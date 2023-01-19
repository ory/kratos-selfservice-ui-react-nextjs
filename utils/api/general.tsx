/**
 * Confirm we are on the client side
 * @returns
 */
export const isClient = (): boolean => {
  if (typeof window !== 'undefined') {
    return true;
  }
  return false;
};
