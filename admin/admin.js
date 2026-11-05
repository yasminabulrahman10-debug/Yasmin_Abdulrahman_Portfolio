
const API = `${location.protocol}//${location.hostname}:5000/api`;
const $ = (s) => document.querySelector(s);

let token = sessionStorage.getItem("yasmin_admin_token") || "";
let currentPage = "dashboard";

const configs = {
  projects: {
    title: "إدارة المشاريع",
    path: "projects",
    fields: [
      ["title", "اسم المشروع", "text", true],
      ["slug", "الرابط المختصر (slug)", "text"],
      ["description", "وصف المشروع", "textarea"],
      ["technologies", "التقنيات (افصلي بينها بفاصلة)", "text"],
      ["category", "التصنيف", "text"],
      ["status", "حالة العمل", "select", false, [
        "completed|مكتمل",
        "in_progress|قيد التطوير",
        "planned|مخطط",
        "stopped|متوقف"
      ]],
      ["publicationStatus", "حالة النشر", "select", false, [
        "published|منشور",
        "draft|مسودة",
        "hidden|مخفي",
        "archived|مؤرشف"
      ]],
      ["progress", "نسبة الإنجاز (0 - 100)", "number"],
      ["startDate", "تاريخ البداية", "date"],
      ["endDate", "تاريخ الانتهاء", "date"],
      ["features", "مميزات المشروع (افصلي بينها بفاصلة)", "textarea"],
      ["image", "الصورة الرئيسية", "image"],
      ["demoUrl", "رابط العرض", "url"],
      ["repositoryUrl", "رابط GitHub", "url"],
      ["displayOrder", "ترتيب العرض", "number"]
    ]
  },

  experiences: {
    title: "الخبرات العملية",
    path: "experiences",
    fields: [
      ["jobTitle", "المسمى الوظيفي", "text", true],
      ["company", "جهة العمل", "text"],
      ["period", "الفترة", "text"],
      ["description", "الوصف", "textarea"],
      ["displayOrder", "ترتيب العرض", "number"],
      ["isPublished", "منشور؟", "checkbox"]
    ]
  },

  education: {
    title: "المؤهلات التعليمية",
    path: "education",
    fields: [
      ["degree", "المؤهل", "text", true],
      ["institution", "الجهة التعليمية", "text"],
      ["period", "الفترة", "text"],
      ["description", "التفاصيل", "textarea"],
      ["displayOrder", "ترتيب العرض", "number"],
      ["isPublished", "منشور؟", "checkbox"]
    ]
  },

  skills: {
    title: "المهارات",
    path: "skills",
    fields: [
      ["name", "اسم المهارة", "text", true],
      ["category", "التصنيف", "text"],
      ["level", "المستوى (0 - 100)", "number"],
      ["displayOrder", "ترتيب العرض", "number"],
      ["isPublished", "منشور؟", "checkbox"]
    ]
  },

  certificates: {
    title: "الشهادات والدورات",
    path: "certificates",
    fields: [
      ["title", "اسم الشهادة أو الدورة", "text", true],
      ["issuer", "الجهة المانحة", "text"],
      ["issueDate", "تاريخ الإصدار", "text"],
      ["image", "مسار الصورة", "text"],
      ["description", "الوصف", "textarea"],
      ["displayOrder", "ترتيب العرض", "number"],
      ["isPublished", "منشور؟", "checkbox"]
    ]
  }
};

// ==========================================
// API
// ==========================================

async function api(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {})
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  const data = await res.json().catch(() => ({
    message: "استجابة غير مفهومة من الخادم"
  }));

  if (res.status === 401) {
    logout();
    throw new Error(data.message || "انتهت الجلسة");
  }

  if (!res.ok) {
    throw new Error(data.message || "تعذر تنفيذ الطلب");
  }

  return data.data;
}

// ==========================================
// تسجيل الدخول والخروج
// ==========================================

function showLogin() {
  $("#loginView").classList.remove("hidden");
  $("#appView").classList.add("hidden");
}

