const bitwise = (bit: number) => 1 << bit;
export const isSetBit = (reg: number, bit: number): boolean => !!(reg & bitwise(bit));
export const setBit = (reg: number, bit: number) => (reg |= bitwise(bit));
export const clearBit = (reg: number, bit: number) => (reg &= ~bitwise(bit));
// export const invertBit = (reg: number, bit: number) => (reg ^= bitwise(bit));
// export const copyBit = (src_reg: number, dst_reg: number, bit: number) => {
//   return isSetBit(src_reg, bit) ? setBit(dst_reg, bit) : clearBit(dst_reg, bit);
// };
