import ImportFromImage from './';
import { test, renderPage, expect, screen, waitFor } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { vi } from 'vitest';
import { FakeCanvas } from '@/test-utils/canvas';
import * as createCanvasModule from '@/pages/ImportFromImage/ImportForm/createCanvas';
import { generatePath } from 'react-router-dom';

// https://icons.getbootstrap.com/icons/brilliance/
const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16M1 8a7 7 0 0 0 7 7 3.5 3.5 0 1 0 0-7 3.5 3.5 0 1 1 0-7 7 7 0 0 0-7 7"/>
</svg>`;

const imageData: ImageData = {
  width: 16,
  height: 16,
  colorSpace: 'srgb',
  data: new Uint8ClampedArray([
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 198, 198, 198, 255, 102, 102, 102,
    255, 61, 61, 61, 255, 19, 19, 19, 255, 19, 19, 19, 255, 61, 61, 61, 255, 103, 103, 103, 255, 200, 200, 200, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 249, 249, 249, 255, 117, 117, 117, 255, 17, 17, 17, 255, 89, 89, 89, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0,
    255, 0, 0, 0, 255, 0, 0, 0, 255, 1, 1, 1, 255, 119, 119, 119, 255, 249, 249, 249, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 251, 251, 251, 255, 53, 53, 53, 255, 75, 75, 75, 255, 215, 215, 215, 255, 27, 27, 27,
    255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 54, 54, 54,
    255, 251, 251, 251, 255, 255, 255, 255, 255, 255, 255, 255, 255, 123, 123, 123, 255, 71, 71, 71, 255, 255, 255, 255,
    255, 165, 165, 165, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0,
    0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 126, 126, 126, 255, 255, 255, 255, 255, 202, 202, 202, 255, 18, 18, 18, 255,
    231, 231, 231, 255, 255, 255, 255, 255, 137, 137, 137, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 1, 1, 1, 255, 206, 206, 206, 255, 96, 96, 96,
    255, 112, 112, 112, 255, 255, 255, 255, 255, 255, 255, 255, 255, 165, 165, 165, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0,
    0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 102,
    102, 102, 255, 56, 56, 56, 255, 170, 170, 170, 255, 255, 255, 255, 255, 255, 255, 255, 255, 236, 236, 236, 255, 11,
    11, 11, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0,
    0, 255, 0, 0, 0, 255, 62, 62, 62, 255, 16, 16, 16, 255, 229, 229, 229, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 190, 190, 190, 255, 68, 68, 68, 255, 17, 17, 17, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 23, 23, 23, 255, 25, 25, 25, 255, 233, 233, 233, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    235, 235, 235, 255, 178, 178, 178, 255, 30, 30, 30, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 25,
    25, 25, 255, 72, 72, 72, 255, 184, 184, 184, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 228, 228, 228, 255,
    12, 12, 12, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 74, 74, 74, 255, 120, 120, 120, 255, 136, 136, 136, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 90, 90, 90, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0,
    0, 255, 124, 124, 124, 255, 220, 220, 220, 255, 38, 38, 38, 255, 242, 242, 242, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 119, 119, 119, 255, 0, 0, 0, 255, 0, 0, 0, 255, 8, 8, 8, 255, 221, 221, 221, 255, 255, 255, 255, 255,
    135, 135, 135, 255, 81, 81, 81, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 90, 90, 90, 255, 0, 0, 0, 255, 0, 0,
    0, 255, 139, 139, 139, 255, 255, 255, 255, 255, 255, 255, 255, 255, 252, 252, 252, 255, 55, 55, 55, 255, 75, 75, 75,
    255, 231, 231, 231, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 242, 242, 242, 255, 16, 16, 16, 255, 0, 0, 0, 255, 57, 57, 57, 255, 252, 252, 252, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 249, 249, 249, 255, 119, 119, 119, 255, 19, 19, 19, 255, 130, 130, 130,
    255, 186, 186, 186, 255, 237, 237, 237, 255, 234, 234, 234, 255, 184, 184, 184, 255, 67, 67, 67, 255, 1, 1, 1, 255,
    121, 121, 121, 255, 249, 249, 249, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 198, 198, 198, 255, 102, 102, 102, 255, 62, 62, 62, 255, 17, 17, 17,
    255, 19, 19, 19, 255, 62, 62, 62, 255, 103, 103, 103, 255, 200, 200, 200, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255,
  ]),
};

const BITMAP_NAME = 'Bitmap from SVG';
const BITMAP_WIDTH = 16;
const BITMAP_HEIGHT = 16;
const BITMAP_NORMAL_DATA = [
  256, -267387841, -1071923181, -2145484771, 4063262, 134087678, -1879209985, -940324869, -62917649,
];
const BITMAP_INVERT_DATA = [
  256, 267387840, 1071923180, 2145484770, -4063263, -134087679, 1879209984, 940324868, 62917648,
];

class FakeImage {
  set onload(callback: () => void) {
    callback();
  }
}

vi.stubGlobal('Image', FakeImage);
vi.mock('@/pages/ImportFromImage/ImportForm/createCanvas');
vi.mock('@/components/BitmapEditor/components/BitmapView/getCanvas');

const createFileFromSvg = (data: string, filename: string): File => {
  const mimeType = 'image/svg+xml';
  const blob = new Blob([data], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};

const renderImportFromJsonPage = () => renderPage(<ImportFromImage />, { route: { path: PageUrl.ImportFromImage } });

const setupTest = async () => {
  const mockModule = await vi.importMock<typeof createCanvasModule>('@/pages/ImportFromImage/ImportForm/createCanvas');
  mockModule.createCanvas.mockImplementation(() => new FakeCanvas(imageData) as unknown as HTMLCanvasElement);

  const renderResult = renderImportFromJsonPage();
  const { userEvent } = renderResult;
  const file = createFileFromSvg(svgData, 'brilliance.svg');
  const inputFile = screen.getByLabelText('Image (*.jpg, *.png, *.svg)');
  const inputName = screen.getByLabelText('Name');
  const inputWidth = screen.getByLabelText('Width');
  const inputHeight = screen.getByLabelText('Height');
  const saveButton = screen.getByText('Save');

  await userEvent.type(inputName, BITMAP_NAME);
  await userEvent.upload(inputFile, file);
  await waitFor(() => expect(saveButton).toBeEnabled()); // Wait load image

  await userEvent.clear(inputWidth);
  await userEvent.type(inputWidth, `${BITMAP_WIDTH}`);
  await userEvent.clear(inputHeight);
  await userEvent.type(inputHeight, `${BITMAP_HEIGHT}`);

  return renderResult;
};

test('import bitmap from image', async () => {
  const { userEvent, stores, router } = await setupTest();
  const saveButton = screen.getByText('Save');

  expect(saveButton).toBeEnabled();
  await userEvent.click(saveButton);

  const bitmap = stores.bitmaps.bitmaps.find((it) => it.name === BITMAP_NAME);
  expect(bitmap).toBeDefined();
  const url = generatePath(PageUrl.EditBitmap, { id: bitmap!.id });
  expect(router.location.pathname).toBe(url);
  expect(bitmap?.data).toEqual(BITMAP_NORMAL_DATA);
});

test('invert color', async () => {
  const { userEvent, stores } = await setupTest();
  const saveButton = screen.getByText('Save');

  const invertCheckbox = screen.getByLabelText('Invert color');
  await userEvent.click(invertCheckbox);

  expect(saveButton).toBeEnabled();
  await userEvent.click(saveButton);

  const bitmap = stores.bitmaps.bitmaps.find((it) => it.name === BITMAP_NAME);
  expect(bitmap).toBeDefined();
  expect(bitmap!.data).toEqual(BITMAP_INVERT_DATA);
});

test('reset form', async () => {
  const { userEvent } = await setupTest();
  const saveButton = screen.getByText('Save');
  const resetButton = screen.getByText('Reset');

  expect(saveButton).toBeEnabled();
  expect(resetButton).toBeEnabled();

  await userEvent.click(resetButton);
  expect(saveButton).toBeDisabled();
});
