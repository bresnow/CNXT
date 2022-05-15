/*
 * Provide one instance of gun to your entire app.
 * NOTE Using this component blocks render until gun is ready
 *
 * Usage examples:
 * // index.js
 *   import { GunContextProvider } from './useGunContext'
 *   // ...
 *   <GunContextProvider>
 *     <App />
 *   </GunContextProvider>
 *
 * // App.js
 *   import useGunContext from './useGunContext'
 *   // ...
 *   const { getGun, getUser } = useGunContext()
 *
 *   getGun().get('ours').put('this')
 *   getUser().get('mine').put('that')
 */

const CONSTANTS = {
  RMX_GUN_ACCESS_TOKEN: "RMX-GUN-Access-Token",
  ERROR_MESSAGE: { ACCESS_TOKEN_MISSING: "Access token missing" },
};
import React, { createContext, useContext, useRef, useEffect } from "react";
import Gun from "gun/gun";
import "gun/sea";
import {
  GunHookMessageOut,
  IGun,
  IGunHookContext,
  IGunInstance,
  IGunInstanceHookHandler,
  _GunRoot,
} from "gun";
import { useFetcher } from "remix";
import { useGunStatic } from ".";
import { useIf } from "bresnow_utility-react-hooks";

const GunContext = createContext<any>({
  getGun: () => {},
  getUser: () => {},
  getCertificate: () => {},
  setCertificate: () => {},
  onAuth: () => () => {},
});

export const GunContextProvider = ({
  children,
  Gun,
}: {
  children: React.PropsWithChildren<any>;
  Gun: IGun;
}) => {
  const gunRef = useRef();
  const userRef = useRef();
  const certificateRef = useRef();
  const accessTokenRef = useRef<string>();
  const onAuthCbRef = useRef();
  const [gun, SEA] = useGunStatic(Gun);
  const fetcher = useFetcher();

  useIf([fetcher.type === "init", !fetcher.data], () => {
    fetcher.load("/api/gun/token");
  });
  useIf(
    [fetcher.type === "done", !fetcher.data.error, fetcher.data.token],
    () => {
      accessTokenRef.current = fetcher.data.token;
    }
  );
  useEffect(() => {
    Gun.on("opt", function (this: IGunHookContext<_GunRoot>, ctx: _GunRoot) {
      if ((ctx as any).once) return;

      ctx.on("out", function <
        MessageExtension extends Partial<{
          headers: { accessToken: string };
          err: string;
        }>,
        MetaExtension extends Partial<_GunRoot>
      >(this: IGunHookContext<GunHookMessageOut<MessageExtension, MetaExtension>>, msg: GunHookMessageOut<MessageExtension, MetaExtension>) {
        const to = this.to;
        // Adds headers for putm\
        accessTokenRef.current = msg.headers?.accessToken;
        to.next(msg); // pass to next middleware
        if (fetcher.data.error) {
          console.error(fetcher.data.error);
        }
      });
    });
  }, []);

  // create user
  const user = gun.user();
  useEffect(() => {
    gun.on("auth", (...args) => {
      if (!accessTokenRef.current) {
        // get new token
        user.get("alias").once((username: any) => {
          fetch("http://localhost:8765/api/tokens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              //   pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ accessToken }) => {
              // store token in app memory
              accessTokenRef.current = accessToken;
            });
        });
      }

      if (!certificateRef.current) {
        // get new certificate
        user.get("alias").once((username: any) => {
          fetch("http://localhost:8765/api/certificates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              //   pub: user.is.pub,
            }),
          })
            .then((resp) => resp.json())
            .then(({ certificate }) => {
              // store certificate in app memory
              // TODO check if expiry isn't working or misconfigured
              // TODO handle expired certificates
              certificateRef.current = certificate;
            });
        });
      }

      if (onAuthCbRef.current) {
        // onAuthCbRef.current(...args);
      }
    });

    // gunRef.current = gun;
    // userRef.current = user;
  }, []);

  return (
    <GunContext.Provider
      value={{
        getGun: () => gunRef.current,
        getUser: () => userRef.current,
        getCertificate: () => certificateRef.current,
        //   setCertificate: (v: undefined) => {
        //   return certificateRef.current = v;
        // },
        // onAuth: (cb: undefined) => {
        //   onAuthCbRef.current = cb;
        //    },
      }}
    >
      {children}
    </GunContext.Provider>
  );
};

export default function useGunContext() {
  return useContext(GunContext);
}
