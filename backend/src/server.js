require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const healthRoutes = require("./routes/health.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((item) => item.trim())
    : true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Yasmin Portfolio API",
    health: "/api/health"
  });
});

app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "المسار المطلوب غير موجود"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "حدث خطأ داخلي في الخادم"
  });
});

app.listen(PORT, () => {
  console.log(`API running: http://localhost:${PORT}`);
});
