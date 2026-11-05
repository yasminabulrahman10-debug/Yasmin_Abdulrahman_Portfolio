require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const origins = (process.env.CLIENT_URL || "").split(",").map(v=>v.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin(origin, callback) {
  if (!origin || origins.includes(origin) || (process.env.NODE_ENV !== "production" && origins.length === 0)) return callback(null,true);
  return callback(new Error("Origin not allowed by CORS"));
}}));
app.use(express.json({limit:"1mb"}));
app.use(express.urlencoded({extended:true,limit:"1mb"}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname,"../uploads"), {maxAge:"7d"}));
app.get("/",(req,res)=>res.json({success:true,name:"Yasmin Portfolio API",health:"/api/health"}));
app.get("/api/health",(req,res)=>res.json({success:true,message:"API يعمل",database:"connected"}));
app.use("/api/auth",rateLimit({windowMs:15*60*1000,max:30,standardHeaders:true,legacyHeaders:false}),authRoutes);
app.use("/api/messages", rateLimit({windowMs:60*60*1000,max:10,standardHeaders:true,legacyHeaders:false}));
app.use("/api",contentRoutes);
app.use("/api/uploads",uploadRoutes);
app.use((req,res)=>res.status(404).json({success:false,message:"المسار غير موجود"}));
app.use((err,req,res,next)=>{
  console.error(err);
  const status=err.name==="SequelizeValidationError" || err.name==="SequelizeUniqueConstraintError" ? 400 : err.status || 500;
  res.status(status).json({success:false,message:status===500?"حدث خطأ داخلي في الخادم":err.message});
});

let server;
async function start(){
  try {
    if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32) throw new Error("JWT_SECRET يجب أن يكون 32 حرفًا على الأقل داخل backend/.env");
    await sequelize.authenticate();
    server=app.listen(PORT,()=>console.log(`Yasmin API: http://localhost:${PORT}`));
  } catch(error) { console.error("فشل تشغيل الخادم:",error.message); process.exit(1); }
}
async function shutdown(){ if(server) server.close(); await sequelize.close(); process.exit(0); }
process.on("SIGINT",shutdown); process.on("SIGTERM",shutdown);
start();
