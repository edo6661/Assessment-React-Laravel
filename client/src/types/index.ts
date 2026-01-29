export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  descriptions: string | null;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}
export interface TodoFormValues {
  title: string;
  descriptions?: string | null;
  is_done?: boolean;
}

export interface AuthResponse {
  message: string;
  data: User;
  token: string;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface CursorMeta {
  path: string;
  per_page: number;
  next_cursor: string | null;
  prev_cursor: string | null;
}

export interface TodoListResponse {
  data: Todo[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: CursorMeta;
}

export interface TodoUpdateResponse {
  message: string;
  data: Todo;
}
