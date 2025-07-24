import fs from 'fs';
import path from 'path';

const timestamp = new Date().toISOString();
const versionJson = {
  version: timestamp,
};

const filePath = path.resolve(__dirname, '../public/version.json');
fs.writeFileSync(filePath, JSON.stringify(versionJson, null, 2));
console.log(`📝 version.json created with version: ${timestamp}`);
