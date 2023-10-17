import fs from 'fs';
import path from 'path';

class Storage {
  static saveJSONToStorage(filename, content) {
    fs.writeFileSync(path.resolve(__dirname, '../', filename), JSON.stringify(content));
  }
}

export default Storage;
