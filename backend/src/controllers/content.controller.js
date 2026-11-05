
const {
  Profile,
  Project,
  Experience,
  Education,
  Skill,
  Certificate,
  ContactMessage
} = require("../models");

const resources = {
  projects: Project,
  experiences: Experience,
  education: Education,
  skills: Skill,
  certificates: Certificate
};

// ==========================================
// الملف الشخصي - العرض العام
// ==========================================

exports.publicProfile = async (req, res, next) => {
  try {
    const row = await Profile.findOne();

    res.json({
      success: true,
      data: row
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// عرض المحتوى العام
// المشاريع المنشورة فقط تظهر للزوار
// ==========================================

exports.publicList = (key) => async (req, res, next) => {
  try {
    const Model = resources[key];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: "نوع المحتوى غير موجود"
      });
    }

    let where;

    if (key === "projects") {
      where = {
        publicationStatus: "published",
        isPublished: true
      };
    } else {
      where = {
        isPublished: true
      };
    }

    const rows = await Model.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["id", "DESC"]
      ]
    });

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// عرض جميع المحتويات في لوحة الإدارة
// ==========================================

exports.adminList = (key) => async (req, res, next) => {
  try {
    const Model = resources[key];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: "نوع المحتوى غير موجود"
      });
    }

    const rows = await Model.findAll({
      order: [
        ["displayOrder", "ASC"],
        ["id", "DESC"]
      ]
    });

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// إضافة محتوى جديد
// ==========================================

exports.create = (key) => async (req, res, next) => {
  try {
    const Model = resources[key];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: "نوع المحتوى غير موجود"
      });
    }

    const row = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: row
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// تحديث محتوى موجود
// ==========================================

exports.update = (key) => async (req, res, next) => {
  try {
    const Model = resources[key];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: "نوع المحتوى غير موجود"
      });
    }

    const row = await Model.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "العنصر غير موجود"
      });
    }

    await row.update(req.body);

    res.json({
      success: true,
      data: row
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// حذف محتوى
// ==========================================

exports.remove = (key) => async (req, res, next) => {
  try {
    const Model = resources[key];

    if (!Model) {
      return res.status(404).json({
        success: false,
        message: "نوع المحتوى غير موجود"
      });
    }

    const row = await Model.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "العنصر غير موجود"
      });
    }

    await row.destroy();

    res.json({
      success: true,
      message: "تم الحذف بنجاح"
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// تحديث الملف الشخصي
// ==========================================

exports.updateProfile = async (req, res, next) => {
  try {
    let row = await Profile.findOne();

    if (!row) {
      row = await Profile.create(req.body);
    } else {
      await row.update(req.body);
    }

    res.json({
      success: true,
      data: row
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// عرض رسائل التواصل
// ==========================================

exports.messages = async (req, res, next) => {
  try {
    const rows = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// استقبال رسالة من الموقع العام
// ==========================================

exports.createMessage = async (req, res, next) => {
  try {
    const {
      name,
      email,
      subject,
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "الاسم والبريد والرسالة مطلوبة"
      });
    }

    const row = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: {
        id: row.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// تحديد الرسالة كمقروءة
// ==========================================

exports.messageRead = async (req, res, next) => {
  try {
    const row = await ContactMessage.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "الرسالة غير موجودة"
      });
    }

    row.isRead = true;
    await row.save();

    res.json({
      success: true,
      data: row
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// حذف رسالة
// ==========================================

exports.messageDelete = async (req, res, next) => {
  try {
    const row = await ContactMessage.findByPk(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "الرسالة غير موجودة"
      });
    }

    await row.destroy();

    res.json({
      success: true,
      message: "تم الحذف بنجاح"
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// إحصائيات لوحة التحكم
// ==========================================

exports.stats = async (req, res, next) => {
  try {
    const [
      projects,
      experiences,
      education,
      skills,
      certificates,
      messages,
      unread
    ] = await Promise.all([
      Project.count(),
      Experience.count(),
      Education.count(),
      Skill.count(),
      Certificate.count(),
      ContactMessage.count(),
      ContactMessage.count({
        where: {
          isRead: false
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        projects,
        experiences,
        education,
        skills,
        certificates,
        messages,
        unread
      }
    });
  } catch (error) {
    next(error);
  }
};
