/**
 * 腾讯云 SCF 云函数：访客访问日志记录
 *
 * 触发方式：函数 URL（HTTPS 公网地址，免鉴权；兼容旧版 API 网关触发）
 * 功能：接收博客前端上报的访问数据，提取真实 IP，将记录写入 COS。
 * 存储结构：visit-logs/<东八区日期>/<毫秒时间戳>-<随机串>.json（每条访问一个对象，
 *          避免 COS 覆盖写带来的并发冲突）。
 *
 * 环境变量（在 SCF 控制台配置）：
 *   COS_SECRET_ID  - 腾讯云 API 密钥 SecretId（建议子账号，仅授权目标桶写权限）
 *   COS_SECRET_KEY - 腾讯云 API 密钥 SecretKey
 *   COS_BUCKET     - COS 桶名，格式：bucketname-APPID
 *   COS_REGION     - COS 地域，如 ap-guangzhou
 */
const COS = require("cos-nodejs-sdk-v5");
const crypto = require("crypto");

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

const BUCKET = process.env.COS_BUCKET;
const REGION = process.env.COS_REGION;

// 允许的前端来源（浏览器跨域软校验）
const ALLOWED_ORIGINS = [
  "https://enndermann.github.io",
  "http://localhost:4321", // 本地 astro dev 调试
];

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

exports.main_handler = async event => {
  const h = event.headers || {};
  const origin = h.origin || h.Origin || "";
  const headers = buildCorsHeaders(origin);
  // 兼容多种触发方式的 method 字段：
  // 函数 URL（httpMethod 顶层或 requestContext.http.method）/ API 网关（已下架，保留兼容）
  const method =
    event.httpMethod ||
    event.requestContext?.httpMethod ||
    event.requestContext?.http?.method;

  // CORS 预检（前端使用 text/plain 时一般不会触发，保留兜底）
  if (method === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (method !== "POST") {
    return { statusCode: 405, headers, body: "" };
  }

  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "{}";

    // 限制请求体大小，防恶意大 payload
    if (raw.length > 2048) {
      return { statusCode: 413, headers, body: "" };
    }

    // JSON 解析失败属于客户端请求错误（400），日志记录 body 片段便于排查
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("visit-logger: invalid JSON body:", raw.slice(0, 200));
      return { statusCode: 400, headers, body: "" };
    }

    // 提取真实 IP。函数 URL 实测事件结构（2026-07）：
    //   requestContext.sourceIp 与 headers["x-scf-remote-addr"] 均为 SCF 平台
    //   注入的客户端地址（客户端无法伪造），优先使用；
    //   X-Forwarded-For 可被客户端伪造，仅作最后兜底；
    //   其余为旧版 API 网关等触发方式的兼容路径。
    const xff = h["x-forwarded-for"] || h["X-Forwarded-For"];
    const ip =
      event.requestContext?.sourceIp ||
      h["x-scf-remote-addr"] ||
      event.requestContext?.http?.sourceIp ||
      event.requestContext?.identity?.sourceIp ||
      (xff ? xff.split(",")[0].trim() : null) ||
      "unknown";

    const now = new Date();
    const record = {
      visitTime: now.toISOString(),
      ip,
      path: String(data.path || "").slice(0, 500),
      url: String(data.url || "").slice(0, 1000),
      title: String(data.title || "").slice(0, 200),
      referrer: String(data.referrer || "").slice(0, 1000),
      userAgent: String(h["user-agent"] || h["User-Agent"] || "").slice(0, 500),
      screen: String(data.screen || "").slice(0, 20),
      language: String(data.language || "").slice(0, 20),
    };

    // 按东八区日期分目录（SCF 运行环境默认为 UTC）
    const cst = new Date(now.getTime() + 8 * 3600 * 1000);
    const date = cst.toISOString().slice(0, 10);
    const key = `visit-logs/${date}/${now.getTime()}-${crypto
      .randomBytes(4)
      .toString("hex")}.json`;

    await cos.putObject({
      Bucket: BUCKET,
      Region: REGION,
      Key: key,
      Body: JSON.stringify(record),
      ContentType: "application/json",
    });

    return { statusCode: 204, headers, body: "" };
  } catch (err) {
    console.error("visit-logger error:", err);
    return { statusCode: 500, headers, body: "" };
  }
};
