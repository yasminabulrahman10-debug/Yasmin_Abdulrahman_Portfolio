# Backend — معرض أعمال ياسمين

## البنية
- Express REST API.
- MySQL + Sequelize.
- JWT لتسجيل دخول المديرة، وbcryptjs لتجزئة كلمة المرور.
- Multer لرفع الصور وملفات PDF.
- لوحة الإدارة في `../admin/index.html`.
- الواجهة العامة الأصلية في `../index.html` وتحمّل البيانات من API عند توفرها، وتحتفظ بمحتوى HTML كبديل إذا لم تتوفر بيانات.

## المتطلبات
Node.js LTS، MySQL Server، وMySQL Workbench اختياريًا.

## إعداد أول مرة (من مجلد المشروع الرئيسي)
1. انسخي `backend/.env.example` إلى `backend/.env`.
2. عدّلي بيانات MySQL وعيّني `JWT_SECRET` عشوائيًا بطول 32 حرفًا على الأقل.
3. عيّني `ADMIN_EMAIL` و`ADMIN_PASSWORD` (12 حرفًا على الأقل) في `backend/.env`.
4. نفّذي `npm run setup`.
5. أنشئي قاعدة البيانات: `npm run db:create`.
6. أنشئي الجداول: `npm run db:migrate`.
7. حمّلي محتوى الموقع الحالي إلى قاعدة البيانات: `npm run db:seed`. الأمر لا يكرر بيانات الجداول غير الفارغة.
8. أنشئي حساب المديرة: `npm run admin:create`.
9. شغّلي الخادم: `npm run dev`.

## التشغيل اليومي
- API: `npm run dev` من جذر المشروع.
- افتحي الموقع عبر Live Server على `http://127.0.0.1:5500`.
- افتحي لوحة الإدارة: `http://127.0.0.1:5500/admin/`.
- فحص API: `http://localhost:5000/api/health`.

## API
- `POST /api/auth/login` تسجيل دخول.
- `GET /api/auth/me` بيانات الجلسة (Bearer token).
- `GET /api/profile`, `/api/projects`, `/api/experiences`, `/api/education`, `/api/skills`, `/api/certificates` بيانات عامة منشورة.
- `POST /api/messages` استقبال رسالة التواصل.
- `/api/admin/*` عمليات إدارة محمية بتوكن.
- `POST /api/uploads` رفع صورة أو PDF، بحد افتراضي 5MB.

## ملاحظات أمنية
- لا ترفعي `backend/.env` إلى GitHub.
- لا تستخدمي كلمة مرور افتراضية أو تتركي `CHANGE_...`.
- قبل النشر الفعلي، استخدمي HTTPS، غيّري أسرار JWT، واضبطي `CLIENT_URL` على نطاق الموقع الحقيقي.
- رفع الملفات يسمح حاليًا بصور JPEG/PNG/WebP/GIF وPDF فقط.
- لا تضعي مجلد `node_modules` في Git.
