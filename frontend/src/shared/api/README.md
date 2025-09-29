Centralized API client
======================

- Base URL: `VITE_API_URL` env or `/api` (dev proxy)
- Cookies supported (`withCredentials: true`). Token from `localStorage.token` is attached as `Authorization: Bearer ...` when present.

Usage examples:

```ts
import { AuthAPI } from '@api';

await AuthAPI.login({ email, password });
await AuthAPI.register({ name, email, password });
await AuthAPI.logout();
```

Dev proxy (vite.config.ts) forwards `/api` to backend (default http://localhost:3000), avoiding CORS in dev.
