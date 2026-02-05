/* API Response Standard */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T;
  errors?: ApiError[];
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}
