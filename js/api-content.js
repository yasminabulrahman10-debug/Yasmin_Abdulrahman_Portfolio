/* Public content integration. Falls back to the original HTML if API data is empty/unavailable. */
(() => {
  const API = "http://localhost:5000/api";
  const $ = (s) => document.querySelector(s);
  const safe = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function get(path) {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error("API request failed");
    const body = await response.json();
    return body.data;
  }
  async function load() {
    try {
      const [profile, projects, experiences, education, skills, certificates] = await Promise.all([
        get("/profile"),get("/projects"),get("/experiences"),get("/education"),get("/skills"),get("/certificates")
      ]);
      if (profile) applyProfile(profile);
      if (projects?.length) renderProjects(projects);
      if (experiences?.length) renderExperiences(experiences);
      if (education?.length) renderEducation(education);
      if (skills?.length) renderSkills(skills);
      if (certificates?.length) renderCertificates(certificates);
      addContactForm();
    } catch (error) {
      console.info("تعذر تحميل محتوى API؛ سيستمر عرض نسخة HTML الأصلية.", error.message);
    }
  }
  function applyProfile(p) {
    const name = $(".hero-content h1");
    if(name && p.fullName) { const parts=String(p.fullName).trim().split(/\\s+/); name.innerHTML = safe(parts.shift()||"") + (parts.length ? ` <span>${safe(parts.join(" "))}</span>` : ""); }
    const role = $(".hero-role"); if(role && p.jobTitle) role.textContent = p.jobTitle;
    const desc = $(".hero-description"); if(desc && p.headline) desc.textContent = p.headline;
    const about = $(".about-main-content p"); if(about && p.summary) about.textContent = p.summary;
    const image = $(".hero-image"); if(image && p.profileImage) image.src = asset(p.profileImage);
    const cv = document.querySelector('a[download][href*="Yasmin_CV"]'); if(cv && p.cvFile) cv.href = asset(p.cvFile);
    const personal = document.querySelectorAll(".personal-grid .info-card");
    const values = [p.fullName,p.address,p.phone,p.email,p.nationality,p.languages];
    personal.forEach((card,i)=>{if(values[i]){const strong=card.querySelector("strong");if(strong)strong.textContent=values[i];}});
    const contact = document.querySelectorAll(".contact-cards .contact-card");
    if(p.email && contact[0]){contact[0].href=`mailto:${p.email}`;contact[0].querySelector("strong").textContent=p.email;}
    if(p.phone && contact[1]){contact[1].href=`tel:${p.phone}`;contact[1].querySelector("strong").textContent=p.phone;}
    if(p.address && contact[2])contact[2].querySelector("strong").textContent=p.address;
  }
  function asset(path){if(path.startsWith("http"))return path;const clean=path.startsWith("/")?path:"/"+path;return clean.startsWith("/uploads/")?`http://localhost:5000${clean}`:path;}
  function renderProjects(rows){
    const grid=document.querySelector("#projects .projects-grid");if(!grid)return;
    grid.innerHTML=rows.map((p,i)=>`<article class="project-card" data-status="${p.status==="completed"?"completed":p.status==="planned"?"planned":"progress"}"><div class="project-content"><span class="project-number">PROJECT ${String(i+1).padStart(2,"0")}</span><div class="project-image">${p.image?`<img src="${safe(asset(p.image))}" alt="${safe(p.title)}">`:""}</div><div class="project-body"><div class="project-heading"><h3>${safe(p.title)}</h3><span class="status-pill ${p.status==="completed"?"completed":""}">${p.status==="completed"?"مكتمل":p.status==="planned"?"مخطط":"قيد التطوير"}</span></div><p>${safe(p.description)}</p><div class="project-tech">${(Array.isArray(p.technologies)?p.technologies:[]).map(t=>`<span>${safe(t)}</span>`).join("")}</div>${p.demoUrl?`<p><a href="${safe(p.demoUrl)}" target="_blank" rel="noopener">عرض المشروع</a></p>`:""}${p.repositoryUrl?`<p><a href="${safe(p.repositoryUrl)}" target="_blank" rel="noopener">مستودع GitHub</a></p>`:""}</div></div></article>`).join("");
    document.querySelectorAll(".project-filter").forEach(btn=>btn.addEventListener("click",()=>{const f=btn.dataset.filter;grid.querySelectorAll(".project-card").forEach(card=>card.hidden=f!=="all"&&card.dataset.status!==f);}));
  }
  function renderExperiences(rows){const box=$(".experience-grid");if(box)box.innerHTML=rows.map(x=>`<article class="experience-card"><span class="experience-date">${safe(x.period)}</span><h3>${safe(x.jobTitle)}</h3><h4>${safe(x.company)}</h4><p>${safe(x.description)}</p></article>`).join("");}
  function renderEducation(rows){const box=$(".education-timeline");if(box)box.innerHTML=rows.map(x=>`<article class="education-item"><span class="education-marker"><i class="fa-solid fa-graduation-cap"></i></span><div class="education-card"><span class="education-year">${safe(x.period)}</span><h3>${safe(x.degree)}</h3><h4>${safe(x.institution)}</h4><p>${safe(x.description)}</p></div></article>`).join("");}
  function renderSkills(rows){const box=$(".skills-grid");if(box)box.innerHTML=rows.map(x=>`<article class="skill-card"><i class="fa-solid fa-code"></i><h3>${safe(x.name)}</h3><p>${safe(x.category||"")}${x.level?` — ${x.level}%`:""}</p></article>`).join("");}
  function renderCertificates(rows){const box=document.querySelector("#certificates .certificate-grid, #certificates .certificates-list, #certificates .certificate-list");if(box)box.innerHTML=rows.map(x=>`<article class="certificate-card"><i class="fa-solid fa-certificate"></i><div><h3>${safe(x.title)}</h3><p>${safe(x.issuer)} ${safe(x.issueDate)}</p>${x.image?`<a href="${safe(asset(x.image))}" target="_blank">عرض الشهادة</a>`:""}</div></article>`).join("");}
  function addContactForm(){
    const wrapper=$(".contact-wrapper");if(!wrapper || $("#portfolioContactForm"))return;
    const form=document.createElement("form");form.id="portfolioContactForm";form.className="contact-form";
    form.innerHTML=`<h3>أرسلي رسالة</h3><label>الاسم<input name="name" required maxlength="150"></label><label>البريد الإلكتروني<input name="email" type="email" required maxlength="190"></label><label>الموضوع<input name="subject" maxlength="200"></label><label>الرسالة<textarea name="message" required maxlength="5000"></textarea></label><button class="btn primary-btn" type="submit">إرسال الرسالة</button><p role="status"></p>`;
    wrapper.appendChild(form);
    form.addEventListener("submit",async e=>{e.preventDefault();const status=form.querySelector('[role="status"]');const data=Object.fromEntries(new FormData(form));
      try{const r=await fetch(`${API}/messages`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const body=await r.json();if(!r.ok)throw new Error(body.message||"تعذر الإرسال");status.textContent="تم إرسال رسالتك بنجاح.";form.reset();}catch(err){status.textContent=err.message;}
    });
  }
  document.addEventListener("DOMContentLoaded",load);
})();
