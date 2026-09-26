const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

async function loadConfig() {
  const response = await fetch("data.json");
  if (!response.ok) throw new Error("Could not load data.json");
  return response.json();
}

const esc = (value="") => String(value)
  .replaceAll("&","&amp;").replaceAll("<","&lt;")
  .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

function valid(value) {
  return value !== undefined && value !== null && value !== "" &&
         (!Array.isArray(value) || value.length > 0);
}

function link(item) {
  if (!item?.url) return "";
  const external = /^https?:\/\//.test(item.url);
  return `<a class="text-link" href="${esc(item.url)}" ${external ? 'target="_blank" rel="noreferrer"' : ''}>${esc(item.label || "Open")} ↗</a>`;
}

function renderSection(name, d) {
  if (!valid(d[name]) && name !== "hero") return "";
  switch(name) {
    case "hero": return `
      <section class="hero reveal" id="top">
        <div class="hero-grid">
          <div class="hero-copy">
            ${d.hero.eyebrow ? `<p class="kicker">${esc(d.hero.eyebrow)}</p>` : ""}
            <h1>${esc(d.site.name || "Avi Vyas")}</h1>
            ${d.site.title ? `<p class="kicker" style="margin-top:18px">${esc(d.site.title)}</p>` : ""}
            ${d.hero.description ? `<p class="hero-description">${esc(d.hero.description)}</p>` : ""}
            ${d.hero.links?.length ? `<div class="hero-links">${d.hero.links.map(x => {
              const cls = x.style === "primary" ? "button" : "button secondary";
              const href = x.target?.startsWith("#") ? x.target : `#${x.target}`;
              return `<a class="${cls}" href="${esc(href)}">${esc(x.label)}</a>`;
            }).join("")}</div>` : ""}
          </div>
          <div class="profile-wrap" ${d.site.profileImage ? "" : "hidden"}>
            <img class="profile-image" src="${esc(d.site.profileImage)}" alt="${esc(d.site.name || "Profile")}">
          </div>
        </div>
        ${(d.site.availability || d.site.location) ? `
        <div class="terminal">
          ${d.site.availability ? `<div class="cmd">$ echo $STATUS</div><div class="value">${esc(d.site.availability)}</div>` : ""}
          ${d.site.location ? `<div class="cmd" style="margin-top:10px">$ echo $LOCATION</div><div class="value">${esc(d.site.location)}</div>` : ""}
        </div>` : ""}
      </section>`;

    case "about": return `
      <section class="reveal" id="about">
        <div class="section-head"><div><p class="kicker">About</p><h2>${esc(d.about.heading || "About")}</h2></div></div>
        <div class="about-grid">
          <p class="about-text">${esc(d.about.text || "")}</p>
          ${d.about.facts?.length ? `<div class="facts">${d.about.facts.map(f => `<div class="fact"><span class="fact-label">${esc(f.label)}</span><span class="fact-value">${esc(f.value)}</span></div>`).join("")}</div>` : ""}
        </div>
      </section>`;

    case "skills": return `
      <section class="reveal" id="skills">
        <div class="section-head"><div><p class="kicker">01 / Skills</p><h2>Toolkit</h2></div></div>
        <div class="skills-grid">${d.skills.map(g => `<div class="skill-group"><h3>${esc(g.group)}</h3><div class="skill-list">${(g.items||[]).map(x=>`<span class="skill">${esc(x)}</span>`).join("")}</div></div>`).join("")}</div>
      </section>`;

    case "experience": return `
      <section class="reveal" id="experience">
        <div class="section-head"><div><p class="kicker">02 / Experience</p><h2>Experience</h2></div></div>
        <div class="timeline">${d.experience.map(x => `<article class="timeline-item">
          <div class="period">${esc(x.period||"")} ${x.location ? `<br>${esc(x.location)}` : ""}</div>
          <div><h3>${esc(x.role||"")}</h3><div class="meta">${esc(x.company||"")}</div>${x.description?`<p>${esc(x.description)}</p>`:""}${x.highlights?.length?`<ul class="highlights">${x.highlights.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>`:""}</div>
        </article>`).join("")}</div>
      </section>`;

    case "projects": return `
      <section class="reveal" id="projects">
        <div class="section-head"><div><p class="kicker">03 / Projects</p><h2>Projects</h2></div></div>
        <div class="projects-grid">${d.projects.map(p => `<article class="project">
          ${p.image ? `<img class="project-image" src="${esc(p.image)}" alt="">` : ""}
          <h3>${esc(p.name||"Untitled project")}</h3>
          ${p.description?`<p>${esc(p.description)}</p>`:""}
          ${p.tags?.length?`<div class="tags">${p.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join("")}</div>`:""}
          ${(p.url||p.github)?`<div class="project-links">${p.url?`<a class="text-link" href="${esc(p.url)}" target="_blank" rel="noreferrer">Live ↗</a>`:""}${p.github?`<a class="text-link" href="${esc(p.github)}" target="_blank" rel="noreferrer">Code ↗</a>`:""}</div>`:""}
        </article>`).join("")}</div>
      </section>`;

    case "certifications": return `
      <section class="reveal" id="certifications">
        <div class="section-head"><div><p class="kicker">04 / Certifications</p><h2>Credentials</h2></div></div>
        <div class="list">${d.certifications.map(c => `<div class="list-item"><div><h3>${esc(c.name||"")}</h3><p>${esc(c.issuer||"")}</p></div><div class="list-meta">${esc(c.year||"")}${c.url ? ` · <a class="text-link" href="${esc(c.url)}" target="_blank" rel="noreferrer">Verify ↗</a>` : ""}</div></div>`).join("")}</div>
      </section>`;

    case "writing": return `
      <section class="reveal" id="writing">
        <div class="section-head"><div><p class="kicker">05 / Writing</p><h2>Notes & articles</h2></div></div>
        <div class="list">${d.writing.map(w => `<div class="list-item"><div><h3>${w.url?`<a class="text-link" href="${esc(w.url)}" target="_blank" rel="noreferrer">${esc(w.title||"")}</a>`:esc(w.title||"")}</h3>${w.excerpt?`<p>${esc(w.excerpt)}</p>`:""}</div><div class="list-meta">${esc(w.date||"")}</div></div>`).join("")}</div>
      </section>`;

    case "contact": return `
      <section class="contact reveal" id="contact">
        <div class="contact-box">
          <p class="kicker">06 / Contact</p>
          <h2>${esc(d.contact.heading || "Get in touch")}</h2>
          ${d.contact.text ? `<p>${esc(d.contact.text)}</p>` : ""}
          <div class="contact-links">
            ${d.contact.email ? `<a class="button" href="mailto:${esc(d.contact.email)}">Email me</a>` : ""}
            ${d.contact.calendar ? `<a class="button secondary" href="${esc(d.contact.calendar)}" target="_blank" rel="noreferrer">Schedule a call ↗</a>` : ""}
          </div>
          ${d.socials?.length ? `<div class="social">${d.socials.filter(x=>x.url).map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noreferrer">${esc(x.label)}</a>`).join("")}</div>` : ""}
        </div>
      </section>`;
    default: return "";
  }
}

function setupInteractions() {
  $("#menuButton")?.addEventListener("click", () => $("#nav").classList.toggle("open"));
  $$("#nav a").forEach(a => a.addEventListener("click", () => $("#nav").classList.remove("open")));

  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  $("#themeToggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, {threshold: .08});
  $$(".reveal").forEach(el => observer.observe(el));
}

(async () => {
  try {
    const d = await loadConfig();
    document.title = d.site.name ? `${d.site.name} — ${d.site.title || "Portfolio"}` : "Portfolio";
    $('meta[name="description"]').content = d.hero?.description || "";
    $("#brand").textContent = d.site.name || "Your Name";
    $("#nav").innerHTML = (d.navigation || []).map(n => `<a href="#${esc(n.target)}">${esc(n.label)}</a>`).join("");

    const resume = $("#resumeLink");
    if (d.site.resume) { resume.href = d.site.resume; resume.hidden = false; resume.target = "_blank"; }

    $("#app").innerHTML = (d.sections || []).map(name => renderSection(name, d)).join("");
    $("#footer").innerHTML = `<div>${esc(d.site.footer || "")}</div>`;
    setupInteractions();
  } catch (err) {
    console.error(err);
    $("#app").innerHTML = `<section><h2>Configuration error</h2><p>Could not load <code>data.json</code>. If you opened this file directly, use GitHub Pages or a local static server.</p></section>`;
  }
})();