function showApp() {
  $("#loginView").classList.add("hidden");
  $("#appView").classList.remove("hidden");
}

function logout() {
  token = "";
  sessionStorage.removeItem("yasmin_admin_token");
  showLogin();
}

$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  $("#loginError").textContent = "جارٍ التحقق...";

  const fd = new FormData(e.currentTarget);

  try {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password")
      })
    });

    token = result.token;

    sessionStorage.setItem("yasmin_admin_token", token);

    showApp();
    await loadPage("dashboard");

  } catch (err) {
    $("#loginError").textContent = err.message;
  }
});

$("#logout").addEventListener("click", logout);

$("#nav").addEventListener("click", (e) => {
  const button = e.target.closest("button[data-page]");

  if (button) {
    loadPage(button.dataset.page);
  }
});

function setPage(title) {
  $("#pageTitle").textContent = title;

  document.querySelectorAll("#nav button").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === currentPage
    );
  });
}

async function loadPage(page) {
  currentPage = page;

  if (page === "dashboard") {
    return dashboard();
  }

  if (page === "profile") {
    return profilePage();
  }

  if (page === "messages") {
    return messagesPage();
  }

  return resourcePage(page);
}

// ==========================================
// لوحة التحكم
// ==========================================

async function dashboard() {
  setPage("نظرة عامة");

  $("#content").innerHTML =
    '<div class="empty">جارٍ تحميل الإحصائيات...</div>';

  try {
    const s = await api("/admin/stats");

    $("#content").innerHTML = `
      <div class="stats">
        ${[
          ["المشاريع", s.projects],
          ["الخبرات", s.experiences],
          ["المهارات", s.skills],
          ["رسائل غير مقروءة", s.unread]
        ].map(([name, value]) => `
          <article class="stat">
            <span>${name}</span>
            <strong>${value}</strong>
          </article>
        `).join("")}
      </div>

      <div class="panel" style="margin-top:18px">
        <h2>مرحبًا بك في لوحة الإدارة</h2>
        <p class="hint">
          يمكنك إدارة بيانات معرض الأعمال من هنا.
          التغييرات تحفظ في قاعدة البيانات.
        </p>
      </div>
    `;

  } catch (e) {
    errorBox(e);
  }
}

// ==========================================
// أدوات مساعدة
// ==========================================

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function errorBox(error) {
  $("#content").innerHTML = `
    <div class="panel error">
      ${escapeHtml(error.message)}
    </div>
  `;
}

