const SITE_PREFIX = '/bitmap_editor';

export enum PageUrl {
  Home = `${SITE_PREFIX}/`,
  CreateBitmap = `${SITE_PREFIX}/create_bitmap/`,
  ImportFromImage = `${SITE_PREFIX}/import_from_image/`,
  ImportFromCollections = `${SITE_PREFIX}/import_from_collections/`,
  ImportFromJson = `${SITE_PREFIX}/import_from_json/`,
  EditBitmap = `${SITE_PREFIX}/bitmap/:id/`,
}
