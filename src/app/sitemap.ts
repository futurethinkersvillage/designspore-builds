import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://portal.place";
  const now = new Date();

  return [
    { url: base,                        lastModified: now, priority: 1.0,  changeFrequency: "monthly" },
    { url: `${base}/village`,           lastModified: now, priority: 0.9,  changeFrequency: "monthly" },
    { url: `${base}/membership`,        lastModified: now, priority: 0.9,  changeFrequency: "monthly" },
    { url: `${base}/partner`,           lastModified: now, priority: 0.8,  changeFrequency: "monthly" },
    { url: `${base}/tour`,              lastModified: now, priority: 0.8,  changeFrequency: "yearly"  },
    { url: `${base}/workstay`,          lastModified: now, priority: 0.8,  changeFrequency: "monthly" },
    { url: `${base}/rhythm`,            lastModified: now, priority: 0.7,  changeFrequency: "monthly" },
    { url: `${base}/immersion`,         lastModified: now, priority: 0.7,  changeFrequency: "monthly" },
    { url: `${base}/host`,              lastModified: now, priority: 0.7,  changeFrequency: "monthly" },
    { url: `${base}/about`,             lastModified: now, priority: 0.7,  changeFrequency: "yearly"  },
    { url: `${base}/consulting`,        lastModified: now, priority: 0.6,  changeFrequency: "yearly"  },
    { url: `${base}/videos`,            lastModified: now, priority: 0.6,  changeFrequency: "monthly" },
    { url: `${base}/media-kit`,         lastModified: now, priority: 0.5,  changeFrequency: "yearly"  },
    { url: `${base}/contact`,           lastModified: now, priority: 0.5,  changeFrequency: "yearly"  },
    { url: `${base}/gallery`,           lastModified: now, priority: 0.6,  changeFrequency: "monthly" },
    { url: `${base}/village-ai`,        lastModified: now, priority: 0.6,  changeFrequency: "monthly" },
    { url: `${base}/roadmap`,           lastModified: now, priority: 0.6,  changeFrequency: "monthly" },
  ];
}
