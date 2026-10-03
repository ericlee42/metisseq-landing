export const tuple = <T extends string[]>(...args: T) => args;
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
