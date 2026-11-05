const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "../../uploads");
fs.mkdirSync(dir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,dir),
  filename: (req,file,cb) => {
    const ext=path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const allowed = new Set(["image/jpeg","image/png","image/webp","image/gif","application/pdf"]);
module.exports = multer({storage,limits:{fileSize:Number(process.env.MAX_FILE_SIZE_MB || 5)*1024*1024},
  fileFilter:(req,file,cb)=> allowed.has(file.mimetype) ? cb(null,true) : cb(new Error("نوع الملف غير مسموح"))
});
