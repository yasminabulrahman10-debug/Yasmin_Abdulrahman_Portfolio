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





/*
  Yasmin Portfolio API
  شرح إعدادات المشروع والمكتبات
*/

// معلومات المشروع
const project = {
  name: "yasmin-portfolio-api",
  version: "1.0.0",
  description: "Backend API for Yasmin Arabic Portfolio",
  main: "src/server.js"
};

// أوامر تشغيل المشروع
const scripts = {
  // تشغيل الخادم
  start: "node src/server.js",

  // تشغيل الخادم أثناء التطوير
  dev: "nodemon src/server.js"
};

// المكتبات الأساسية ووظيفة كل مكتبة
const dependencies = {
  express: "إنشاء الخادم ومسارات API",
  cors: "السماح بالتواصل بين Frontend و Backend",
  dotenv: "قراءة متغيرات البيئة من ملف .env",
  helmet: "إضافة إعدادات حماية HTTP",
  morgan: "تسجيل طلبات HTTP",
  mysql2: "الاتصال بقاعدة بيانات MySQL",
  sequelize: "إدارة الجداول والعلاقات والاستعلامات"
};

// مكتبات التطوير
const devDependencies = {
  nodemon: "إعادة تشغيل الخادم تلقائياً عند تعديل الملفات"
};

// عرض معلومات المشروع
console.log("Project:", project);
console.log("Scripts:", scripts);
console.log("Dependencies:", dependencies);
console.log("DevDependencies:", devDependencies);
