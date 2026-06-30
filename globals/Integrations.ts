import type { GlobalConfig } from "payload";

export const Integrations: GlobalConfig = {
  slug: "integrations",
  admin: {
    group: "Site",
    description:
      "Analytics and search-verification tags. Leave blank to inject nothing. All technical SEO works regardless of these settings.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "ga4MeasurementId",
      type: "text",
      label: "GA4 Measurement ID",
      admin: {
        description: "e.g. G-XXXXXXXXXX. Leave blank to disable GA4.",
        placeholder: "G-XXXXXXXXXX",
      },
    },
    {
      name: "googleSiteVerification",
      type: "text",
      label: "Google Search Console verification",
      admin: {
        description:
          "The content value from the <meta name='google-site-verification'> tag.",
      },
    },
    {
      name: "extraVerificationTags",
      type: "array",
      label: "Extra verification meta tags",
      fields: [
        { name: "name", type: "text", label: "Meta name attribute" },
        { name: "content", type: "text", label: "Meta content attribute" },
      ],
    },
  ],
};
