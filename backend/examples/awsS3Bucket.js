// Как правильно получать доступ к картинке в AWS S3 bucket?
// 1. Публичный доступ (для аватарок, статических картинок)
// Если картинка должна быть общедоступной (например, аватар пользователя):
// При загрузке укажите:
s3.upload({
  Bucket: "my-bucket",
  Key: "avatars/user123.jpg",
  Body: fileBuffer,
  ContentType: "image/jpeg",
  ACL: "public-read",   // сделать файл публичным
});
// Теперь к файлу можно обратиться напрямую по URL:
// https://my-bucket.s3.eu-central-1.amazonaws.com/avatars/user123.jpg
// Минус: ссылка доступна абсолютно всем.
// 2. Доступ только по времени (безопаснее, для приватных файлов)
// Если картинки должны быть приватные (например, документы, внутренние изображения), то делают pre-signed URL — временную ссылку.
// Пример (AWS SDK v3):

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "eu-central-1" });

async function getImageUrl() {
  const command = new GetObjectCommand({
    Bucket: "my-bucket",
    Key: "avatars/user123.jpg",
  });

  // ссылка будет работать 1 час
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}
// Тогда клиент получает не прямой URL, а подписанную ссылку вроде:

// https://my-bucket.s3.eu-central-1.amazonaws.com/avatars/user123.jpg?X-Amz-Algorithm=...
// Она работает ограниченное время, потом истекает.
// 3. Через CloudFront (рекомендуется для продакшена)
// Можно повесить CloudFront поверх S3.
// Тогда ссылки будут красивее и быстрее кэшироваться:
// https://cdn.myapp.com/avatars/user123.jpg
// Можно настроить подписанные ссылки даже через CloudFront, чтобы контролировать доступ.
// Что выбрать?
// Аватарки, иконки, общая статика, тогда public-read.
// Приватные изображения (документы, внутренний контент), тогда только через pre-signed URL.
// Много статики, продакшен, тогда S3 + CloudFront.
// Как сделать файл публичным в S3 (через интерфейс AWS)
// 1. Найдите нужный бакет
// Зайдите в AWS Console -> S3.
// Откройnt свой бакет (например, social-app-storage-oiau5is).
// 2. Найдите объект (картинку)
// Перейдите в папку (например, avatars/).
// Кликните по файлу (например, 1758130419828-Foto.jpg).
// 3. Измените права доступа
// В открывшейся карточке файла (Object overview) найдите раздел Permissions.
// Прокрутите вниз до Object ownership / Access Control List (ACL).
// Нажмите Edit -> и включите Public access.
// Для AWS иногда это формулируется как «Grant public-read».
// Сохраните изменения.
// 4. Убедитесь, что бакет разрешает публичный доступ
// Перейдите в Bucket -> Permissions -> Block public access.
// Снимите галку Block all public access (осторожно, это сделает бакет доступным).
// Сохраните изменения.
// 5. Ссылка на файл
// После этого к файлу можно обращаться по ссылке:

// https://<bucket-name>.s3.<region>.amazonaws.com/<path>/<filename>
// Например:

// https://social-app-storage-oiau5is.s3.eu-central-1.amazonaws.com/avatars/1758130419828-Foto.jpg
// Открыв в браузере, вы сразу увидите картинку.