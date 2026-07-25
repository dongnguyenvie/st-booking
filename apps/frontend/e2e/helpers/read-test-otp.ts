/**
 * Fetch the last email OTP code from the dev-only test helper endpoint.
 * Available only when NODE_ENV !== production.
 */

export async function getLastEmailOtp(email: string): Promise<string> {
  const response = await fetch(`http://localhost:7001/__test__/last-otp?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch OTP for ${email}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.code;
}
