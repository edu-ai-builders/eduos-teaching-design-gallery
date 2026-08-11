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
