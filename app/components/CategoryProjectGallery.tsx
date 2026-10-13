'use client';

import ServiceShowcaseGallery from './ServiceShowcaseGallery';
import { ServiceSlug } from '@/lib/media-library';

type CategoryProjectGalleryProps = {
  category: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function CategoryProjectGallery({
  category,
  eyebrow,
  title,
  description,
}: CategoryProjectGalleryProps) {
  const serviceSlug: ServiceSlug =
    category === 'parques'
      ? 'parques'
      : category === 'residencial' || category === 'piscina'
      ? 'paisajismo'
      : 'canchas';

  return (
    <ServiceShowcaseGallery
      service={serviceSlug}
      customEyebrow={eyebrow}
      customTitle={title}
      customDescription={description}
    />
  );
}
