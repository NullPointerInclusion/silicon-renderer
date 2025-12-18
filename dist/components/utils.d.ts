export declare const tryCatch: <T extends (...args: any[]) => any>(fn: T, catchFn?: null | ((error: unknown, ...args: any[]) => unknown), callArgs?: null | Parameters<T>, catchArgs?: null | any[]) => ReturnType<T> | Error;
export declare const radiansToDegrees: (radians: number) => number;
export declare const degreesToRadians: (degrees: number) => number;
//# sourceMappingURL=utils.d.ts.map