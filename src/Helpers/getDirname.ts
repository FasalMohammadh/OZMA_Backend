import { dirname } from 'path';
import { fileURLToPath } from 'url';

const getDirName = () => dirname(fileURLToPath(import.meta.url));

export default getDirName;
