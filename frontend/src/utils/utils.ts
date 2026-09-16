export const debounce = <T>(fn: (...args: T[]) => void, timeout = 500) => {
  let timeoutId: number;
  return (...args: T[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};
