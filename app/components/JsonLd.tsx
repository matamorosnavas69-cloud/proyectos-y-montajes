import Script from "next/script";

export default function JsonLd() {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Proyectos y Montajes",
    "image": "https://images.unsplash.com/photo-1622225369204-a12efee3364c?q=80&w=2070&auto=format&fit=crop",
    "@id": "https://www.proyectosymontajes.com",
    "url": "https://www.proyectosymontajes.com",
    "telephone": "+573001234567",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zona Industrial",
      "addressLocality": "Bucaramanga",
      "addressRegion": "Santander",
      "postalCode": "680001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 7.1193,
      "longitude": -73.1227
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/proyectosymontajes",
      "https://www.instagram.com/proyectosymontajes"
    ]
  };

  return (
    <Script
      id="json-ld-local-business"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
