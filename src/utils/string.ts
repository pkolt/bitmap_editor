export const capitalize = (value: string) => {
  const firstLetter: string = value[0] ?? '';
  return firstLetter.toUpperCase() + value.slice(1);
};
