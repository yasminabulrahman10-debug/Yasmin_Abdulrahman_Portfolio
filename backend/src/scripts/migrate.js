require("dotenv").config();
const {sequelize}=require("../models");
(async()=>{try{await sequelize.authenticate();await sequelize.sync();console.log("تم إنشاء/مطابقة الجداول بنجاح.");process.exit(0);}catch(e){console.error(e);process.exit(1);}})();
