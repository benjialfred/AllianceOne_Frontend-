import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'webapp';
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "Alliance One est le système nerveux central des organisations de demain. Gérez, automatisez et accélérez votre entreprise.",
  keywords = "SaaS, ERP, Alliance One, gestion d'entreprise, automatisation, IA",
  image = "/og-image.jpg",
  url = "https://allianceone.io",
  type = "website",
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | Alliance One`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    // 3. Open Graph (Facebook/LinkedIn)
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', 'Alliance One', true);

    // 4. Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything in the DOM
};
