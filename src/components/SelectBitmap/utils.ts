export const isEqualArrays = <T>(arr1: T[], arr2: T[]) => {
  const merged: T[] = Array.from(new Set([...arr1, ...arr2]));
  return merged.length > 0 && merged.every((it) => arr1.includes(it) && arr2.includes(it));
};
