export function cleanString(value?: string | null): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function normalizeEmail(value?: string | null): string | undefined {
  const cleaned = cleanString(value);
  return cleaned ? cleaned.toLowerCase() : undefined;
}
