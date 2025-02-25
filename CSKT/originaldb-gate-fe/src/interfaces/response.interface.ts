export interface IResponseMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IResponseFully<T> {
  data: T[];
  meta: IResponseMeta
}

export interface IErrorResponse {
  errors: IError[];
}
export interface IError {
  message: string;
  extensions: IExtensions;
}
export interface IExtensions {
  code: string;
  message: string;
}