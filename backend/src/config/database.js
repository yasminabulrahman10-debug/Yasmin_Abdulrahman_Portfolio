const { Sequelize } = require("sequelize");

const required = ["DB_HOST", "DB_NAME", "DB_USER"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    charset: "utf8mb4",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    define: { timestamps: true, underscored: false, freezeTableName: true },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  }
);

module.exports = sequelize;
