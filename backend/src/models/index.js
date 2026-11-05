
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// =====================================================
// Admin
// =====================================================
const Admin = sequelize.define("Admin", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "admins", updatedAt: true });

// =====================================================
// Profile
// =====================================================
const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING(180), allowNull: false, defaultValue: "ياسمين عبدالرحمن هرين" },
  jobTitle: { type: DataTypes.STRING(180), defaultValue: "خريجة تقنية معلومات" },
  headline: { type: DataTypes.STRING(255), allowNull: true },
  summary: { type: DataTypes.TEXT, allowNull: true },
  address: { type: DataTypes.STRING(255), allowNull: true },
  phone: { type: DataTypes.STRING(50), allowNull: true },
  email: { type: DataTypes.STRING(190), allowNull: true },
  nationality: { type: DataTypes.STRING(100), allowNull: true },
  languages: { type: DataTypes.STRING(255), allowNull: true },
  profileImage: { type: DataTypes.STRING(500), allowNull: true },
  cvFile: { type: DataTypes.STRING(500), allowNull: true },
  socialLinks: { type: DataTypes.JSON, allowNull: false, defaultValue: {} }
}, { tableName: "profile" });

// =====================================================
// Project
// =====================================================
const Project = sequelize.define("Project", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

  title: { type: DataTypes.STRING(180), allowNull: false },
  slug: { type: DataTypes.STRING(200), unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },

  technologies: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },

  category: { type: DataTypes.STRING(100), allowNull: true },

  status: {
    type: DataTypes.ENUM("completed", "in_progress", "planned", "stopped"),
    defaultValue: "completed"
  },

  publicationStatus: {
    type: DataTypes.ENUM("published", "draft", "hidden", "archived"),
    allowNull: false,
    defaultValue: "published"
  },

  progress: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    defaultValue: null,
    validate: { min: 0, max: 100 }
  },

  startDate: { type: DataTypes.DATEONLY, allowNull: true },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },

  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },

  // صورة الغلاف الرئيسية
  image: { type: DataTypes.STRING(500), allowNull: true },

  demoUrl: { type: DataTypes.STRING(500), allowNull: true },
  repositoryUrl: { type: DataTypes.STRING(500), allowNull: true },

  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },

  // حقل قديم للتوافق المؤقت مع الكود الحالي
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }

}, { tableName: "projects" });

// =====================================================
// Project Images - معرض صور المشروع
// =====================================================
const ProjectImage = sequelize.define("ProjectImage", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },

  projectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },

  image: {
    type: DataTypes.STRING(500),
    allowNull: false
  },

  altText: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }

}, { tableName: "project_images" });

// العلاقة: المشروع الواحد يحتوي على عدة صور
Project.hasMany(ProjectImage, {
  foreignKey: "projectId",
  as: "gallery",
  onDelete: "CASCADE"
});

// الصورة تتبع مشروعًا واحدًا
ProjectImage.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project"
});

// =====================================================
// Experience
// =====================================================
const Experience = sequelize.define("Experience", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  jobTitle: { type: DataTypes.STRING(180), allowNull: false },
  company: { type: DataTypes.STRING(180), allowNull: true },
  period: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "experiences" });

// =====================================================
// Education
// =====================================================
const Education = sequelize.define("Education", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  degree: { type: DataTypes.STRING(180), allowNull: false },
  institution: { type: DataTypes.STRING(180), allowNull: true },
  period: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "education" });

// =====================================================
// Skill
// =====================================================
const Skill = sequelize.define("Skill", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: true },
  level: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "skills" });

// =====================================================
// Certificate
// =====================================================
const Certificate = sequelize.define("Certificate", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(180), allowNull: false },
  issuer: { type: DataTypes.STRING(180), allowNull: true },
  issueDate: { type: DataTypes.STRING(80), allowNull: true },
  image: { type: DataTypes.STRING(500), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: "certificates" });

// =====================================================
// Contact Messages
// =====================================================
const ContactMessage = sequelize.define("ContactMessage", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(190), allowNull: false },
  subject: { type: DataTypes.STRING(200), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: "contact_messages", updatedAt: false });

// =====================================================
// Exports
// =====================================================
module.exports = {
  sequelize,
  Admin,
  Profile,
  Project,
  ProjectImage,
  Experience,
  Education,
  Skill,
  Certificate,
  ContactMessage
};
