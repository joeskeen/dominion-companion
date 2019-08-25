import { copySync } from 'fs-extra';
import { join } from 'path';

const dataSrc = join(__dirname, 'dominiontabs/src/domdiv/card_db');
const imgSrc = join(__dirname, 'dominiontabs/src/domdiv/images');
const dest = join(__dirname, 'src/assets');

copySync(dataSrc, join(dest, 'data'), { recursive: true, overwrite: true });
copySync(imgSrc, join(dest, 'images'), { recursive: true, overwrite: true });
