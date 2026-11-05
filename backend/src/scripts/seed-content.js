require("dotenv").config();
const initial=require("./initial-content.json");
const {sequelize,Profile,Project,Experience,Education,Skill,Certificate}=require("../models");
(async()=>{try{
 await sequelize.authenticate();
 await sequelize.sync();
 if(!(await Profile.count())) await Profile.create(initial.profile);
 for(const [Model,key] of [[Project,"projects"],[Experience,"experiences"],[Education,"education"],[Skill,"skills"],[Certificate,"certificates"]]){
   if(!(await Model.count())) await Model.bulkCreate(initial[key]);
 }
 console.log("تم إدخال بيانات الموقع الحالية إلى قاعدة البيانات (دون تكرار البيانات الموجودة).");
 process.exit(0);
}catch(e){console.error(e);process.exit(1);}})();
