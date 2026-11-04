# Yasmin Arabic Portfolio

معرض أعمال شخصي باللغة العربية، باتجاه RTL، مع واجهة أمامية HTML/CSS/JavaScript وبداية Backend باستخدام Node.js وExpress.

## تشغيل الواجهة
يمكن فتح `index.html` مباشرة أو تشغيل مجلد المشروع عبر Live Server في VS Code.

## تشغيل Backend
راجعي `backend/README_AR.md`.

## حالة التطوير
- الواجهة الأمامية الحالية محفوظة كما هي.
- تمت إضافة هيكل أولي للـBackend ومسار فحص `/api/health`.
- قاعدة البيانات والجداول وتسجيل الدخول ولوحة التحكم وربط الواجهة بالـAPI ما زالت مراحل لاحقة.

## رفع التعديلات إلى GitHub
من Terminal داخل مجلد المشروع:

```bash
git status
git add .
git commit -m "Prepare portfolio backend structure"
git push origin main
```

لا ترفعي ملف `.env` أو مجلد `node_modules`.
