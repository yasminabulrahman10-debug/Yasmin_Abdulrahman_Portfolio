const router = require("express").Router();
const upload = require("../middleware/upload");
const { requireAdmin } = require("../middleware/auth");
router.post("/", requireAdmin, upload.single("file"), (req,res) => {
  if(!req.file) return res.status(400).json({success:false,message:"اختاري ملفًا"});
  res.status(201).json({success:true,data:{url:`/uploads/${req.file.filename}`,filename:req.file.filename,mimetype:req.file.mimetype,size:req.file.size}});
});
module.exports = router;
