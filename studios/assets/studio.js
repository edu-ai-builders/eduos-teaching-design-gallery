(() => {
  const subject = document.body.dataset.subject;
  const meta = {
    history:{name:'历史',en:'HISTORY',mark:'史',accent:'#b45a42',title:'历史课可以让学生操作什么？',note:'时空、史料、判断与解释必须发生在同一个可修订的课堂对象里。'},
    mathematics:{name:'数学',en:'MATHEMATICS',mark:'∑',accent:'#267395',title:'可视化之后，学生下一步要做什么？',note:'内容资产让关系可见；脚手架控制预测、解释、诊断与撤除。'},
    english:{name:'英语',en:'ENGLISH',mark:'Aa',accent:'#298a7b',title:'此刻最小、最可能有效的帮助是什么？',note:'31 个 scaffold skills 由学习证据触发；它们不是按顺序播放的课程。'},
    chinese:{name:'语文',en:'CHINESE',mark:'文',accent:'#9b4d56',title:'怎样让文本解释保持开放，同时受证据约束？',note:'从字词支持、文本表征到解释修订，始终回到原文。'},
    civics:{name:'政治／公民',en:'CIVICS',mark:'政',accent:'#86612d',title:'怎样把关键词判断推进到概念边界与原则权衡？',note:'概念、材料、规范理由与诊断探针必须分开。'},
    physics:{name:'物理',en:'PHYSICS',mark:'F',accent:'#3b678f',title:'怎样从现象进入可检验的物理模型？',note:'系统边界、预测、测量和模型修订属于同一条证据链。'},
    chemistry:{name:'化学',en:'CHEMISTRY',mark:'⚗',accent:'#637b3f',title:'宏观、微观与符号怎样真正发生映射？',note:'三层并排不等于协调；学生必须补全、连接或修订。'},
    biology:{name:'生物',en:'BIOLOGY',mark:'生',accent:'#3d7b64',title:'怎样把生命系统从流程图变成机制模型？',note:'扰动、变量轨迹、竞争模型与实验设计都需要可见证据。'},
    geography:{name:'地理',en:'GEOGRAPHY',mark:'地',accent:'#6b6f9b',title:'地图之外，学生要怎样进行空间因果推理？',note:'位置、剖面、尺度和流动服务于解释，不是视觉装饰。'}
  }[subject];
  document.documentElement.style.setProperty('--accent', meta.accent);
  document.documentElement.style.setProperty('--accent-soft', `${meta.accent}20`);

  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const roleLabel={asset:'全量内容资产',content:'内容与表征',scaffold:'教学脚手架',diagnostic:'诊断探针',metacog:'元认知与迁移',regulation:'难度调节',agent:'Agent Skills'};
  const roleGroup={asset:'CONTENT ASSETS · 可直接调用的原始 HTML',content:'CONTENT / REPRESENTATION · 学科对象',scaffold:'PEDAGOGY / SCAFFOLD · 学习动作',diagnostic:'DIAGNOSTIC PROBES · 区分性证据',metacog:'METACOGNITION · 监控与迁移',regulation:'REGULATION · 难度与撤除',agent:'AGENT SKILLS · 搜索、路由与解释'};
  const roleIcon={asset:'▧',content:'◇',scaffold:'↗',diagnostic:'?',metacog:'◎',regulation:'≋',agent:'⌘'};
  const roleOrder=['content','asset','scaffold','diagnostic','metacog','regulation','agent'];
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const demoUrl=(type,id)=>`../demos/${type==='content'?'content':type==='pedagogy'?'pedagogy':'worked-examples'}/${id}.html`;

  function normalizeCatalog(){
    const content=(window.EDUOS_CONTENT||[]).filter(x=>x.subject===subject).map(x=>({
      ...x,kind:'content',symbol:'◇',name:x.title,en:x.target,claim:x.summary,trigger:x.when,
      success:`学生能够${x.domainMove.replace(/[。]$/,'')}，并留下可检查的课堂产物。`,fade:'当学生能独立完成目标关系时，撤掉提示层，只保留内容对象。',
      slots:[x.target,x.representation,x.codingSurface],contract:`type: content_representation\nsubject: ${subject}\ntarget: ${x.target}\nrepresentation: ${x.representation}\nwhen: ${x.when}`,previewUrl:demoUrl('content',x.id),search:[x.title,x.summary,...(x.keywords||[])].join(' ')
    }));
    const pedagogy=(window.EDUOS_PEDAGOGY||[]).filter(x=>x.subject===subject).map((x,i)=>({
      ...x,kind:'scaffold',symbol:'↗',name:x.title,en:'Domain-native teaching move',claim:x.summary,trigger:x.conditions,
      success:`学生完成“${x.mechanism}”中的关键承诺、比较或修订。`,fade:`成功后撤掉步骤标签；保留${x.native}`,not:x.notWhen,
      slots:['学科内容',x.mechanism,x.adaptation],contract:`type: pedagogical_interaction\nmechanism: ${x.mechanism}\nconditions: ${x.conditions}\nadaptation: ${x.adaptation}`,previewUrl:demoUrl('pedagogy',x.id),search:[x.title,x.summary,...(x.keywords||[])].join(' ')
    }));
    const skills=(window.EDUOS_SKILLS||[]).filter(x=>x.subject===subject).map(x=>({
      ...x,kind:/probe|signal|interpreter/.test(x.title)?'diagnostic':'agent',symbol:/probe|signal|interpreter/.test(x.title)?'?':'⌘',name:x.title,en:'Agent-readable skill',claim:x.summary,success:`输出 ${x.output}，并让下一步选择可追溯。`,fade:'完成路由或生成探针后退出；不作为学生界面的常驻组件。',not:x.refusal,slots:[x.input,...(x.searches||[])],contract:`id: ${x.id}\ntrigger: ${x.trigger}\ninput: ${x.input}\noutput: ${x.output}\nsearches:\n${(x.searches||[]).map(s=>`  - ${s}`).join('\n')}\nrefusal: ${x.refusal}`,search:[x.title,x.summary,...(x.keywords||[])].join(' ')
    }));
    return [...content,...pedagogy,...skills];
  }

  function specialData(){
    if(subject==='history'){
      const source=window.EDUOS_HISTORY_STUDIO;
      const kind={orient:'content',compare:'content',lecture:'content',source:'diagnostic',perspective:'scaffold',explain:'scaffold'};
      return {tools:source.tools.map(x=>({...x,kind:kind[x.intent]||'scaffold',symbol:x.icon,contract:x.spec,search:`${x.name} ${x.en} ${x.claim}`})),routes:source.routes,worked:source.worked};
    }
    if(subject==='mathematics'){
      const source=window.EDUOS_MATH_STUDIO;
      return {tools:[...source.tools,...(window.EDUOS_MATH_LIBRARY||[])],routes:source.routes,worked:source.worked};
    }
    if(subject==='english'){
      const source=window.EDUOS_ENGLISH_STUDIO;
      return {tools:source.tools,routes:source.routes,worked:[]};
    }
    return null;
  }

  const special=specialData();
  const tools=special?.tools||normalizeCatalog();
  const examples=(window.EDUOS_EXAMPLES||[]).filter(x=>x.subject===subject);
  const byId=id=>tools.find(x=>x.id===id);
  const routes=special?.routes||buildRoutes();
  let worked=special?.worked||[];
  let selected=tools[0]?.id, filter='all', query='', sequence=[], workedIndex=0;

  function buildRoutes(){
    const content=tools.filter(x=>x.kind==='content'),moves=tools.filter(x=>x.kind==='scaffold'),probes=tools.filter(x=>x.kind==='diagnostic'),agents=tools.filter(x=>x.kind==='agent');
    return [
      {name:'从内容对象到可见学习证据',time:'10–15 MIN',desc:'先让关键关系可操作，再加入一次承诺或比较，最后只采集一个区分性证据。',ids:[content[0]?.id,moves[0]?.id,probes[0]?.id].filter(Boolean)},
      {name:'从学生产物到下一步',time:'5–10 MIN',desc:'保留学生原始操作，由 Agent skill 提出多种解释和最便宜的下一探针。',ids:[content[1]?.id,moves[1]?.id,agents[0]?.id,probes[0]?.id].filter(Boolean)}
    ];
  }

  function buildShell(){
    document.title=`${meta.name}教学工作台 · EduOS`;
    q('#subject-mark').textContent=meta.mark;q('#subject-name').textContent=`${meta.name}教学工作台`;q('#subject-en').textContent=`${meta.en} STUDIO · UNIFIED 0.2`;
    if(subject==='english')q('#worked-nav-label').textContent='Route walkthrough';
    q('#view-title').textContent=meta.title;q('#side-note').innerHTML=`<b>这不是 overview。</b><br>${meta.note}<br><a href="../subjects/${subject}.html">查看学科说明 →</a>`;
    renderFilters();renderIndex();renderStage();renderRoutes();renderWorked();renderSequence();
  }

  function renderFilters(){
    const present=roleOrder.filter(kind=>tools.some(t=>t.kind===kind));
    const entries=[['all','全部'],...present.map(k=>[k,roleLabel[k]])];
    q('#filters').innerHTML=entries.map(([kind,label])=>`<button data-filter="${kind}" class="${filter===kind?'active':''}"><span>${label}</span><i>${kind==='all'?tools.length:tools.filter(t=>t.kind===kind).length}</i></button>`).join('');
    qa('[data-filter]',q('#filters')).forEach(button=>button.onclick=()=>{filter=button.dataset.filter;renderFilters();renderIndex()});
  }

  function visibleTools(){
    const needle=query.trim().toLowerCase();
    return tools.filter(t=>(filter==='all'||t.kind===filter)&&(!needle||`${t.name} ${t.en||''} ${t.claim||''} ${t.search||''}`.toLowerCase().includes(needle)));
  }

  function renderIndex(){
    const list=visibleTools();q('#index-count').textContent=`${list.length} / ${tools.length} COMPONENTS`;
    const previous=selected;if(!list.some(t=>t.id===selected))selected=list[0]?.id;
    let html='';for(const kind of roleOrder){const group=list.filter(t=>t.kind===kind);if(!group.length)continue;html+=`<div class="component-group">${roleGroup[kind]}</div>`+group.map(t=>`<button class="component-item ${t.id===selected?'active':''}" data-tool="${safe(t.id)}"><span class="symbol">${safe(t.symbol||roleIcon[kind])}</span><span><b>${safe(t.name)}</b><small>${safe(t.en||roleLabel[kind])}</small></span><span class="id">${safe(t.id)}</span></button>`).join('')}
    q('#component-list').innerHTML=html||'<p style="padding:20px">没有匹配项。</p>';
    qa('[data-tool]',q('#component-list')).forEach(button=>button.onclick=()=>{selected=button.dataset.tool;renderIndex();renderStage()});
    if(previous!==selected)renderStage();
  }

  function previewFor(t){
    if(t.previewUrl)return `<iframe class="stage-frame" src="${safe(t.previewUrl)}" title="${safe(t.name)}" loading="lazy"></iframe>`;
    if(t.demo)return `<div class="embedded-demo">${t.demo}</div>`;
    return `<div class="agent-demo"><small>AGENT-READABLE SKILL</small><h3>${safe(t.name)}</h3><p>${safe(t.claim)}</p><textarea aria-label="Agent input">${safe(t.input||'在这里放入教师目标、内容和学习者证据。')}</textarea><button data-agent-run>运行最小路由</button><div class="agent-output"><b>输出不是标准答案：</b><br>${safe(t.output||'候选解释、推荐组件、被拒绝的替代方案与下一 probe。')}</div></div>`;
  }

  function renderStage(){
    const t=byId(selected);if(!t){q('#stage').innerHTML='';q('#inspector').innerHTML='';return}
    q('#stage').innerHTML=`<header class="stage-head"><span>${safe(t.symbol||roleIcon[t.kind])}</span><div><h2>${safe(t.name)}</h2><p>${safe(t.claim)}</p></div><button id="add-component">＋ 加入链路</button></header><div class="preview-label">学生 / 教师 / Agent 真正看到的可操作结果</div><div class="stage-preview">${previewFor(t)}</div>`;
    q('#inspector').innerHTML=`<section class="inspect-card"><h3>何时调用与何时撤</h3><dl><dt>TRIGGER</dt><dd>${safe(t.trigger||'由教师目标或学习者证据触发。')}</dd><dt>SUCCESS SIGNAL</dt><dd>${safe(t.success||'产生可检查的学习者行动或产物。')}</dd><dt>FADE / NEXT</dt><dd>${safe(t.fade||'成功后撤除提示，失败时只增加一个最小支撑。')}</dd></dl></section><section class="inspect-card"><h3>内容槽与来源</h3><div class="slots">${(t.slots||[]).map(s=>`<span>${safe(s)}</span>`).join('')}</div><dl><dt>PROVENANCE</dt><dd>${safe(t.origin||t.provenance||'EduOS catalog seed')}</dd></dl></section><section class="inspect-card refusal"><h3>它不是什么</h3><p>${safe(t.not||'不是与学习目标脱离的通用活动。')}</p></section><pre class="contract">${safe(t.contract||'contract: pending')}</pre>`;
    q('#add-component').onclick=()=>{sequence.push(t.id);renderSequence(true)};
    if(t.init)t.init(q('.embedded-demo',q('#stage')));
    qa('[data-reveal]',q('#stage')).forEach(b=>b.onclick=()=>{const a=b.parentElement.querySelector('.answer')||q('.answer',q('#stage'));if(a)a.classList.add('show')});
    const run=q('[data-agent-run]',q('#stage'));if(run)run.onclick=()=>q('.agent-output',q('#stage')).classList.add('show');
    const sound=q('[data-sound]',q('#stage'));if(sound)sound.onclick=()=>{sound.textContent='播放中 · /ʃʊdəv/';setTimeout(()=>sound.textContent='▶ 再播一次 /ʃʊdəv/',900)};
  }

  function renderRoutes(){
    q('#route-grid').innerHTML=routes.map((r,i)=>`<article class="route-card"><small>${safe(r.time||`ROUTE ${i+1}`)}</small><h3>${safe(r.name)}</h3><p>${safe(r.desc)}</p><div class="route-flow">${r.ids.map((id,j)=>`${j?'<b>→</b>':''}<span>${safe(id)} ${safe(byId(id)?.name||'')}</span>`).join('')}</div><div class="route-branch"><span><b>IF SUCCESS</b> stop / fade 当前支持</span><span><b>IF FAIL</b> 依据证据进入下一组件</span></div><button data-route="${i}">载入本节课链路</button></article>`).join('');
    qa('[data-route]',q('#route-grid')).forEach(b=>b.onclick=()=>{sequence=[...routes[+b.dataset.route].ids];renderSequence(true)});
  }

  function normalizedWorked(){
    if(subject==='history')return worked.map(w=>({label:`${w.time} · ${w.id}`,name:w.name,screen:w.screen,support:w.why,evidence:Object.entries(w.e).map(([k,v])=>`${k}: ${v}`).join('\n'),fade:'根据新证据修订判断；不以猜中历史结果作为成功。'}));
    if(subject==='mathematics')return worked.map((w,i)=>({label:`${String(i+1).padStart(2,'0')} · ${w.phase}`,name:w.name,screen:w.screen,support:w.support,evidence:w.evidence,fade:w.fade}));
    if(subject==='english'){
      const route=routes[0]||{ids:[]};return route.ids.map((id,i)=>{const t=byId(id);return {label:`${String(i+1).padStart(2,'0')} · ${t?.id}`,name:t?.name,screen:t?.demo||previewFor(t),support:t?.trigger,evidence:t?.success,fade:t?.fade}})
    }
    const ex=examples[0];if(!ex)return [];
    return ex.flow.map((step,i)=>({label:`${String(i+1).padStart(2,'0')} · ${step}`,name:step,screen:`<iframe src="${demoUrl('example',ex.id)}" title="${safe(ex.title)}"></iframe>`,support:i===0?ex.goal:`当前动作：${step}。保留前一步的学生产物，不替换成 AI 生成答案。`,evidence:ex.observations[Math.min(i,ex.observations.length-1)]||ex.probe,fade:i===ex.flow.length-1?ex.conditions[0]?.preserve||'结束支持并保存迁移证据。':`成功后进入“${ex.flow[i+1]}”；失败时使用 cheap probe：${ex.probe}`}));
  }

  function renderWorked(){
    const items=normalizedWorked();
    q('#worked-rail').innerHTML=items.map((w,i)=>`<button data-worked="${i}" class="${i===workedIndex?'active':''}"><small>${safe(w.label)}</small><b>${safe(w.name)}</b></button>`).join('')||'<p style="padding:16px">Worked example 尚待建设。</p>';
    qa('[data-worked]',q('#worked-rail')).forEach(b=>b.onclick=()=>{workedIndex=+b.dataset.worked;renderWorked()});
    const w=items[workedIndex];if(!w){q('#worked-screen').innerHTML='';q('#worked-agent').innerHTML='';return}
    q('#worked-screen').innerHTML=w.screen;q('#worked-agent').innerHTML=`<h3>这一阶段如何连接</h3><dl><dt>SUPPORT / CONTENT</dt><dd>${safe(w.support)}</dd><dt>OBSERVE</dt><dd>${safe(w.evidence)}</dd><dt>FADE / NEXT</dt><dd>${safe(w.fade)}</dd></dl>`;
  }

  function renderSequence(open=false){
    q('#sequence-count').textContent=sequence.length;
    q('#sequence-items').innerHTML=sequence.length?sequence.map((id,i)=>{const t=byId(id);return `<div class="sequence-item"><span>${i+1}</span><div><b>${safe(t?.id)} ${safe(t?.name)}</b><small>${safe(t?.success)}</small></div><button data-remove="${i}">×</button></div>`}).join(''):'<p>还没有组件。可从组件实验室加入，或载入一条教学链路。</p>';
    qa('[data-remove]',q('#sequence-items')).forEach(b=>b.onclick=()=>{sequence.splice(+b.dataset.remove,1);renderSequence()});
    const kinds=sequence.map(id=>byId(id)?.kind);const checks=[];
    if(kinds.length&&kinds.every(k=>['asset','content'].includes(k)))checks.push(['warn','当前只有内容表征；如果目标包含学习者行动，还需要 scaffold 或 probe。']);
    if(kinds.includes('diagnostic'))checks.push(['ok','包含区分性探针，下一步可以由学生证据决定。']);
    if(kinds.some(k=>['scaffold','metacog','regulation'].includes(k)))checks.push(['ok','包含可撤除的支持；请在成功信号命中时停止。']);
    if(sequence.length>5)checks.push(['warn','超过 5 步。请保留真正会改变学生判断或产物的节点。']);
    q('#sequence-checks').innerHTML=checks.map(([type,msg])=>`<div class="sequence-check ${type==='warn'?'warn':''}">${msg}</div>`).join('');
    if(open)toggleSequence(true);
  }

  function toggleSequence(on){q('#sequence').classList.toggle('open',on);q('#scrim').classList.toggle('show',on);q('#sequence').setAttribute('aria-hidden',String(!on))}
  function setView(view){qa('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));qa('.wb-view').forEach(v=>v.classList.toggle('active',v.id===`${view}-view`));const copy={library:['COMPONENT LAB',meta.title],routes:['LESSON ROUTES','让学生证据决定下一步，而不是活动顺序。'],worked:[subject==='english'?'ROUTE WALKTHROUGH':'WORKED EXAMPLE',subject==='english'?'路线回放：看 scaffold 怎样在成功时撤除；这不是 Gold worked example。':'看 content、pedagogy 与 Agent 如何连接成课堂成品。']}[view];q('#view-kicker').textContent=copy[0];q('#view-title').textContent=copy[1]}

  q('#search').oninput=e=>{query=e.target.value;renderIndex()};qa('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));q('#open-sequence').onclick=()=>toggleSequence(true);q('#close-sequence').onclick=()=>toggleSequence(false);q('#scrim').onclick=()=>toggleSequence(false);q('#clear-sequence').onclick=()=>{sequence=[];renderSequence()};
  buildShell();
})();
