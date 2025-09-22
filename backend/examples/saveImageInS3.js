// Ребята, давайте уточним, как реализовать хранение картинки в S3.
// Описание рабочего процесса:
// 1. Пользователь загружает файл через форму на фронтенде.
// 2. Бэкенд принимает файл и отправляет его в S3 (через aws-sdk или @aws-sdk/client-s3).
// 3. После успешной загрузки получаете URL файла (например, https://bucket-name.s3.eu-central-1.amazonaws.com/my-image.png).
// 4. Сохраняешь в MongoDB документ вида:

{
  "filename": "my-image.png",
  "url": "https://bucket-name.s3.eu-central-1.amazonaws.com/my-image.png",
  "userId": "12345",
  "uploadedAt": "2025-09-22T12:00:00Z"
}
// 5.  Фронтенд получает ссылку из MongoDB и может показывать картинку напрямую из S3.
// Код-пример (Node.js + Express + MongoDB + S3)
import express from "express";
import multer from "multer"; 
// multer нужен для работы с загрузкой файлов через form-data
// (например, <input type="file" />). Он парсит multipart/form-data 
// и делает файл доступным в req.file

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; 
// Это AWS SDK v3 (модульная версия). 
// Лучше использовать именно @aws-sdk/client-s3 вместо старого aws-sdk:
// - он легче (подгружается только S3, а не весь SDK)
// - поддерживает tree-shaking
// - более современный синтаксис и оптимизации.

import mongoose from "mongoose";

const app = express();

// Храним файлы в памяти (RAM), а не на диске, чтобы сразу 
// отправлять их в S3 (удобно для временных файлов).
const upload = multer({ storage: multer.memoryStorage() });

// Инициализируем клиента S3. В реальности сюда ещё можно передать credentials 
// или использовать IAM роли, если код крутится в AWS.
const s3 = new S3Client({ region: "eu-central-1" });

// Описание схемы MongoDB для хранения метаданных картинки
const ImageSchema = new mongoose.Schema({
  filename: String,        // имя файла
  url: String,             // ссылка на файл в S3
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },          // кто загрузил (id пользователя)
  uploadedAt: { type: Date, default: Date.now } // дата загрузки
});

// Модель для работы с MongoDB
const Image = mongoose.model("Image", ImageSchema);

// Эндпоинт загрузки файла
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // multer кладёт файл в req.file
    const file = req.file!;
    const bucketName = process.env.S3_BUCKET!;

    // Подготавливаем параметры для загрузки файла в S3
    const uploadParams = {
      Bucket: bucketName,         // имя бакета
      Key: file.originalname,     // имя файла в S3 (можно заменить на uuid для уникальности)
      Body: file.buffer,          // содержимое файла (буфер)
      ContentType: file.mimetype  // MIME-тип (например, image/png)
    };

    // Загружаем файл в S3
    await s3.send(new PutObjectCommand(uploadParams));

    // Формируем публичный URL (если бакет публичный)
    const url = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${file.originalname}`;

    // Сохраняем метаданные в MongoDB
    const image = new Image({
      filename: file.originalname,
      url,
      userId: req.body.userId // id пользователя передаётся в теле запроса
    });
    await image.save();

    // Отправляем ответ клиенту
    res.json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});