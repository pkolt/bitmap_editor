import { Point } from './Point';

export class Area {
  public point1: Point;
  public point2: Point;

  static fromRectangle(x: number, y: number, width: number, height: number) {
    return new Area(new Point(x, y), new Point(x + width, y + height));
  }

  constructor(point1: Point, point2: Point) {
    this.point1 = point1;
    this.point2 = point2;
  }

  get xMin() {
    return Math.min(this.point1.x, this.point2.x);
  }

  get xMax() {
    return Math.max(this.point1.x, this.point2.x);
  }

  get yMin() {
    return Math.min(this.point1.y, this.point2.y);
  }

  get yMax() {
    return Math.max(this.point1.y, this.point2.y);
  }

  get width() {
    return this.xMax - this.xMin;
  }

  get height() {
    return this.yMax - this.yMin;
  }

  intersection(point: Point): boolean {
    return point.x >= this.xMin && point.x <= this.xMax && point.y >= this.yMin && point.y <= this.yMax;
  }

  equal(area: Area): boolean {
    return area.xMin === this.xMin && area.xMax === this.xMax && area.yMin === this.yMin && area.yMax === this.yMax;
  }
}
