interface Reducer<T> {
  (state: T, payload: any): void;
  signKey: string;
}

export interface Model<T> {
  namespace: string,
  state?: T;
  reducers?: {
    [key: string]: Reducer<T>;
  }
  effects?: {
    [key: string]: any;
  }
}
