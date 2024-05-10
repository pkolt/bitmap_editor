export const requiredValue = <T>(value: T | null | undefined, message: string = 'The value must not be empty'): T => {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
};
