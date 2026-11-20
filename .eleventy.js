const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");

// Same settings as Eleventy's built-in Markdown, so the Chinese body
// (a front matter field) renders exactly like the English body.
const md = markdownIt({ html: true, linkify: true });

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  // ── Static assets — copied through untouched ──────────────
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.ignores.add("README.md");

  // Pages we haven't converted to Eleventy templates yet ──
  // These are copied through exactly as they are today.
  const staticPages = [
    "privacy.html",
    "terms.html",
  ];
  staticPages.forEach((page) => eleventyConfig.addPassthroughCopy(page));

  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  // ── Date filters, used in event cards ──────────────────────
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });
  eleventyConfig.addFilter("dayOfMonth", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd");
  });
  eleventyConfig.addFilter("monthShort", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLL");
  });

  // ── Journal / post filters ─────────────────────────────────
  // 20 Nov 2026 → 2026年11月20日
  eleventyConfig.addFilter("zhDate", (dateObj) => {
    if (!dateObj) return "";
    const d = DateTime.fromJSDate(dateObj, { zone: "utc" });
    return `${d.year}年${d.month}月${d.day}日`;
  });
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISODate();
  });

  // Render a Markdown string from front matter (used for body_cn).
  eleventyConfig.addFilter("markdown", (str) => (str ? md.render(String(str)) : ""));

  // Lead story for a list of posts: newest "featured" one, else the newest.
  eleventyConfig.addFilter("leadStory", (posts) => {
    if (!posts || !posts.length) return null;
    return posts.find((p) => p.data.featured) || posts[0];
  });

  // Category keys that actually have posts (so the filter bar shows no empty tabs).
  eleventyConfig.addFilter("usedCategories", (posts) =>
    [...new Set((posts || []).map((p) => p.data.category).filter(Boolean))]
  );

  // Rough reading time in minutes. English ≈ 220 words/min,
  // Chinese ≈ 400 characters/min.
  eleventyConfig.addFilter("readingMinutes", (html) => {
    if (!html) return 0;
    const text = String(html).replace(/<[^>]*>/g, " ");
    const cjk = (text.match(/[㐀-鿿豈-﫿]/g) || []).length;
    const words = text.replace(/[㐀-鿿豈-﫿]/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220 + cjk / 400));
  });

  // ── Collections — these mirror the Decap CMS collections in
  // admin/config.yml exactly. Adding an entry through /admin
  // (or dropping a .md file into content/events/) makes it show
  // up here automatically on the next build. ────────────────

  // Only published events that haven't already happened, soonest first.
  eleventyConfig.addCollection("upcomingEvents", (collectionApi) => {
    const now = new Date();
    return collectionApi
      .getFilteredByTag("events")
      .filter((item) => item.data.published !== false && item.data.date >= now)
      .sort((a, b) => a.data.date - b.data.date);
  });

  // All published events, most recently added first (useful for an events archive later).
  eleventyConfig.addCollection("allEvents", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("events")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => b.data.date - a.data.date);
  });

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("articles")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => b.data.date - a.data.date);
  });

  // SG Taoist Journal · 星洲道誌 — published posts, newest first.
  eleventyConfig.addCollection("journal", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("journal")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => b.data.date - a.data.date);
  });

  eleventyConfig.addCollection("galleryAlbums", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("gallery")
      .filter((item) => item.data.published !== false)
      .sort((a, b) => (b.data.date || 0) - (a.data.date || 0));
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    // Only .njk (and .md, for CMS content) files are treated as Eleventy
    // templates. Plain .html files are left alone and passthrough-copied
    // above, so nothing you haven't converted can break.
    templateFormats: ["njk", "md"],
  };
};
