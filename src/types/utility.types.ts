export type JSON =
  | string
  | number
  | boolean
  | { [x: string]: JSON }
  | Array<JSON>;
