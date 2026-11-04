/* =====================================================
   تفاعلات الموقع: قائمة الجوال، الوضع الداكن، السنة الحالية
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");
  const darkModeButton = document.getElementById("darkMode");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  // فتح وإغلاق قائمة التنقل على الشاشات الصغيرة
  if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // الوضع الداكن
  if (darkModeButton) {
    const savedTheme = localStorage.getItem("yasmin-portfolio-theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
    updateThemeIcon();

    darkModeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "yasmin-portfolio-theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!darkModeButton) return;
    const icon = darkModeButton.querySelector("i");
    if (!icon) return;
    icon.className = document.body.classList.contains("dark-mode")
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
  }


  // تصفية المشاريع حسب الحالة: الكل، مكتمل، قيد التطوير، مخطط
  const projectFilters = document.querySelectorAll(".project-filter");
  const projectCards = document.querySelectorAll(".project-card[data-status]");
  const projectGroups = document.querySelectorAll(".project-group-title");
  projectFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      projectFilters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.status !== filter;
      });
      projectGroups.forEach((heading) => {
        const grid = heading.nextElementSibling;
        if (!grid || !grid.classList.contains("projects-grid")) return;
        const visibleCards = grid.querySelectorAll('.project-card:not([hidden])');
        heading.hidden = visibleCards.length === 0;
        grid.hidden = visibleCards.length === 0;
      });
    });
  });


  // =====================================================
  // روابط عرض المواقع المنشورة
  // ضعي رابط الموقع الحقيقي بين علامتي الاقتباس.
  // اتركي القيمة فارغة إذا لم يكن المشروع منشورًا؛
  // عندها لن تظهر أيقونة عرض الموقع على صورته.
  // =====================================================
  const projectDemoLinks = {
    "ABC Kids | منصة تعليم اللغة الإنجليزية للأطفال": "",
    "HIGH CAR | موقع زينة السيارات": "",
    "موقع التسوق الإلكتروني": "",
    "DIA Digital Journal | اليوميات الرقمية": "",
    "My Projects Manager | نظام إدارة المشاريع الشخصية": ""
  };

  document.querySelectorAll(".project-card").forEach((card) => {
    const titleElement = card.querySelector(".project-heading h3");
    const imageBox = card.querySelector(".project-image");
    if (!titleElement || !imageBox) return;

    const projectTitle = titleElement.textContent.trim();
    const demoUrl = (projectDemoLinks[projectTitle] || "").trim();

    // لا تعرض الأيقونة إذا لم يضف رابط موقع منشور.
    if (!demoUrl) return;

    const image = imageBox.querySelector("img");
    if (!image) return;

    const viewLink = document.createElement("a");
    viewLink.className = "project-demo-link";
    viewLink.href = demoUrl;
    viewLink.target = "_blank";
    viewLink.rel = "noopener noreferrer";
    viewLink.setAttribute("aria-label", `عرض موقع ${projectTitle}`);
    viewLink.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true"></i><span>عرض الموقع</span>';
    imageBox.appendChild(viewLink);
  });

  // إظهار الأقسام تدريجيًا عند التمرير، مع دعم تقليل الحركة
  const revealSections = document.querySelectorAll(".reveal-section");
  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealSections.forEach((section) => observer.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("show"));
  }
});
