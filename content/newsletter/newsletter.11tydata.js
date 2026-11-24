// Applies to every post in content/newsletter/ (created via /admin or by hand).
// Published posts get their own page at /newsletter/<file-name>/.
// Drafts (published: false) are not built at all.
module.exports = {
  tags: "journal",
  layout: "post.njk",
  postSection: "journal",
  activeNav: "journal",
  bilingualNav: true,
  ogType: "article",
  eleventyComputed: {
    pageTitle: (data) => `${data.title} — SG Taoist Newsletter`,
    pageTitleZh: (data) => `${data.title_cn || data.title} — 星洲道誌`,
    description: (data) => data.summary || "",
    ogImage: (data) => data.cover || data.photo || "",
    permalink: (data) =>
      data.published === false ? false : `/newsletter/${data.page.fileSlug}/index.html`,
  },
};
