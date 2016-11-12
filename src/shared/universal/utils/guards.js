/* eslint-disable import/prefer-default-export */

export function notEmpty(x, message) {
  if (x == null) {
    throw new Error(message || 'Expected value to not be empty.');
  }

  return x;
}
