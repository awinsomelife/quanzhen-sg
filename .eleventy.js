const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
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
