/* global process */
import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { render } from "../dist/server/entry-server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistDir = path.resolve(__dirname, "../dist/client");
const indexHtmlPath = path.join(clientDistDir, "index.html");
const siteUrl = "https://israelitemusic.com";
const apiUrl = process.env.VITE_API_URL || process.env.API_URL;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const isSafePath = (root, target) => {
  const rel = path.relative(root, target);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
};

const sendStaticIfExists = async (pathname, res) => {
  if (pathname === "/" || pathname.endsWith("/")) return false;

  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const filePath = path.join(clientDistDir, cleanPath);

  if (!isSafePath(clientDistDir, filePath)) {
    return false;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return false;

    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader(
      "Content-Type",
      MIME_TYPES[ext] || "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    const file = await fs.readFile(filePath);
    res.end(file);
    return true;
  } catch {
    return false;
  }
};

const escapeXml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

const stripHtml = (value = "") => {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const truncate = (value = "", length = 160) => {
  const text = stripHtml(value);
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1).trim()}...`;
};

const getImageUrl = (img) => {
  if (!img) return `${siteUrl}/logo.png`;
  if (/^https?:\/\//i.test(img)) return img;
  return `https://ik.imagekit.io/cu7rwsp4u/${String(img).replace(/^\/+/, "")}`;
};

const fetchPublicPost = async (slug) => {
  if (!apiUrl || !slug) return null;

  try {
    const response = await fetch(`${apiUrl}/posts/${encodeURIComponent(slug)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

const getRouteSeo = async (pathname) => {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  if (cleanPath === "/") {
    return {
      title: "Israelite Music | Music, Artists & New Releases",
      description:
        "Israelite Music helps listeners discover inspiring music, artists, albums, lyrics, and new releases.",
      url: `${siteUrl}/`,
      image: `${siteUrl}/logo.png`,
      type: "website",
    };
  }

  if (cleanPath === "/posts") {
    return {
      title: "Israelite Music | Music Library",
      description:
        "Discover music, artists, albums, lyrics, and new releases from Israelite Music.",
      url: `${siteUrl}/posts`,
      image: `${siteUrl}/logo.png`,
      type: "website",
    };
  }

  const isPublicPostPath =
    cleanPath.split("/").length === 2 &&
    !["/login", "/register", "/write", "/cpanel"].includes(cleanPath);

  if (!isPublicPostPath) return null;

  const slug = cleanPath.slice(1);
  const post = await fetchPublicPost(slug);
  if (!post?.title) return null;

  return {
    title: `${post.title} | Israelite Music`,
    description: truncate(post.desc || post.content),
    url: `${siteUrl}/${post.slug || slug}`,
    image: getImageUrl(post.img),
    type: "article",
  };
};

const replaceTagContent = (page, tagName, content) => {
  return page.replace(
    new RegExp(`<${tagName}[^>]*>.*?</${tagName}>`, "i"),
    `<${tagName}>${escapeHtml(content)}</${tagName}>`
  );
};

const replaceMeta = (page, selector, content) => {
  const escapedContent = escapeHtml(content);
  const pattern = new RegExp(
    `<meta\\s+([^>]*${selector}[^>]*)content="[^"]*"([^>]*)>`,
    "i"
  );

  if (pattern.test(page)) {
    return page.replace(pattern, `<meta $1content="${escapedContent}"$2>`);
  }

  return page.replace(
    "</head>",
    `    <meta ${selector} content="${escapedContent}" />\n  </head>`
  );
};

const applySeo = (page, seo) => {
  if (!seo) return page;

  let nextPage = replaceTagContent(page, "title", seo.title);
  nextPage = replaceMeta(nextPage, 'name="description"', seo.description);
  nextPage = replaceMeta(nextPage, 'property="og:type"', seo.type);
  nextPage = replaceMeta(nextPage, 'property="og:title"', seo.title);
  nextPage = replaceMeta(nextPage, 'property="og:description"', seo.description);
  nextPage = replaceMeta(nextPage, 'property="og:url"', seo.url);
  nextPage = replaceMeta(nextPage, 'property="og:image"', seo.image);
  nextPage = replaceMeta(nextPage, 'name="twitter:title"', seo.title);
  nextPage = replaceMeta(nextPage, 'name="twitter:description"', seo.description);
  nextPage = replaceMeta(nextPage, 'name="twitter:image"', seo.image);
  nextPage = nextPage.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(seo.url)}" />`
  );

  return nextPage;
};

const fetchPublicPosts = async () => {
  if (!apiUrl) return [];

  const posts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 100) {
    const response = await fetch(`${apiUrl}/posts?page=${page}&limit=100`);
    if (!response.ok) break;

    const data = await response.json();
    posts.push(...(data.posts || []));
    hasMore = Boolean(data.hasMore);
    page++;
  }

  return posts;
};

const sendSitemap = async (res) => {
  const posts = await fetchPublicPosts();
  const staticUrls = [
    { loc: `${siteUrl}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${siteUrl}/posts`, changefreq: "daily", priority: "0.8" }
  ];

  const postUrls = posts
    .filter((post) => post.slug)
    .map((post) => ({
      loc: `${siteUrl}/${post.slug}`,
      lastmod: post.updatedAt || post.createdAt,
      changefreq: "weekly",
      priority: "0.7"
    }));

  const urls = [...staticUrls, ...postUrls]
    .map((url) => {
      const lastmod = url.lastmod
        ? `\n    <lastmod>${escapeXml(new Date(url.lastmod).toISOString())}</lastmod>`
        : "";

      return `  <url>
    <loc>${escapeXml(url.loc)}</loc>${lastmod}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(sitemap);
};

const sendRobots = (res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /write
Disallow: /cpanel
Disallow: /login
Disallow: /register

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(robots);
};

const redirectToWww = (res, url) => {
  const target = new URL(url.pathname + url.search, siteUrl);

  res.statusCode = 301;
  res.setHeader("Location", target.toString());
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.end();
};

export default async function handler(req, res) {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url || "/", `https://${host}`);
    const pathname = url.pathname;

    if (url.hostname === "israelitemusic.com") {
      redirectToWww(res, url);
      return;
    }

    if (pathname === "/sitemap.xml") {
      await sendSitemap(res);
      return;
    }

    if (pathname === "/robots.txt") {
      sendRobots(res);
      return;
    }

    const served = await sendStaticIfExists(pathname, res);
    if (served) return;

    const template = await fs.readFile(indexHtmlPath, "utf-8");
    const { html, head = "" } = render(`${pathname}${url.search}`);
    const seo = await getRouteSeo(pathname);

    const page = applySeo(template
      .replace("<!--ssr-outlet-->", html)
      .replace("<!--app-head-->", head), seo);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.end(page);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(error?.stack || "Server render failed");
  }
}
