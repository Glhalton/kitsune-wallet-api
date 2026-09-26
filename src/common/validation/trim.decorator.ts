import { Transform } from 'class-transformer';

/**
 * Trims incoming strings before validation, so a blank-but-padded value fails
 * `@IsNotEmpty()` instead of reaching the database as whitespace.
 */
export function Trim(): PropertyDecorator {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}