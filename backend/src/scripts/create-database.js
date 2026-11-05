require("dotenv").config();
const mysql=require("mysql2/promise");
(async()=>{let c;try{
 c=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD||""});
 const db=String(process.env.DB_NAME||"yasmin_portfolio").replace(/[^a-zA-Z0-9_]/g,"");
 await c.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
 console.log(`Database ${db} is ready.`);
}catch(e){console.error(e.message);process.exitCode=1;}finally{if(c)await c.end();}})();
