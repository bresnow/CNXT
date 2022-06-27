import React from 'react';
import debug from '~/app/debug';
let { log, error, opt, warn } = debug({ devOnly: true });
export const ContentEditable = ({
  children,
  name,
  id,
  edit,
  ...props
}: {
  children: React.ReactNode;
  name: string;
  id: string;
  edit?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  let ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current && ref.current instanceof HTMLDivElement) {
      let el = ref.current;
      let input = document.getElementById(`${name}-${id}`);

      el.oninput = ({ target, type }) => {
        if (
          target instanceof HTMLDivElement &&
          input instanceof HTMLInputElement
        ) {
          input.value = ((state: HTMLDivElement, newText: string) => {
            return state.innerText + newText;
          })(target, target.innerText);
          log(`inputElement - ${input.value}`);
        }
      };
    }
  }, [children]);
  return (
    <>
      <div
        ref={ref}
        {...props}
        contentEditable={edit}
        suppressContentEditableWarning={true}
      >
        {children}
      </div>
      <input id={`${name}-${id}`} name={name} type='hidden' />
    </>
  );
};
