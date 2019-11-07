declare module '*.css';
declare module "*.png";

declare module '@lxjx/utils' {
  export function isFunction(arg: any): boolean;
  export function isBoolean(arg: any): boolean;
  export function isObject(arg: any): boolean;
  export function isString(arg: any): boolean;
  export function isNumber(arg: any): boolean;
  export function isUndefined(arg: any): boolean;
}
