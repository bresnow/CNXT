import { IGunChain } from "gun/types";
import type { PromiseValue } from "type-fest";
/**
 * @see https://twitter.com/buildsghost/status/1507109734519750680
 */
export type PromiseObject = Record<string, Promise<Record<string, any>>>;
export type GunObjPromise = Record<string, IGunChain<string, any>>


export async function GunPromiseObject<GunPromiseObject>(
  object: GunPromiseObject
): Promise<PromiseObject> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(object).map(async ([key, promise]) => [key, await promise])
    )
  );
}
