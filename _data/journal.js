// Labels shared by the Newsletter listing, post pages and homepage strip.
// Keep the keys in sync with the select options in admin/config.yml.
module.exports = {
  name: { en: "SG Taoist Newsletter", zh: "星洲道誌" },
  tagline: { en: "Connecting Taoism Around the World.", zh: "連結世界各地的道教。" },

  // Email sign-up (see tools/newsletter-signup.gs).
  // signupUrl: the Google Apps Script web app URL (ends in /exec).
  // turnstileSiteKey: the Cloudflare Turnstile SITE key (public; the
  //   secret key goes only into the Apps Script's Script Properties).
  // The sign-up box is shown only when both are set.
  signupUrl: "",
  turnstileSiteKey: "",

  categories: {
    news:       { en: "News",                 zh: "新聞",     icon: "訊" },
    ceremonies: { en: "Ceremonies & Rituals", zh: "科儀",     icon: "禮" },
    heritage:   { en: "Heritage & Culture",   zh: "文化傳承", icon: "承" },
    interfaith: { en: "Interfaith",           zh: "宗教交流", icon: "和" },
    education:  { en: "Education",            zh: "教育",     icon: "學" },
    community:  { en: "Community Service",    zh: "社會服務", icon: "濟" },
    profiles:   { en: "Profiles",             zh: "人物與宮觀", icon: "人" },
    perspectives: { en: "Perspectives",       zh: "觀點",     icon: "思" },
  },

  regions: {
    singapore:      { en: "Singapore",        zh: "新加坡" },
    "southeast-asia": { en: "Southeast Asia", zh: "東南亞" },
    "east-asia":    { en: "East Asia",        zh: "東亞" },
    oceania:        { en: "Oceania",          zh: "大洋洲" },
    europe:         { en: "Europe",           zh: "歐洲" },
    americas:       { en: "Americas",         zh: "美洲" },
    global:         { en: "Global",           zh: "全球" },
  },

  // Learn articles reuse the post template; these are their categories.
  learnCategories: {
    introduction: { en: "Introduction", zh: "入門", icon: "道" },
    practice:     { en: "Practice",     zh: "修持", icon: "修" },
    deities:      { en: "Deities",      zh: "神明", icon: "神" },
    scripture:    { en: "Scripture",    zh: "經典", icon: "經" },
    festival:     { en: "Festival",     zh: "節慶", icon: "節" },
    lineage:      { en: "Lineage",      zh: "道脈", icon: "脈" },
  },
};
