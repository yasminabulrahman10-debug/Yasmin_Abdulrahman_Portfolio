require("dotenv").config();
const bcrypt=require("bcryptjs");
const {sequelize,Admin}=require("../models");
(async()=>{try{
 const {ADMIN_NAME,ADMIN_EMAIL,ADMIN_PASSWORD}=process.env;
 if(!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length<12 || ADMIN_PASSWORD.startsWith("CHANGE_")) throw new Error("عدّلي ADMIN_EMAIL و ADMIN_PASSWORD في backend/.env (12 حرفًا على الأقل) أولًا.");
 await sequelize.authenticate();
 const email=ADMIN_EMAIL.toLowerCase().trim();
 const hash=await bcrypt.hash(ADMIN_PASSWORD,12);
 const existing=await Admin.findOne({where:{email}});
 if(existing){existing.name=ADMIN_NAME||"مديرة الموقع";existing.passwordHash=hash;existing.isActive=true;await existing.save();console.log("تم تحديث حساب المديرة.");}
 else {await Admin.create({name:ADMIN_NAME||"مديرة الموقع",email,passwordHash:hash});console.log("تم إنشاء حساب المديرة.");}
 process.exit(0);
}catch(e){console.error("تعذر إنشاء الحساب:",e.message);process.exit(1);}})();
