export const errorCheck = (promise: any) => {
    let prop = "err" || "ERR" || "error" || "ERROR"
    if (Object.getOwnPropertyNames(promise).includes(prop)) {
        return true
    }
    return false
}
export const checkIf = {
    isObject: function (value: unknown) {
        return !!(value && typeof value === "object" && !Array.isArray(value));
    },
    isNumber: function (value: unknown) {
        return !isNaN(Number(value));
    },
    isBoolean: function (value: unknown) {
        if (
            value === "true" ||
            value === "false" ||
            value === true ||
            value === false
        ) {
            return true;
        }
    },
    isString: function (value: unknown) {
        return typeof value === "string";
    },
    isArray: function (value: unknown) {
        return Array.isArray(value);
    },

    isFn: function (value: unknown) {
        return typeof value === "function";
    },
};