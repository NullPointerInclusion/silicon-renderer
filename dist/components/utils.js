export const tryCatch = (fn, catchFn, callArgs, catchArgs) => {
    try {
        return fn(...(callArgs || []));
    }
    catch (error) {
        let possibleErr = error;
        if (catchFn) {
            try {
                possibleErr = catchFn(error, ...(catchArgs || []));
            }
            catch {
                possibleErr = error;
            }
        }
        else
            possibleErr = error;
        return possibleErr instanceof Error ? possibleErr : new Error(String(possibleErr));
    }
};
export const radiansToDegrees = (radians) => (radians * 180) / Math.PI;
export const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
//# sourceMappingURL=utils.js.map