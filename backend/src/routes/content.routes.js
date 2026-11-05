const router = require("express").Router();
const c = require("../controllers/content.controller");
const { requireAdmin } = require("../middleware/auth");
const keys = ["projects","experiences","education","skills","certificates"];
router.get("/profile", c.publicProfile);
for (const key of keys) router.get(`/${key}`, c.publicList(key));
router.post("/messages", c.createMessage);
router.use("/admin", requireAdmin);
router.get("/admin/stats", c.stats);
router.get("/admin/profile", c.publicProfile);
router.put("/admin/profile", c.updateProfile);
router.get("/admin/messages", c.messages);
router.patch("/admin/messages/:id/read", c.messageRead);
router.delete("/admin/messages/:id", c.messageDelete);
for (const key of keys) {
  router.get(`/admin/${key}`, c.adminList(key));
  router.post(`/admin/${key}`, c.create(key));
  router.put(`/admin/${key}/:id`, c.update(key));
  router.delete(`/admin/${key}/:id`, c.remove(key));
}
module.exports = router;
