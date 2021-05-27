export function isEmptyArray(value: unknown): boolean {
  if (typeof value === 'string' {
    return value === '[]'
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}
