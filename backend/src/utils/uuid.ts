import type { UUID } from '../types/types';

/**
 * Validates if a string is a valid UUID.
 * 
 * @param value - The string to validate.
 * @returns True if the string is a valid UUID, false otherwise.
 */
export const isUUID = (value: string): value is UUID => {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(value);
}; 