function resolveImage(path) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${location.protocol}//${location.hostname}:5000${
    path.startsWith("/") ? "" : "/"
  }${path}`;
}

// تجهيز قيمة التاريخ لحقل HTML
function dateInputValue(value) {
  if (!value) return "";

  const text = String(value);

  // MySQL DATE أو ISO Date
  const match = text.match(/^\d{4}-\d{2}-\d{2}/);

  return match ? match[0] : "";
}

// التحقق من صحة التاريخ
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

// ==========================================
// إنشاء حقول النماذج
// ==========================================

function fieldHtml(field, value, resourceKey) {
  const [key, label, type, required, options] = field;

  let v = value ?? "";

  if (type === "checkbox") {
    return `
      <label class="field">
        <span>${label}</span>

        <input
          name="${key}"
          type="checkbox"
          ${v ? "checked" : ""}
        >
      </label>
    `;
  }

  if (type === "textarea") {
    if (key === "features" && Array.isArray(v)) {
      v = v.join(", ");
    }

    return `
      <label class="field full">
        ${label}

        <textarea name="${key}">${escapeHtml(v)}</textarea>
      </label>
    `;
  }

  if (type === "select") {
    return `
      <label class="field">
        ${label}

        <select name="${key}">
          ${options.map((option) => {
            const [val, text] = option.split("|");

            return `
              <option
                value="${val}"
                ${v === val ? "selected" : ""}
              >
                ${text}
              </option>
            `;
          }).join("")}
        </select>
      </label>
    `;
  }

  if (
    key === "technologies" &&
    Array.isArray(v)
  ) {
    v = v.join(", ");
  }

  if (type === "date") {
    v = dateInputValue(v);
  }

  if (type === "image" && resourceKey === "projects") {
    return `
      <div class="field full">
        <label>${label}</label>

        <input
          name="image"
          type="text"
          value="${escapeAttr(v)}"
          placeholder="/uploads/image.jpg"
        >

        <label
          class="btn"
          style="display:inline-block;margin-top:8px"
        >
          اختيار صورة من الجهاز

          <input
            type="file"
            name="imageFile"
            id="projectImageFile"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
          >
        </label>

        <div id="projectImagePreview" style="margin-top:10px">
          ${v ? `
            <img
              src="${escapeAttr(resolveImage(v))}"
              alt="معاينة الصورة"
              style="max-width:180px;max-height:120px;object-fit:cover;border-radius:8px"
            >
          ` : ""}
        </div>

        <small class="hint">
          اختاري صورة وسيتم رفعها إلى الخادم تلقائيًا.
        </small>
      </div>
    `;
  }

  return `
    <label class="field">
      ${label}

      <input
        name="${key}"
        type="${type}"
        value="${escapeAttr(v)}"
        ${required ? "required" : ""}
        ${key === "progress" ? 'min="0" max="100"' : ""}
        ${key === "level" ? 'min="0" max="100"' : ""}
      >
    </label>
  `;
}

// ==========================================
// رفع صورة المشروع
// ==========================================

async function uploadProjectImage(file, form) {
  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("نوع الصورة غير مدعوم");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 5MB");
  }

  const fd = new FormData();

  fd.append("file", file);

  const result = await api("/upload", {
    method: "POST",
    body: fd
  });

  form.elements.image.value = result.url;

  $("#projectImagePreview").innerHTML = `
    <img
      src="${escapeAttr(resolveImage(result.url))}"
      alt="معاينة الصورة"
      style="max-width:180px;max-height:120px;object-fit:cover;border-radius:8px"
    >
  `;

  return result.url;
}

// ==========================================
// معالجة بيانات النماذج
// ==========================================

function collectFormData(form, fields, resourceKey) {
  const formData = new FormData(form);
  const data = {};

  for (const field of fields) {
    const [fieldName, , fieldType] = field;

    if (fieldType === "checkbox") {
      const checkbox = form.elements[fieldName];

      data[fieldName] = checkbox.checked;
      continue;
    }

    data[fieldName] = formData.get(fieldName) ?? "";
  }

  // الأرقام
  for (const field of fields) {
    const [fieldName, , fieldType] = field;

    if (fieldType === "number") {
      const value = data[fieldName];

      if (value === "") {
        data[fieldName] = fieldName === "progress" ||
          fieldName === "level"
          ? null
          : 0;
      } else {
        const number = Number(value);

        if (!Number.isFinite(number)) {
          throw new Error(`القيمة الرقمية غير صحيحة: ${fieldName}`);
        }

        data[fieldName] = number;
      }
    }

    // التواريخ
    if (fieldType === "date") {
      const value = String(data[fieldName] || "").trim();

      if (!value) {
        data[fieldName] = null;
      } else if (!isValidDate(value)) {
        throw new Error("التاريخ المدخل غير صالح");
      } else {
        data[fieldName] = value;
      }
    }
  }

  // المشاريع
  if (resourceKey === "projects") {
    data.technologies = String(data.technologies || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    data.features = String(data.features || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    data.isPublished =
      data.publicationStatus === "published";

    if (
      data.progress !== null &&
      (data.progress < 0 || data.progress > 100)
    ) {
      throw new Error("نسبة الإنجاز يجب أن تكون بين 0 و100");
    }

    if (
      data.startDate &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      throw new Error("تاريخ الانتهاء لا يمكن أن يسبق تاريخ البداية");
    }
  }

  return data;
}

// ==========================================
// إدارة الأقسام
// ==========================================

async function resourcePage(key) {
  const cfg = configs[key];

  if (!cfg) {
    return errorBox(new Error("القسم غير موجود"));
  }

  setPage(cfg.title);

  $("#content").innerHTML =
    '<div class="empty">جارٍ التحميل...</div>';

  try {
    const rows = await api(`/admin/${key}`);

    $("#content").innerHTML = `
      <div class="panel">

        <div class="actions" style="justify-content:space-between">
          <h2>${cfg.title}</h2>

          <button class="btn primary-btn" id="addItem">
            ＋ إضافة جديد
          </button>
        </div>

        <form id="itemForm" class="hidden">
          <input type="hidden" name="id">

          <div class="form-grid">
            ${cfg.fields.map((field) => {
              const keyName = field[0];

              const defaultValue =
                keyName === "isPublished" ? true :
                keyName === "publicationStatus" ? "published" :
                keyName === "status" ? "completed" :
                keyName === "displayOrder" ? 0 :
                "";

              return fieldHtml(field, defaultValue, key);
            }).join("")}
          </div>

          <div class="actions">
            <button
              class="btn primary-btn"
              type="submit"
            >
              حفظ
            </button>

            <button
              class="btn"
              type="button"
              id="cancelForm"
            >
              إلغاء
            </button>
          </div>

          <p id="formMessage" class="hint"></p>
        </form>
      </div>

      <div class="items" id="items">
        ${
          rows.length
            ? rows.map(row => itemCard(key, row)).join("")
            : '<div class="empty">لا توجد عناصر بعد.</div>'
        }
      </div>
    `;

    const form = $("#itemForm");

    // إضافة عنصر جديد
    $("#addItem").onclick = () => {
      form.reset();

      form.elements.id.value = "";

      if (key === "projects") {
        form.elements.publicationStatus.value = "published";
        form.elements.status.value = "completed";
      }

      if (form.elements.displayOrder) {
        form.elements.displayOrder.value = 0;
      }

      form.classList.remove("hidden");
      form.scrollIntoView({ behavior: "smooth" });
    };

    // إلغاء النموذج
    $("#cancelForm").onclick = () => {
      form.classList.add("hidden");
    };

    // رفع صورة المشروع
    if (key === "projects") {
      $("#projectImageFile").onchange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const message = $("#formMessage");

        message.textContent = "جارٍ رفع الصورة...";

        try {
          await uploadProjectImage(file, form);

          message.textContent = "تم رفع الصورة بنجاح.";

        } catch (err) {
          message.textContent = err.message;
        }
      };
    }

    // حفظ البيانات
    form.onsubmit = async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector(
        'button[type="submit"]'
      );

      const message = $("#formMessage");

      submitButton.disabled = true;
      message.textContent = "جارٍ الحفظ...";

      try {
        const data = collectFormData(
          form,
          cfg.fields,
          key
        );

        const id = form.elements.id.value;

        await api(
          `/admin/${key}${id ? "/" + id : ""}`,
          {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(data)
          }
        );

        alert("تم حفظ البيانات بنجاح.");

        await resourcePage(key);

      } catch (err) {
        message.textContent = err.message;

      } finally {
        submitButton.disabled = false;
      }
    };

    // تعديل وحذف
    $("#items").onclick = async (e) => {
      const edit = e.target.closest("[data-edit]");
      const del = e.target.closest("[data-delete]");

      if (edit) {
        const row = rows.find(
          item => String(item.id) === edit.dataset.edit
        );

        if (!row) return;

        form.reset();

        form.elements.id.value = row.id;

        cfg.fields.forEach((field) => {
          const [fieldName, , fieldType] = field;

          const el = form.elements[fieldName];

          if (!el) return;

          let value = row[fieldName];

          if (
            (fieldName === "technologies" ||
             fieldName === "features") &&
            Array.isArray(value)
          ) {
            value = value.join(", ");
          }

          if (fieldType === "checkbox") {
            el.checked = !!value;

          } else if (fieldType === "date") {
            el.value = dateInputValue(value);

          } else {
            el.value = value ?? "";
          }
        });

        if (key === "projects") {
          $("#projectImagePreview").innerHTML =
            row.image
              ? `
                <img
                  src="${escapeAttr(resolveImage(row.image))}"
                  alt="معاينة الصورة"
                  style="max-width:180px;max-height:120px;object-fit:cover;border-radius:8px"
                >
              `
              : "";
        }

        form.classList.remove("hidden");

        form.scrollIntoView({
          behavior: "smooth"
        });
      }

      if (del && confirm("هل أنت متأكدة من حذف هذا العنصر؟")) {
        try {
          await api(`/admin/${key}/${del.dataset.delete}`, {
            method: "DELETE"
          });

          alert("تم الحذف بنجاح.");

          await resourcePage(key);

        } catch (err) {
          alert(err.message);
        }
      }
    };

  } catch (e) {
    errorBox(e);
  }
}

// ==========================================
// بطاقات العناصر
// ==========================================

function itemCard(key, row) {
  const title =
    row.title ||
    row.jobTitle ||
    row.degree ||
    row.name;

  const sub =
    row.company ||
    row.institution ||
    row.category ||
    row.issuer ||
    row.period ||
    "";

  let status = "";

  if (key === "projects") {
    const workStatuses = {
      completed: "مكتمل",
      in_progress: "قيد التطوير",
      planned: "مخطط",
      stopped: "متوقف"
    };

    const publicationStatuses = {
      published: "منشور",
      draft: "مسودة",
      hidden: "مخفي",
      archived: "مؤرشف"
    };

    status = `
      <p>
        حالة العمل:
        <span class="badge">
          ${escapeHtml(workStatuses[row.status] || row.status || "غير محدد")}
        </span>
      </p>

      <p>
        النشر:
        <span class="badge">
          ${escapeHtml(
            publicationStatuses[row.publicationStatus] ||
            (row.isPublished ? "منشور" : "غير منشور")
          )}
        </span>
      </p>

      <p>
        نسبة الإنجاز:
        ${row.progress ?? "غير محددة"}%
      </p>
    `;

  } else {
    status = `
      <span class="badge">
        ${row.isPublished === false ? "غير منشور" : "منشور"}
      </span>
    `;
  }

  return `
    <article class="item">
      <div>
        <strong>${escapeHtml(title)}</strong>

        <p>${escapeHtml(sub)}</p>

        ${status}
      </div>

      <div class="actions">
        <button class="btn" data-edit="${row.id}">
          تعديل
        </button>

        <button class="btn danger" data-delete="${row.id}">
          حذف
        </button>
      </div>
    </article>
  `;
}

// ==========================================
// الملف الشخصي والسيرة الذاتية
// ==========================================

async function profilePage() {
  setPage("الملف الشخصي والسيرة");

  $("#content").innerHTML =
    '<div class="empty">جارٍ التحميل...</div>';

  try {
    const p = await api("/admin/profile") || {};

    const fields = [
      ["fullName", "الاسم الكامل"],
      ["jobTitle", "المسمى الوظيفي"],
      ["headline", "العنوان المختصر"],
      ["summary", "الملخص المهني"],
      ["address", "العنوان"],
      ["phone", "رقم الهاتف"],
      ["email", "البريد الإلكتروني"],
      ["nationality", "الجنسية"],
      ["languages", "اللغات"],
      ["profileImage", "مسار الصورة الشخصية"],
      ["cvFile", "مسار ملف السيرة الذاتية"]
    ];

    $("#content").innerHTML = `
      <form id="profileForm" class="panel">
        <h2>بيانات الملف الشخصي</h2>

        <div class="form-grid">
          ${fields.map(([key, label]) => `
            <label class="field ${key === "summary" ? "full" : ""}">
              ${label}

              ${
                key === "summary"
                  ? `<textarea name="${key}">${escapeHtml(p[key] || "")}</textarea>`
                  : `<input name="${key}" value="${escapeAttr(p[key] || "")}">`
              }
            </label>
          `).join("")}

          <label class="field full">
            روابط التواصل (JSON)

            <textarea name="socialLinks">${escapeHtml(
              JSON.stringify(p.socialLinks || {}, null, 2)
            )}</textarea>
          </label>
        </div>

        <div class="actions">
          <button class="btn primary-btn">
            حفظ البيانات
          </button>

          <label class="btn">
            رفع صورة أو PDF

            <input
              id="uploadFile"
              type="file"
              accept="image/*,application/pdf"
              hidden
            >
          </label>

          <span id="uploadResult" class="hint"></span>
        </div>

        <p class="hint">
          بعد رفع الملف سيظهر مساره في الحقل المناسب.
          احفظي البيانات بعد ذلك.
        </p>
      </form>
    `;

    $("#profileForm").onsubmit = async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(
        new FormData(e.currentTarget)
      );

      try {
        data.socialLinks = JSON.parse(
          data.socialLinks || "{}"
        );

        await api("/admin/profile", {
          method: "PUT",
          body: JSON.stringify(data)
        });

        alert("تم حفظ الملف الشخصي.");

      } catch (err) {
        alert(err.message);
      }
    };

    $("#uploadFile").onchange = async (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const fd = new FormData();

      fd.append("file", file);

      try {
        const result = await api("/upload", {
          method: "POST",
          body: fd
        });

        $("#uploadResult").textContent =
          `تم الرفع: ${result.url}`;

        const target =
          file.type === "application/pdf"
            ? "cvFile"
            : "profileImage";

        $("#profileForm").elements[target].value =
          result.url;

      } catch (err) {
        alert(err.message);
      }
    };

  } catch (e) {
    errorBox(e);
  }
}

// ==========================================
// رسائل التواصل
// ==========================================

async function messagesPage() {
  setPage("رسائل التواصل");

  try {
    const rows = await api("/admin/messages");

    $("#content").innerHTML = rows.length
      ? `
        <div class="items">
          ${rows.map(message => `
            <article class="item message">
              <div>
                <strong>
                  ${escapeHtml(message.name)}
                  — ${escapeHtml(message.subject || "بدون عنوان")}
                </strong>

                <p>
                  ${escapeHtml(message.email)}
                  ·
                  ${new Date(message.createdAt).toLocaleString("ar")}
                </p>

                <p>${escapeHtml(message.message)}</p>

                <span class="badge">
                  ${message.isRead ? "مقروءة" : "جديدة"}
                </span>
              </div>

              <div class="actions">
                ${
                  !message.isRead
                    ? `
                      <button class="btn" data-read="${message.id}">
                        تحديد كمقروءة
                      </button>
                    `
                    : ""
                }

                <button class="btn danger" data-delete="${message.id}">
                  حذف
                </button>
              </div>
            </article>
          `).join("")}
        </div>
      `
      : '<div class="empty">لا توجد رسائل.</div>';

    $("#content").onclick = async (e) => {
      const read = e.target.closest("[data-read]");
      const del = e.target.closest("[data-delete]");

      try {
        if (read) {
          await api(`/admin/messages/${read.dataset.read}/read`, {
            method: "PATCH"
          });
        }

        if (del && confirm("حذف الرسالة؟")) {
          await api(`/admin/messages/${del.dataset.delete}`, {
            method: "DELETE"
          });
        }

        await messagesPage();

      } catch (err) {
        alert(err.message);
      }
    };

  } catch (e) {
    errorBox(e);
  }
}

// ==========================================
// التحقق من الجلسة عند فتح الصفحة
// ==========================================

(async () => {
  if (token) {
    try {
      await api("/auth/me");

      showApp();

      await loadPage("dashboard");

    } catch {
      showLogin();
    }

  } else {
    showLogin();
  }
})();
