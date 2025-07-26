export function formatAddress(properties?: {
  street?: string;
  city?: string;
  postcode?: string;
}): string {
  return [properties?.street, properties?.city, properties?.postcode]
    .filter(Boolean)
    .join(', ');
}
