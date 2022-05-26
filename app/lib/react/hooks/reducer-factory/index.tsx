import invariant from "@remix-run/react/invariant";

export function ReducerFactory<InitialState, HandlerKey, ActionPayload>(
  handler: Map<
    HandlerKey,
    (state: InitialState, payload?: ActionPayload) => InitialState | undefined
  >
) {
  return function reducer(
    state: InitialState,
    action: { type: HandlerKey; payload?: ActionPayload }
  ) {
    let { payload, type } = action;
    const handlerFunc = handler.get(type);
    invariant(handlerFunc, `No handler for ${type}`);

    return handlerFunc(state, payload);
  };
}
