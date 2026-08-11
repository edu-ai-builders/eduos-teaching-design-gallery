(function () {
  const subjects = {
    history: {name:"历史", color:"#e7a15d", note:"决策时信息、史料位置、因果权重与历史 contingency。"},
    chinese: {name:"语文", color:"#ee7e78", note:"原文支持层、语言证据、修辞操作与可辩护解释。"},
    civics: {name:"政治／公民", color:"#d7bb51", note:"概念边界、原则冲突、材料证据与规范论证。"},
    mathematics: {name:"数学", color:"#77c8ae", note:"不变量、错误定位、表示协调与参数变化。"},
    physics: {name:"物理", color:"#71b8ed", note:"系统边界、模型构建、预测—观察与测量证据。"},
    chemistry: {name:"化学", color:"#9e9bea", note:"宏观—微观—符号、粒子机制、守恒与平衡。"},
    biology: {name:"生物", color:"#78bd68", note:"系统反馈、竞争模型、变量关系与实验设计。"},
    geography: {name:"地理", color:"#5fc1c2", note:"空间因果、路径—剖面、尺度变化与人地流动。"}
  };

  const typeMeta = {
    all: {label:"全部"},
    content: {label:"Content / Representation"},
    pedagogy: {label:"Pedagogy"},
    skill: {label:"Agent Skill"},
    example: {label:"Worked Example"}
  };

  const records = [
    ...(window.EDUOS_CONTENT || []),
    ...(window.EDUOS_PEDAGOGY || []),
    ...(window.EDUOS_SKILLS || []),
    ...(window.EDUOS_EXAMPLES || [])
  ];

  const subjectGrid = document.getElementById("subject-grid");
  const frame = document.getElementById("subject-frame");
  const framePath = document.getElementById("frame-path");
  const frameOpen = document.getElementById("frame-open");
  const previewDescription = document.getElementById("preview-description");
  const input = document.getElementById("catalog-search");
  const resultRoot = document.getElementById("search-results");
  const filterRoot = document.getElementById("type-filters");
  let activeType = "all";

  function chooseSubject(key, shouldScroll) {
    const subject = subjects[key];
    if (!subject) return;
    const href = `subjects/${key}.html`;
    frame.src = href;
    frame.title = `${subject.name}学科评审页面`;
    framePath.textContent = href;
    frameOpen.href = href;
    previewDescription.textContent = `当前展示${subject.name}：${subject.note}`;
    document.querySelectorAll(".subject-card").forEach(card => {
      card.setAttribute("aria-pressed", String(card.dataset.subject === key));
    });
    if (shouldScroll) document.querySelector(".review-stage").scrollIntoView({behavior:"smooth", block:"start"});
  }

  Object.entries(subjects).forEach(([key, subject], index) => {
    const counts = records.filter(record => record.subject === key);
    const liveCount = counts.filter(record => record.type !== "skill").length;
    const skillCount = counts.filter(record => record.type === "skill").length;
    const button = document.createElement("button");
    button.className = "subject-card";
    button.dataset.subject = key;
    button.dataset.index = String(index + 1).padStart(2, "0");
    button.style.setProperty("--subject-color", subject.color);
    button.innerHTML = `<span class="pill">${liveCount} live demos + ${skillCount} skills</span><h3>${subject.name}</h3><p>${subject.note}</p>`;
    button.addEventListener("click", () => chooseSubject(key, true));
    subjectGrid.appendChild(button);
  });

  const totals = [
    [Object.keys(subjects).length, "学科"],
    [window.EDUOS_CONTENT.length, "content records"],
    [window.EDUOS_PEDAGOGY.length, "pedagogy methods"],
    [window.EDUOS_SKILLS.length, "skill contracts"],
    [48, "live HTML demos"],
    [window.EDUOS_EXAMPLES.length, "composed examples"]
  ];
  document.getElementById("hero-stats").innerHTML = totals.map(([value,label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");

  Object.entries(typeMeta).forEach(([key, meta]) => {
    const button = document.createElement("button");
    button.className = `filter-button${key === activeType ? " active" : ""}`;
    button.textContent = meta.label;
    button.dataset.type = key;
    button.addEventListener("click", () => {
      activeType = key;
      filterRoot.querySelectorAll("button").forEach(item => item.classList.toggle("active", item.dataset.type === key));
      renderResults();
    });
    filterRoot.appendChild(button);
  });

  function searchable(record) {
    return JSON.stringify(record).toLocaleLowerCase("zh-CN");
  }

  function renderResults() {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    const matches = records.filter(record => {
      const typePass = activeType === "all" || record.type === activeType;
      return typePass && (!query || searchable(record).includes(query));
    }).slice(0, query ? 36 : 12);

    if (!matches.length) {
      resultRoot.innerHTML = `<div class="empty-state">没有找到完全匹配。可以尝试学科名、机制名、课堂条件或 provenance 标签。</div>`;
      return;
    }

    resultRoot.innerHTML = matches.map(record => {
      const subject = subjects[record.subject];
      const summary = record.summary || record.goal || "";
      const family = record.type === "content" ? "content" : record.type === "pedagogy" ? "pedagogy" : record.type === "example" ? "worked-examples" : null;
      const href = family ? `demos/${family}/${record.id}.html` : `subjects/${record.subject}.html#skill`;
      return `<a class="result-card" href="${href}" ${family ? 'target="_blank" data-live="true"' : ''} data-subject="${record.subject}"><div class="result-meta"><span>${subject.name}</span><span>${typeMeta[record.type].label} · ${record.role}</span></div><h3>${record.title}</h3><p>${summary}</p><div class="keyword-row">${(record.keywords || []).slice(0,3).map(key => `<span class="keyword">${key}</span>`).join("")}</div></a>`;
    }).join("");

    resultRoot.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", event => {
        if (link.dataset.live === "true") return;
        event.preventDefault();
        chooseSubject(link.dataset.subject, true);
      });
    });
  }

  input.addEventListener("input", renderResults);
  document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) {
      input.value = "";
      input.blur();
      renderResults();
    }
  });

  renderResults();
  chooseSubject("history", false);
})();
