const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { requireAdmin } = require("../middleware/auth");
router.post("/login", controller.login);
router.get("/me", requireAdmin, controller.me);
module.exports = router;
