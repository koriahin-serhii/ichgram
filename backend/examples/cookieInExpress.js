// // Ребята, давайте разберём процесс работы с cookie в Express и то, 
// // как они используются для передачи данных (например, JWT) между клиентом и сервером.
// // 1. Сервер записывает cookie клиенту
// // В Express есть встроенный метод res.cookie().
// // Пример:
// import { Response } from "express";

// res.cookie("token", jwtToken, {
//   httpOnly: true,   // клиентский JS не сможет прочитать куку (безопаснее)
//   secure: true,     // только по HTTPS
//   sameSite: "strict", // кука не будет утекать на сторонние сайты
//   maxAge: 1000 * 60 * 60 * 24 // 1 день
// });
// // После этого в ответе сервера клиенту уйдёт заголовок Set-Cookie.
// // Браузер сам сохранит его и будет хранить у себя.
// // 2. Как клиент получает cookie
// // Если это браузер, то он автоматически сохраняет куку в хранилище (DevTools -> Application -> Cookies).
// // Если это, например, fetch или axios в браузере:
// // при обычных запросах браузер сам будет отправлять куку на сервер;
// // если API находится на другом домене, то нужно явно включить credentials: "include" в fetch 
// // или withCredentials: true в axios.
// // Пример с fetch:
// fetch("https://api.example.com/user", {
//   method: "GET",
//   credentials: "include" // включаем отправку cookies
// });
// // 3. Как сервер получает cookie
// // При каждом запросе браузер добавляет заголовок Cookie в HTTP-запрос, например:
// // Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// // В Express для работы с куками часто используют пакет cookie-parser:
// import cookieParser from "cookie-parser";

// app.use(cookieParser());

// app.get("/profile", (req, res) => {
//   const token = req.cookies.token; // забираем JWT из куки
//   res.json({ token });
// });
// // ! Важный момент: если cookie httpOnly: true, то JS-код на клиенте её не увидит. Это повышает защиту от XSS-атак, но тогда доступ к токену есть только у сервера - это безопаснее.
// // 5. Схема по шагам
// // Клиент отправляет запрос на /login с логином/паролем.
// // Сервер проверяет данные -> создаёт JWT -> кладёт его в cookie через res.cookie().
// // Браузер автоматически сохраняет cookie.
// // При следующем запросе (например, /profile) браузер добавляет заголовок Cookie.
// // Сервер читает JWT из cookie, проверяет подпись, достаёт userId.
// // Если токен валиден -> возвращает защищённые данные.
// // 6. Что значит "обычные запросы"
// // "Обычные запросы" - это те, что браузер делает сам в рамках того же домена/поддомена, к которому прикреплена кука.
// // Пример:
// // Сервер https://api.example.com установил cookie token.
// // Теперь при любом запросе к https://api.example.com/* (страница, fetch, AJAX) браузер сам добавит заголовок Cookie.
// // То есть вам не нужно вручную забирать JWT из localStorage и отправлять его - браузер сделает это автоматически.
// // Если запрос идёт на другой домен (CORS), то надо явно указывать credentials: "include" (для fetch) или withCredentials: true (для axios).
// // 7. Как отправить cookie httpOnly с клиента
// // Когда httpOnly: true, JS не может прочитать куку (это и есть защита от XSS).
// // Но браузер всё равно будет её отправлять автоматически в заголовке Cookie, если выполняются условия:
// // домен совпадает,
// // путь совпадает,
// // протокол (если secure: true) - только HTTPS.
// // Т.е. клиенту вообще не нужно руками её отправлять - браузер сделает всё сам.
// // 8. Что значит «совпадает путь» для cookie
// // Когда сервер устанавливает куку через Set-Cookie, он может указать атрибут Path.
// // Пример ответа от сервера:
// // Set-Cookie: token=abc123; Path=/api; HttpOnly; Secure; SameSite=Strict
// // Path=/api означает, что браузер будет отправлять эту куку только в запросах к URL, начинающимся с /api.
// // Запрос на /api/profile , значит кука отправится
// // Запрос на /home , значит кука не отправится
// // Если атрибут Path не указан, по умолчанию берётся / (т.е. кука отправляется во все запросы к данному домену).
// // 9. Что если домены frontend и backend разные
// // Это классическая ситуация (например: frontend.com и api.frontend.com или frontend.com и backend.com). Здесь вступают правила CORS + cookies.
// // Чтобы кука отправлялась:
// // На стороне сервера (Express)
// // При установке cookie:
// res.cookie("token", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",  // важно при кросс-доменных запросах
// });
// // Без sameSite: "none" браузер заблокирует куку при запросах с другого домена.
// // Также нужно настроить CORS:
// import cors from "cors";

