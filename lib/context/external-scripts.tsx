import { useMatches } from '@remix-run/react';
import jsesc from 'jsesc';
import React, { useId } from 'react';
/**
 *https://github.com/sergiodxa/remix-utils/blob/main/src/react/external-scripts.tsx
 */
type ReferrerPolicy =
  | 'no-referrer-when-downgrade'
  | 'no-referrer'
  | 'origin-when-cross-origin'
  | 'origin'
  | 'same-origin'
  | 'strict-origin-when-cross-origin'
  | 'strict-origin'
  | 'unsafe-url';

type CrossOrigin = 'anonymous' | 'use-credentials';

type ScriptDescriptor = {
  async?: boolean;
  crossOrigin?: CrossOrigin;
  defer?: boolean;
  integrity?: string;
  noModule?: boolean;
  nonce?: string;
  referrerPolicy?: ReferrerPolicy;
  src?: string;
  type?: string;
  innerHtml?: string;
};

export type ExternalScriptsFunction = () => ScriptDescriptor[];

export function ExternalScripts() {
  let id = useId();
  let matches = useMatches();
  let scripts = matches.flatMap((match) => {
    let scripts = match.handle?.scripts as ExternalScriptsFunction | undefined;
    if (typeof scripts === 'function') return scripts();
    return [];
  });

  return (
    <>
      {scripts.map((props) => {
        let rel = props.noModule ? 'modulepreload' : 'preload';
        let as = !props.noModule ? 'script' : undefined;
        return (
          <link
            key={id + props.src}
            rel={rel}
            href={props.src}
            as={as}
            crossOrigin={props.crossOrigin}
            integrity={props.integrity}
            referrerPolicy={props.referrerPolicy}
          />
        );
      })}

      {scripts.map((props) => {
        let markup = props.innerHtml || undefined;
        return <script {...props} key={id + props.src} />;
      })}
    </>
  );
}
