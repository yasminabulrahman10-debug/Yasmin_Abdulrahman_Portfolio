# دليل الإعداد خطوة بخطوة

افتحي PowerShell في مجلد `My-Portfolio` (المجلد الذي يحتوي `index.html` و`package.json`).

1. انسخي `backend/.env.example` إلى `backend/.env`.
2. افتحي `backend/.env` وعدّلي:
   - `DB_USER` و`DB_PASSWORD` حسب MySQL عندك.
   - `JWT_SECRET` إلى قيمة طويلة عشوائية 32 حرفًا أو أكثر.
   - `ADMIN_EMAIL` و`ADMIN_PASSWORD` إلى بيانات دخول المديرة الخاصة.
   - `CLIENT_URL=http://127.0.0.1:5500,http://localhost:5500`
3. نفذي الأوامر بالترتيب:
   ```powershell
   npm run setup
   npm run db:create
   npm run db:migrate
   npm run db:seed
   npm run admin:create
   npm run dev
   ```
4. يجب أن يظهر `Yasmin API: http://localhost:5000`.
5. افتحي `http://localhost:5000/api/health`، ثم افتحي `index.html` باستخدام Live Server.
6. افتحي `/admin/` من نفس Live Server وسجلي الدخول ببيانات `ADMIN_EMAIL` و`ADMIN_PASSWORD`.

إذا فشل أمر، توقفي عنده وأرسلي نص الخطأ كاملًا. لا تنتقلي للأمر التالي حتى نعالج الخطأ.
