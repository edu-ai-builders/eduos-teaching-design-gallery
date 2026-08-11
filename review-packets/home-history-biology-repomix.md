This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

- Pay special attention to the Repository Instruction. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: index.html, README.md, subjects/history.html, subjects/biology.html, assets/site.css, assets/app.js, assets/subject.js, assets/demo.css, assets/demo-engine.js, catalog/README.md, catalog/manifest.json, catalog/content/records.js, catalog/pedagogy/records.js, catalog/skills/records.js, catalog/worked-examples/records.js, catalog/demo-configs.js, demos/content/history-*.html, demos/content/biology-*.html, demos/pedagogy/history-*.html, demos/pedagogy/biology-*.html, demos/worked-examples/example-history-*.html, demos/worked-examples/example-biology-*.html
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded

# Directory Structure
````
assets/
  app.js
  demo-engine.js
  demo.css
  site.css
  subject.js
catalog/
  content/
    records.js
  pedagogy/
    records.js
  skills/
    records.js
  worked-examples/
    records.js
  demo-configs.js
  manifest.json
  README.md
demos/
  content/
    biology-experiment-variables.html
    biology-feedback-loop.html
    biology-genetics-model.html
    history-causal-weight-graph.html
    history-constraint-map.html
    history-source-board.html
  pedagogy/
    biology-competing-models.html
    biology-perturb-system.html
    history-decision-under-uncertainty.html
    history-source-corroboration.html
  worked-examples/
    example-biology-feedback.html
    example-history-red-cliffs.html
subjects/
  biology.html
  history.html
index.html
README.md
````

# Files

## File: assets/app.js
````javascript
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
````

