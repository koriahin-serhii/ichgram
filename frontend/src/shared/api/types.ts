export type ID = string;

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AuthResponse = {
  token?: string; // if backend returns token in body; cookies can also be used
  user?: { id: ID; name?: string; email?: string; username?: string; profileImage?: string };
};
