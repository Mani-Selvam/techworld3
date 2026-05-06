// Polyfills for Node 10 compatibility

// globalThis polyfill
if (typeof globalThis === "undefined") {
    (global as any).globalThis = global;
}

// Object.fromEntries polyfill
if (!Object.fromEntries) {
    Object.fromEntries = function (entries: any) {
        const obj: any = {};
        for (const [key, value] of entries) {
            obj[key] = value;
        }
        return obj;
    };
}

// Array.prototype.at polyfill
if (!Array.prototype.at) {
    Array.prototype.at = function (index: number) {
        const arr = this;
        const len = arr.length;
        const actualIndex = index < 0 ? len + index : index;
        return actualIndex < 0 || actualIndex >= len
            ? undefined
            : arr[actualIndex];
    };
}
