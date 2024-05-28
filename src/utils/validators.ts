export const validatePositiveNumber = (value: unknown) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Value must be number';
  }
  if (value <= 0) {
    return 'Value must be greater 0';
  }
};