## File: assets/demo-engine.js
````javascript
(function () {
  const id = document.body.dataset.demoId;
  const config = (window.EDUOS_DEMOS || {})[id];
  const root = document.getElementById("demo-root");

  if (!config) {
    root.innerHTML = `<div class="demo-page"><div class="demo-stage"><div class="demo-canvas">Unknown demo: ${id}</div></div></div>`;
    return;
  }

  root.innerHTML = `<div class="demo-page"><header class="demo-head"><div><div class="demo-kicker">${config.subject} · ${config.kind} deliverable</div><h1>${config.title}</h1></div><span class="demo-role">${config.role}</span></header><section class="demo-stage" id="active-demo" aria-label="${config.title} interactive demo"></section></div>`;

  function frame(target, title, embedded) {
    target.innerHTML = `<div class="demo-toolbar"><strong>${title}</strong><span>${embedded ? "live primitive" : "直接操作下面的表示"}</span></div><div class="demo-canvas"></div><div class="demo-status" aria-live="polite">${config.prompt || "选择一个操作开始。"}</div>`;
    return {canvas:target.querySelector(".demo-canvas"), status:target.querySelector(".demo-status"), toolbar:target.querySelector(".demo-toolbar")};
  }

  function button(label, action, className="demo-btn") {
    const el = document.createElement("button");
    el.type = "button";
    el.className = className;
    el.textContent = label;
    el.addEventListener("click", action);
    return el;
  }

  function renderDecisionMap(c,target,embedded) {
    const ui = frame(target,"决策时信息地图",embedded);
    ui.canvas.innerHTML = `<div class="mini-map">${c.zones.map((z,i)=>`<button class="map-zone" data-i="${i}" style="left:${z.x}%;top:${z.y}%">${z.label}</button><div class="constraint-card" data-card="${i}" style="left:${Math.min(z.x+8,65)}%;top:${Math.min(z.y+18,72)}%">${z.card}</div>`).join("")}</div>`;
    ui.canvas.querySelectorAll(".map-zone").forEach(zone => zone.addEventListener("click",()=>{
      const i=zone.dataset.i; ui.canvas.querySelectorAll(".map-zone").forEach(x=>x.classList.toggle("active",x===zone)); ui.canvas.querySelectorAll(".constraint-card").forEach(x=>x.classList.toggle("show",x.dataset.card===i)); ui.status.textContent=`Observation-ready: learner opened ${c.zones[i].label} and saw a decision-relevant constraint.`;
    }));
  }

  function renderSourceBoard(c,target,embedded) {
    const ui=frame(target,"材料主张与出处",embedded);
    ui.toolbar.append(button("揭示全部出处",()=>{ui.canvas.querySelectorAll(".source-card").forEach(x=>x.classList.add("revealed"));ui.status.textContent="出处已揭示：现在比较作者位置、时间距离与说服目的。"},"demo-btn primary"));
    ui.canvas.innerHTML=`<div class="source-row">${c.sources.map((s,i)=>`<button class="source-card" data-i="${i}"><span class="demo-label">source ${i+1}</span><blockquote>${s.claim}</blockquote><div class="source-meta">${s.meta}</div></button>`).join("")}</div>`;
    ui.canvas.querySelectorAll(".source-card").forEach(card=>card.addEventListener("click",()=>{card.classList.toggle("revealed");ui.status.textContent=card.classList.contains("revealed")?"Learner inspected provenance before accepting the claim.":"出处再次隐藏：只凭内容判断会遗漏来源位置。";}));
  }

  function renderCausalGraph(c,target,embedded) {
    const ui=frame(target,"多因解释权重",embedded);
    ui.canvas.innerHTML=`<div class="demo-grid">${c.nodes.map((node,i)=>`<label class="demo-panel"><span class="demo-label">cause ${i+1}</span><h3>${node}</h3><input aria-label="${node}权重" type="range" min="0" max="100" value="${c.weights[i]}"><div class="weight-bar"><i style="width:${c.weights[i]}%"></i></div><p><strong>${c.weights[i]}</strong> / 100</p></label>`).join("")}</div>`;
    ui.canvas.querySelectorAll("input").forEach((input,i)=>input.addEventListener("input",()=>{input.parentElement.querySelector("i").style.width=`${input.value}%`;input.parentElement.querySelector("p strong").textContent=input.value;ui.status.textContent=`${c.nodes[i]} 的解释权重被修订为 ${input.value}。权重变化本身需要证据。`;}));
  }

  function renderLayeredText(c,target,embedded) {
    const ui=frame(target,"原文支持层",embedded); let mode="lex";
    const passage=()=>c.notes.reduce((text,n)=>text.replace(n.term,`<span class="annotated" data-note="${n[mode]}">${n.term}</span>`),c.text);
    function draw(){ui.canvas.innerHTML=`<div class="text-passage show-notes">${passage()}</div>`;}
    [["词义","lex"],["句法","syntax"],["语境","context"]].forEach(([label,key])=>ui.toolbar.append(button(label,()=>{mode=key;draw();ui.status.textContent=`已打开${label}层；其他层仍然隐藏。`;})));
    draw();
  }

  function renderEmotion(c,target,embedded) {
    const ui=frame(target,"相对情绪轨迹",embedded); let values=[...c.values];
    function draw(){const points=values.map((v,i)=>`${80+i*220},${220-v*1.7}`).join(" ");ui.canvas.innerHTML=`<div class="emotion-wrap"><svg viewBox="0 0 600 260" role="img" aria-label="三段文本的相对情绪曲线"><line class="axis" x1="55" y1="220" x2="565" y2="220"/><polyline class="emotion-line" points="${points}"/>${values.map((v,i)=>`<circle class="emotion-point" cx="${80+i*220}" cy="${220-v*1.7}" r="8"/><text class="chart-label" x="${80+i*220}" y="245" text-anchor="middle">${c.labels[i]}</text>`).join("")}</svg></div><div class="demo-grid">${values.map((v,i)=>`<label class="demo-panel"><h3>${c.labels[i]}</h3><input type="range" min="0" max="100" value="${v}" data-i="${i}" aria-label="${c.labels[i]}强度"><p>${v}/100</p></label>`).join("")}</div>`;ui.canvas.querySelectorAll("input").forEach(input=>input.addEventListener("input",()=>{values[+input.dataset.i]=+input.value;draw();ui.status.textContent="曲线已修改：下一步应给转折点附上原文证据。";}));}
    draw();
  }

  function renderTextSurgery(c,target,embedded) {
    const ui=frame(target,"受控文本 A/B",embedded); let changed=false;
    function draw(){ui.canvas.innerHTML=`<div class="text-version">${changed?`<span class="added">${c.changed}</span>`:c.original}</div><div class="demo-panel"><span class="demo-label">effect trace</span><p>${changed?c.focus:"先预测：删除意象后，尺度感、节奏和视角会怎样变化？"}</p></div>`;}
    ui.toolbar.append(button("切换原句／改句",()=>{changed=!changed;draw();ui.status.textContent=changed?"只改变意象表达，其他语境保持不变。":"回到原句，比较效果是否恢复。"},"demo-btn primary"));draw();
  }

  function renderNearMiss(c,target,embedded) {
    const ui=frame(target,"控制变量材料对",embedded);
    ui.canvas.innerHTML=`<div class="choice-grid">${c.choices.map((x,i)=>`<button class="choice-card" data-i="${i}"><span class="demo-label">材料 ${String.fromCharCode(65+i)}</span><p>${x.replace(c.cue,`<span class="cue">${c.cue}</span>`)}</p></button>`).join("")}</div>`;
    ui.canvas.querySelectorAll("button").forEach(card=>card.addEventListener("click",()=>{const i=+card.dataset.i;ui.canvas.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===card));ui.status.innerHTML=i===c.correct?`选择已保存。决定性短语是 <span class="decisive">${c.decisive}</span>。`:`选择已保存，但两则都有“${c.cue}”。请标出行为层面的决定性差异。`;}));
  }

  function renderMatrix(c,target,embedded) {
    const ui=frame(target,"原则 × 方案",embedded); const states=["unknown","support","tension"], symbols={unknown:"?",support:"+",tension:"△"};
    ui.canvas.innerHTML=`<table class="matrix"><thead><tr><th>原则</th>${c.cols.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${c.rows.map((r,ri)=>`<tr><th>${r}</th>${c.cols.map((_,ci)=>`<td data-state="unknown" data-cell="${ri}-${ci}">?</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    ui.canvas.querySelectorAll("td").forEach(cell=>cell.addEventListener("click",()=>{const next=states[(states.indexOf(cell.dataset.state)+1)%states.length];cell.dataset.state=next;cell.textContent=symbols[next];ui.status.textContent=`${c.rows[cell.dataset.cell.split("-")[0]]} 对 ${c.cols[cell.dataset.cell.split("-")[1]]} 标记为 ${next}；请补充理由。`;}));
  }

  function renderArgument(c,target,embedded) {
    const ui=frame(target,"论证链",embedded);let visible=1;
    function draw(){ui.canvas.innerHTML=`<div class="argument-board">${c.slots.map((slot,i)=>`${i?'<div class="argument-arrow">→</div>':''}<button class="argument-slot ${i<visible?'filled':''}" data-i="${i}"><span class="demo-label">${["claim","evidence","warrant"][i]}</span><p>${i<visible?slot:"点击补上缺失一环"}</p></button>`).join("")}</div>`;ui.canvas.querySelectorAll("button").forEach(x=>x.addEventListener("click",()=>{visible=Math.max(visible,+x.dataset.i+1);draw();ui.status.textContent=visible===3?"论证链完整：证据通过解释桥支持主张。":"摘抄证据还不等于完成论证。";}));} draw();
  }

  function renderBalance(c,target,embedded) {
    const ui=frame(target,"等式保持",embedded);let step=0;const states=[{eq:"3x + 5 = 20",left:"x x x +5",right:"20"},{eq:"3x = 15",left:"x x x",right:"15"},{eq:"x = 5",left:"x",right:"5"}];
    function draw(){const s=states[step];ui.canvas.innerHTML=`<div class="equation-display">${s.eq}</div><div class="balance-stage"><div class="pan left">${s.left.split(" ").map(x=>`<span class="block ${x==='x'?'x':''}">${x}</span>`).join("")}</div><div class="balance-pivot"></div><div class="pan right">${s.right.split(" ").map(x=>`<span class="block">${x}</span>`).join("")}</div></div>`;}
    ui.toolbar.append(button("两边 −5",()=>{if(step===0){step=1;draw();ui.status.textContent="两边同时减 5，解集保持不变。";}},"demo-btn primary"));ui.toolbar.append(button("两边 ÷3",()=>{if(step===1){step=2;draw();ui.status.textContent="两边同时除以 3，得到 x=5。";}}));draw();
  }

  function renderSolution(c,target,embedded) {
    const ui=frame(target,"第一处不合法步骤",embedded);
    ui.canvas.innerHTML=`<div class="solution-list">${c.lines.map((line,i)=>`<button class="solution-line" data-i="${i}"><code>${line}</code><span>选择此行</span></button>`).join("")}</div>`;
    ui.canvas.querySelectorAll("button").forEach(line=>line.addEventListener("click",()=>{const i=+line.dataset.i;ui.canvas.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===line));ui.status.textContent=i===c.invalid?"定位正确：除以 3 不能替换为减去 3。下一题应去掉负数／除法负荷。":"这一步仍可由上一行合法推出。继续寻找 first invalid step。";}));
  }

  function renderParamGraph(c,target,embedded) {
    const ui=frame(target,"参数与交点",embedded);let b=c.value;
    function draw(){const x=(8-b)/2,px=70+(x+2)*70;ui.canvas.innerHTML=`<div class="plot-wrap"><svg viewBox="0 0 600 260" role="img" aria-label="y=2x+b 与 y=8"><line class="axis" x1="50" y1="220" x2="560" y2="220"/><line class="axis" x1="70" y1="20" x2="70" y2="230"/><line x1="70" y1="80" x2="550" y2="80" stroke="#ff9b65" stroke-width="3"/><line x1="70" y1="${200-b*8}" x2="550" y2="${80-b*8}" stroke="#76b8ff" stroke-width="3"/><circle cx="${Math.max(70,Math.min(550,px))}" cy="80" r="7" fill="#142c40"/><text class="chart-label" x="480" y="69">y=8</text><text class="chart-label" x="450" y="${105-b*8}">y=2x+${b}</text></svg></div><label class="demo-panel"><h3>b = ${b} · 交点 x = ${x.toFixed(1)}</h3><input type="range" min="${c.min}" max="${c.max}" value="${b}" aria-label="参数 b"></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{b=+e.target.value;draw();ui.status.textContent="b 增大时交点左移；请从方程而不是动画外观解释。";});} draw();
  }

  function renderForce(c,target,embedded) {
    const ui=frame(target,"受力模型",embedded);let active=[];
    c.forces.forEach((f,i)=>ui.toolbar.append(button(f.label,()=>{if(!active.includes(i))active.push(i);draw();ui.status.textContent=f.bad?"观察：添加了‘运动方向’。这可能是 motion-as-force，也可能只是把速度箭头画错位置。":"已添加一个有外部作用源的力。";})));
    function draw(){ui.canvas.innerHTML=`<div class="force-scene"><div class="force-object">小车</div>${active.map(i=>{const f=c.forces[i];return `<div class="force-arrow" style="--rot:${f.rot}deg;--len:${f.bad?70:90}px;${f.bad?'background:#e9766b':''}"><span>${f.label}</span></div>`}).join("")}</div>`;} draw();
  }

  function renderMotion(c,target,embedded) {
    const ui=frame(target,"运动—图像—方程同步",embedded);let t=4;
    function draw(){const x=c.initial+c.speed*t;ui.canvas.innerHTML=`<div class="demo-grid"><div class="demo-panel"><h3>场景</h3><div style="position:relative;height:100px;border-bottom:3px solid #819087"><span style="position:absolute;left:${Math.min(88,t*10)}%;bottom:3px;width:36px;height:24px;background:var(--d-orange);border-radius:6px"></span></div></div><div class="demo-panel plot-wrap"><h3>x–t graph</h3><svg viewBox="0 0 240 120"><line class="axis" x1="20" y1="100" x2="220" y2="100"/><line class="axis" x1="20" y1="10" x2="20" y2="105"/><line x1="20" y1="90" x2="210" y2="25" stroke="#76b8ff" stroke-width="3"/><circle cx="${20+t*19}" cy="${90-t*6.5}" r="6" fill="#142c40"/></svg></div><div class="demo-panel"><h3>方程</h3><p style="font-size:22px">x = 10 + 1.5t</p><p>t=${t}s → x=${x.toFixed(1)}m</p></div></div><label class="demo-panel"><h3>时间游标 ${t}s</h3><input type="range" min="0" max="10" value="${t}" aria-label="时间"></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{t=+e.target.value;draw();ui.status.textContent="同一时间游标同时改变场景位置、图像点与方程值。";});}draw();
  }

  function renderUncertainty(c,target,embedded) {
    const ui=frame(target,"模型与测量区间",embedded);let value=c.value;
    function draw(){const delta=value-c.model,inside=Math.abs(delta)<=c.tolerance;ui.canvas.innerHTML=`<div class="plot-wrap"><svg viewBox="0 0 600 180"><line x1="70" y1="100" x2="540" y2="100" stroke="#aeb7b0"/><rect x="250" y="60" width="120" height="80" fill="rgba(118,184,255,.25)"/><line x1="310" y1="45" x2="310" y2="150" stroke="#76b8ff" stroke-width="3"/><circle cx="${310+(value-c.model)*180}" cy="100" r="10" fill="${inside?'#78bd68':'#e9766b'}"/><text class="chart-label" x="275" y="50">model ${c.model} ± ${c.tolerance}</text></svg></div><label class="demo-panel"><h3>measurement = ${value.toFixed(2)}</h3><input type="range" min="9.2" max="10.4" step="0.02" value="${value}" aria-label="测量值"><p>${inside?"落在当前不确定区间内":"偏差超过当前区间；需要重复测量并检查系统误差"}</p></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{value=+e.target.value;draw();ui.status.textContent="数值不相等不自动意味着模型错误；先比较不确定度。";});}draw();
  }

  function particleMarkup(){return Array.from({length:12},(_,i)=>`<span class="particle ${i%3===0?'alt':i%4===0?'neutral':''}" style="left:${8+(i*31)%84}%;top:${8+(i*47)%72}%">${i%3===0?'OH':i%4===0?'Na':'H'}</span>`).join("");}
  function renderChemistry(c,target,embedded) {
    const ui=frame(target,"宏观—微观—符号",embedded);
    ui.canvas.innerHTML=`<div class="demo-grid"><div class="demo-panel"><h3>Macro · 温度略升，无沉淀</h3><div class="beaker"><div class="liquid"></div></div></div><div class="demo-panel"><h3>Micro · 哪些粒子变化？</h3><div class="particle-cloud">${particleMarkup()}</div></div><div class="demo-panel"><h3>Symbol · 补全缺失层</h3><div class="symbol-box" id="symbol-choice">?</div>${c.options.map((x,i)=>`<button class="demo-btn" data-i="${i}">${x}</button>`).join(" ")}</div></div>`;
    ui.canvas.querySelectorAll("button").forEach(x=>x.addEventListener("click",()=>{const i=+x.dataset.i;ui.canvas.querySelector("#symbol-choice").textContent=c.options[i];ui.status.textContent=i===c.correct?"符号层正确。下一步还要指出 Na⁺/Cl⁻ 是旁观粒子。":"这个符号层预测了沉淀，与宏观和粒子视图不一致。";}));
  }

  function renderParticles(c,target,embedded) {
    const ui=frame(target,"粒子事件帧",embedded);let step=0;
    function draw(){ui.canvas.innerHTML=`<div class="particle-cloud" style="height:250px">${particleMarkup()}</div><div class="demo-panel"><span class="demo-label">frame ${step+1}/${c.frames.length}</span><h3>${c.frames[step]}</h3><p>反应前后粒子身份与数量需要保持可追踪。</p></div>`;}
    ui.toolbar.append(button("上一帧",()=>{step=Math.max(0,step-1);draw();}));ui.toolbar.append(button("下一帧",()=>{step=Math.min(c.frames.length-1,step+1);draw();ui.status.textContent=`进入“${c.frames[step]}”：检查是否发生了守恒的身份变化。`},"demo-btn primary"));draw();
  }

  function renderEquilibrium(c,target,embedded) {
    const ui=frame(target,"平衡扰动",embedded);let r=c.reactant,p=c.product,phase="平衡";
    function draw(){ui.canvas.innerHTML=`<div class="demo-grid"><div class="demo-panel"><h3>反应物</h3><div class="weight-bar"><i style="width:${r}%"></i></div><p>${r}</p></div><div class="demo-panel"><h3>产物</h3><div class="weight-bar"><i style="width:${p}%;background:var(--d-blue)"></i></div><p>${p}</p></div><div class="demo-panel"><h3>状态</h3><p>${phase}</p></div></div>`;}
    ui.toolbar.append(button("加入反应物",()=>{r=82;phase="正反应速率瞬时增大";draw();ui.status.textContent="先观察速率变化；组成尚未立刻到达新平衡。"},"demo-btn primary"));ui.toolbar.append(button("运行至新平衡",()=>{r=63;p=67;phase="新动态平衡";draw();ui.status.textContent="正逆反应速率再次相等，但组成与扰动前不同。";}));draw();
  }

  function renderFeedback(c,target,embedded) {
    const ui=frame(target,"反馈关系与时间轨迹",embedded);let value=c.value;
    function draw(){const high=value>c.baseline;ui.canvas.innerHTML=`<div class="feedback-loop"><div class="feedback-node ${high?'active':''}" style="left:4%;top:80px">体温 ${value.toFixed(1)}℃</div><div class="feedback-link" style="left:24%;top:108px;width:120px"></div><div class="feedback-node ${high?'active':''}" style="left:40%;top:25px">下丘脑检测</div><div class="feedback-link" style="left:57%;top:82px;width:110px;transform:rotate(28deg)"></div><div class="feedback-node ${high?'active':''}" style="right:3%;top:120px">出汗／血管舒张</div></div><label class="demo-panel"><h3>扰动体温 ${value.toFixed(1)}℃</h3><input type="range" min="35" max="40" step="0.1" value="${value}" aria-label="体温扰动"><p>${high?"响应增加散热，使偏差减小":"低于基线时需要另一组响应"}</p></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{value=+e.target.value;draw();ui.status.textContent="圆形布局不是机制；方向、组件和时滞才是。";});}draw();
  }

  function renderGenetics(c,target,embedded) {
    const ui=frame(target,"候选遗传模型",embedded);let selected=null,revealed=false;
    function draw(){ui.canvas.innerHTML=`<div class="demo-grid">${c.models.map((m,i)=>`<button class="demo-panel ${selected===i?'graph-node active':''}" data-i="${i}"><span class="demo-label">model ${i+1}</span><h3>${m}</h3><p>${selected===i?"已保存预测":"选择候选模型"}</p></button>`).join("")}</div>${revealed?`<div class="demo-panel" style="margin-top:12px"><span class="demo-label">new evidence</span><h3>${c.evidence}</h3></div>`:""}`;ui.canvas.querySelectorAll("button").forEach(x=>x.addEventListener("click",()=>{selected=+x.dataset.i;draw();ui.status.textContent="模型已提交；现在可以揭示能区分模型的数据。";}));}
    ui.toolbar.append(button("揭示后代数据",()=>{revealed=true;draw();ui.status.textContent="使用新数据淘汰或修订模型，而不是只看名称是否熟悉。"},"demo-btn primary"));draw();
  }

  function renderExperiment(c,target,embedded) {
    const ui=frame(target,"实验变量角色",embedded);const roles=["未分配","处理变量","响应变量","控制变量"],state=[0,0,0];
    function draw(){ui.canvas.innerHTML=`<div class="demo-grid">${c.variables.map((v,i)=>`<button class="demo-panel" data-i="${i}"><span class="demo-label">${roles[state[i]]}</span><h3>${v}</h3><p>点击改变变量角色</p></button>`).join("")}</div>`;ui.canvas.querySelectorAll("button").forEach(x=>x.addEventListener("click",()=>{const i=+x.dataset.i;state[i]=(state[i]+1)%roles.length;draw();ui.status.textContent=`${c.variables[i]} 被设为 ${roles[state[i]]}。检查实验比较是否能支持因果主张。`;}));}draw();
  }

  function renderTerrain(c,target,embedded) {
    const ui=frame(target,"水汽路径与地形剖面",embedded);let progress=35;
    function draw(){ui.canvas.innerHTML=`<div class="terrain-scene"><div class="mountain one"></div><div class="mountain two"></div><div class="basin"></div><div class="air-path" style="width:${progress}%"></div><div class="rain ${progress>48?'show':''}">•••<br>•••</div></div><label class="demo-panel"><h3>水汽路径 ${progress}%</h3><input type="range" min="15" max="78" value="${progress}" aria-label="水汽路径"><p>${progress>48?"气流遇山地抬升，迎风侧出现降水。":"先预测路径遇到山地后会怎样。"}</p></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{progress=+e.target.value;draw();ui.status.textContent="路径和剖面联动：地图只有进入因果链时才有用。";});}draw();
  }

  function renderScale(c,target,embedded) {
    const ui=frame(target,"空间聚合尺度",embedded);let level=0;
    function draw(){const cols=c.sizes[level],count=cols*cols;ui.canvas.innerHTML=`<div class="scale-grid" style="--cols:${cols}">${Array.from({length:count},(_,i)=>`<span class="scale-cell ${(i%7===0||i===Math.floor(count*.62))?'hot':''} ${level>0&&i%3===0?'aggregate':''}">${level>0?Math.round((i%5+2)*10):""}</span>`).join("")}</div><label class="demo-panel" style="margin-top:14px"><h3>${["社区 1×","区域 2×","城市 4×"][level]}</h3><input type="range" min="0" max="2" value="${level}" aria-label="聚合尺度"></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{level=+e.target.value;draw();ui.status.textContent=level?"聚合后局部热点被平均；结论必须限定尺度。":"细尺度显示局部差异。";});}draw();
  }

  function renderFlow(c,target,embedded) {
    const ui=frame(target,"人口流动与约束",embedded);let cost=50;
    function draw(){const w1=Math.max(3,14-cost/7),w2=4+cost/8;ui.canvas.innerHTML=`<div class="flow-field"><div class="flow-place" style="left:8%;top:36%">${c.places[0]}</div><div class="flow-place" style="left:43%;top:15%">${c.places[1]}</div><div class="flow-place" style="right:8%;bottom:14%">${c.places[2]}</div><div class="flow-line" style="left:19%;top:46%;width:210px;transform:rotate(-18deg);--w:${w1}px"></div><div class="flow-line" style="left:52%;top:34%;width:250px;transform:rotate(28deg);--w:${w2}px;background:var(--d-orange)"></div></div><label class="demo-panel"><h3>核心城区住房成本 ${cost}</h3><input type="range" min="10" max="90" value="${cost}" aria-label="住房成本"></label>`;ui.canvas.querySelector("input").addEventListener("input",e=>{cost=+e.target.value;draw();ui.status.textContent="流量变化需要由机会与成本解释，不只是线条变粗。";});}draw();
  }

  const renderers={"decision-map":renderDecisionMap,"source-board":renderSourceBoard,"causal-graph":renderCausalGraph,"layered-text":renderLayeredText,"emotion":renderEmotion,"text-surgery":renderTextSurgery,"near-miss":renderNearMiss,"matrix":renderMatrix,"argument":renderArgument,"balance":renderBalance,"solution":renderSolution,"param-graph":renderParamGraph,"force":renderForce,"motion":renderMotion,"uncertainty":renderUncertainty,"chemistry":renderChemistry,"particles":renderParticles,"equilibrium":renderEquilibrium,"feedback":renderFeedback,"genetics":renderGenetics,"experiment":renderExperiment,"terrain":renderTerrain,"scale":renderScale,"flow":renderFlow};

  function renderVisual(c,target,embedded=true){const fn=renderers[c.renderer];if(fn)fn(c,target,embedded);else target.innerHTML="<div class='demo-canvas'>Renderer unavailable.</div>";}

  function renderPedagogy(c,target) {
    target.innerHTML=`<div class="demo-toolbar"><strong>Pedagogy state machine</strong><span>先保存 learner state，再 reveal</span></div><div class="demo-canvas"><div class="pedagogy-shell"><div id="inner-visual"></div><aside class="pedagogy-rail"><h3>${c.title}</h3>${c.stages.map((x,i)=>`<div class="ped-step ${i===0?'active':''}" data-step="${i}">${i+1}. ${x}</div>`).join("")}<div class="commit-box"><strong>提交一个承诺</strong><div id="commit-actions"></div></div></aside></div></div><div class="demo-status" id="ped-status">${config.prompt||"选择后才能揭示新证据。"}</div>`;
    const inner=(window.EDUOS_DEMOS||{})[c.inner];renderVisual(inner,target.querySelector("#inner-visual"),true);const status=target.querySelector("#ped-status"),actions=target.querySelector("#commit-actions");let committed=false,step=0;
    c.choices.forEach(choice=>actions.append(button(choice,()=>{committed=true;step=1;target.querySelectorAll(".ped-step").forEach((x,i)=>x.classList.toggle("active",i===step));status.textContent=`Observation: learner committed to “${choice}”. Interpretation remains open.`;})));
    actions.append(button("揭示新证据",()=>{if(!committed){status.textContent="先提交选择；没有 prior commitment，reveal 无法测试或修订判断。";return;}step=2;target.querySelectorAll(".ped-step").forEach((x,i)=>x.classList.toggle("active",i===step));status.textContent=`Reveal: ${c.reveal} Next probe: ${c.probe}`;},"demo-btn primary"));
  }

  function renderWorkflow(c,target) {
    target.innerHTML=`<div class="demo-toolbar"><strong>Composed worked example</strong><span>content → pedagogy → observation → skill → probe</span></div><div class="demo-canvas"><div class="layer-stack"><span class="layer-chip active">Content: ${c.inner}</span><span class="layer-chip">Pedagogy: ${c.pedagogy}</span><span class="layer-chip">Skill: ${c.skill}</span><span class="layer-chip">Artifact: ${c.title}</span></div><div class="workflow-shell"><div id="workflow-visual"></div><aside class="workflow-side"><div class="trace-card"><h3>Learner action</h3><div id="workflow-actions"></div></div><div class="trace-card"><h3>Public agent trace</h3><div id="trace-log"><div class="trace-event">waiting_for_observation</div></div></div></aside></div></div><div class="demo-status" id="workflow-status">先操作内容表示，再模拟一次学习者提交。</div>`;
    const inner=(window.EDUOS_DEMOS||{})[c.inner];renderVisual(inner,target.querySelector("#workflow-visual"),true);const actions=target.querySelector("#workflow-actions"),log=target.querySelector("#trace-log"),status=target.querySelector("#workflow-status");
    c.options.forEach(option=>actions.append(button(option,()=>{log.innerHTML=`<div class="trace-event">observation: ${c.observation}</div><div class="trace-event">possible_interpretations:<br>• ${c.interpretations.join("<br>• ")}</div>`;status.textContent=`已保存提交“${option}”。Skill 只产生 hypotheses，不做确定诊断。`;})));
    actions.append(button("运行 next probe",()=>{log.innerHTML+=`<div class="trace-event">next_discriminating_probe:<br>${c.probe}</div>`;target.querySelectorAll(".layer-chip").forEach((x,i)=>x.classList.toggle("active",i===2));status.textContent="Skill 根据 observation 选择下一条最便宜的区分性证据。";},"demo-btn primary"));
  }

  if(config.renderer==="pedagogy")renderPedagogy(config,document.getElementById("active-demo"));
  else if(config.renderer==="workflow")renderWorkflow(config,document.getElementById("active-demo"));
  else renderVisual(config,document.getElementById("active-demo"),false);
})();
````

## File: assets/demo.css
````css
:root {
  --d-bg: #f7f5ed;
  --d-card: #fffdf7;
  --d-ink: #17211c;
  --d-muted: #657269;
  --d-line: #d9dbd2;
  --d-navy: #142c40;
  --d-acid: #c7f36b;
  --d-blue: #76b8ff;
  --d-orange: #ff9b65;
  --d-violet: #ad9bea;
  --d-red: #e9766b;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "PingFang SC", sans-serif;
  color: var(--d-ink);
  background: var(--d-bg);
}

* { box-sizing: border-box; }
body { margin: 0; background: var(--d-bg); }
button, input { font: inherit; }
button { cursor: pointer; }

.demo-page { min-height: 100vh; padding: 18px; }
.demo-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; max-width: 1060px; margin: 0 auto 14px; }
.demo-head h1 { margin: 5px 0 0; font-family: Georgia, "Songti SC", serif; font-size: clamp(24px, 4vw, 38px); font-weight: 500; letter-spacing: -.03em; }
.demo-kicker { color: var(--d-muted); font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.demo-role { padding: 6px 9px; color: var(--d-navy); background: var(--d-acid); border-radius: 8px; font-family: ui-monospace, monospace; font-size: 10px; font-weight: 800; }
.demo-stage { max-width: 1060px; min-height: 360px; margin: 0 auto; overflow: hidden; background: var(--d-card); border: 1px solid var(--d-line); border-radius: 20px; box-shadow: 0 18px 50px rgba(20,44,64,.09); }
.demo-canvas { position: relative; min-height: 310px; padding: 22px; }
.demo-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 16px; background: #eef0e9; border-bottom: 1px solid var(--d-line); }
.demo-toolbar strong { margin-right: auto; font-size: 12px; }
.demo-toolbar span { color: var(--d-muted); font-size: 11px; }
.demo-btn { padding: 8px 11px; color: var(--d-ink); background: #fff; border: 1px solid var(--d-line); border-radius: 9px; }
.demo-btn:hover, .demo-btn[aria-pressed="true"] { color: #fff; background: var(--d-navy); border-color: var(--d-navy); }
.demo-btn.primary { color: var(--d-navy); background: var(--d-acid); border-color: #acd75a; font-weight: 750; }
.demo-btn:disabled { opacity: .4; cursor: not-allowed; }
.demo-status { min-height: 40px; padding: 10px 16px; color: var(--d-muted); background: #f4f4ed; border-top: 1px solid var(--d-line); font-size: 12px; line-height: 1.55; }
.demo-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.demo-panel { position: relative; min-height: 150px; padding: 15px; background: #f5f4ed; border: 1px solid var(--d-line); border-radius: 14px; }
.demo-panel h3 { margin: 0 0 10px; font-size: 13px; }
.demo-panel p { margin: 0; color: var(--d-muted); font-size: 12px; line-height: 1.55; }
.demo-label { display: inline-flex; padding: 4px 7px; color: var(--d-navy); background: #e4e8dc; border-radius: 999px; font-size: 9px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }

.mini-map { position: relative; height: 250px; overflow: hidden; background: linear-gradient(155deg,#dce9d7,#c9dbcb 48%,#bdd3da 49%,#a9c8d2 58%,#d9dfc8 59%); border-radius: 16px; }
.mini-map::before { content:""; position:absolute; left:-10%; top:43%; width:120%; height:42px; background:#83b7ca; transform:rotate(-4deg); box-shadow:0 9px 0 rgba(255,255,255,.23) inset; }
.map-zone { position:absolute; display:grid; place-items:center; width:86px; height:58px; padding:8px; color:#26372e; background:rgba(255,253,247,.82); border:1px solid rgba(43,67,53,.2); border-radius:45% 55% 48% 52%; font-size:11px; text-align:center; }
.map-zone.active { background:var(--d-acid); box-shadow:0 0 0 4px rgba(199,243,107,.28); }
.constraint-card { position:absolute; width:180px; padding:10px; color:#fff; background:rgba(20,44,64,.92); border-radius:10px; font-size:11px; line-height:1.45; opacity:0; transform:translateY(6px); transition:.2s; }
.constraint-card.show { opacity:1; transform:none; }

.source-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.source-card { min-height:210px; padding:14px; background:#f2efe5; border:1px solid var(--d-line); border-radius:13px; }
.source-card blockquote { margin:14px 0; font-family:Georgia,"Songti SC",serif; font-size:16px; line-height:1.6; }
.source-meta { padding-top:10px; color:var(--d-muted); border-top:1px dashed var(--d-line); font-size:10px; opacity:.15; transition:.2s; }
.source-card.revealed .source-meta { opacity:1; }

.node-space { position:relative; height:260px; }
.graph-node { position:absolute; display:grid; place-items:center; width:110px; min-height:54px; padding:9px; background:#fff; border:2px solid var(--d-line); border-radius:14px; font-size:11px; text-align:center; z-index:2; }
.graph-node.active { border-color:var(--d-orange); background:#fff2e8; }
.graph-edge { position:absolute; height:2px; background:#9ca9a1; transform-origin:left center; z-index:1; }
.weight-bar { height:6px; margin-top:7px; overflow:hidden; background:#dfe3dc; border-radius:5px; }
.weight-bar i { display:block; height:100%; background:var(--d-orange); }

.text-passage { max-width:760px; margin:18px auto; font-family:Georgia,"Songti SC",serif; font-size:21px; line-height:2.15; }
.annotated { position:relative; padding:2px 4px; border-bottom:2px solid var(--d-violet); }
.annotated::after { content:attr(data-note); position:absolute; left:0; bottom:100%; min-width:90px; padding:4px 6px; color:#fff; background:var(--d-navy); border-radius:6px; font-family:ui-sans-serif,system-ui; font-size:9px; line-height:1.35; opacity:0; pointer-events:none; transform:translateY(5px); transition:.15s; }
.show-notes .annotated::after { opacity:1; transform:none; }
.text-version { max-width:760px; margin:25px auto; padding:20px; background:#f4f2e8; border-radius:14px; font-family:Georgia,"Songti SC",serif; font-size:20px; line-height:1.8; }
.removed { color:#a64f48; text-decoration:line-through; }
.added { color:#276e62; background:#def1dd; }

.emotion-wrap svg, .plot-wrap svg { width:100%; height:240px; overflow:visible; }
.axis { stroke:#aeb7b0; stroke-width:1; }
.emotion-line { fill:none; stroke:var(--d-red); stroke-width:4; stroke-linecap:round; stroke-linejoin:round; }
.emotion-point { fill:var(--d-card); stroke:var(--d-red); stroke-width:3; cursor:pointer; }
.chart-label { fill:var(--d-muted); font-size:10px; }

.choice-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.choice-card { min-height:170px; padding:16px; background:#f4f2e8; border:2px solid transparent; border-radius:14px; text-align:left; }
.choice-card:hover, .choice-card.selected { border-color:var(--d-blue); }
.choice-card .cue { display:inline; padding:1px 3px; background:#ffeaa0; }
.decisive { color:#995c24; font-weight:750; text-decoration:underline; text-decoration-thickness:2px; }

.matrix { width:100%; border-collapse:collapse; font-size:11px; }
.matrix th,.matrix td { padding:10px; border-bottom:1px solid var(--d-line); text-align:center; }
.matrix th:first-child,.matrix td:first-child { text-align:left; }
.matrix td[data-state] { cursor:pointer; font-weight:800; }
.matrix td[data-state="support"] { background:#e7f4d1; }
.matrix td[data-state="tension"] { background:#fff0de; }
.matrix td[data-state="unknown"] { background:#ecebe7; color:var(--d-muted); }

.argument-board { display:grid; grid-template-columns:1fr 42px 1fr 42px 1fr; align-items:stretch; gap:8px; }
.argument-slot { min-height:180px; padding:16px; background:#f4f2e8; border:2px dashed #c9cec6; border-radius:14px; }
.argument-slot.filled { border-style:solid; border-color:var(--d-blue); }
.argument-arrow { display:grid; place-items:center; color:#87928b; font-size:24px; }

.balance-stage { display:grid; grid-template-columns:1fr 100px 1fr; align-items:end; max-width:700px; margin:30px auto; }
.pan { min-height:120px; display:flex; align-items:flex-end; justify-content:center; gap:7px; padding:14px; border-bottom:8px solid #5c6c63; transition:.25s; }
.pan.left { transform:translateY(var(--left-y,0)); }
.pan.right { transform:translateY(var(--right-y,0)); }
.block { display:grid; place-items:center; min-width:34px; height:34px; padding:5px; color:#fff; background:var(--d-navy); border-radius:7px; font-size:11px; }
.block.x { background:var(--d-violet); }
.balance-pivot { position:relative; height:100px; border-bottom:10px solid #69786f; clip-path:polygon(50% 0,100% 100%,0 100%); }
.equation-display { text-align:center; font-family:Georgia,serif; font-size:28px; }

.solution-list { max-width:700px; margin:10px auto; counter-reset:line; }
.solution-line { display:grid; grid-template-columns:34px 1fr auto; gap:10px; align-items:center; width:100%; padding:11px 13px; background:transparent; border:0; border-bottom:1px solid var(--d-line); text-align:left; }
.solution-line::before { counter-increment:line; content:counter(line); color:var(--d-muted); font-family:ui-monospace,monospace; }
.solution-line:hover { background:#f2f3ec; }
.solution-line.selected { background:#fff0e5; box-shadow:inset 4px 0 var(--d-orange); }

.force-scene { position:relative; height:260px; overflow:hidden; background:linear-gradient(#d8eaf3 0 68%,#d5d0bd 68%); border-radius:16px; }
.force-object { position:absolute; left:45%; top:48%; width:90px; height:55px; display:grid; place-items:center; background:var(--d-orange); border:3px solid #9b5b35; border-radius:10px; font-weight:750; }
.force-arrow { position:absolute; left:50%; top:50%; width:var(--len,90px); height:4px; background:var(--d-navy); transform-origin:left center; transform:rotate(var(--rot,0deg)); }
.force-arrow::after { content:""; position:absolute; right:-2px; top:-5px; width:0; height:0; border-left:12px solid var(--d-navy); border-top:7px solid transparent; border-bottom:7px solid transparent; }
.force-arrow span { position:absolute; left:35%; top:-24px; padding:3px 5px; background:#fff; border-radius:4px; font-size:9px; white-space:nowrap; }

.beaker { position:relative; width:130px; height:170px; margin:0 auto; border:5px solid #9fb1b7; border-top:0; border-radius:0 0 25px 25px; }
.liquid { position:absolute; left:5px; right:5px; bottom:5px; height:72%; background:rgba(118,184,255,.35); border-radius:0 0 17px 17px; }
.particle-cloud { position:relative; height:170px; overflow:hidden; background:#eef0e9; border-radius:13px; }
.particle { position:absolute; display:grid; place-items:center; width:24px; height:24px; border-radius:50%; color:#fff; background:var(--d-blue); font-size:8px; font-weight:800; transition:.3s; }
.particle.alt { background:var(--d-orange); }
.particle.neutral { background:#728078; }
.symbol-box { display:grid; min-height:170px; place-items:center; padding:15px; background:#f4f2e8; border-radius:13px; font-family:Georgia,serif; font-size:20px; text-align:center; }

.feedback-loop { position:relative; height:230px; max-width:640px; margin:0 auto; }
.feedback-node { position:absolute; display:grid; place-items:center; width:120px; min-height:54px; padding:8px; background:#fff; border:2px solid var(--d-blue); border-radius:14px; font-size:11px; text-align:center; }
.feedback-node.active { background:#e2f1ff; box-shadow:0 0 0 5px rgba(118,184,255,.2); }
.feedback-link { position:absolute; height:2px; background:#89978f; transform-origin:left center; }

.terrain-scene { position:relative; height:250px; overflow:hidden; background:linear-gradient(#d9edf7 0 52%,#e6e2ce 52%); border-radius:16px; }
.mountain { position:absolute; bottom:0; width:0; height:0; border-left:120px solid transparent; border-right:120px solid transparent; border-bottom:170px solid #8da177; }
.mountain.one { left:8%; }
.mountain.two { right:3%; border-bottom-color:#718b68; }
.basin { position:absolute; left:38%; right:34%; bottom:0; height:48px; background:#b3a783; border-radius:0 0 45% 45%; }
.air-path { position:absolute; left:2%; top:44%; width:62%; height:5px; background:var(--d-blue); transform:rotate(-12deg); transform-origin:left; }
.air-path::after { content:""; position:absolute; right:-4px; top:-6px; border-left:13px solid var(--d-blue); border-top:8px solid transparent; border-bottom:8px solid transparent; }
.rain { position:absolute; left:31%; top:25%; color:#357ca6; font-size:26px; letter-spacing:3px; opacity:0; transition:.25s; }
.rain.show { opacity:1; }

.scale-grid { display:grid; grid-template-columns:repeat(var(--cols,8),1fr); gap:3px; max-width:640px; margin:0 auto; }
.scale-cell { aspect-ratio:1; display:grid; place-items:center; color:transparent; background:#dfe6d8; border-radius:3px; font-size:8px; }
.scale-cell.hot { background:var(--d-orange); }
.scale-cell.aggregate { color:var(--d-ink); outline:2px solid var(--d-navy); }

.flow-field { position:relative; height:250px; background:linear-gradient(140deg,#dbe7d6,#edf0e8); border-radius:16px; }
.flow-place { position:absolute; display:grid; place-items:center; width:74px; height:74px; background:#fff; border:2px solid var(--d-navy); border-radius:50%; font-size:10px; text-align:center; z-index:2; }
.flow-line { position:absolute; height:var(--w,5px); background:var(--d-blue); border-radius:999px; transform-origin:left; opacity:.75; }

.pedagogy-shell { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(220px,.8fr); gap:14px; }
.pedagogy-rail { padding:15px; background:var(--d-navy); border-radius:14px; color:#fff; }
.pedagogy-rail h3 { margin:0 0 12px; font-size:13px; }
.ped-step { padding:10px 11px; color:#9fb1b8; border-left:2px solid #40566a; font-size:11px; line-height:1.4; }
.ped-step.active { color:#fff; border-color:var(--d-acid); background:rgba(199,243,107,.08); }
.commit-box { margin-top:14px; padding:12px; color:var(--d-ink); background:#fff; border-radius:10px; }
.commit-box strong { display:block; margin-bottom:8px; font-size:11px; }

.workflow-shell { display:grid; grid-template-columns:minmax(0,1.5fr) minmax(270px,.75fr); gap:14px; }
.workflow-side { display:grid; gap:10px; }
.trace-card { padding:14px; background:#f2f3ec; border:1px solid var(--d-line); border-radius:12px; }
.trace-card h3 { margin:0 0 8px; font-size:12px; }
.trace-event { padding:8px 0; color:var(--d-muted); border-bottom:1px solid var(--d-line); font-family:ui-monospace,monospace; font-size:10px; line-height:1.45; }
.trace-event:last-child { border-bottom:0; }
.layer-stack { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
.layer-chip { padding:5px 7px; background:#e8eae3; border-radius:7px; font-size:9px; font-weight:800; }
.layer-chip.active { color:#fff; background:var(--d-navy); }

@media (max-width:760px) {
  .demo-grid,.source-row,.pedagogy-shell,.workflow-shell { grid-template-columns:1fr; }
  .argument-board { grid-template-columns:1fr; }
  .argument-arrow { transform:rotate(90deg); }
  .choice-grid { grid-template-columns:1fr; }
  .demo-canvas { padding:14px; }
}

@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
````

## File: assets/site.css
````css
:root {
  --ink: #17211c;
  --muted: #68736c;
  --paper: #f6f4ec;
  --paper-strong: #fffdf7;
  --line: #d9d8ce;
  --navy: #12273a;
  --navy-soft: #1c3b53;
  --acid: #c7f36b;
  --orange: #ff9b65;
  --blue: #76b8ff;
  --violet: #b9a0ff;
  --shadow: 0 22px 60px rgba(23, 33, 28, 0.11);
  --radius-lg: 28px;
  --radius-md: 18px;
  --radius-sm: 11px;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--ink);
  background: var(--paper);
  font-synthesis: none;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(circle at 10% 0%, rgba(199, 243, 107, .12), transparent 22rem),
    linear-gradient(180deg, #f9f7ef 0%, var(--paper) 100%);
}

button, input { font: inherit; }

button, a { -webkit-tap-highlight-color: transparent; }

a { color: inherit; }

.site-shell { min-height: 100vh; }

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px clamp(20px, 4vw, 64px);
  color: #f8faee;
  background: rgba(18, 39, 58, .94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255,255,255,.11);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  font-weight: 760;
  letter-spacing: -.02em;
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  color: var(--navy);
  background: var(--acid);
  border-radius: 10px 10px 3px 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
}

.topbar-note { color: #c3d0d5; font-size: 13px; }

.hero {
  position: relative;
  overflow: hidden;
  padding: 88px clamp(20px, 5vw, 78px) 58px;
  color: #f7f8ed;
  background: var(--navy);
}

.hero::after {
  content: "";
  position: absolute;
  right: -9rem;
  top: -12rem;
  width: 38rem;
  height: 38rem;
  border: 1px solid rgba(199, 243, 107, .34);
  border-radius: 50%;
  box-shadow: 0 0 0 72px rgba(199,243,107,.04), 0 0 0 144px rgba(199,243,107,.025);
}

.hero-inner { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: var(--acid);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.eyebrow::before { content: ""; width: 24px; height: 2px; background: currentColor; }

.hero h1 {
  max-width: 850px;
  margin: 0;
  font-family: Georgia, "Songti SC", serif;
  font-size: clamp(44px, 7vw, 88px);
  font-weight: 500;
  line-height: .98;
  letter-spacing: -.055em;
}

.hero h1 span { color: var(--acid); }

.hero-copy {
  max-width: 760px;
  margin: 28px 0 34px;
  color: #cbd6d5;
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.65;
}

.search-wrap {
  display: flex;
  align-items: center;
  max-width: 760px;
  padding: 8px 10px 8px 18px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 14px 32px rgba(0,0,0,.2);
}

.search-wrap:focus-within { outline: 3px solid rgba(199,243,107,.42); }

.search-icon { color: #6e7b74; margin-right: 12px; }

.search-wrap input {
  min-width: 0;
  flex: 1;
  padding: 10px 0;
  color: var(--ink);
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 16px;
}

.keycap {
  padding: 7px 10px;
  color: #62716a;
  background: #f0f1eb;
  border: 1px solid #dcdfd6;
  border-radius: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
}

.hero-stats { display: flex; flex-wrap: wrap; gap: 26px; margin-top: 32px; }

.stat { display: flex; align-items: baseline; gap: 8px; }
.stat strong { color: #fff; font-size: 26px; }
.stat span { color: #9bafb5; font-size: 13px; }

.main { max-width: 1320px; margin: 0 auto; padding: 56px clamp(18px, 4vw, 56px) 90px; }

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.section-head h2 {
  margin: 0;
  font-family: Georgia, "Songti SC", serif;
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 500;
  letter-spacing: -.035em;
}

.section-head p { max-width: 560px; margin: 0; color: var(--muted); line-height: 1.6; }

.subject-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.subject-card {
  position: relative;
  min-height: 190px;
  overflow: hidden;
  padding: 22px;
  color: var(--ink);
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}

.subject-card:hover, .subject-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--subject-color, var(--navy));
  outline: 0;
}

.subject-card::after {
  content: attr(data-index);
  position: absolute;
  right: 10px;
  bottom: -30px;
  color: color-mix(in srgb, var(--subject-color) 16%, transparent);
  font-family: Georgia, serif;
  font-size: 112px;
  line-height: 1;
}

.subject-card .pill { background: color-mix(in srgb, var(--subject-color) 16%, white); }
.subject-card h3 { margin: 32px 0 8px; font-size: 24px; }
.subject-card p { position: relative; z-index: 1; margin: 0; color: var(--muted); font-size: 13px; line-height: 1.55; }

.pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  background: #eceee6;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.review-stage { margin-top: 62px; }

.frame-shell {
  overflow: hidden;
  background: #dfe4dc;
  border: 1px solid #c9cec5;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.frame-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #edf0e9;
  border-bottom: 1px solid #ccd2c9;
}

.frame-dot { width: 10px; height: 10px; background: #bdc5bc; border-radius: 50%; }
.frame-path { margin-left: 8px; color: #69756e; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
.frame-open { margin-left: auto; color: var(--navy); font-size: 12px; font-weight: 750; text-decoration: none; }

.subject-frame { display: block; width: 100%; height: 760px; border: 0; background: var(--paper); }

.type-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 28px 0 20px; }

.filter-button {
  padding: 9px 13px;
  color: var(--ink);
  background: #fffdf7;
  border: 1px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
}

.filter-button.active { color: #fff; background: var(--navy); border-color: var(--navy); }

.search-results {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
  min-height: 90px;
}

.result-card {
  display: block;
  padding: 18px;
  background: var(--paper-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.result-card:hover { border-color: var(--navy); }
.result-card h3 { margin: 12px 0 8px; font-size: 17px; }
.result-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.55; }
.result-meta { display: flex; justify-content: space-between; color: var(--muted); font-size: 11px; }

.empty-state {
  grid-column: 1 / -1;
  padding: 34px;
  color: var(--muted);
  border: 1px dashed #bdc4bb;
  border-radius: var(--radius-md);
  text-align: center;
}

.method-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 62px; }

.method-card { padding: 22px; color: #eef5ef; background: var(--navy); border-radius: var(--radius-md); }
.method-card:nth-child(2) { background: #284d47; }
.method-card:nth-child(3) { background: #503e62; }
.method-card h3 { margin: 28px 0 8px; font-size: 20px; }
.method-card p { margin: 0; color: #c5d3d1; font-size: 13px; line-height: 1.6; }
.method-card .pill { color: var(--navy); background: var(--acid); }

.footer-note { margin-top: 64px; padding-top: 24px; color: var(--muted); border-top: 1px solid var(--line); font-size: 12px; line-height: 1.6; }

/* Subject pages */
.subject-body { --subject-color: var(--acid); background: var(--paper); }

.subject-hero {
  padding: 62px clamp(20px, 5vw, 70px) 46px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--subject-color) 24%, var(--navy)), var(--navy) 72%);
  color: #fff;
}

.subject-hero-inner { max-width: 1160px; margin: 0 auto; }
.subject-kicker { color: var(--subject-color); font-size: 11px; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; }
.subject-hero h1 { margin: 16px 0 12px; font-family: Georgia, "Songti SC", serif; font-size: clamp(42px, 8vw, 72px); font-weight: 500; letter-spacing: -.05em; }
.subject-hero p { max-width: 800px; margin: 0; color: #c7d3d5; font-size: 16px; line-height: 1.65; }
.subject-metrics { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
.subject-metrics span { padding: 7px 10px; color: #eaf1ef; background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.12); border-radius: 8px; font-size: 11px; }

.subject-main { max-width: 1160px; margin: 0 auto; padding: 32px clamp(18px, 4vw, 48px) 72px; }

.subject-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 0;
  background: rgba(246,244,236,.94);
  backdrop-filter: blur(14px);
}

.subject-nav button { white-space: nowrap; }

.layer-section { scroll-margin-top: 70px; margin-top: 48px; }
.layer-title { display: grid; grid-template-columns: auto 1fr; gap: 15px; align-items: start; margin-bottom: 18px; }
.layer-number { display: grid; width: 38px; height: 38px; place-items: center; color: var(--navy); background: var(--subject-color); border-radius: 12px 12px 4px 12px; font-weight: 850; }
.layer-title h2 { margin: 0; font-family: Georgia, "Songti SC", serif; font-size: 29px; font-weight: 500; }
.layer-title p { margin: 5px 0 0; color: var(--muted); font-size: 13px; }

.asset-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.live-grid { grid-template-columns: 1fr; }
.asset-card { padding: 20px; background: var(--paper-strong); border: 1px solid var(--line); border-radius: var(--radius-md); }
.asset-card h3 { margin: 13px 0 8px; font-size: 18px; }
.asset-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.6; }
.asset-card dl { display: grid; grid-template-columns: 110px 1fr; gap: 8px 12px; margin: 18px 0 0; font-size: 12px; }
.asset-card dt { color: var(--muted); }
.asset-card dd { margin: 0; line-height: 1.5; }
.role-chip { display: inline-flex; padding: 4px 7px; color: var(--navy); background: color-mix(in srgb, var(--subject-color) 50%, white); border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; font-weight: 850; }
.keyword-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 15px; }
.keyword { padding: 4px 7px; color: #526059; background: #eef0e9; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }

.skill-card { border-left: 5px solid var(--subject-color); }
.skill-contract { margin-top: 16px; padding: 13px; background: #f0f1e9; border-radius: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; line-height: 1.65; white-space: pre-wrap; }

.worked-example { overflow: hidden; background: var(--paper-strong); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.example-head { display: grid; grid-template-columns: 1fr auto; gap: 20px; padding: 25px; background: color-mix(in srgb, var(--subject-color) 18%, white); }
.example-head h3 { margin: 8px 0; font-family: Georgia, "Songti SC", serif; font-size: 30px; font-weight: 500; }
.example-head p { max-width: 760px; margin: 0; color: var(--muted); line-height: 1.6; }
.authority { align-self: start; padding: 7px 10px; background: rgba(255,255,255,.72); border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }
.example-body { padding: 25px; }

.state-flow { display: flex; align-items: stretch; gap: 7px; overflow-x: auto; padding-bottom: 8px; }
.state-step { min-width: 132px; flex: 1; padding: 14px; background: #f0f1e9; border-radius: 10px; font-size: 12px; line-height: 1.45; }
.state-arrow { display: grid; place-items: center; color: #87928b; }

.evidence-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 20px; }
.evidence-box { padding: 15px; border: 1px solid var(--line); border-radius: 12px; }
.evidence-box strong { display: block; margin-bottom: 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
.evidence-box ul { margin: 0; padding-left: 17px; color: var(--muted); font-size: 12px; line-height: 1.6; }
.evidence-box.observation strong { color: #246d62; }
.evidence-box.hypothesis strong { color: #875b2f; }
.evidence-box.probe strong { color: #5b4b99; }

.anti-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
.anti-card { padding: 18px; border-radius: 13px; }
.anti-card.bad { background: #fff0e8; border: 1px solid #f2c7b1; }
.anti-card.fix { background: #eef7dd; border: 1px solid #cfdfa9; }
.anti-card h4 { margin: 0 0 8px; }
.anti-card p { margin: 0; color: #536058; font-size: 13px; line-height: 1.6; }

.condition-list { display: grid; gap: 8px; margin-top: 18px; }
.condition-item { display: grid; grid-template-columns: 170px 1fr; gap: 12px; padding: 12px 14px; background: #f4f3ec; border-radius: 10px; font-size: 12px; line-height: 1.5; }
.condition-item strong { color: var(--muted); }

.provenance-strip { margin-top: 18px; padding: 13px 15px; color: #637068; background: #ebece5; border-radius: 10px; font-size: 11px; line-height: 1.55; }

.live-asset { overflow: hidden; background: var(--paper-strong); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.live-asset-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 13px 16px; background: color-mix(in srgb, var(--subject-color) 13%, white); border-bottom: 1px solid var(--line); }
.live-asset-head h3 { margin: 0; font-size: 15px; }
.live-asset-head a { color: var(--navy); font-size: 11px; font-weight: 800; text-decoration: none; }
.live-demo-frame { display: block; width: 100%; height: 540px; border: 0; background: #f7f5ed; }
.live-demo-frame.pedagogy { height: 690px; }
.live-demo-frame.example { height: 760px; }
.asset-explanation { border-top: 1px solid var(--line); }
.asset-explanation summary { padding: 13px 16px; color: var(--muted); cursor: pointer; font-size: 12px; font-weight: 750; }
.asset-explanation[open] summary { color: var(--ink); background: #f3f3ec; }
.asset-explanation-body { padding: 0 18px 18px; }
.skill-links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.skill-links a { padding: 6px 8px; color: var(--navy); background: color-mix(in srgb, var(--subject-color) 18%, white); border-radius: 7px; font-size: 10px; font-weight: 750; text-decoration: none; }

@media (max-width: 980px) {
  .subject-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .search-results, .method-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .subject-frame { height: 720px; }
}

@media (max-width: 700px) {
  .topbar-note, .keycap { display: none; }
  .hero { padding-top: 58px; }
  .section-head { align-items: start; flex-direction: column; }
  .subject-grid, .search-results, .method-grid, .asset-grid, .evidence-grid, .anti-grid { grid-template-columns: 1fr; }
  .subject-frame { height: 680px; }
  .example-head { grid-template-columns: 1fr; }
  .condition-item { grid-template-columns: 1fr; }
  .live-demo-frame { height: 620px; }
  .live-demo-frame.pedagogy, .live-demo-frame.example { height: 820px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; }
}
````

## File: assets/subject.js
````javascript
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
````

## File: catalog/content/records.js
````javascript
window.EDUOS_CONTENT = [
  {id:"history-constraint-map",type:"content",subject:"history",title:"Decision-time Constraint Map",role:"RC",summary:"只呈现历史行动者当时可获得的地理、兵力、联盟与不确定情报。",target:"赤壁之战中的决策条件",representation:"地图 + 约束卡 + 不确定性标记",domainMove:"把事后叙述还原成当时的信息状态。",codingSurface:"可缩放地图、证据抽屉、分阶段 reveal。",when:"空间位置会改变历史选择时。",not:"不是人物百科地图，也不是事件插图。",keywords:["contingency","map","constraints","decision-time"],provenance:"mixed"},
  {id:"history-source-board",type:"content",subject:"history",title:"Source Provenance Board",role:"RC",summary:"并列来源、作者位置、时间距离和具体主张，让证据差异可检查。",target:"一手／二手史料与叙述立场",representation:"来源卡 + claim 对齐 + provenance 标签",domainMove:"先问谁在什么位置说，再问内容是否可信。",codingSurface:"卡片排序、出处延迟揭示、claim 高亮。",when:"目标是 sourcing、corroboration 或立场判断。",not:"不是把几段材料放进轮播图。",keywords:["sourcing","provenance","corroboration","stance"],provenance:"v0_inference"},
  {id:"history-causal-weight-graph",type:"content",subject:"history",title:"Causal Weight Graph",role:"RC",summary:"让军事、政治、地理、疾病等原因的相对解释力能够被赋权与修订。",target:"多因历史解释",representation:"因果节点 + 权重 + 反事实切换",domainMove:"区分原因存在与原因重要程度。",codingSurface:"滑杆、依赖边、before/after 权重比较。",when:"目标是事后因果解释或反事实。",not:"不是所有原因等权的思维导图。",keywords:["causality","counterfactual","weight","graph"],provenance:"mixed"},

  {id:"chinese-layered-text",type:"content",subject:"chinese",title:"Layered Text",role:"RC",summary:"在原文上按需叠加词义、句法、语境和文化层，不一次性替学生完成解释。",target:"文言理解与阅读支持",representation:"原文锚点 + 可开关支持层",domainMove:"把理解障碍定位到具体词、结构或语境。",codingSurface:"行内批注、层级开关、支持使用日志。",when:"阅读门槛妨碍后续解释时。",not:"不是整段白话翻译覆盖原文。",keywords:["文言","layered text","syntax","context"],provenance:"conversation_given"},
  {id:"chinese-emotion-river",type:"content",subject:"chinese",title:"Emotion River",role:"RC",summary:"把情绪转折作为可争论的时序曲线，并始终与原文证据相连。",target:"《赤壁赋》等文本的情绪结构",representation:"段落轴 + 相对强度曲线 + 引文锚点",domainMove:"提出情绪轨迹并用措辞支持，而非只贴情绪标签。",codingSurface:"拖动节点、引文连接、同伴曲线叠加。",when:"顺序和转折本身是解释对象。",not:"不是预填 happy/sad emoji 的装饰波浪。",keywords:["赤壁赋","emotion river","evidence","turning point"],provenance:"conversation_given"},
  {id:"chinese-text-surgery",type:"content",subject:"chinese",title:"Text Surgery",role:"RC",summary:"删除、替换或重排一个语言特征，再比较意义、节奏或语气的变化。",target:"修辞、句式与表达效果",representation:"原句／改句同步差异视图",domainMove:"通过受控改写显露形式与效果的关系。",codingSurface:"词块替换、diff 高亮、朗读 A/B。",when:"目标是修辞或语言选择的效果。",not:"不是自由改写器或自动润色器。",keywords:["rhetoric","revision","diff","sentence"],provenance:"conversation_given"},

  {id:"civics-near-miss-materials",type:"content",subject:"civics",title:"Near-miss Material Pair",role:"RC",summary:"保持政府等表面提示不变，只改变决定概念归属的主体行为。",target:"政治概念边界",representation:"句式对齐的两张材料卡",domainMove:"控制变量式地区分关键词匹配与概念判断。",codingSurface:"同步高亮、decisive phrase 选择、二次 pair。",when:"学生似乎依赖关键词分类。",not:"不是两道随机的困难选择题。",keywords:["near miss","concept boundary","依法行政","keyword"],provenance:"mixed"},
  {id:"civics-principle-collision",type:"content",subject:"civics",title:"Principle Collision Matrix",role:"RC",summary:"把同一政策对不同原则、权利与责任的支持和张力并列呈现。",target:"政策权衡与规范冲突",representation:"原则 × 方案矩阵 + 证据格",domainMove:"承认原则可能同时相关，再要求说明优先次序。",codingSurface:"权重、证据引用、利益相关者切换。",when:"没有单一关键词能直接决定结论。",not:"不是给每个政策贴唯一正确原则。",keywords:["trade-off","principle","policy","stakeholder"],provenance:"v0_inference"},
  {id:"civics-argument-bridge",type:"content",subject:"civics",title:"Claim–Evidence–Warrant Bridge",role:"RC",summary:"显示观点、材料证据和解释桥之间缺失或错配的位置。",target:"政治材料论证",representation:"三段式 argument board",domainMove:"不把摘抄材料当成已经完成论证。",codingSurface:"拖放关系、缺失桥提示、反例插入。",when:"学生有证据但解释不到原则。",not:"不是万能作文模板。",keywords:["claim","evidence","warrant","argument"],provenance:"v0_inference"},

  {id:"math-balance-transform",type:"content",subject:"mathematics",title:"Equality-preserving Balance",role:"RC",summary:"同步显示方程两边进行同一操作，突出等式保持而非换边口诀。",target:"一元一次方程的等价变形",representation:"符号步骤 + 可选天平对应",domainMove:"把每一步解释为保持解集的操作。",codingSurface:"同步动画、操作按钮、代回检查。",when:"目标是解释等式不变量。",not:"不是用天平替代所有符号推理。",keywords:["equation","balance","invariant","algebra"],provenance:"mixed"},
  {id:"math-error-lines",type:"content",subject:"mathematics",title:"Aligned Solution Lines",role:"RC",summary:"逐行对齐两份相似解法，使第一处不合法变形可被准确定位。",target:"代数错误辨析",representation:"并排步骤 + 行级选择",domainMove:"寻找 first invalid step，而不只判断最终答案。",codingSurface:"行锁定、规则标注、substitution check。",when:"需要区分概念错误和计算 slip。",not:"不是提前用红绿颜色标答案。",keywords:["error microscope","first invalid step","algebra"],provenance:"mixed"},
  {id:"math-parameter-intersection",type:"content",subject:"mathematics",title:"Parameter–Graph–Equation Link",role:"RC",summary:"参数、图像与方程解同步变化，支持先预测再拖动。",target:"函数与方程的表示协调",representation:"滑杆 + 图像 + 代数表达",domainMove:"把参数变化解释为图像结构变化。",codingSurface:"实时绘图、预测 ghost、intersection 标记。",when:"目标是连接多个数学表示。",not:"不是只供观看的 graphing demo。",keywords:["function","parameter","graph","equation"],provenance:"mixed"},

  {id:"physics-force-scene",type:"content",subject:"physics",title:"System-boundary Force Scene",role:"RC",summary:"先明确研究系统，再把场景中的外部相互作用映射为受力箭头。",target:"受力分析",representation:"场景 + 系统边界 + 自由体图",domainMove:"每个力必须有外部作用源。",codingSurface:"圈选系统、箭头生成、source 标签。",when:"学生把运动、速度或反作用力混入受力图。",not:"不是拖箭头匹配隐藏图片。",keywords:["free body diagram","system boundary","force"],provenance:"mixed"},
  {id:"physics-motion-linked-views",type:"content",subject:"physics",title:"Motion–Graph–Equation Triplet",role:"RC",summary:"同一运动同时以场景、图像和方程呈现，并允许缺失一层让学生补全。",target:"运动学表示协调",representation:"运动动画 + x–t/v–t 图 + 方程",domainMove:"用斜率、截距和趋势建立跨表示映射。",codingSurface:"同步时间游标、ghost prediction、方程选择。",when:"会算但无法解释图像，或相反。",not:"不是三个互不关联的面板。",keywords:["motion","graph","equation","slope"],provenance:"conversation_given"},
  {id:"physics-measurement-strip",type:"content",subject:"physics",title:"Measurement & Uncertainty Strip",role:"RC",summary:"并列原始测量、估计区间和模型预测，不把实验读数显示成绝对真值。",target:"实验数据与不确定性",representation:"测量轨迹 + 误差带 + 模型线",domainMove:"比较差异是否大于测量不确定度。",codingSurface:"重复测量、误差条、残差视图。",when:"目标是实验推理而非理想模型演示。",not:"不是给仪器加随机噪声的动画。",keywords:["measurement","uncertainty","residual","experiment"],provenance:"v0_inference"},

  {id:"chemistry-three-level",type:"content",subject:"chemistry",title:"Macro–Micro–Symbol Linked View",role:"RC",summary:"同步组织可观察现象、粒子变化与符号表达，并要求跨层映射。",target:"化学表征协调",representation:"烧杯现象 + 粒子模型 + 方程",domainMove:"区分观察、模型解释与符号记述。",codingSurface:"联动高亮、隐藏一层、粒子到符号连线。",when:"学生会写方程但解释不了粒子变化。",not:"不是三张图同时出现就算对齐。",keywords:["macro","micro","symbol","particle","equation"],provenance:"conversation_given"},
  {id:"chemistry-particle-collision",type:"content",subject:"chemistry",title:"Particle Event Sequence",role:"RC",summary:"以离散事件显示碰撞、键变化与产物形成，避免连续魔法式 morph。",target:"反应微观机制",representation:"粒子事件帧 + 守恒计数",domainMove:"用粒子身份与数量解释反应。",codingSurface:"逐帧推进、物种过滤、守恒计数器。",when:"微观机制对宏观现象有解释价值。",not:"不是漂亮但不守恒的粒子动画。",keywords:["particle","reaction","conservation","mechanism"],provenance:"v0_inference"},
  {id:"chemistry-equilibrium-shift",type:"content",subject:"chemistry",title:"Equilibrium Perturbation View",role:"RC",summary:"把正逆反应速率、粒子群与宏观浓度在扰动前后联动。",target:"化学平衡",representation:"速率曲线 + 粒子状态 + 浓度面板",domainMove:"解释新平衡如何形成，而非只背移动方向。",codingSurface:"扰动控制、预测锁定、动态曲线。",when:"目标是平衡机制与预测。",not:"不是勒夏特列原理关键词选择器。",keywords:["equilibrium","perturbation","rate","concentration"],provenance:"v0_inference"},

  {id:"biology-feedback-loop",type:"content",subject:"biology",title:"Feedback Loop + Variable Trace",role:"RC",summary:"将组件关系和随时间变化的变量轨迹并列，避免把圆形图当成机制。",target:"生理调节与反馈",representation:"因果环 + 时间曲线",domainMove:"追踪扰动、检测、响应和恢复之间的符号关系。",codingSurface:"变量扰动、关系编辑、时间 trace。",when:"目标是系统调节的因果机制。",not:"不是顺时针播放的定义动画。",keywords:["feedback","homeostasis","variable trace","system"],provenance:"conversation_given"},
  {id:"biology-genetics-model",type:"content",subject:"biology",title:"Inheritance Model Revision",role:"RC",summary:"从家系或后代数据出发，让学生修订等位基因与概率模型。",target:"遗传模式与证据",representation:"家系／交配结果 + 模型假设",domainMove:"用数据区分多个遗传解释。",codingSurface:"模型选择、预测区间、反例个体 reveal。",when:"目标是模型选择，不只是 Punnett square 操作。",not:"不是已知模型下的机械填格。",keywords:["genetics","model revision","pedigree","probability"],provenance:"v0_inference"},
  {id:"biology-experiment-variables",type:"content",subject:"biology",title:"Experiment Variable Canvas",role:"RC",summary:"把处理、响应、控制变量和可能混杂安排进一个可检查实验结构。",target:"生物实验设计",representation:"实验组结构 + 数据预览",domainMove:"让因果主张对应可区分的实验比较。",codingSurface:"变量槽位、组间对齐、伪数据 preview。",when:"目标是设计或评价实验。",not:"不是通用项目管理画布。",keywords:["experiment","control variable","causal inference"],provenance:"v0_inference"},

  {id:"geography-terrain-path",type:"content",subject:"geography",title:"Terrain Cross-section + Moisture Path",role:"RC",summary:"把平面路径与垂直地形剖面连起来，显露气流抬升和阻挡。",target:"四川盆地气候因果解释",representation:"定位图 + 剖面 + 水汽路径",domainMove:"用空间关系构建气候因果链。",codingSurface:"路径绘制、剖面对齐、uplift 标注。",when:"地形位置在解释中具有因果作用。",not:"不是旋转 3D 地形加城市事实。",keywords:["四川盆地","terrain","moisture path","climate"],provenance:"mixed"},
  {id:"geography-multiscale",type:"content",subject:"geography",title:"Multi-scale Place Comparator",role:"RC",summary:"同一现象在社区、区域与国家尺度切换，并显式显示尺度变化带来的解释损失。",target:"地理尺度推理",representation:"同步多尺度地图 + 指标",domainMove:"区分现象变化与聚合尺度变化。",codingSurface:"尺度切换、区域聚合、可比指标锁定。",when:"结论会随空间尺度改变。",not:"不是普通地图缩放。",keywords:["scale","aggregation","map","comparison"],provenance:"v0_inference"},
  {id:"geography-flow-map",type:"content",subject:"geography",title:"Human Flow & Constraint Map",role:"RC",summary:"把人口或资源流动与机会、成本和边界条件联动。",target:"人口迁移与人文地理",representation:"流线 + 来源／目的地 + 约束层",domainMove:"解释流动为何发生，而非只显示数量。",codingSurface:"流线筛选、情景变量、stakeholder view。",when:"目标是人地关系和空间选择。",not:"不是越粗越重要的装饰流线图。",keywords:["migration","flow","human geography","constraint"],provenance:"v0_inference"}
];
````

## File: catalog/pedagogy/records.js
````javascript
window.EDUOS_PEDAGOGY = [
  {id:"history-decision-under-uncertainty",type:"pedagogy",subject:"history",title:"Decision under Historical Uncertainty",role:"PI",summary:"把学习者放回结果尚未知的信息状态，先权衡约束再看后来证据。",mechanism:"commit → progressive evidence → re-weight → outcome",native:"历史行动者只能使用当时可获得且可信度不一的信息。",conditions:"目标是 contingency；选择确实受约束；后续证据能改变判断。",notWhen:"只需时序、人物或事实复习。",adaptation:"无设备时改成同步投票卡，但保留 reveal 前承诺。",keywords:["commit-before-reveal","contingency","evidence"],provenance:"conversation_given"},
  {id:"history-source-corroboration",type:"pedagogy",subject:"history",title:"Sourcing before Agreement",role:"PI",summary:"先判断来源位置和可知范围，再比较材料是否相互印证。",mechanism:"source position → claim extraction → corroborate/conflict → bounded conclusion",native:"史料不是透明事实容器；沉默、距离和立场都影响可用性。",conditions:"材料之间存在真实的来源差异。",notWhen:"多份材料只是重复同一教材叙述。",adaptation:"初学者先比较两份材料和一个 claim。",keywords:["sourcing","corroboration","provenance"],provenance:"v0_inference"},

  {id:"chinese-evidence-constrained-reading",type:"pedagogy",subject:"chinese",title:"Evidence-constrained Interpretation",role:"PI",summary:"允许多种文本解释，但要求每个判断落回措辞、结构或语境证据。",mechanism:"provisional reading → quote → explain wording → compare → revise",native:"文本解释可以开放，证据约束不能消失。",conditions:"文本存在可辩护的解释空间，且学生能接触原文。",notWhen:"主要障碍仍是基本字词和句法。",adaptation:"弱读者先加 Layered Text，只缩小文本范围，不取消证据。",keywords:["interpretation","text evidence","revision"],provenance:"mixed"},
  {id:"chinese-text-surgery-method",type:"pedagogy",subject:"chinese",title:"Controlled Text Surgery",role:"PI",summary:"只改一个语言特征，通过 A/B 差异推理其表达效果。",mechanism:"commit effect → controlled change → compare → justify",native:"改动必须保持其他语境尽量稳定。",conditions:"目标是句式、词语、修辞或节奏作用。",notWhen:"目标是自由创作或整体润色。",adaptation:"时间短时只做一个词或一个倒装。",keywords:["text surgery","rhetoric","controlled contrast"],provenance:"conversation_given"},

  {id:"civics-near-miss-discrimination",type:"pedagogy",subject:"civics",title:"Concept-boundary Near Miss",role:"PI",summary:"保持诱人的关键词不变，只改变决定概念归属的一项特征。",mechanism:"classify pair → mark decisive phrase → probe simpler pair",native:"政治概念常由主体、行为、关系与制度位置共同限定。",conditions:"存在稳定的课程概念边界和可控制的最小对照。",notWhen:"争议本身没有唯一课程边界。",adaptation:"阅读负荷高时先对齐句式和词长。",keywords:["near miss","boundary","keyword reliance"],provenance:"conversation_given"},
  {id:"civics-principle-deliberation",type:"pedagogy",subject:"civics",title:"Principle Collision Deliberation",role:"PI",summary:"让学生比较多个原则对同一政策的相关性、优先级与代价。",mechanism:"stakeholder view → principle claims → evidence → trade-off statement",native:"规范判断需要说明优先依据，而非找到一个关键词。",conditions:"任务确实涉及原则冲突或政策代价。",notWhen:"问题只是定义识别。",adaptation:"五分钟版只保留两个原则和一个利益相关者。",keywords:["deliberation","trade-off","principle"],provenance:"v0_inference"},

  {id:"math-first-invalid-step",type:"pedagogy",subject:"mathematics",title:"First Invalid Step",role:"PI",summary:"比较相近解法，定位第一处不保持数学关系的变形。",mechanism:"inspect → select line → name invariant → test → transfer",native:"错误定位围绕等价、定义域、守恒或逻辑有效性。",conditions:"错误能被嵌入看似合理的步骤序列。",notWhen:"学生完全没有所需先备程序。",adaptation:"先移除负数等次要负荷，保留同一不变量。",keywords:["error microscope","invariant","diagnostic"],provenance:"conversation_given"},
  {id:"math-representation-coordination",type:"pedagogy",subject:"mathematics",title:"Predict before Representation Shift",role:"PI",summary:"在图像、符号或数值表示切换前先保存预测，再检查映射。",mechanism:"inspect A → predict B → reveal B → explain mapping → revise",native:"映射依赖斜率、参数、结构或不变量，而非视觉相似。",conditions:"两种表示共享明确的数学对象。",notWhen:"第二种表示只是第一种的装饰重复。",adaptation:"生成困难时提供两个 near-miss 目标表示。",keywords:["representation","prediction","graph","equation"],provenance:"mixed"},

  {id:"physics-model-construction",type:"pedagogy",subject:"physics",title:"System-first Model Construction",role:"PI",summary:"先定义系统和外部相互作用，再建立受力模型并预测后果。",mechanism:"choose system → interactions → model → predict → check",native:"力属于相互作用，不属于运动方向。",conditions:"场景足够清楚，系统边界影响模型。",notWhen:"只需介绍箭头记号。",adaptation:"低年级先不求合力大小，只辨来源和方向。",keywords:["system boundary","model construction","force"],provenance:"mixed"},
  {id:"physics-predict-observe-revise",type:"pedagogy",subject:"physics",title:"Prediction–Measurement Revision",role:"PI",summary:"在模拟或测量可见前保存模型预测，再用差异修正模型。",mechanism:"model → quantitative/qualitative prediction → observation → residual → revise",native:"观察受测量误差与理想化条件限制。",conditions:"结果确实能区分候选模型。",notWhen:"动画只是重播已知结论。",adaptation:"无传感器时使用预先记录且带不确定度的数据。",keywords:["prediction","measurement","model revision"],provenance:"v0_inference"},

  {id:"chemistry-representation-completion",type:"pedagogy",subject:"chemistry",title:"Missing Chemical Representation",role:"PI",summary:"给定宏观与微观两层，要求补全符号层并说明对应关系。",mechanism:"inspect linked levels → complete missing level → map → reveal → revise",native:"映射必须遵守物种身份、电荷与原子守恒。",conditions:"给定层足以支持缺失层的推导。",notWhen:"任务退化为记忆方程式。",adaptation:"符号生成过难时改成 near-miss 方程选择。",keywords:["macro micro symbol","completion","mapping"],provenance:"conversation_given"},
  {id:"chemistry-perturb-equilibrium",type:"pedagogy",subject:"chemistry",title:"Perturb–Predict–Reconcile",role:"PI",summary:"先预测扰动后速率和组成，再观察到达新平衡的过程。",mechanism:"baseline → perturb → signed prediction → dynamic reveal → reconcile",native:"区分瞬时速率改变与最终平衡组成。",conditions:"模型能同时显示速率与组成。",notWhen:"只需背诵规则方向。",adaptation:"先只改变浓度一个变量，不同时改变温度。",keywords:["equilibrium","perturbation","rate"],provenance:"v0_inference"},

  {id:"biology-perturb-system",type:"pedagogy",subject:"biology",title:"Perturb–Predict–Trace",role:"PI",summary:"扰动一个变量，预测下游方向与时间，再修改因果关系。",mechanism:"perturb → signed prediction → trace → edit relation → name feedback",native:"组件身份、关系符号和时间延迟都属于生物机制。",conditions:"简化模型仍保留关键生物组件。",notWhen:"用通用恒温器完全替代生物系统。",adaptation:"社交风险高时匿名保存预测。",keywords:["feedback","perturbation","systems"],provenance:"conversation_given"},
  {id:"biology-competing-models",type:"pedagogy",subject:"biology",title:"Competing Biological Models",role:"PI",summary:"让多个机制模型对同一数据作出不同预测，再用新证据淘汰模型。",mechanism:"candidate models → predictions → evidence reveal → revise/eliminate",native:"避免用功能目的语言冒充具体生物机制。",conditions:"候选模型确实有可区分预测。",notWhen:"伪备选项明显荒谬。",adaptation:"初学者保留两个模型和一个决定性数据点。",keywords:["competing models","evidence","mechanism"],provenance:"v0_inference"},

  {id:"geography-spatial-causal-chain",type:"pedagogy",subject:"geography",title:"Spatial Causal Chain",role:"PI",summary:"让学习者把路径、地形、过程和数据连成可修订的空间解释。",mechanism:"locate → trace path → predict process → check data → revise link",native:"位置和尺度必须对因果过程有实际作用。",conditions:"地图／剖面表达的是解释关系。",notWhen:"目标只是地点识记。",adaptation:"静态课件中改成编号链和教师主持的预测暂停。",keywords:["spatial causality","terrain","path","scale"],provenance:"mixed"},
  {id:"geography-scale-shift",type:"pedagogy",subject:"geography",title:"Scale-shift Explanation",role:"PI",summary:"固定现象，改变聚合尺度，比较模式与结论如何变化。",mechanism:"claim at scale A → switch scale → inspect aggregation → qualify claim",native:"尺度不是缩放控件，而是解释单位和证据分辨率。",conditions:"数据在多个可比尺度上可用。",notWhen:"只是为了地图导航。",adaptation:"低数据条件下使用三张预生成尺度快照。",keywords:["scale","aggregation","geography"],provenance:"v0_inference"}
];
````

## File: catalog/skills/records.js
````javascript
window.EDUOS_SKILLS = [
  {id:"skill-historical-intent-router",type:"skill",subject:"history",title:"historical-intent-router",role:"PS",summary:"区分时序、因果、contingency、sourcing 与 perspective，避免把所有历史内容路由成时间线。",trigger:"教师给出历史主题但没有明确学习动作，或只说‘做个可视化’。",refusal:"不因历史主题自动选择地图、时间线或角色扮演。",input:"topic, teacher_goal?, learners, time, devices, design_authority",output:"intent hypothesis, preferred artifact, rejected alternative, clarifying fork",searches:["content/history","pedagogy/history","worked-examples/history","contingency","sourcing"],keywords:["router","history","intent","artifact"],provenance:"mixed"},
  {id:"skill-historical-evidence-probe",type:"skill",subject:"history",title:"historical-evidence-probe",role:"PS",summary:"从历史选择、引文和修订中生成多个解释，并提出最便宜的下一证据。",trigger:"已有 learner commitment、source selection 或 causal weighting。",refusal:"不把与标准答案不同的选择直接标成 misconception。",input:"observations[], available_sources, target_reasoning",output:"possible_interpretations[], next_discriminating_probe",searches:["source provenance","claim evidence bridge","decision-time constraints"],keywords:["probe","evidence","history","hypothesis"],provenance:"v0_inference"},

  {id:"skill-chinese-intent-router",type:"skill",subject:"chinese",title:"chinese-text-intent-router",role:"PS",summary:"同一篇文本按文言理解、情绪结构、修辞效果或论证变化路由到不同 artifact。",trigger:"教师给出篇目但没有说要学生理解、解释还是改写什么。",refusal:"不因为已有 Emotion River 就把《赤壁赋》的所有目标都路由过去。",input:"text, instructional_intent?, learner_barrier, time",output:"Layered Text | Emotion River | Text Surgery | Evidence Board recommendation",searches:["content/chinese","same-content-different-intent","worked-examples/chinese"],keywords:["赤壁赋","router","layered text","emotion river"],provenance:"conversation_given"},
  {id:"skill-literary-evidence-probe",type:"skill",subject:"chinese",title:"literary-evidence-probe",role:"PS",summary:"区分字面理解、证据选择和解释分歧，为文本判断生成下一 probe。",trigger:"学习者提交情绪、主题、修辞效果或段意判断。",refusal:"不把另一种可辩护阅读判成错误。",input:"claim, quote?, explanation?, passage",output:"observations, possible interpretations, evidence-focused probe",searches:["Layered Text","Evidence Board","claim-with-evidence"],keywords:["text evidence","probe","interpretation"],provenance:"mixed"},

  {id:"skill-civics-boundary-probe",type:"skill",subject:"civics",title:"civics-concept-boundary-probe",role:"PS",summary:"围绕政治概念的决定性边界生成控制变量式 near-miss。",trigger:"教师怀疑学生依赖主体或关键词匹配概念。",refusal:"不生成多个无关特征同时变化的‘难题对’。",input:"target_concept, seductive_cue, decisive_feature, reading_level",output:"aligned pair, decisive phrase key, follow-up pair",searches:["near-miss","content/civics","worked-examples/civics"],keywords:["concept boundary","near miss","politics"],provenance:"mixed"},
  {id:"skill-civics-argument-repair",type:"skill",subject:"civics",title:"civics-argument-repair",role:"PS",summary:"判断政治材料回答缺失的是 claim、evidence 还是 warrant，并选择最小修复动作。",trigger:"学生已经有部分材料分析，但论证链断裂。",refusal:"不直接替学生生成完整标准答案。",input:"prompt, student_claim, cited_material, explanation",output:"observed gap, candidate interpretations, one repair prompt",searches:["claim evidence warrant","principle collision","worked examples"],keywords:["argument","warrant","repair"],provenance:"v0_inference"},

  {id:"skill-math-error-probe",type:"skill",subject:"mathematics",title:"mathematical-error-probe",role:"PS",summary:"从第一处无效步骤生成能区分不变量理解、符号处理和 slip 的 probe。",trigger:"学生提交步骤或在两种解法中做出选择。",refusal:"不从一个错误断言稳定 misconception。",input:"problem, student_steps, target_invariant, confidence?",output:"first observable divergence, hypotheses, minimal transfer item",searches:["error microscope","aligned solution lines","invariant"],keywords:["math","error","probe","first invalid step"],provenance:"conversation_given"},
  {id:"skill-math-representation-router",type:"skill",subject:"mathematics",title:"math-representation-router",role:"PS",summary:"判断该生成静态解释、linked visualization、completion task 还是 diagnostic contrast。",trigger:"已有数学内容或图形，但教学意图与 learner action 未定。",refusal:"不把所有可视化都升级成带诊断的互动练习。",input:"content, goal, existing_asset?, learner_state?, authority",output:"representation role, interaction need, reuse/synthesis decision",searches:["math visualization","content/mathematics","pedagogy/mathematics"],keywords:["representation","router","reuse","synthesis"],provenance:"mixed"},

  {id:"skill-physics-model-builder",type:"skill",subject:"physics",title:"physics-model-builder",role:"PS",summary:"从场景和目标选择系统边界、模型元素与预测 reveal。",trigger:"目标涉及力、运动或实验模型构建。",refusal:"不生成没有作用源标签的箭头匹配游戏。",input:"scene, target_system, prior_knowledge, goal",output:"representation plan, model steps, observable evidence",searches:["free body diagram","system boundary","prediction observation"],keywords:["physics","model","force","system"],provenance:"mixed"},
  {id:"skill-physics-signal-interpreter",type:"skill",subject:"physics",title:"physics-signal-interpreter",role:"PS",summary:"将受力图和运动预测拆为观察，并区分 source、vector sum 与 motion-as-force 假设。",trigger:"已有箭头、来源标签或运动预测记录。",refusal:"不因多画一个箭头就自动诊断 action–reaction confusion。",input:"system_boundary, forces[], prediction, revision",output:"possible interpretations, next scene perturbation",searches:["force model","motion linked views","measurement uncertainty"],keywords:["learner signal","physics","probe"],provenance:"v0_inference"},

  {id:"skill-chemistry-representation-router",type:"skill",subject:"chemistry",title:"chemistry-representation-router",role:"PS",summary:"决定宏观、微观、符号三层中哪些展示、隐藏或让学习者补全。",trigger:"化学内容需要解释或练习，但三层角色未定。",refusal:"不把三层并排等同于表征协调。",input:"reaction_or_system, goal, known_representation_gap, learner_level",output:"linked views, missing layer, mapping action, simplification",searches:["macro micro symbol","representation completion","content/chemistry"],keywords:["chemistry","representation","router"],provenance:"conversation_given"},
  {id:"skill-chemistry-probe",type:"skill",subject:"chemistry",title:"chemical-representation-probe",role:"PS",summary:"区分符号生成、粒子身份、守恒和跨层因果困难。",trigger:"学生选择或生成方程、粒子或现象解释。",refusal:"不把方程错误直接解释为化学机制不懂。",input:"observations across macro_micro_symbol",output:"hypotheses, one layer-reduced probe",searches:["spectator species","particle mapping","equation"],keywords:["chemistry","probe","particle","symbol"],provenance:"mixed"},

  {id:"skill-biology-system-router",type:"skill",subject:"biology",title:"biology-system-router",role:"PS",summary:"为反馈、遗传、生态或实验问题选择因果环、竞争模型或变量画布。",trigger:"教师给出生物系统但未说明要解释机制、比较模型还是设计实验。",refusal:"不把通用流程图当作生物机制。",input:"system, intent, variables, time, authority",output:"domain representation, learner action, simplification boundary",searches:["feedback loop","competing models","experiment variables"],keywords:["biology","system","router"],provenance:"v0_inference"},
  {id:"skill-biology-feedback-probe",type:"skill",subject:"biology",title:"biology-feedback-probe",role:"PS",summary:"从变量预测和关系编辑中区分符号错误、组件角色、时滞与目的论解释。",trigger:"学习者已经扰动系统或画出反馈关系。",refusal:"不把‘系统想恢复’接受为充分机制解释。",input:"perturbation, predictions, relation_edits, explanation",output:"observations, hypotheses, component-freeze probe",searches:["feedback","variable trace","mechanism versus purpose"],keywords:["feedback","probe","teleology"],provenance:"mixed"},

  {id:"skill-geography-intent-router",type:"skill",subject:"geography",title:"geography-intent-router",role:"PS",summary:"区分定位、空间比较、因果解释、尺度推理与人地流动，避免默认 3D 地图。",trigger:"教师说‘做个地理可视化’或只给出地区。",refusal:"不因地理学科自动选择地图；表示必须服务目标关系。",input:"place_or_process, goal?, scale, data, devices",output:"map/cross-section/chart/flow recommendation and rejected alternative",searches:["content/geography","spatial causal chain","scale shift"],keywords:["geography","router","map","scale"],provenance:"conversation_given"},
  {id:"skill-geography-causal-probe",type:"skill",subject:"geography",title:"spatial-causal-probe",role:"PS",summary:"区分地图／剖面读取、过程机制、来源知识和尺度混淆。",trigger:"学习者提交路径、地点、剖面标注或气候解释。",refusal:"不从一条错误路径直接诊断气候机制缺失。",input:"path, annotations, prediction, selected_data",output:"possible interpretations, simplified spatial probe",searches:["terrain cross-section","moisture path","multi-scale"],keywords:["geography","causal","probe","scale"],provenance:"mixed"}
];
````

## File: catalog/worked-examples/records.js
````javascript
window.EDUOS_EXAMPLES = [
  {id:"example-history-red-cliffs",type:"example",subject:"history",title:"Red Cliffs Decision Room",role:"WE",summary:"在结果未知时权衡历史约束，保存选择，再用新证据修订。",authority:"ai_proposed",goal:"理解孙权的选择为什么困难，而不是猜中最后胜负。",sees:"决策时点的地图、兵力、联盟、内部立场与带不确定性标签的情报。",does:"选择政策，引用两项约束，报告信心；看到一份新或冲突材料后重新赋权。",flow:["决策时证据","选择 + 两个理由","信心","新／冲突材料","修订","结果与背景"],observations:["选择的政策","引用的约束卡","reveal 前后信心","修改或保留的理由"],hypotheses:["后见之明依赖","单一因素过度赋权","来源可信度判断不足","可辩护的不同权重"],probe:"隐藏结果并替换一份互相冲突的情报，问哪项约束改变了权重。",bad:"三国地图点击孙权弹出人物简介，再问‘你会投降吗？’并立即判对错。",whyBad:"地图是装饰；选择没有信息后果；reveal 奖励的是与历史结果一致。",minimalFix:"把两个人物简介换成决策相关约束；reveal 前保存一个选择和理由。",conditions:[{if:"无学生设备",change:"投影共享地图，用彩色卡同时投票。",preserve:"先承诺、后揭示。"},{if:"目标改成史料 sourcing",change:"换成 Source Board 和出处 reveal。",preserve:"证据必须改变或限定判断。"},{if:"学生不认识行动者",change:"增加一分钟角色／约束 primer。",preserve:"仍在结果未知状态决策。"}],notThis:"不是 trivia、人物角色换皮游戏或百科地图。",keywords:["赤壁","Decision Room","contingency","commit-before-reveal"],provenance:"mixed"},
  {id:"example-chinese-chibi-fu",type:"example",subject:"chinese",title:"《赤壁赋》 Emotion River",role:"WE",summary:"把情绪转折画成可争论曲线，并用原文措辞支持或修改。",authority:"collaborative",goal:"学生不只说乐、悲、旷达，而能解释文本如何发生转折。",sees:"两段相邻原文、空白情绪轴和一个可辩护的替代曲线。",does:"标相对强度、暂定情绪、引用一句原文、解释措辞，再比较并修订。",flow:["阅读","标转折","引原文","解释措辞","比较替代曲线","修订"],observations:["曲线节点位置","情绪标签","所引原文","比较后的修订"],hypotheses:["字面理解不足","标签缺乏证据","证据选择浅","可辩护的另一阅读"],probe:"给出两句相邻原文，问哪一句改变说话者立场，并指出关键动词或意象。",bad:"预填 happy/sad emoji 的波浪，点击后看老师解释。",whyBad:"学习者没有提出解释，也没有用语言证据；曲线只是装饰。",minimalFix:"留空一个转折点；必须引用短句后才能 reveal 解释。",conditions:[{if:"字面理解不足",change:"先提供两句的词义／句法 Layered Text。",preserve:"情绪判断仍需回到原文。"},{if:"目标是修辞效果",change:"换成 Text Surgery。",preserve:"受控证据比较。"},{if:"只有 5 分钟",change:"只保留一个 turning-point pair。",preserve:"claim + quote + revision。"}],notThis:"不是测量真实情绪值，也不是唯一标准曲线。",keywords:["赤壁赋","Emotion River","text evidence","same content"],provenance:"conversation_given"},
  {id:"example-civics-boundary",type:"example",subject:"civics",title:"Concept Boundary Lab",role:"WE",summary:"用控制变量式材料对区分政治概念边界和关键词依赖。",authority:"collaborative",goal:"判断学生为何一看到政府就选依法行政。",sees:"两则都含政府主体、句式对齐，但只有一个行为属于目标概念的材料。",does:"选择原则、高亮决定性短语、给出信心，再做一组简化 near-miss。",flow:["分类 pair","高亮短语","信心","反馈","简化／迁移 pair"],observations:["选择的原则","高亮短语","信心","第二组回答"],hypotheses:["关键词依赖","主体／行为边界混淆","材料语言误读","偶然点击"],probe:"保持政府主体不变，简化句子，只改变是否行使行政权力。",bad:"五道主题各异的选择题，每题只显示红绿反馈。",whyBad:"多个特征同时变化；无法区分概念、关键词和阅读问题。",minimalFix:"替换其中两题为对齐的控制 pair，并先问决定性短语。",conditions:[{if:"阅读负荷高",change:"缩短并对齐两个材料。",preserve:"只改变一个决定性特征。"},{if:"目标改成政策权衡",change:"换成 Principle Collision Matrix。",preserve:"结论必须有规范理由。"},{if:"只有 5 分钟",change:"一组 pair + 一个按需 follow-up。",preserve:"observation 与 interpretation 分离。"}],notThis:"不是随机难题，也不是用一次错误给学生贴 misconception 标签。",keywords:["政治","near miss","concept boundary","依法行政"],provenance:"mixed"},
  {id:"example-math-error",type:"example",subject:"mathematics",title:"Equality Error Microscope",role:"WE",summary:"定位第一处破坏等式的不合法步骤，再用低符号负荷题区分原因。",authority:"collaborative",goal:"区分学生是不懂等式保持、背换边口诀，还是只发生符号 slip。",sees:"两份前几步相同、后来一份只改变等式一边的逐行解法。",does:"选择 first invalid line、说明不变量、用天平或代回检查，再完成无负数 transfer item。",flow:["比较解法","锁定第一错行","说明不变量","选择检查","低负荷 transfer"],observations:["选中的行","给出的理由","检查方法","follow-up 操作","信心"],hypotheses:["等式不变量缺失","位置口诀记忆","符号操作困难","一次计算 slip"],probe:"对 3 + x = 8 明确选择要同时施加于两边的操作，不出现负数。",bad:"正确步骤预先标绿、错误标红，再问哪份解法正确。",whyBad:"颜色泄露答案；学生无需定位第一处错误。",minimalFix:"提交前移除颜色；让每一行可选并要求说明违反的关系。",conditions:[{if:"目标只是讲清楚",change:"改成同步符号／天平解释。",preserve:"等式保持。"},{if:"天平隐喻造成摩擦",change:"保留符号高亮和代回检查。",preserve:"两边同操作。"},{if:"移动端窄屏",change:"逐对显示对应行但保留两份历史。",preserve:"first invalid step。"}],notThis:"不是又一组大量刷题，也不是展示标准答案动画。",keywords:["数学","Error Microscope","equation","first invalid step"],provenance:"mixed"},
  {id:"example-physics-force",type:"example",subject:"physics",title:"Force Model Builder",role:"WE",summary:"先选系统和外部相互作用，再画力并预测加速度。",authority:"ai_proposed",goal:"区分运动描述和真正作用在系统上的力。",sees:"一个对象清晰的物理场景、空自由体图和后续 motion view。",does:"圈定系统、为每个力标来源、预测加速度，再根据运动修订。",flow:["选系统","找外部相互作用","画力 + 来源","预测加速度","看运动","修订"],observations:["系统边界","力箭头和来源","加速度预测","修订"],hypotheses:["把运动当力","混淆第三定律 partner","漏掉相互作用","合力推理不足"],probe:"保持物体仍在运动但移除一个施力者，问哪支箭头消失。",bad:"随意拖箭头，直到和隐藏受力图匹配。",whyBad:"视觉匹配绕开物理推理；没有系统边界和作用源。",minimalFix:"先要求选择研究系统，并为每支箭头选择外部来源。",conditions:[{if:"教师主导 + 单投影",change:"学生举 source card，教师建立共享图。",preserve:"系统先于力清单。"},{if:"尚未学向量",change:"只判断来源和定性方向。",preserve:"力属于相互作用。"},{if:"目标变成实验",change:"用传感数据和不确定度替换理想 motion reveal。",preserve:"模型预测先于证据。"}],notThis:"不是箭头拼图，也不是把运动方向画成‘动力’。",keywords:["物理","force","system boundary","model builder"],provenance:"mixed"},
  {id:"example-chemistry-missing",type:"example",subject:"chemistry",title:"Missing Chemical Representation",role:"WE",summary:"由宏观和粒子两层补全符号层，并逐项说明跨层对应。",authority:"ai_proposed",goal:"发现学生会背中和反应方程式但是否理解哪些粒子真正变化。",sees:"盐酸与氢氧化钠反应的宏观观察和粒子视图，符号层暂时隐藏。",does:"区分反应／旁观粒子，补全或选择离子方程式，将每项连回粒子。",flow:["观察宏观 + 微观","分类粒子","补符号层","跨层连线","reveal + 修订"],observations:["反应／旁观粒子选择","方程","粒子到符号连线","现象解释"],hypotheses:["符号生成不足","粒子身份混淆","守恒理解不足","宏观—微观因果断裂"],probe:"直接给正确方程，只问哪些粒子发生变化、哪些是旁观者。",bad:"烧杯、彩球、方程三个面板各有 Next，但彼此不需要映射。",whyBad:"三层只是共现；颜色可能代替化学身份。",minimalFix:"隐藏一层并要求补全；至少要求一个明确的粒子—符号对应。",conditions:[{if:"未掌握化学式",change:"用两个 near-miss 方程替代开放生成。",preserve:"跨层映射。"},{if:"只要一页课件解释",change:"同步显示三层，取消 learner evidence。",preserve:"观察、模型、符号的角色区分。"},{if:"色觉可访问性",change:"增加形状和文字标签。",preserve:"物种身份不靠单一颜色。"}],notThis:"不是把三张化学图并排，也不是单纯配平方程。",keywords:["化学","macro micro symbol","representation completion"],provenance:"mixed"},
  {id:"example-biology-feedback",type:"example",subject:"biology",title:"Feedback Loop Builder",role:"WE",summary:"先扰动和预测变量，再观察时间轨迹，最后命名反馈类型。",authority:"teacher_defined",goal:"尊重教师的 experience-before-definition 顺序，让学生形成机制解释。",sees:"一个明确简化的生理系统、因果环和变量时间曲线。",does:"扰动一个变量，预测两个下游变化的方向和时间，观察后编辑一条关系。",flow:["扰动","有符号预测","看 trace","编辑关系","解释恢复","命名反馈"],observations:["选择的扰动","方向预测","编辑的关系","恢复解释"],hypotheses:["关系符号错误","sensor/effector 混淆","忽略时滞","目的论代替机制"],probe:"冻结 effector 但保留扰动，问哪些变量仍变化以及系统能否恢复。",bad:"一个顺时针圆环动画标注‘负反馈’，每个节点点击看定义。",whyBad:"圆形布局被误当成反馈机制；学生没有预测变量关系。",minimalFix:"允许一次扰动，并在播放前要求预测下一个变量的变化方向。",conditions:[{if:"只有投影",change:"匿名收集预测，教师控制共享系统。",preserve:"预测先于结果。"},{if:"公开回答风险高",change:"不显示姓名和信心 leaderboard。",preserve:"private commitment。"},{if:"目标比较正负反馈",change:"先完成基础模型，再加入一个 controlled near miss。",preserve:"机制关系而不是术语匹配。"}],notThis:"不是通用恒温器换生物皮肤，也不是圆形流程图。",keywords:["生物","feedback loop","teacher_defined","perturbation"],provenance:"mixed"},
  {id:"example-geography-sichuan",type:"example",subject:"geography",title:"Sichuan Climate Explanation",role:"WE",summary:"把水汽路径、地形剖面和气候数据连成可修改的空间因果链。",authority:"ai_proposed",goal:"从‘湿润、多云’事实记忆走向地形与水汽路径解释。",sees:"定位图、水汽路径、盆地剖面和季节气候图表。",does:"画路径、转到剖面、预测抬升／阻挡和降水，再用图表修订一条因果边。",flow:["定位路径","转入剖面","预测过程","检查图表","修订因果链"],observations:["路径","剖面标注","降水预测","所选图表证据","修订的关系"],hypotheses:["不会读剖面","水汽来源判断错","只会相关描述","尺度混淆"],probe:"固定水汽路径，把地形简化成单一屏障，只问哪里发生抬升。",bad:"旋转四川 3D 地形，点击城市读取气候事实。",whyBad:"地形和气流没有协调；点击只是事实检索。",minimalFix:"固定一个因果剖面，在显示事实前加入路径／抬升预测。",conditions:[{if:"目标只是课前描述",change:"用定位 inset + 标注气候图表。",preserve:"准确空间背景。"},{if:"学生不会剖面",change:"加一个 map-to-section 定向步骤。",preserve:"地形与过程对应。"},{if:"只允许静态 slide",change:"编号展示因果链并留一次全班预测暂停。",preserve:"空间因果关系。"}],notThis:"不是只因为地理就使用 3D 地图，也不是单因气候模型。",keywords:["地理","四川盆地","climate","spatial causal chain"],provenance:"mixed"}
];
````

## File: catalog/demo-configs.js
````javascript
window.EDUOS_DEMOS = {
  "history-constraint-map": {kind:"content",role:"RC",subject:"历史",title:"Decision-time Constraint Map",renderer:"decision-map",prompt:"点击区域，查看孙权在结果未知时面对的约束。",zones:[{x:12,y:18,label:"江东",card:"内部意见分裂：投降可保全，抗曹风险极高。"},{x:70,y:12,label:"曹军",card:"兵力数字来自不同报告，可信度并不相同。"},{x:48,y:68,label:"长江",card:"水域、补给和疫病使纸面兵力不能直接转成优势。"}]},
  "history-source-board": {kind:"content",role:"RC",subject:"历史",title:"Source Provenance Board",renderer:"source-board",prompt:"先读主张，再揭示出处，观察可信度判断是否改变。",sources:[{claim:"曹军号称八十万，声势极盛。",meta:"《资治通鉴》后世编纂 · 距事件约八百年"},{claim:"今治水军八十万众，方与将军会猎于吴。",meta:"曹操致孙权书 · 决策时宣传性文本"},{claim:"彼所将中国人不过十五六万，且已久疲。",meta:"周瑜说孙权 · 劝战情境中的估计"}]},
  "history-causal-weight-graph": {kind:"content",role:"RC",subject:"历史",title:"Causal Weight Graph",renderer:"causal-graph",prompt:"调整原因权重，比较你的解释是否仍把所有原因等权。",nodes:["水战适应","联盟形成","疫病疲劳","战略判断"],weights:[72,58,64,81]},
  "chinese-layered-text": {kind:"content",role:"RC",subject:"语文",title:"Layered Text",renderer:"layered-text",prompt:"按需打开词义、句法和语境层；原文始终保留在中心。",text:"于是饮酒乐甚，扣舷而歌之。",notes:[{term:"乐甚",lex:"非常快乐",syntax:"补充说明饮酒后的状态",context:"欢乐发生在客人吹箫、情绪转折之前"},{term:"扣舷",lex:"敲击船舷",syntax:"与‘歌’构成连续动作",context:"声音和节奏把外在欢乐推向抒情"}]},
  "chinese-emotion-river": {kind:"content",role:"RC",subject:"语文",title:"Emotion River",renderer:"emotion",prompt:"拖动三段强度，形成你的情绪轨迹；曲线不是标准答案。",labels:["饮酒乐甚","客有吹洞箫者","相与枕藉"],values:[72,22,64]},
  "chinese-text-surgery": {kind:"content",role:"RC",subject:"语文",title:"Text Surgery",renderer:"text-surgery",prompt:"切换原句与受控改句，比较节奏和视角发生了什么变化。",original:"寄蜉蝣于天地，渺沧海之一粟。",changed:"人生很短，人在世界上很渺小。",focus:"意象被抽象判断替代后，尺度感和画面感明显减弱。"},
  "civics-near-miss-materials": {kind:"content",role:"RC",subject:"政治／公民",title:"Near-miss Material Pair",renderer:"near-miss",prompt:"两则材料都有‘政府’，请选择真正涉及依法行政的一则。",choices:["市政府发布全民阅读倡议，鼓励社会组织参与。","市政府依据法定程序作出行政许可决定，并公开救济渠道。"],correct:1,cue:"政府",decisive:"依据法定程序作出行政许可决定"},
  "civics-principle-collision": {kind:"content",role:"RC",subject:"政治／公民",title:"Principle Collision Matrix",renderer:"matrix",prompt:"点击格子，在支持／张力／未知之间切换。",rows:["公平","效率","隐私"],cols:["实名公共服务","匿名申请通道","自动风险审核"]},
  "civics-argument-bridge": {kind:"content",role:"RC",subject:"政治／公民",title:"Claim–Evidence–Warrant Bridge",renderer:"argument",prompt:"依次激活 claim、evidence 和 warrant，观察缺一环时论证为何不成立。",slots:["主张：应保留线下公共服务渠道","证据：部分老年人智能设备使用率低","解释桥：公共服务的可及性不能以单一设备能力为前提"]},
  "math-balance-transform": {kind:"content",role:"RC",subject:"数学",title:"Equality-preserving Balance",renderer:"balance",prompt:"对等式两边执行同一个操作，直到 x 被单独留下。",equation:"3x + 5 = 20"},
  "math-error-lines": {kind:"content",role:"RC",subject:"数学",title:"Aligned Solution Lines",renderer:"solution",prompt:"请选择第一处不再保持等式的步骤。",lines:["3x + 5 = 20","3x = 20 − 5","3x = 15","x = 15 − 3","x = 12"],invalid:3},
  "math-parameter-intersection": {kind:"content",role:"RC",subject:"数学",title:"Parameter–Graph–Equation Link",renderer:"param-graph",prompt:"改变 b，先预测直线 y = 2x + b 与 y = 8 的交点如何移动。",min:-4,max:6,value:2},
  "physics-force-scene": {kind:"content",role:"RC",subject:"物理",title:"System-boundary Force Scene",renderer:"force",prompt:"先选系统，再添加具有外部作用源的力。",forces:[{label:"地面对车的支持力",rot:-90},{label:"地球对车的重力",rot:90},{label:"绳对车的拉力",rot:0},{label:"车的运动方向",rot:180,bad:true}]},
  "physics-motion-linked-views": {kind:"content",role:"RC",subject:"物理",title:"Motion–Graph–Equation Triplet",renderer:"motion",prompt:"拖动时间游标，观察小车、图像点和方程值同步变化。",speed:1.5,initial:10},
  "physics-measurement-strip": {kind:"content",role:"RC",subject:"物理",title:"Measurement & Uncertainty Strip",renderer:"uncertainty",prompt:"改变测量值，判断它是否真的偏离模型的不确定区间。",model:9.8,tolerance:.25,value:10.0},
  "chemistry-three-level": {kind:"content",role:"RC",subject:"化学",title:"Macro–Micro–Symbol Linked View",renderer:"chemistry",prompt:"观察宏观和粒子层，再选择能表示真实变化的离子方程式。",options:["H⁺ + OH⁻ → H₂O","Na⁺ + Cl⁻ → NaCl↓"],correct:0},
  "chemistry-particle-collision": {kind:"content",role:"RC",subject:"化学",title:"Particle Event Sequence",renderer:"particles",prompt:"逐帧查看碰撞、有效取向和产物形成，检查粒子数是否守恒。",frames:["反应物接近","发生有效碰撞","旧键断裂／新键形成","产物分离"]},
  "chemistry-equilibrium-shift": {kind:"content",role:"RC",subject:"化学",title:"Equilibrium Perturbation View",renderer:"equilibrium",prompt:"加入反应物后，先看瞬时速率，再看新平衡组成。",reactant:50,product:50},
  "biology-feedback-loop": {kind:"content",role:"RC",subject:"生物",title:"Feedback Loop + Variable Trace",renderer:"feedback",prompt:"扰动体温，观察检测—响应—恢复的方向和时间。",baseline:37,value:39},
  "biology-genetics-model": {kind:"content",role:"RC",subject:"生物",title:"Inheritance Model Revision",renderer:"genetics",prompt:"先选择遗传模型，再揭示一个能区分模型的后代数据。",models:["常染色体显性","常染色体隐性","伴 X 隐性"],evidence:"两位表现正常的父母生出一位患病女儿"},
  "biology-experiment-variables": {kind:"content",role:"RC",subject:"生物",title:"Experiment Variable Canvas",renderer:"experiment",prompt:"把光照、株高和土壤含水量分配到处理、响应和控制角色。",variables:["光照时长","一周后株高","土壤含水量"]},
  "geography-terrain-path": {kind:"content",role:"RC",subject:"地理",title:"Terrain Cross-section + Moisture Path",renderer:"terrain",prompt:"推进水汽路径，判断气流在山地哪一侧抬升和降水。",region:"四川盆地"},
  "geography-multiscale": {kind:"content",role:"RC",subject:"地理",title:"Multi-scale Place Comparator",renderer:"scale",prompt:"改变聚合尺度，观察局部热点如何被区域平均掩盖。",sizes:[8,4,2]},
  "geography-flow-map": {kind:"content",role:"RC",subject:"地理",title:"Human Flow & Constraint Map",renderer:"flow",prompt:"改变住房成本，观察人口流向和流量如何重新分配。",places:["核心城区","近郊","外围城镇"]},

  "history-decision-under-uncertainty": {kind:"pedagogy",role:"PI",subject:"历史",title:"Decision under Historical Uncertainty",renderer:"pedagogy",inner:"history-constraint-map",stages:["读取当时证据","提交选择","揭示新情报","修订权重"],choices:["迎战","议和","暂缓决策"],reveal:"新情报：曹军内部出现疫病，水军训练不足。",probe:"去掉已知战果，换一份冲突情报，问哪项约束改变权重。"},
  "history-source-corroboration": {kind:"pedagogy",role:"PI",subject:"历史",title:"Sourcing before Agreement",renderer:"pedagogy",inner:"history-source-board",stages:["提取主张","判断来源位置","比较印证／冲突","形成有限结论"],choices:["可信","需限定","不可用"],reveal:"出处揭示后，宣传性和时间距离进入判断。",probe:"保持 claim 相同，替换作者位置，检查可信度是否变化。"},
  "chinese-evidence-constrained-reading": {kind:"pedagogy",role:"PI",subject:"语文",title:"Evidence-constrained Interpretation",renderer:"pedagogy",inner:"chinese-emotion-river",stages:["提出暂定阅读","引用原文","解释措辞","比较后修订"],choices:["由乐入悲","由悲入旷","情绪并未改变"],reveal:"替代曲线把‘客有吹洞箫者’视为外来声音引起的转折。",probe:"从两句中选出真正改变说话者立场的一句。"},
  "chinese-text-surgery-method": {kind:"pedagogy",role:"PI",subject:"语文",title:"Controlled Text Surgery",renderer:"pedagogy",inner:"chinese-text-surgery",stages:["预测效果","只改一个特征","A/B 比较","用措辞说明"],choices:["尺度感减弱","节奏更强","视角不变"],reveal:"改句删除‘蜉蝣／沧海一粟’两个尺度意象。",probe:"只恢复一个意象，判断哪一项效果首先回来。"},
  "civics-near-miss-discrimination": {kind:"pedagogy",role:"PI",subject:"政治／公民",title:"Concept-boundary Near Miss",renderer:"pedagogy",inner:"civics-near-miss-materials",stages:["分类 pair","标决定性短语","保存信心","做简化 pair"],choices:["材料 A","材料 B"],reveal:"两则都有‘政府’，真正不同的是是否依法行使行政权力。",probe:"保持主体不变，只替换行为。"},
  "civics-principle-deliberation": {kind:"pedagogy",role:"PI",subject:"政治／公民",title:"Principle Collision Deliberation",renderer:"pedagogy",inner:"civics-principle-collision",stages:["切换 stakeholder","提出原则主张","加入证据","说明 trade-off"],choices:["公平优先","效率优先","隐私优先"],reveal:"同一方案可能同时提升效率并制造可及性张力。",probe:"固定方案，切换一个利益相关者，检查优先理由是否改变。"},
  "math-first-invalid-step": {kind:"pedagogy",role:"PI",subject:"数学",title:"First Invalid Step",renderer:"pedagogy",inner:"math-error-lines",stages:["比较相近解法","锁定第一错行","说出不变量","低负荷迁移"],choices:["第 2 行","第 3 行","第 4 行"],reveal:"第 4 行把除以 3 错写成减去 3，解集不再等价。",probe:"换成 3 + x = 8，去掉负数和除法负荷。"},
  "math-representation-coordination": {kind:"pedagogy",role:"PI",subject:"数学",title:"Predict before Representation Shift",renderer:"pedagogy",inner:"math-parameter-intersection",stages:["观察表示 A","预测表示 B","揭示 B","解释映射"],choices:["交点左移","交点右移","交点不变"],reveal:"b 增大时，2x+b=8 的解 x=(8-b)/2 变小，交点左移。",probe:"保持图像变化，要求从方程中指出对应参数。"},
  "physics-model-construction": {kind:"pedagogy",role:"PI",subject:"物理",title:"System-first Model Construction",renderer:"pedagogy",inner:"physics-force-scene",stages:["选系统","找外部相互作用","建模","预测运动"],choices:["向右加速","匀速","向左加速"],reveal:"只有来源明确的外力进入受力图；运动方向本身不是力。",probe:"保留运动但移除拉车的绳，问哪支箭头消失。"},
  "physics-predict-observe-revise": {kind:"pedagogy",role:"PI",subject:"物理",title:"Prediction–Measurement Revision",renderer:"pedagogy",inner:"physics-measurement-strip",stages:["建立模型","保存预测","观察残差","修订模型"],choices:["支持模型","不支持模型","证据不足"],reveal:"测量差异必须与不确定区间比较，不能只看数值不相等。",probe:"重复一次测量以区分随机波动和系统偏差。"},
  "chemistry-representation-completion": {kind:"pedagogy",role:"PI",subject:"化学",title:"Missing Chemical Representation",renderer:"pedagogy",inner:"chemistry-three-level",stages:["检查给定两层","补缺失层","跨层连线","揭示后修订"],choices:["H⁺ + OH⁻ → H₂O","Na⁺ + Cl⁻ → NaCl↓"],reveal:"Na⁺ 和 Cl⁻ 是旁观粒子；宏观现象由 H⁺ 与 OH⁻ 的变化解释。",probe:"直接给方程，只问哪些粒子变化。"},
  "chemistry-perturb-equilibrium": {kind:"pedagogy",role:"PI",subject:"化学",title:"Perturb–Predict–Reconcile",renderer:"pedagogy",inner:"chemistry-equilibrium-shift",stages:["记录基线","施加扰动","预测速率","观察新平衡"],choices:["正反应先变快","逆反应先变快","两者同时不变"],reveal:"加入反应物使正反应速率瞬时增大，之后两速率重新相等。",probe:"只显示速率曲线，要求区分瞬时变化和最终组成。"},
  "biology-perturb-system": {kind:"pedagogy",role:"PI",subject:"生物",title:"Perturb–Predict–Trace",renderer:"pedagogy",inner:"biology-feedback-loop",stages:["扰动变量","预测方向／时滞","观察 trace","编辑关系"],choices:["促进散热","减少散热","没有响应"],reveal:"体温升高被检测后，效应器响应增加散热，使偏差减小。",probe:"冻结效应器，问系统是否仍能恢复。"},
  "biology-competing-models": {kind:"pedagogy",role:"PI",subject:"生物",title:"Competing Biological Models",renderer:"pedagogy",inner:"biology-genetics-model",stages:["选择候选模型","写预测","揭示决定性证据","淘汰／修订"],choices:["显性","隐性","伴 X 隐性"],reveal:"正常父母和患病女儿的组合对三个模型具有不同约束。",probe:"加入父亲表型，检查伴 X 模型是否仍可成立。"},
  "geography-spatial-causal-chain": {kind:"pedagogy",role:"PI",subject:"地理",title:"Spatial Causal Chain",renderer:"pedagogy",inner:"geography-terrain-path",stages:["定位水汽路径","转入剖面","预测过程","用图表修订"],choices:["迎风坡抬升","盆地中心抬升","背风坡抬升"],reveal:"路径遇山地后抬升冷却，地形位置进入因果解释。",probe:"简化成一个屏障，只问哪里抬升。"},
  "geography-scale-shift": {kind:"pedagogy",role:"PI",subject:"地理",title:"Scale-shift Explanation",renderer:"pedagogy",inner:"geography-multiscale",stages:["在尺度 A 提出 claim","改变聚合尺度","检查模式损失","限定结论"],choices:["热点仍清晰","热点被平均","出现新热点"],reveal:"区域平均可以隐藏社区尺度上的局部高值。",probe:"保持数据不变，只改变统计单元。"},

  "example-history-red-cliffs": {kind:"example",role:"WE",subject:"历史",title:"Red Cliffs Decision Room",renderer:"workflow",inner:"history-constraint-map",pedagogy:"commit-before-reveal",skill:"historical-evidence-probe",options:["迎战","议和","暂缓"],observation:"learner chose 迎战 · cited 长江 + 疫病 · confidence 0.74",interpretations:["可能理解地理约束","可能受已知战果影响","尚未显示来源判断"],probe:"替换为一份夸大曹军兵力的冲突情报，要求重新赋权。"},
  "example-chinese-chibi-fu": {kind:"example",role:"WE",subject:"语文",title:"《赤壁赋》 Emotion River",renderer:"workflow",inner:"chinese-emotion-river",pedagogy:"claim-with-text-evidence",skill:"literary-evidence-probe",options:["由乐入悲","情绪不变","由悲入乐"],observation:"learner plotted 72→22 · quoted ‘客有吹洞箫者’",interpretations:["可能识别转折","可能只匹配悲伤意象","字面理解需进一步确认"],probe:"给两句相邻原文，问哪一个动词或意象真正改变立场。"},
  "example-civics-boundary": {kind:"example",role:"WE",subject:"政治／公民",title:"Concept Boundary Lab",renderer:"workflow",inner:"civics-near-miss-materials",pedagogy:"near-miss-discrimination",skill:"civics-concept-boundary-probe",options:["材料 A","材料 B"],observation:"learner selected B · highlighted ‘法定程序’ · confidence 0.86",interpretations:["可能掌握主体／行为边界","也可能只匹配‘法定’关键词"],probe:"保留‘法定’一词但改变行为是否属于行政权力。"},
  "example-math-error": {kind:"example",role:"WE",subject:"数学",title:"Equality Error Microscope",renderer:"workflow",inner:"math-error-lines",pedagogy:"first-invalid-step",skill:"mathematical-error-probe",options:["第 3 行","第 4 行","最终答案"],observation:"learner selected 第 4 行 · reason ‘除以 3 不能写成减 3’",interpretations:["可能理解运算关系","等式两边同操作仍需独立检查"],probe:"用 3+x=8 去掉除法负荷，要求明确两边执行的操作。"},
  "example-physics-force": {kind:"example",role:"WE",subject:"物理",title:"Force Model Builder",renderer:"workflow",inner:"physics-force-scene",pedagogy:"system-first-model",skill:"physics-signal-interpreter",options:["重力","支持力","运动方向"],observation:"learner added 重力 + 支持力 + 运动方向箭头",interpretations:["可能把运动当力","也可能把箭头当速度标记"],probe:"保持物体运动，移除施力者，问哪支力箭头消失。"},
  "example-chemistry-missing": {kind:"example",role:"WE",subject:"化学",title:"Missing Chemical Representation",renderer:"workflow",inner:"chemistry-three-level",pedagogy:"representation-completion",skill:"chemical-representation-probe",options:["H⁺ + OH⁻ → H₂O","Na⁺ + Cl⁻ → NaCl↓"],observation:"learner chose correct ionic equation but marked Na⁺ as reacting",interpretations:["符号层可能正确","粒子身份／旁观离子仍混淆"],probe:"保留正确方程，只让学生分类 reacting 与 spectator particles。"},
  "example-biology-feedback": {kind:"example",role:"WE",subject:"生物",title:"Feedback Loop Builder",renderer:"workflow",inner:"biology-feedback-loop",pedagogy:"perturb-predict-trace",skill:"biology-feedback-probe",options:["促进散热","减少散热","体温保持不变"],observation:"learner predicted 促进散热 · explanation ‘身体想恢复正常’",interpretations:["方向预测正确","解释仍可能是目的论而非机制"],probe:"冻结 effector，问系统是否仍能恢复以及为什么。"},
  "example-geography-sichuan": {kind:"example",role:"WE",subject:"地理",title:"Sichuan Climate Explanation",renderer:"workflow",inner:"geography-terrain-path",pedagogy:"spatial-causal-chain",skill:"spatial-causal-probe",options:["迎风坡抬升","盆地中心抬升","背风坡抬升"],observation:"learner drew moisture path but placed uplift in basin center",interpretations:["可能不会读剖面","也可能不懂地形抬升机制"],probe:"简化成单一山地屏障并固定路径，只问抬升位置。"}
};
````

## File: catalog/manifest.json
````json
{
  "id": "eduos-teaching-design-atlas-v0",
  "status": "pending_review",
  "subjects": [
    "history",
    "chinese",
    "civics",
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "geography"
  ],
  "families": {
    "content": {
      "path": "content/records.js",
      "primary_roles": ["RP", "RC"],
      "expected_records": 24
    },
    "pedagogy": {
      "path": "pedagogy/records.js",
      "primary_roles": ["PI"],
      "expected_records": 16
    },
    "skills": {
      "path": "skills/records.js",
      "primary_roles": ["PS"],
      "expected_records": 16
    },
    "worked_examples": {
      "path": "worked-examples/records.js",
      "primary_roles": ["WE"],
      "expected_records": 8
    }
  },
  "authority_values": ["teacher_defined", "collaborative", "ai_proposed"],
  "provenance_values": ["conversation_given", "v0_inference", "mixed"],
  "standalone_demos": {
    "config": "demo-configs.js",
    "content_directory": "../demos/content",
    "pedagogy_directory": "../demos/pedagogy",
    "worked_examples_directory": "../demos/worked-examples",
    "expected_total": 48
  },
  "notes": [
    "Catalog families deliberately keep different record shapes.",
    "Skill records are previews, not installed SKILL.md packages.",
    "The static page is a review surface, not the canonical substrate."
  ]
}
````

## File: catalog/README.md
````markdown
# Agent-search Catalog

This directory is the static site's source catalog. Each family keeps a shape appropriate to its function.

| Family | Primary role | Agent-relevant fields |
|---|---|---|
| `content/records.js` | `RP` / `RC` | target, representation, domain move, coding surface, when, not |
| `pedagogy/records.js` | `PI` | mechanism, domain-native reason, activation conditions, not-when, adaptation |
| `skills/records.js` | `PS` | trigger, refusal, input, output, searches |
| `worked-examples/records.js` | `WE` | authority, state flow, learner evidence, anti-example, minimal fix, conditions |

Every record has a single `role`. Connections across families are discovered through `subject`, `keywords`, and explicit search hints rather than by turning the entire worked example into every asset type at once.

## Provenance

- `conversation_given`: the named design or distinction appeared in the prior discussion.
- `v0_inference`: the record was concretized in this run.
- `mixed`: a discussion seed plus V0 implementation detail.

These are review labels, not quality scores.
````

## File: demos/content/biology-experiment-variables.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Experiment Variable Canvas interactive EduOS teaching object">
  <title>Experiment Variable Canvas · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="biology-experiment-variables">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/content/biology-feedback-loop.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Feedback Loop + Variable Trace interactive EduOS teaching object">
  <title>Feedback Loop + Variable Trace · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="biology-feedback-loop">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/content/biology-genetics-model.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Inheritance Model Revision interactive EduOS teaching object">
  <title>Inheritance Model Revision · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="biology-genetics-model">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/content/history-causal-weight-graph.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Causal Weight Graph interactive EduOS teaching object">
  <title>Causal Weight Graph · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="history-causal-weight-graph">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/content/history-constraint-map.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Decision-time Constraint Map interactive EduOS teaching object">
  <title>Decision-time Constraint Map · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="history-constraint-map">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/content/history-source-board.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Source Provenance Board interactive EduOS teaching object">
  <title>Source Provenance Board · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="history-source-board">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/pedagogy/biology-competing-models.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Competing Biological Models interactive EduOS teaching object">
  <title>Competing Biological Models · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="biology-competing-models">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/pedagogy/biology-perturb-system.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Perturb–Predict–Trace interactive EduOS teaching object">
  <title>Perturb–Predict–Trace · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="biology-perturb-system">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/pedagogy/history-decision-under-uncertainty.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Decision under Historical Uncertainty interactive EduOS teaching object">
  <title>Decision under Historical Uncertainty · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="history-decision-under-uncertainty">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/pedagogy/history-source-corroboration.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Sourcing before Agreement interactive EduOS teaching object">
  <title>Sourcing before Agreement · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="history-source-corroboration">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/worked-examples/example-biology-feedback.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="生物 Feedback Loop Builder interactive EduOS teaching object">
  <title>Feedback Loop Builder · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="example-biology-feedback">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: demos/worked-examples/example-history-red-cliffs.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="历史 Red Cliffs Decision Room interactive EduOS teaching object">
  <title>Red Cliffs Decision Room · EduOS Demo</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="../../assets/demo.css">
</head>
<body data-demo-id="example-history-red-cliffs">
  <main id="demo-root"></main>
  <script src="../../catalog/demo-configs.js"></script>
  <script src="../../assets/demo-engine.js"></script>
</body>
</html>
````

## File: subjects/biology.html
````html
<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>生物 · EduOS Atlas</title><link rel="stylesheet" href="../assets/site.css"></head><body class="subject-body" data-subject="biology"><main id="subject-root"></main><script src="../catalog/content/records.js"></script><script src="../catalog/pedagogy/records.js"></script><script src="../catalog/skills/records.js"></script><script src="../catalog/worked-examples/records.js"></script><script src="../assets/subject.js"></script></body></html>
````

## File: subjects/history.html
````html
<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>历史 · EduOS Atlas</title><link rel="stylesheet" href="../assets/site.css"></head><body class="subject-body" data-subject="history"><main id="subject-root"></main><script src="../catalog/content/records.js"></script><script src="../catalog/pedagogy/records.js"></script><script src="../catalog/skills/records.js"></script><script src="../catalog/worked-examples/records.js"></script><script src="../assets/subject.js"></script></body></html>
````

## File: index.html
````html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="EduOS 八学科 content、pedagogy、skills 与 worked examples 静态评审目录。">
  <title>EduOS Teaching Design Atlas</title>
  <link rel="stylesheet" href="assets/site.css">
</head>
<body>
  <div class="site-shell">
    <header class="topbar">
      <a class="brand" href="index.html"><span class="brand-mark">E/O</span><span>Teaching Design Atlas</span></a>
      <span class="topbar-note">pending_review · static evaluator</span>
    </header>

    <section class="hero">
      <div class="hero-inner">
        <div class="eyebrow">EduOS · design substrate preview</div>
        <h1>不只看资产，<br>看 AI 如何做出<span>教学判断</span>。</h1>
        <p class="hero-copy">八个学科的 content representation、domain-native pedagogy、agent skills 与 worked examples 被放进同一张可搜索地图；每个成品例子都显示它是什么、不是什么、观察到了什么，以及条件改变后应该怎样改。</p>
        <label class="search-wrap" for="catalog-search">
          <span class="search-icon" aria-hidden="true">⌕</span>
          <input id="catalog-search" type="search" placeholder="搜索：赤壁赋、near miss、无设备、宏观微观符号、teacher_defined…" autocomplete="off">
          <span class="keycap">/</span>
        </label>
        <div class="hero-stats" id="hero-stats" aria-label="目录统计"></div>
      </div>
    </section>

    <main class="main">
      <section aria-labelledby="subjects-title">
        <div class="section-head">
          <div><div class="eyebrow" style="color:var(--navy)">Subject lenses</div><h2 id="subjects-title">八科不是八个皮肤</h2></div>
          <p>每个入口都保留学科原生的表示、推理动作与诊断证据。点击后会在下方评审窗打开，也可以单独打开 HTML。</p>
        </div>
        <div class="subject-grid" id="subject-grid"></div>
      </section>

      <section class="review-stage" aria-labelledby="preview-title">
        <div class="section-head">
          <div><div class="eyebrow" style="color:var(--navy)">Live subject file</div><h2 id="preview-title">学科评审窗</h2></div>
          <p id="preview-description">当前展示历史：将地图、证据和决策约束连接成一个可修正的历史判断。</p>
        </div>
        <div class="frame-shell">
          <div class="frame-toolbar"><span class="frame-dot"></span><span class="frame-dot"></span><span class="frame-dot"></span><span class="frame-path" id="frame-path">subjects/history.html</span><a class="frame-open" id="frame-open" href="subjects/history.html">单独打开 ↗</a></div>
          <iframe class="subject-frame" id="subject-frame" src="subjects/history.html" title="学科评审页面"></iframe>
        </div>
      </section>

      <section class="review-stage" aria-labelledby="search-title">
        <div class="section-head">
          <div><div class="eyebrow" style="color:var(--navy)">Agent-search surface</div><h2 id="search-title">跨层搜索</h2></div>
          <p>搜索结果来自结构化 catalog，而不是页面文字抓取。可按 content、pedagogy、skill 或 worked example 限定。</p>
        </div>
        <div class="type-filters" id="type-filters" aria-label="资产类型筛选"></div>
        <div class="search-results" id="search-results" aria-live="polite"></div>
      </section>

      <section class="method-grid" aria-label="统一设计规则">
        <article class="method-card"><span class="pill">Rule 01</span><h3>Pattern ≠ Widget</h3><p>commit-before-reveal 是信息状态与承诺顺序，不是固定的“预测按钮”。学科改变时，承诺对象和 reveal 的证据必须随之改变。</p></article>
        <article class="method-card"><span class="pill">Rule 02</span><h3>Signal ≠ Diagnosis</h3><p>先保存可观察行为，再列多种解释；只有 next discriminating probe 能让其中一些解释获得或失去支持。</p></article>
        <article class="method-card"><span class="pill">Rule 03</span><h3>Authority before novelty</h3><p>教师已经给定教学流程时，agent 应忠实实现。设计创新不能覆盖 teacher_defined 的顺序、排除项和课堂意图。</p></article>
      </section>

      <p class="footer-note">本网页是 experiment-local 的静态 evaluator，不是 canonical substrate，也不声称示例已经通过学科或课堂有效性验证。页面数据保留 <code>conversation_given</code>、<code>v0_inference</code> 与 <code>mixed</code> 来源标签。</p>
    </main>
  </div>

  <script src="catalog/content/records.js"></script>
  <script src="catalog/pedagogy/records.js"></script>
  <script src="catalog/skills/records.js"></script>
  <script src="catalog/worked-examples/records.js"></script>
  <script src="assets/app.js"></script>
</body>
</html>
````

## File: README.md
````markdown
# Static Review Site

Open [`index.html`](index.html) directly in a browser. The site uses no framework, build step, remote font, network request, or runtime dependency. Relative scripts and iframe pages also work from `file://`.

For a local HTTP preview from the experiment directory:

```bash
python3 -m http.server 8000 --directory review-site
```

Then open `http://localhost:8000/`.

## Information architecture

```text
review-site/
├── index.html                       # cross-subject search + iframe evaluator
├── subjects/                        # eight standalone subject HTML files
├── demos/
│   ├── content/                     # 24 directly operable HTML results
│   ├── pedagogy/                    # 16 pedagogy state-machine HTML results
│   └── worked-examples/             # 8 composed content→skill runtimes
├── assets/
│   ├── site.css                     # shared visual system
│   ├── app.js                       # hub search, filters, iframe routing
│   └── subject.js                   # shared subject-page renderer
├── catalog/
│   ├── content/records.js           # RP / RC candidates
│   ├── pedagogy/records.js          # domain-native PI candidates
│   ├── skills/records.js            # searchable PS contract previews
│   └── worked-examples/records.js   # eight WE gold seeds
└── scripts/validate_site.py
```

The four catalog files are the data layer. HTML is the evaluator view. An agent can search the catalog directly with identifiers, subjects, roles, triggers, refusals, keywords, conditions, or provenance labels.

Each content and pedagogy record now has a standalone HTML result under `demos/`. Worked examples are separate composed runtimes: they render the content primitive, preserve a learner event, show possible interpretations, and expose the next discriminating probe selected by the skill layer.

Example searches:

```bash
rg -n "teacher_defined|near miss|宏观|无学生设备" review-site/catalog
rg -n "subject:\"chemistry\"" review-site/catalog
rg -n "role:\"PS\"" review-site/catalog/skills
```

## Boundaries

- Skill records are contract previews, not installed `SKILL.md` packages.
- Content, pedagogy, skill, and worked-example directories retain different record shapes.
- The browser combines them for search but does not assert one canonical ontology.
- All records remain `pending_review`; subject and classroom review is still required.
````




# Instruction
# Review request: EduOS visual teaching objects

You are reviewing a static web prototype for EduOS. The selected packet contains:

- the cross-subject home page;
- the complete History subject page;
- the complete Biology subject page;
- shared visual and interaction code;
- the content, pedagogy, skill, and worked-example records needed to render those pages;
- every standalone History and Biology demo HTML.

## Why this review is needed

The owner’s current judgment is that the web coding is visually weak and has not captured the intended product. Earlier versions over-described what AI should build without providing finished results. The current version now has executable demos, but it may still be producing generic UI mockups rather than convincing content representations or pedagogy-native learning experiences.

Please be direct and specific. Do not merely suggest polishing colors or spacing.

## Questions to answer

1. What do you think the owner is actually trying to build, based on these files?
2. Where does the current homepage misunderstand that intent structurally—not just aesthetically?
3. For the History page, which items are genuine content representations, which are merely diagrams/cards, and which should be removed or rebuilt?
4. For the Biology page, which visual models genuinely expose a biological mechanism, and which are only generic boxes, sliders, or circles wearing a biology label?
5. Do the pedagogy HTML demos instantiate a real learning mechanism, or do they merely add a generic “choose → reveal” shell around content?
6. Does the worked-example runtime make the relationship among content, pedagogy, learner observation, agent skill, and next probe understandable? If not, propose a better concrete screen/state sequence.
7. Which three History deliverables and which three Biology deliverables should be rebuilt first as gold examples?
8. For each priority example, provide:
   - what the learner should literally see;
   - what the learner should literally manipulate or commit;
   - what visual state should change;
   - what learner evidence should be captured;
   - what the skill should do with that evidence;
   - one plausible-but-bad implementation to avoid.
9. Identify visual-design problems that prevent evaluation: hierarchy, density, framing, use of iframes, typography, interaction discoverability, or excess explanatory text.
10. Give a targeted redesign brief that Codex could execute without interpreting it as “make another dashboard.”

## Important conceptual boundaries

- Content representation may be independently useful without diagnosis.
- Pedagogy is not just a backend skill; it may require learner-facing UI and interaction.
- A pedagogy pattern is a mechanism, not a fixed widget.
- A worked example should show how content, pedagogy, skill judgment, and workflow connect.
- Learner observation must remain separate from interpretation.
- If the teacher already authored the pedagogy, AI should implement it rather than substitute another design.
- Please distinguish “the concept is wrong” from “the current implementation is weak.”

## Desired output format

1. One-paragraph diagnosis.
2. Five most consequential misunderstandings.
3. Homepage critique.
4. History critique and three gold rebuilds.
5. Biology critique and three gold rebuilds.
6. Pedagogy/skill/worked-example architecture critique.
7. Concrete redesign instructions for the next Codex pass.
