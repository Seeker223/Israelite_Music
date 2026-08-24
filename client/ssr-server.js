/* global process */
import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = (p) => path.resolve(__dirname, p);
const isProd = process.argv.includes("--prod");
const port = Number(process.env.PORT || 5173);
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
  ".woff2": "font/woff2",
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  createReadStream(filePath).pipe(res);
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
    { loc: `${siteUrl}/posts`, changefreq: "daily", priority: "0.8" },
  ];

  const postUrls = posts
    .filter((post) => post.slug)
    .map((post) => ({
      loc: `${siteUrl}/${post.slug}`,
      lastmod: post.updatedAt || post.createdAt,
      changefreq: "weekly",
      priority: "0.7",
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

let vite;
let prodTemplate;
let prodRender;

if (!isProd) {
  const { createServer } = await import("vite");
  vite = await createServer({
    root: __dirname,
    appType: "custom",
    server: { middlewareMode: true },
  });
} else {
  prodTemplate = await readFile(resolve("dist/client/index.html"), "utf-8");
  ({ render: prodRender } = await import("./dist/server/entry-server.js"));
}

const server = createHttpServer(async (req, res) => {
  const url = req.url || "/";

  try {
    const cleanPath = url.split("?")[0];
    const requestUrl = new URL(url, `https://${req.headers.host || "localhost"}`);

    if (requestUrl.hostname === "israelitemusic.com") {
      redirectToWww(res, requestUrl);
      return;
    }

    if (cleanPath === "/sitemap.xml") {
      await sendSitemap(res);
      return;
    }

    if (cleanPath === "/robots.txt") {
      sendRobots(res);
      return;
    }

    if (!isProd) {
      vite.middlewares(req, res, async () => {
        const template = await readFile(resolve("index.html"), "utf-8");
        const transformed = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
        const { html, head = "" } = render(url);
        const seo = await getRouteSeo(cleanPath);
        const page = applySeo(
          transformed
            .replace("<!--ssr-outlet-->", html)
            .replace("<!--app-head-->", head),
          seo
        );

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(page);
      });
      return;
    }

    // Serve built static assets first.
    if (cleanPath !== "/" && cleanPath !== "/index.html") {
      const staticPath = resolve(`dist/client${cleanPath}`);
      if (existsSync(staticPath)) {
        sendFile(res, staticPath);
        return;
      }
    }

    const { html, head = "" } = prodRender(url);
    const seo = await getRouteSeo(cleanPath);
    const page = applySeo(
      prodTemplate
        .replace("<!--ssr-outlet-->", html)
        .replace("<!--app-head-->", head),
      seo
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(page);
  } catch (error) {
    if (!isProd && vite) {
      vite.ssrFixStacktrace(error);
    }
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(error?.stack || "SSR server error");
  }
});

server.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
