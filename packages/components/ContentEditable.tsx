import React, {
  createElement,
  useEffect,
  createRef,
  useRef,
  forwardRef,
} from 'react';

export interface ReactContenteditableProps {
  /**
   * default: true
   */
  editable?: boolean;

  /**
   * placeholder
   */
  placeholder?: string;

  /**
   * style
   */
  style?: React.CSSProperties;

  /**
   * default: 'editable-area'
   */
  className?: string;

  /**
   * delimiter, default: #
   */
  delimiter?: string;

  /**
   * value
   */
  value?: string;

  /**
   * onChange
   */
  onChange?: (value?: string) => void;
}

export interface ContenteditableComponent
  extends React.Component<ReactContenteditableProps> {}

export const ContentEditable: React.FC<ReactContenteditableProps> = forwardRef(
  (
    { placeholder, style, className = '', editable = true, value, onChange },
    ref
  ) => {
    const editableRef = createRef<HTMLDivElement>();
    const beforeInsertOffsetRef = useRef(0);
    const curNodeRef = useRef<Node>();
    const enteredRef = useRef(false);
    const codeRef = useRef<string>();
    const compositionLock = useRef(false);

    // other typewriting event
    const onCompositionStart = () => {
      compositionLock.current = true;
    };
    const onCompositionEnd = () => {
      compositionLock.current = false;
      onAnchorTextChange();
    };

    const onInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (compositionLock.current) {
        return;
      }
      onAnchorTextChange();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { code } = e;
      if (code === 'Enter') {
        e.preventDefault();
        value += '\n';
        return;
      }

      codeRef.current = code;

      const $ref = editableRef.current!,
        nodes = $ref.childNodes,
        len = nodes.length;

      const selection = document.getSelection()!,
        offset = selection.anchorOffset,
        currentNode = nodes[offset];

      if (offset < len && code === 'ArrowRight') {
        e.preventDefault();
        const range = selection.getRangeAt(0);
        range.setStartAfter(currentNode);
      }
    };

    const onAnchorTextChange = () => {
      const selection = document.getSelection()!;
      const currentNode = selection.anchorNode!;

      const $ref = editableRef.current!;
      const children = $ref.childNodes;

      enteredRef.current = true;

      if (currentNode.nodeType === 3) {
        // text node
        const nodeVal = currentNode.nodeValue!;
        const offset = selection.anchorOffset;

        // save current node & position
        curNodeRef.current = currentNode;
        beforeInsertOffsetRef.current = offset;

        const txt = nodeVal.substring(0, offset);

        onChange && onChange($ref.innerHTML);
      } else if ($ref === currentNode && children.length === 0) {
        onChange && onChange(undefined);
      }
    };

    useEffect(() => {
      // Trigger only under non-input conditions(use innerHTML)
      if (enteredRef.current === false) {
        editableRef.current!.innerHTML = value === undefined ? '' : value;
      }
    }, [value]);

    const $className = `${className}`;

    return (
      <p
        placeholder={placeholder}
        style={style}
        contentEditable={editable}
        className={$className}
        ref={editableRef}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onPaste={(e) => e.preventDefault()}
      >
        {value}
      </p>
    );
  }
);
