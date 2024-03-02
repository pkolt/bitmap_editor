export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(p: Point): boolean {
    return p.x === this.x && p.y === this.y;
  }

  isNotEqual(p: Point) {
    return !this.isEqual(p);
  }

  move(xOffset: number, yOffset: number) {
    return new Point(this.x + xOffset, this.y + yOffset);
  }

  plus(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  minus(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }
}
