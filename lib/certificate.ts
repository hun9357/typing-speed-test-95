/**
 * Generate a unique certification ID
 * Format: CERT-[TIMESTAMP]-[HASH]
 */
export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${timestamp}-${randomHash}`;
}

/**
 * Format date for certificate display
 */
export function formatCertificateDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Check if user qualifies for certificate
 * Requirements: 95%+ accuracy on 60-second test
 */
export function qualifiesForCertificate(accuracy: number, testDuration: number = 60): boolean {
  return accuracy >= 95 && testDuration === 60;
}
