export function formatAddress(properties?: {
  street?: string;
  city?: string;
  zipCode?: string;
}): string {
  return [properties?.street, properties?.zipCode, properties?.city]
    .filter(Boolean)
    .join(', ');
}
