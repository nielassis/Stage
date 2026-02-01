import { DocumentType } from '@prisma/client';

export function cleanString(value?: string | null): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function normalizeEmail(value?: string | null): string | undefined {
  const cleaned = cleanString(value);
  return cleaned ? cleaned.toLowerCase() : undefined;
}

function normalizeDocumentType(raw: unknown): DocumentType | undefined {
  if (typeof raw !== 'string') return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const values = Object.values(DocumentType) as string[];
  return values.includes(trimmed) ? (trimmed as DocumentType) : undefined;
}
