import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { v2 as cloudinary } from 'cloudinary';

class Storage {
  static saveJSONToStorage(filename, content) {
    fs.writeFileSync(path.resolve(__dirname, '../', filename), JSON.stringify(content));
  }

  static saveMedia(filename, content) {
    const mediaDir = path.resolve(__dirname, '../media');
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir);
    }
    fs.writeFileSync(path.resolve(__dirname, '../media', filename), content);
  }

  static async uploadMedia(path) {
    const { CURRENT_YEAR } = process.env;
    const jsdomInstance = new JSDOM('');
    const url = new jsdomInstance.window.URL(path);
    const [, media, ...rest] = url.pathname.split('/').slice(0, -1);
    const targetFolder = ['', media, CURRENT_YEAR, ...rest].join('/');

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: targetFolder,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(path, options);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Storage;
