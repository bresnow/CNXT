import 'gun/lib/path';
import 'gun/sea';
import 'gun/lib/webrtc';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/lib/then';
import 'gun/lib/later';
import 'gun/lib/load';
import 'gun/lib/open';
import 'gun/lib/not';
import 'gun/lib/axe';
import { data } from '../../data.config';
import { ENV, gun } from './server-utils';

//@ts-ignore
gun.on('out', { get: { '#': { '*': '' } } });
const user = gun.user();

user.auth(ENV.APP_KEY_PAIR as any, (ack) => {
  if ((ack as any).err) {
    throw new Error(
      'APP AUTH FAILED - Check your app keypair environment variables ' +
        (ack as any).err
    );
  }
  console.log('APP AUTH SUCCESS');
});
user.put(data);
