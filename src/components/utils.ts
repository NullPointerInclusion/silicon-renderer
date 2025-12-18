export const tryCatch = <T extends (...args: any[]) => any>(
  fn: T,
  catchFn?: null | ((error: unknown, ...args: any[]) => unknown),
  callArgs?: null | Parameters<T>,
  catchArgs?: null | any[],
): ReturnType<T> | Error => {
  try {
    return fn(...(callArgs || []));
  } catch (error) {
    let possibleErr: unknown = error;

    if (catchFn) {
      try {
        possibleErr = catchFn(error, ...(catchArgs || []));
      } catch {
        possibleErr = error;
      }
    } else possibleErr = error;

    return possibleErr instanceof Error ? possibleErr : new Error(String(possibleErr));
  }
};

export const radiansToDegrees = (radians: number): number => (radians * 180) / Math.PI;
export const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
