import path from 'path';
import fs from 'fs-extra';

const resolvePath = (args: string) => path.resolve(process.cwd(), args);

export function exists(path: string) {
  return fs.existsSync(resolvePath(path));
}

export async function remove(path: string) {
  return fs.remove(resolvePath(path));
}

export async function read(arg: string) {
  const path = resolvePath(arg);
  return fs.readFile(path, 'utf-8');
}

export async function write(path: string, content: any) {
  return fs.writeFile(resolvePath(path), content, 'utf-8');
}

write.sync = function (path: any, content: string | NodeJS.ArrayBufferView) {
  return fs.writeFileSync(resolvePath(path), content, 'utf-8');
};
