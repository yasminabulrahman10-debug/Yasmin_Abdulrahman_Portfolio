const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ success: false, message: "البريد وكلمة المرور مطلوبان" });
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
    }
    const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
    res.json({ success: true, data: { token, admin: { id: admin.id, name: admin.name, email: admin.email } } });
  } catch (error) { next(error); }
};

exports.me = (req, res) => res.json({ success: true, data: req.admin });
