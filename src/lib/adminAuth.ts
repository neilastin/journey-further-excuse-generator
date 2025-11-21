/**
 * Admin session management utilities
 * Handles pro mode unlock state with 24-hour expiration
 */

const SESSION_KEY = 'jf-excuse-gen-admin-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface AdminSession {
  token: string;
  unlocked: boolean;
  expiresAt: number;
}

/**
 * Check if pro mode is currently unlocked
 */
export function checkUnlockStatus(): boolean {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;

    const session: AdminSession = JSON.parse(sessionData);

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      clearUnlockStatus();
      return false;
    }

    return session.unlocked;
  } catch (error) {
    console.error('Error checking unlock status:', error);
    return false;
  }
}

/**
 * Save unlock status with session token
 */
export function setUnlockStatus(token: string): void {
  try {
    const session: AdminSession = {
      token,
      unlocked: true,
      expiresAt: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error setting unlock status:', error);
  }
}

/**
 * Clear unlock status (logout)
 */
export function clearUnlockStatus(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing unlock status:', error);
  }
}

/**
 * Get session token for API requests
 */
export function getSessionToken(): string | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session: AdminSession = JSON.parse(sessionData);

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      clearUnlockStatus();
      return null;
    }

    return session.token;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
}

/**
 * Check if session is still valid (not expired)
 */
export function isSessionValid(): boolean {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;

    const session: AdminSession = JSON.parse(sessionData);
    return Date.now() <= session.expiresAt;
  } catch (error) {
    return false;
  }
}
