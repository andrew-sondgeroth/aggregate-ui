const ZIP_REGEX = /^\d{5}$/

export function isValidZip(zip: string): boolean {
  return ZIP_REGEX.test(zip.trim())
}
