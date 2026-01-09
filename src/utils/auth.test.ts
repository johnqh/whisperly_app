import { describe, it, expect } from 'vitest';
import {
  getFirebaseErrorMessage,
  getFirebaseErrorCode,
  formatFirebaseError,
} from './auth';

describe('auth utilities', () => {
  describe('getFirebaseErrorMessage', () => {
    it('returns message for user-not-found', () => {
      expect(getFirebaseErrorMessage('auth/user-not-found')).toBe(
        'No account found with this email'
      );
    });

    it('returns message for wrong-password', () => {
      expect(getFirebaseErrorMessage('auth/wrong-password')).toBe(
        'Incorrect password'
      );
    });

    it('returns message for invalid-email', () => {
      expect(getFirebaseErrorMessage('auth/invalid-email')).toBe(
        'Invalid email address'
      );
    });

    it('returns message for invalid-credential', () => {
      expect(getFirebaseErrorMessage('auth/invalid-credential')).toBe(
        'Invalid email or password'
      );
    });

    it('returns message for email-already-in-use', () => {
      expect(getFirebaseErrorMessage('auth/email-already-in-use')).toBe(
        'An account with this email already exists'
      );
    });

    it('returns message for weak-password', () => {
      expect(getFirebaseErrorMessage('auth/weak-password')).toBe(
        'Password must be at least 6 characters'
      );
    });

    it('returns message for too-many-requests', () => {
      expect(getFirebaseErrorMessage('auth/too-many-requests')).toBe(
        'Too many attempts. Please try again later.'
      );
    });

    it('returns message for network-request-failed', () => {
      expect(getFirebaseErrorMessage('auth/network-request-failed')).toBe(
        'Network error. Please check your connection.'
      );
    });

    it('returns message for popup-closed-by-user', () => {
      expect(getFirebaseErrorMessage('auth/popup-closed-by-user')).toBe(
        'Sign in cancelled'
      );
    });

    it('returns message for popup-blocked', () => {
      expect(getFirebaseErrorMessage('auth/popup-blocked')).toBe(
        'Popup blocked. Please allow popups for this site.'
      );
    });

    it('returns message for account-exists-with-different-credential', () => {
      expect(
        getFirebaseErrorMessage('auth/account-exists-with-different-credential')
      ).toBe(
        'An account already exists with this email using a different sign-in method.'
      );
    });

    it('returns message for operation-not-allowed', () => {
      expect(getFirebaseErrorMessage('auth/operation-not-allowed')).toBe(
        'This sign-in method is not enabled.'
      );
    });

    it('returns default message for unknown error code', () => {
      expect(getFirebaseErrorMessage('auth/unknown-error')).toBe(
        'Something went wrong. Please try again.'
      );
    });

    it('returns default message for empty string', () => {
      expect(getFirebaseErrorMessage('')).toBe(
        'Something went wrong. Please try again.'
      );
    });
  });

  describe('getFirebaseErrorCode', () => {
    it('extracts code from error object with code property', () => {
      const error = { code: 'auth/user-not-found', message: 'Not found' };
      expect(getFirebaseErrorCode(error)).toBe('auth/user-not-found');
    });

    it('returns empty string for null', () => {
      expect(getFirebaseErrorCode(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(getFirebaseErrorCode(undefined)).toBe('');
    });

    it('returns empty string for non-object', () => {
      expect(getFirebaseErrorCode('string error')).toBe('');
      expect(getFirebaseErrorCode(123)).toBe('');
      expect(getFirebaseErrorCode(true)).toBe('');
    });

    it('returns empty string for object without code property', () => {
      expect(getFirebaseErrorCode({ message: 'Error' })).toBe('');
    });

    it('handles Error object without code', () => {
      const error = new Error('Something went wrong');
      expect(getFirebaseErrorCode(error)).toBe('');
    });

    it('handles Firebase-like error object', () => {
      const error = {
        code: 'auth/invalid-credential',
        message: 'Invalid credential',
        name: 'FirebaseError',
      };
      expect(getFirebaseErrorCode(error)).toBe('auth/invalid-credential');
    });
  });

  describe('formatFirebaseError', () => {
    it('returns user-friendly message for known Firebase error', () => {
      const error = { code: 'auth/user-not-found' };
      expect(formatFirebaseError(error)).toBe('No account found with this email');
    });

    it('returns default message for unknown Firebase error', () => {
      const error = { code: 'auth/some-unknown-error' };
      expect(formatFirebaseError(error)).toBe(
        'Something went wrong. Please try again.'
      );
    });

    it('returns default message for non-Firebase error', () => {
      expect(formatFirebaseError(new Error('Generic error'))).toBe(
        'Something went wrong. Please try again.'
      );
    });

    it('returns default message for null', () => {
      expect(formatFirebaseError(null)).toBe(
        'Something went wrong. Please try again.'
      );
    });

    it('handles multiple Firebase error codes', () => {
      const testCases = [
        { code: 'auth/wrong-password', expected: 'Incorrect password' },
        { code: 'auth/weak-password', expected: 'Password must be at least 6 characters' },
        { code: 'auth/popup-blocked', expected: 'Popup blocked. Please allow popups for this site.' },
      ];

      testCases.forEach(({ code, expected }) => {
        expect(formatFirebaseError({ code })).toBe(expected);
      });
    });
  });
});
