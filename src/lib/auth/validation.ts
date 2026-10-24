/** Match the backend's public account field constraints before sending credentials. */
export const accountEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const playerUsernamePattern = /^[a-zA-Z0-9_]{3,24}$/;

export type PlayerRegistrationFields = {
  displayName: string; username: string; email: string; password: string;
};

export function validatePlayerRegistration(fields: PlayerRegistrationFields): string | null {
  if (!fields.displayName.trim() || fields.displayName.trim().length > 60) {
    return 'Full name must be between 1 and 60 characters.';
  }
  if (!playerUsernamePattern.test(fields.username.trim())) {
    return 'Username must be 3–24 characters, using letters, numbers or underscores only.';
  }
  if (fields.email.trim().length > 254 || !accountEmailPattern.test(fields.email.trim())) {
    return 'Enter a valid email address (for example name@gmail.com).';
  }
  if (fields.password.length < 12 || fields.password.length > 128 ||
      new TextEncoder().encode(fields.password).length > 256) {
    return 'Password must be 12–128 characters (maximum 256 UTF-8 bytes).';
  }
  return null;
}

export type OperatorRegistrationFields = {
  companyName: string; website: string; email: string; contactPerson: string;
  phone: string; country: string; businessType: string; registrationNumber?: string;
  password: string;
};

function safeText(value: string, max: number): boolean {
  return value.trim().length >= 2 && value.trim().length <= max &&
    !/[\u0000-\u001f\u007f]/.test(value);
}

export function validateOperatorRegistration(fields: OperatorRegistrationFields): string | null {
  if (!safeText(fields.companyName, 120)) return 'Company name must be 2–120 characters.';
  if (!safeText(fields.contactPerson, 80)) return 'Contact name must be 2–80 characters.';
  if (!safeText(fields.phone, 40)) return 'Enter a valid phone number (2–40 characters).';
  if (!safeText(fields.country, 80) || !safeText(fields.businessType, 80)) return 'Select a country and business type.';
  let url: URL;
  try { url = new URL(fields.website); } catch { return 'Enter a valid HTTPS business website.'; }
  if (url.protocol !== 'https:' || !!url.username || !!url.password || !!url.hash || !!url.search || url.hostname.length <= 3) {
    return 'Business website must be HTTPS, without credentials, query or fragment.';
  }
  if (fields.email.trim().length > 254 || !accountEmailPattern.test(fields.email.trim())) return 'Enter a valid business email address.';
  if (fields.registrationNumber && (fields.registrationNumber.length > 80 || /[\u0000-\u001f\u007f]/.test(fields.registrationNumber))) {
    return 'Registration number must be no more than 80 characters.';
  }
  if (fields.password.length < 12 || fields.password.length > 128 || new TextEncoder().encode(fields.password).length > 256) {
    return 'Password must be 12–128 characters (maximum 256 UTF-8 bytes).';
  }
  return null;
}
