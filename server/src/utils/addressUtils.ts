export function formatAddress(properties?: {
  street?: string;
  city?: string;
  zipCode?: string;
}): string {
  return [properties?.street, properties?.city, properties?.zipCode]
    .filter(Boolean)
    .join(', ');
}
