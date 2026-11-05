const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

exports.requireAdmin = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "يلزم تسجيل الدخول" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(payload.sub, { attributes: ["id", "name", "email", "isActive"] });
    if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: "الحساب غير متاح" });
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "جلسة الدخول غير صالحة أو منتهية" });
  }
};
