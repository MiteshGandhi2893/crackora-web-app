/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://crackora.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  additionalPaths: async (config) => {
    const results = [];

    // ─── 1. /exam-info/[slug] ─── hardcoded
    const examSlugs = [
      'wb-jeca',
      'mah-mca-cet',
      'tancet-mca',
      'cuet-pg-mca',
      'ipu-cet-mca',
      'nimcet',
    ];

    for (const slug of examSlugs) {
      results.push({
        loc: `/exam-info/${slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    }

    // ─── 2. /blogs/[slug] ─── hardcoded (grow this list over time)
    const blogSlugs = [
      'how-to-study-mca-effectively-2-year-plan',
      'mca-entrance-exam-preparation-guide-2026',
    ];

    for (const slug of blogSlugs) {
      results.push({
        loc: `/blogs/${slug}`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    }

    // ─── 3. /tools/[slug] ─── internal, hardcoded
    const toolSlugs = [
      'college',
      'college-comparison',
      'planner',
      'cutoff',
      'salary',
      'eligibility',
    ];

    for (const slug of toolSlugs) {
      results.push({
        loc: `/tools/${slug}`,
        changefreq: 'monthly',
        priority: 0.65,
        lastmod: new Date().toISOString(),
      });
    }

    return results;
  },
};