// app.use(cors({
//   origin: "https://frontend.com", // домен фронтенда
//   credentials: true,              // разрешаем отправку cookies
// }));
// // На стороне клиента (например, fetch)
// fetch("https://backend.com/api/profile", {
//   method: "GET",
//   credentials: "include", // заставляет браузер отправлять куки
// });
// // Если не указать credentials: "include", кука не уйдёт.
// // Минимальный рабочий пример, где:
// // Frontend живёт на http://localhost:3000
// // Backend живёт на http://localhost:4000
// // Авторизация выдаёт JWT в httpOnly cookie
// // Клиент потом автоматически отправляет cookie при запросах к API
// // Backend (Express + JWT + Cookies)
// // server.ts
// import express, { Request, Response } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import jwt from "jsonwebtoken";

// const app = express();
// const JWT_SECRET = "supersecret"; // вынести в .env для безопасности

// app.use(express.json());
// app.use(cookieParser());

// // Разрешаем фронтенду делать кросс-доменные запросы и слать куки
// app.use(cors({
//   origin: "http://localhost:3000", // адрес фронтенда
//   credentials: true,               // разрешаем куки
// }));

// // Маршрут для логина
// app.post("/login", (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   // Простейшая проверка пользователя
//   if (username !== "admin" || password !== "123") {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   // Создаём JWT
//   const token = jwt.sign({ userId: "12345" }, JWT_SECRET, { expiresIn: "1h" });

//   // Отправляем токен в httpOnly cookie
//   res.cookie("token", token, {
//     httpOnly: true,   // JS на клиенте не может читать эту куку
//     secure: false,    // true = только HTTPS (для продакшена обязательно)
//     sameSite: "none", // нужно при разных доменах фронта и бэка
//     maxAge: 1000 * 60 * 60, // 1 час
//   });

//   res.json({ message: "Logged in successfully" });
// });

// // Пример защищённого маршрута
// app.get("/profile", (req: Request, res: Response) => {
//   const token = req.cookies.token; // читаем JWT из куки
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//     res.json({ userId: decoded.userId, message: "Hello from protected route" });
//   } catch (err) {
//     res.status(403).json({ message: "Invalid token" });
//   }
// });

// app.listen(4000, () => {
//   console.log("Backend running on http://localhost:4000");
// });
// Frontend (axios)
// index.html
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Frontend Example (axios)</title>
//   <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// </head>
// <body>
//   <button id="login">Login</button>
//   <button id="profile">Get Profile</button>

//   <script>
//     // Настраиваем axios: включаем отправку куки
//     axios.defaults.withCredentials = true;

//     // Обработчик кнопки "Login"
//     document.getElementById("login").onclick = async () => {
//       try {
//         const res = await axios.post("http://localhost:4000/login", {
//           username: "admin",
//           password: "123"
//         });
//         console.log("Login:", res.data);
//       } catch (err) {
//         console.error("Login failed:", err.response?.data || err);
//       }
//     };

//     // Обработчик кнопки "Get Profile"
//     document.getElementById("profile").onclick = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/profile");
//         console.log("Profile:", res.data);
//       } catch (err) {
//         console.error("Profile request failed:", err.response?.data || err);
//       }
//     };
//   </script>
// </body>
// </html>
// {/* Теперь при login сервер установит httpOnly cookie, браузер её сохранит, 
// а axios будет автоматически отправлять её в каждом запросе к http://localhost:4000, 
// благодаря axios.defaults.withCredentials = true. */}