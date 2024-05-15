export class FakeCanvas {
  public width = 0;
  public height = 0;
  #imageData?: ImageData;

  constructor(imageData?: ImageData) {
    this.#imageData = imageData;
  }

  getContext() {
    return {
      fillRect() {},
      clearRect() {},
      drawImage() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
      getImageData: () => this.#imageData,
    };
  }
}
