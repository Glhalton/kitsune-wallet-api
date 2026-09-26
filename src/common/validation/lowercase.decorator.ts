import { Transform } from 'class-transformer';

/**
 * Lowercases incoming strings before validation, so values compared
 * case-insensitively (such as emails) are stored in a single canonical form.
 */
export function Lowercase(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );
}
