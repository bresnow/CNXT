import React from 'react';

export function useIff<ReturnValue = any>(
  conditions: any[],
  statementCallback: () => ReturnValue,
  opts?: { else: () => void }
) {
  // Csallback function that returns the condition statement
  let memo = React.useCallback(statementCallback, [statementCallback]);

  // iff mounted we'll loop through the condition dependencies to check for falsy values
  React.useEffect(() => {
    for (let i = 0; i < conditions.length; i++) {
      if (
        conditions[i] === false ||
        conditions[i] === null ||
        typeof conditions[i] === 'undefined'
      ) {
        return opts?.else ? opts.else : function noop() {}; // cleanup function as an else statement
      }
    }
    // if condition is true make a statement
    memo();
  }, [conditions]);
}

export function Iff({
  conditions,
  children,
}: {
  conditions: any[];
  children: React.ReactNode;
}) {
  return (
    <>
      {conditions.map((condition, index) => {
        if (
          condition === false ||
          condition === null ||
          typeof condition === 'undefined'
        ) {
          return null;
        }
        return children;
      })}
    </>
  );
}
