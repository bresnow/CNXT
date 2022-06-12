import { $, question, } from 'zx'
import { cd, read } from 'fsxx'
import fs from 'fs'
import Configstore from 'configstore';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const yaml = JSON.parse(fs.readFileSync('./github/main.yml', 'utf8'));
console.log(yaml)
packageJson.version = '0.2.123'
// Create a Configstore instance.
// const config = new Configstore(packageJson.name, { foo: 'bar' });

console.log(packageJson.version);

// version = await question("Version: ")