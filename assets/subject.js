(function () {
  const subjects = {
    history: {name:"历史", en:"History", color:"#e7a15d", thesis:"把过去恢复成当时不确定的信息环境，再讨论来源、因果与选择。", gap:"下一批优先补 conflicting sources、causal weight revision 与尺度变化。"},
    chinese: {name:"语文", en:"Chinese Language Arts", color:"#ee7e78", thesis:"内容相同不代表 artifact 相同；字面理解、情绪结构、修辞和论证需要不同学习动作。", gap:"下一批优先补现代文、诗歌比较和写作 revision trace。"},
    civics: {name:"政治／公民", en:"Civics & Politics", color:"#d7bb51", thesis:"从关键词匹配走向概念边界、原则权衡和材料论证。", gap:"下一批优先补 principle collision、政策 stakeholder 与 civic action。"},
    mathematics: {name:"数学", en:"Mathematics", color:"#77c8ae", thesis:"现有 content visualization 已较丰富，新增重点应是错误证据、表示映射和设计选择。", gap:"下一批优先补 proof-step repair 和 mathematical modeling，而非复制可视化目录。"},
    physics: {name:"物理", en:"Physics", color:"#71b8ed", thesis:"让系统边界、模型、预测与测量证据形成可以修订的闭环。", gap:"下一批优先补能量、波、电学和 measurement uncertainty。"},
    chemistry: {name:"化学", en:"Chemistry", color:"#9e9bea", thesis:"协调宏观观察、微观模型与符号表达，而不是让三种图各自播放。", gap:"下一批优先补反应族、平衡、定量化学与实验安全。"},
    biology: {name:"生物", en:"Biology", color:"#78bd68", thesis:"用变量关系和证据解释生命系统，避免目的论标签替代机制。", gap:"下一批优先补进化、遗传、生态证据与实验设计。"},
    geography: {name:"地理", en:"Geography", color:"#5fc1c2", thesis:"只有当空间位置、尺度或路径进入解释时，地图才是教学表示。", gap:"下一批优先补人文地理、GIS evidence、投影与 field data。"}
  };

  const key = document.body.dataset.subject;
  const subject = subjects[key];
  const content = (window.EDUOS_CONTENT || []).filter(item => item.subject === key);
  const pedagogy = (window.EDUOS_PEDAGOGY || []).filter(item => item.subject === key);
  const skills = (window.EDUOS_SKILLS || []).filter(item => item.subject === key);
  const examples = (window.EDUOS_EXAMPLES || []).filter(item => item.subject === key);
  document.body.style.setProperty("--subject-color", subject.color);

  function chips(items) {
    return (items || []).map(item => `<span class="keyword">${item}</span>`).join("");
  }

  function renderContent(item) {
    const href = `../demos/content/${item.id}.html`;
    return `<article class="live-asset"><div class="live-asset-head"><h3><span class="role-chip">${item.role}</span> ${item.title}</h3><a href="${href}" target="_blank">单独打开成品 ↗</a></div><iframe class="live-demo-frame" src="${href}" title="${item.title} 可交互 content demo" loading="lazy"></iframe><details class="asset-explanation"><summary>查看使用条件、学科动作与边界</summary><div class="asset-explanation-body asset-card" style="border:0;padding-top:8px"><p>${item.summary}</p><dl><dt>学科内容</dt><dd>${item.target}</dd><dt>表示形式</dt><dd>${item.representation}</dd><dt>Domain move</dt><dd>${item.domainMove}</dd><dt>Coding surface</dt><dd>${item.codingSurface}</dd><dt>何时使用</dt><dd>${item.when}</dd><dt>不是什么</dt><dd>${item.not}</dd></dl><div class="keyword-row">${chips(item.keywords)}</div><div class="provenance-strip">provenance: ${item.provenance}</div></div></details></article>`;
  }

  function renderPedagogy(item) {
    const href = `../demos/pedagogy/${item.id}.html`;
    return `<article class="live-asset"><div class="live-asset-head"><h3><span class="role-chip">${item.role}</span> ${item.title}</h3><a href="${href}" target="_blank">单独打开机制 ↗</a></div><iframe class="live-demo-frame pedagogy" src="${href}" title="${item.title} 可交互 pedagogy demo" loading="lazy"></iframe><details class="asset-explanation"><summary>查看 activation、学科原生性与 adaptation</summary><div class="asset-explanation-body asset-card" style="border:0;padding-top:8px"><p>${item.summary}</p><dl><dt>机制</dt><dd>${item.mechanism}</dd><dt>学科原生性</dt><dd>${item.native}</dd><dt>Activation</dt><dd>${item.conditions}</dd><dt>不应使用</dt><dd>${item.notWhen}</dd><dt>条件适配</dt><dd>${item.adaptation}</dd></dl><div class="keyword-row">${chips(item.keywords)}</div><div class="provenance-strip">provenance: ${item.provenance}</div></div></details></article>`;
  }

  function renderSkill(item) {
    const contract = `trigger: ${item.trigger}\nrefusal: ${item.refusal}\ninput: ${item.input}\noutput: ${item.output}\nsearches:\n${item.searches.map(value => `  - ${value}`).join("\n")}`;
    const contentTarget = content[0] ? `../demos/content/${content[0].id}.html` : "#";
    const pedagogyTarget = pedagogy[0] ? `../demos/pedagogy/${pedagogy[0].id}.html` : "#";
    const exampleTarget = examples[0] ? `../demos/worked-examples/${examples[0].id}.html` : "#";
    return `<article class="asset-card skill-card"><span class="role-chip">${item.role} · searchable skill</span><h3>${item.title}</h3><p>${item.summary}</p><div class="skill-contract">${contract}</div><div class="skill-links"><a href="${contentTarget}" target="_blank">检索 content ↗</a><a href="${pedagogyTarget}" target="_blank">检索 pedagogy ↗</a><a href="${exampleTarget}" target="_blank">检索 worked example ↗</a></div><div class="keyword-row">${chips(item.keywords)}</div><div class="provenance-strip">provenance: ${item.provenance} · 这是 V0 contract preview，不是已安装 SKILL.md。</div></article>`;
  }

  function renderExample(item) {
    const href = `../demos/worked-examples/${item.id}.html`;
    const flow = item.flow.map((step,index) => `<div class="state-step"><strong>${String(index+1).padStart(2,"0")}</strong><br>${step}</div>${index < item.flow.length-1 ? '<div class="state-arrow">→</div>' : ''}`).join("");
    return `<article class="live-asset"><div class="live-asset-head"><h3><span class="role-chip">${item.role}</span> ${item.title} · composed runtime</h3><a href="${href}" target="_blank">单独打开完整例子 ↗</a></div><iframe class="live-demo-frame example" src="${href}" title="${item.title} worked example runtime" loading="lazy"></iframe><details class="asset-explanation"><summary>查看完整设计解释、反例与适配</summary><article class="worked-example" style="border:0;border-radius:0"><div class="example-head"><div><span class="role-chip">${item.role} · gold seed</span><h3>${item.title}</h3><p>${item.summary}</p></div><span class="authority">design_authority: ${item.authority}</span></div><div class="example-body"><div class="asset-grid"><div class="asset-card"><span class="pill">Teaching problem</span><h3>目标</h3><p>${item.goal}</p></div><div class="asset-card"><span class="pill">Learner interface</span><h3>看见／做什么</h3><p><strong>看见：</strong>${item.sees}<br><br><strong>行动：</strong>${item.does}</p></div></div><h4 style="margin:26px 0 10px">State flow</h4><div class="state-flow">${flow}</div><div class="evidence-grid"><div class="evidence-box observation"><strong>Observation</strong><ul>${item.observations.map(value => `<li>${value}</li>`).join("")}</ul></div><div class="evidence-box hypothesis"><strong>Possible interpretations</strong><ul>${item.hypotheses.map(value => `<li>${value}</li>`).join("")}</ul></div><div class="evidence-box probe"><strong>Next discriminating probe</strong><ul><li>${item.probe}</li></ul></div></div><div class="anti-grid"><div class="anti-card bad"><h4>Plausible-but-bad</h4><p>${item.bad}<br><br><strong>为什么失败：</strong>${item.whyBad}</p></div><div class="anti-card fix"><h4>Minimal fix</h4><p>${item.minimalFix}<br><br><strong>它不是什么：</strong>${item.notThis}</p></div></div><h4 style="margin:26px 0 10px">What would change the design</h4><div class="condition-list">${item.conditions.map(condition => `<div class="condition-item"><strong>${condition.if}</strong><span>${condition.change}<br><em>Preserve:</em> ${condition.preserve}</span></div>`).join("")}</div><div class="provenance-strip">provenance: ${item.provenance} · pending_review · 本例保存设计边界，不声称学习效果。</div></div></article></details></article>`;
  }

  document.getElementById("subject-root").innerHTML = `
    <header class="subject-hero"><div class="subject-hero-inner"><div class="subject-kicker">${subject.en} · subject file</div><h1>${subject.name}</h1><p>${subject.thesis}</p><div class="subject-metrics"><span>${content.length} content representations</span><span>${pedagogy.length} pedagogy methods</span><span>${skills.length} skill contracts</span><span>${examples.length} worked example</span><span>status: pending_review</span></div></div></header>
    <div class="subject-main">
      <nav class="subject-nav" aria-label="页面分层导航"><button class="filter-button" data-target="content">Content</button><button class="filter-button" data-target="pedagogy">Pedagogy</button><button class="filter-button" data-target="skill">Skills</button><button class="filter-button" data-target="example">Worked example</button><a class="filter-button" href="../index.html" target="_top" style="text-decoration:none">返回总览</a></nav>
      <section class="layer-section" id="content"><div class="layer-title"><span class="layer-number">01</span><div><h2>Content / Representation</h2><p>这里首先是可直接操作的 HTML 成品；说明被收进下方展开项。</p></div></div><div class="asset-grid live-grid">${content.map(renderContent).join("")}</div></section>
      <section class="layer-section" id="pedagogy"><div class="layer-title"><span class="layer-number">02</span><div><h2>Domain-native Pedagogy</h2><p>每种机制都实际保存 commitment、reveal 或 learner evidence，而不只描述流程。</p></div></div><div class="asset-grid live-grid">${pedagogy.map(renderPedagogy).join("")}</div></section>
      <section class="layer-section" id="skill"><div class="layer-title"><span class="layer-number">03</span><div><h2>Searchable Agent Skills</h2><p>展示 trigger、refusal、输入输出和 agent 检索路径。V0 只预览 contract，不冒充已安装 skill。</p></div></div><div class="asset-grid">${skills.map(renderSkill).join("")}</div></section>
      <section class="layer-section" id="example"><div class="layer-title"><span class="layer-number">04</span><div><h2>Worked Example</h2><p>上方运行 content → pedagogy → observation → skill → next probe；下方可展开完整设计解释。</p></div></div>${examples.map(renderExample).join("")}</section>
      <p class="footer-note"><strong>Coverage gap:</strong> ${subject.gap}<br>此页是独立静态 HTML，可在总览 iframe 中评审，也可直接打开。页面记录来自 experiment-local catalog。</p>
    </div>`;

  document.querySelectorAll("[data-target]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.target).scrollIntoView({behavior:"smooth", block:"start"}));
  });
})();
