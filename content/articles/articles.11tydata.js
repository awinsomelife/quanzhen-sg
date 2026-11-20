// Applies to every Learn article in content/articles/.
// Published articles get their own page at /learn/<file-name>/,
// using the same post template as the Journal.
module.exports = {
  tags: "articles",
  layout: "post.njk",
  postSection: "learn",
  activeNav: "learn",
  bilingualNav: true,
  ogType: "article",
  eleventyComputed: {
    pageTitle: (data) => `${data.title} — Learn · Quan Zhen Cultural Society`,
    pageTitleZh: (data) => `${data.title_cn || data.title} — 學習 · 全真教化協會`,
    description: (data) => data.summary || "",
    ogImage: (data) => data.cover || data.photo || "",
    permalink: (data) =>
      data.published === false ? false : `/learn/${data.page.fileSlug}/index.html`,
  },
};
