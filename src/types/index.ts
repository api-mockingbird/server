export interface User {
  createdAt: Date;
  id: string;
  isTemp: boolean;
}

export interface MockEndpoint {
  charset: Charset;
  endpointName: string;
  httpHeaders: string;
  httpMethod: HttpMethod;
  httpResponseBody: string;
  httpStatus: HttpStatus;
  id: number;
  responseContentType: ResponseContentType;
  timeout: number;
  urlPath: string;
  userId: string;
}

export interface MockEndpointInput {
  id?: number;
  charset: Charset;
  endpointName: string;
  httpHeaders: string;
  httpMethod: HttpMethod;
  httpResponseBody: string;
  httpStatus: HttpStatus;
  responseContentType: ResponseContentType;
  timeout: number;
  urlPath: string;
}

export interface UserCreateInput {
  id?: string | null;
  isTemp?: boolean | null;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
type HttpStatus =
  | 200
  | 201
  | 204
  | 401
  | 402
  | 403
  | 404
  | 405
  | 500
  | 502
  | 503
  | 504;
type Charset = 'UTF-8';
type ResponseContentType =
  | 'application/json'
  | 'application-x-www-form-urlencoded';
