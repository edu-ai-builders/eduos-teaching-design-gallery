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
  let workedTrace=[], workedHelp=0, workedComplete=false;
  const goldExperiences=buildGoldExperiences();
  let activeGold=goldExperiences[0]?.id||'', goldState={};

  function buildGoldExperiences(){
    if(subject==='english')return [
      {id:'EN-G01',module:'听力 · 感知诊断',title:'Perception Rescue',problem:'学习者把 should’ve 听成 should；继续讲语法不会解决声音感知。',promise:'让访客亲自经历一次由错误证据驱动的最小帮助升级。',flow:['第一次听写','目标区间回放','语块边界','重音线索','书写展开'],when:'同一音频区间被反复重听，漏写集中在弱读或连读处，且没有词义查询。',not:'学生已经准确听出 should’ve，只是不理解它的语法意义时。',with:['Replay','Boundary Detection','Attention Cue','Acoustic Alignment'],ask:'Build an adaptive listening-rescue interaction for “I should’ve told you earlier.” Start with an actual listening reconstruction task. If the learner omits the weak form, replay only “should’ve”, then reveal chunk boundaries, stress, and finally “should have”. Show the learner trace and stop immediately when reconstruction succeeds. Do not explain grammar while the evidence still indicates a perception problem.'},
      {id:'EN-G02',module:'阅读 · 语法 · 写作',title:'Meaning → Retrieval → Production',problem:'学习者看懂单词，却不能保留语块结构、提取语法形式并写出自己的表达。',promise:'同一个 learner artifact 从理解、对比、提取一路进入 plus-one 写作。',flow:['意义块映射','撤除中文','最小对比','引导提取','句型产出','Plus-one 写作'],when:'学生能识别词义，但整句映射不稳；或理解正确、产出停顿。',not:'学生尚未理解核心词义或连基本句子都无法感知时。',with:['Semantic Chunk Mapping','Contrast','Partial Completion','Sentence Frame','Writing Skeleton'],ask:'Build a staged English experience that preserves one learner artifact across semantic chunk mapping, support removal, grammar contrast, guided retrieval, sentence framing, and plus-one writing. The learner must act at every stage. Keep selected arguments visible inside the writing skeleton, vary the amount of given text by level, and give structural feedback without replacing the learner’s paragraph.'}
    ];
    if(subject==='history')return [
      {id:'HI-G01',module:'史料 · 解释修订',title:'Evidence-Constrained Interpretation',problem:'“美国为何参加一战”不能被压成单因答案；学生需要让主张经受异质史料的支持与牵制。',promise:'拖放/分类史料，观察证据账本改变，再修订自己的主张。',flow:['提出暂定主张','分类三份史料','查看证据覆盖','识别张力','修订主张'],when:'目标是解释多重历史原因，并区分史料能够支持什么、不能证明什么。',not:'只要求记忆参战日期、人物或条约名称时。',with:['Source Annotation','Evidence Ledger','Claim Revision','Uncertainty Note'],ask:'Build an evidence-constrained history interpretation lab about U.S. entry into World War I. Give the learner a provisional claim and three short, attributed classroom sources. Let the learner classify each source as supports, complicates, or contradicts. Update an evidence-coverage ledger without pretending it is an objective truth score, preserve the original claim, and require a revised claim that acknowledges tension.'},
      {id:'HI-G02',module:'视角 · 史料对话',title:'Source-Grounded Perspective Chat',problem:'“和历史人物聊天”很容易变成无边界角色扮演；历史学习需要可追溯史料、视角比较与解释修订。',promise:'提问、追溯来源、保存证据、切换人物，再修订自己的解释。',flow:['选择历史行动者','基于史料提问','追溯回答来源','保存证据','比较视角','修订解释'],when:'目标是理解同一事件中行动者的处境、利益与可见信息。',not:'用虚构口吻替代史料，或询问人物当时不可能知道的后来结局时。',with:['Source Bundle','Perspective Interrogation','Evidence Notebook','Compare Perspectives'],ask:'Build a source-grounded perspective interrogation about the 1839 opium crisis. Use three columns: source bundle, chat, and evidence notebook. Every answer must cite the provided source bundle; allow saving claims and switching actors. Refuse knowledge outside the actor’s historical horizon. End by comparing perspectives and revising the learner’s interpretation.'}
    ];
    return [];
  }

  function newGoldState(id){
    if(id==='EN-G01')return {plays:0,help:0,attempt:'',confidence:'low',result:'等待第一次听写。',success:false,trace:['09:41　任务开始：无字幕播放完整句']};
    if(id==='EN-G02')return {stage:0,support:'chunks',mapped:'',reconstruct:'',contrast:'',partial:'',frame:'',arguments:[],draft:'',result:'先点击一个意义块。',trace:['10:02　呈现英文原句；中文支持默认关闭']};
    if(id==='HI-G01')return {claim:'美国参战主要因为德国的无限制潜艇战。',classify:{},revised:'',result:'先判断每份史料与暂定主张的关系。',trace:['11:10　保存暂定主张；尚未读取史料']};
    if(id==='HI-G02')return {actor:'林则徐',messages:[],saved:[],highlight:'S1',revision:'',result:'选择一个问题，或直接向行动者提问。',trace:['13:20　载入 1839 年史料包；历史视野锁定在当时']};
    return {};
  }

  function ensureGoldState(){if(!goldState[activeGold])goldState[activeGold]=newGoldState(activeGold);return goldState[activeGold]}
  function traceHtml(trace){return `<ol class="gold-trace">${trace.map(x=>`<li>${safe(x)}</li>`).join('')}</ol>`}
  function progressHtml(exp,current){return `<div class="gold-progress">${exp.flow.map((x,i)=>`<span class="${i<current?'done':i===current?'current':''}"><i>${i+1}</i>${safe(x)}</span>`).join('')}</div>`}

  function goldExplanation(exp,what){
    return `<section class="gold-explain"><div class="gold-what"><small>WHAT JUST HAPPENED</small><h3>${safe(what)}</h3><p>体验先让学习者行动，再让系统依据可见证据选择最小响应。这里的 UI 不是装饰；它承担诊断、支持与撤除。</p></div><div class="boundary-grid"><article><small>WHEN TO USE</small><p>${safe(exp.when)}</p></article><article class="not-use"><small>WHEN NOT TO USE</small><p>${safe(exp.not)}</p></article></div><div class="compose-row"><small>WORKS WELL WITH</small>${exp.with.map(x=>`<span>${safe(x)}</span>`).join('<b>→</b>')}</div><details class="agent-ask"><summary>Ask your Agent</summary><pre>${safe(exp.ask)}</pre></details><div class="four-layer"><article><small>CONCEPT</small><b>${safe(exp.title)}</b><p>这是什么教学机制？</p></article><article><small>DECISION CONTRACT</small><b>${safe(exp.when)}</b><p>什么时候应该调用？</p></article><article><small>EXPERIENCE SPEC</small><b>学习者看见、行动、得到响应，并留下证据。</b><p>调用后具体发生什么？</p></article><article><small>REFERENCE IMPLEMENTATION</small><b>上方可操作微型产品</b><p>用户真的能玩到什么？</p></article></div></section>`;
  }

  function englishPerception(exp,s){
    const sentence=s.success?'I should’ve told you earlier.':s.help>=4?'I / should have / told you / earlier':s.help>=2?'I / should’ve / told you / earlier':s.help>=1?'I should’ve told you earlier.':'I should’ve told you earlier.';
    const target=s.help>=3?'<mark>SHOULD</mark><span class="weak-form">’ve</span>':s.help>=1?'<mark>should’ve</mark>':'should’ve';
    const shown=sentence.replace('should’ve',target);
    return `<div class="gold-live english-live"><header class="gold-context"><div><small>LEARNING SITUATION · REAL CONTENT</small><h2>你听见的是 <em>should</em>，还是 <em>should’ve</em>？</h2><p>先完成一句真实听写。系统不会因为出错就立刻讲语法。</p></div><div class="learner-switch"><small>SIMULATE LEARNER STATE</small><button data-perception-state="novice" class="${s.confidence==='low'?'active':''}">novice</button><button data-perception-state="partial" class="${s.confidence==='mid'?'active':''}">partial</button><button data-perception-state="ready" class="${s.confidence==='high'?'active':''}">ready</button></div></header>${progressHtml(exp,Math.min(s.help,4))}<div class="experience-grid"><section class="experience-main"><div class="audio-player ${s.plays?'playing':''}"><button data-listen>▶</button><div><b>Listen once</b><span>${s.help?`当前只播放：${s.help===1?'should’ve':'完整句'}`:'无字幕 · 正常语速'}</span></div><div class="audio-bars">${Array.from({length:22},(_,i)=>`<i style="height:${18+(i*23)%72}%"></i>`).join('')}</div></div><label class="reconstruct-label">What did you hear?<span>I <input data-perception-input value="${safe(s.attempt)}" placeholder="should / should’ve"> told you earlier.</span></label><div class="experience-actions"><button class="primary" data-perception-submit>检查我的听写</button><button data-perception-help ${s.success||s.help>=4?'disabled':''}>我还听不出 · 给一个线索</button></div><div class="response-card ${s.success?'success':''}"><small>SYSTEM RESPONSE</small><b>${safe(s.result)}</b>${s.help?`<div class="rescue-line">${shown}</div>`:''}${s.help>=4?'<p><b>should’ve = should have</b>。这是最后一级；此前都没有解释语法。</p>':''}</div></section><aside class="evidence-dock"><small>LEARNING EVIDENCE</small><div><span>full plays</span><b>${s.plays}</b></div><div><span>weak-form omission</span><b>${s.attempt&&!/(should\s*have|should['’]?ve)/i.test(s.attempt)?'yes':'—'}</b></div><div><span>confidence</span><b>${s.confidence}</b></div><div class="next-decision"><span>NEXT SCAFFOLD</span><b>${s.success?'fade all support':['observe first','target replay','boundary cue','stress cue','written expansion'][s.help]}</b></div><small>LEARNER TRACE</small>${traceHtml(s.trace)}</aside></div></div>${goldExplanation(exp,s.success?'学生在最小必要支持下重建了声音形式；支架现在消失。':'系统把“听不懂”先当作可验证的感知问题，而不是语法问题。')}`;
  }

  function englishProduction(exp,s){
    const stages=['意义块映射','撤除中文并重建','时态最小对比','引导提取','个人句型产出','Plus-one 写作'];
    const meanings={a:['I’ve been waiting','一直在等'],b:['for you','等的是你'],c:['since noon','从中午开始']};
    let task='';
    if(s.stage===0)task=`<div class="support-tabs"><button data-support="chunks" class="${s.support==='chunks'?'active':''}">Meaning chunks</button><button data-support="chinese" class="${s.support==='chinese'?'active':''}">Chinese support</button><button data-support="none" class="${s.support==='none'?'active':''}">No support</button></div><div class="semantic-stage">${Object.entries(meanings).map(([k,v])=>`<button data-meaning="${k}" class="tone-${k} ${s.mapped===k?'open':''}"><span>${v[0]}</span>${s.support==='chinese'||s.mapped===k?`<b>${v[1]}</b>`:''}</button>`).join('')}</div><button class="primary" data-mrp-next>我看见了三个意义块 → 撤支持</button>`;
    if(s.stage===1)task=`<p class="task-prompt">中文支持已经撤掉。把刚才的意义块从记忆中放回句子。</p><div class="sentence-task">I’ve been waiting <input data-reconstruct value="${safe(s.reconstruct)}" placeholder="______"> since noon.</div><button class="primary" data-reconstruct-submit>检查重建</button>`;
    if(s.stage===2)task=`<p class="task-prompt">哪一句表达“过去本应该做、但没有做”？</p><div class="contrast-choice"><button data-mrp-contrast="call" class="${s.contrast==='call'?'picked':''}">I should call you.</button><button data-mrp-contrast="called" class="${s.contrast==='called'?'picked':''}">I should have called you.</button></div>`;
    if(s.stage===3)task=`<p class="task-prompt">把刚才识别出的结构提取出来。</p><div class="sentence-task">I <input data-partial value="${safe(s.partial)}" placeholder="______"> have checked the address.</div><button class="primary" data-partial-submit>提交</button>`;
    if(s.stage===4)task=`<p class="task-prompt">现在把结构带进你自己的昨天。</p><div class="sentence-task">I should have <input data-frame value="${safe(s.frame)}" placeholder="called my friend">.</div><button class="primary" data-frame-submit>保存我的句子</button>`;
    if(s.stage===5){const args=[['human','教师理解具体写作语境'],['speed','AI 能即时返回建议'],['depend','过度依赖会削弱自我修改'],['access','AI 让更多学生获得反馈']];task=`<div class="writing-brief"><small>WRITING EXTENSION · 来自 Language Learning Studio SOP Kit</small><h3>Should students rely on AI feedback when writing?</h3><p>先选观点；系统推荐骨架。不是先生成范文。</p></div><div class="argument-pool">${args.map(([id,x])=>`<button data-argument="${id}" class="${s.arguments.includes(id)?'picked':''}">${x}</button>`).join('')}</div><div class="skeleton-card"><small>RECOMMENDED SKELETON</small><b>${s.arguments.includes('speed')&&s.arguments.includes('depend')?'Concession → Risk → Position':'Claim → Reason → Example'}</b><p><span>GIVEN</span> Although AI feedback can be immediate,</p><p><span>BLANK</span> <input data-draft value="${safe(s.draft)}" placeholder="students still need to…"></p></div><button class="primary" data-writing-submit>检查结构，不代写</button>`}
    const artifact=`<div class="artifact-stack"><small>LEARNER ARTIFACT · 一直保留</small><p><b>Meaning:</b> ${s.reconstruct||'—'}</p><p><b>Grammar:</b> ${s.partial||'—'}</p><p><b>My sentence:</b> ${s.frame?`I should have ${safe(s.frame)}.`:'—'}</p><p><b>Writing:</b> ${s.draft||'—'}</p></div>`;
    return `<div class="gold-live english-live"><header class="gold-context"><div><small>LEARNING SITUATION · MODULE CHAIN</small><h2>看懂以后，怎样真的变成自己的表达？</h2><p>阅读、词义、语法、提取和写作共享同一份学生产物。</p></div><span class="module-pill">${stages[s.stage]}</span></header>${progressHtml(exp,s.stage)}<div class="experience-grid"><section class="experience-main"><div class="mrp-task">${task}</div><div class="response-card"><small>PEDAGOGICAL RESPONSE</small><b>${safe(s.result)}</b></div></section><aside class="evidence-dock">${artifact}<small>LEARNER TRACE</small>${traceHtml(s.trace)}</aside></div></div>${goldExplanation(exp,s.stage===5?'SOP Kit 的 plus-one 让“已给部分”和“学生承担部分”同时可见；反馈只检查结构。':'支架逐步减少，但前一步的理解与产出没有被下一张卡替换。')}`;
  }

  function historyEvidence(exp,s){
    const sources=[
      {id:'A',type:'总统演说 · 1917-04-02',factor:'政治理念',text:'Wilson 向国会主张：“The world must be made safe for democracy.” 同时把德国潜艇战描述为对中立权利的挑战。'},
      {id:'B',type:'外交电报 · 1917-01（课堂转述）',factor:'国家安全',text:'Zimmermann Telegram 提议：若美国参战，德国将寻求墨西哥结盟，并支持其收复失地。'},
      {id:'C',type:'贸易与金融记录 · 1914–1917（课堂摘要）',factor:'经济联系',text:'美国对协约国的出口和贷款迅速增加，使战争结果与美国商业、金融利益产生更深联系。'}
    ];
    const labels={supports:'SUPPORTS',complicates:'COMPLICATES',contradicts:'CONTRADICTS'};
    const counts={supports:0,complicates:0,contradicts:0};Object.values(s.classify).forEach(x=>counts[x]++);
    return `<div class="gold-live history-live"><header class="gold-context"><div><small>HISTORICAL THINKING LAB · REAL SOURCES</small><h2>Why did the United States enter World War I?</h2><p>你不是在猜标准答案；你在检查一个暂定主张能否承受多种史料。</p></div><span class="module-pill">史料解释</span></header>${progressHtml(exp,Object.keys(s.classify).length?Math.min(4,Object.keys(s.classify).length+1):0)}<div class="history-claim"><small>WORKING CLAIM · 会被保留</small><textarea data-history-claim>${safe(s.claim)}</textarea></div><div class="source-lab"><section class="source-stack">${sources.map(src=>`<article class="source-card"><header><b>Source ${src.id}</b><span>${src.type}</span></header><p>${src.text}</p><div>${Object.entries(labels).map(([k,v])=>`<button data-source="${src.id}" data-relation="${k}" class="${s.classify[src.id]===k?'active':''}">${v}</button>`).join('')}</div></article>`).join('')}</section><aside class="ledger"><small>EVIDENCE LEDGER</small><h3>Your current evidence coverage</h3><p>不是历史真相分数；只表示你目前使用了哪些类型的证据。</p>${sources.map(src=>`<div class="ledger-row"><span>${src.factor}</span><i><b style="width:${s.classify[src.id]?78:8}%"></b></i><em>${s.classify[src.id]?labels[s.classify[src.id]]:'未分类'}</em></div>`).join('')}<div class="relation-count"><span>support ${counts.supports}</span><span>complicate ${counts.complicates}</span><span>contradict ${counts.contradicts}</span></div><small>LEARNER TRACE</small>${traceHtml(s.trace)}</aside></div><div class="revision-zone"><div><small>ORIGINAL CLAIM</small><p>${safe(s.claim)}</p></div><label><small>REVISE AFTER EVIDENCE</small><textarea data-history-revision placeholder="至少承认一个不同原因或证据张力…">${safe(s.revised)}</textarea></label><button class="primary" data-history-revise>保存修订</button></div><div class="response-card"><small>SYSTEM RESPONSE</small><b>${safe(s.result)}</b></div></div>${goldExplanation(exp,s.revised?'原始主张与修订版本并排保存；学习成果是解释变得更能容纳证据。':'证据账本只显示覆盖与张力，不伪装成客观因果权重。')}`;
  }

  function historyChat(exp,s){
    const sources={S1:['林则徐奏折与禁烟告示（课堂转述）','鸦片贸易被描述为损害民生、白银与国家法纪，禁绝被视为必须执行的国家责任。'],S2:['Charles Elliot 通知（1839，课堂转述）','英方要求商人交出鸦片，同时强调保护英国臣民与财产，并试图把私人损失转为国家交涉。'],S3:['广州贸易记录与商人陈述（课堂摘要）','合法贸易、鸦片走私、行商信用与地方生计相互缠绕；骤然中断会让多方承担不同成本。']};
    const actors=['林则徐','Charles Elliot','广州行商'];
    return `<div class="gold-live history-live"><header class="gold-context"><div><small>SOURCE-GROUNDED PERSPECTIVE INTERROGATION</small><h2>不要“和历史人物随便聊”；让每句话回到史料。</h2><p>时间边界：广州，1839 年。行动者不知道后来条约的具体结果。</p></div><span class="module-pill">视角比较</span></header>${progressHtml(exp,s.messages.length?Math.min(5,s.saved.length+2):0)}<div class="perspective-grid"><section class="source-panel"><small>SOURCE BUNDLE</small>${Object.entries(sources).map(([id,x])=>`<article class="${s.highlight===id?'highlight':''}"><b>${id} · ${x[0]}</b><p>${x[1]}</p></article>`).join('')}</section><section class="perspective-chat"><div class="actor-tabs">${actors.map(a=>`<button data-actor="${a}" class="${s.actor===a?'active':''}">${a}</button>`).join('')}</div><div class="chat-stream">${s.messages.length?s.messages.map((m,i)=>`<div class="${m.who}"><small>${m.who==='student'?'YOU':safe(m.actor)}</small><p>${safe(m.text)}</p>${m.sources?m.sources.map(id=>`<button data-source-ref="${id}">[${id}]</button>`).join(''):''}${m.who==='actor'?`<button class="save-claim" data-save-message="${i}">＋ Save claim</button>`:''}</div>`).join(''):'<div class="empty-chat">先问：你当时最担心失去什么？</div>'}</div><div class="question-chips"><button data-question="你当时最担心失去什么？">最担心什么？</button><button data-question="你认为对方误解了什么？">对方误解什么？</button><button data-question="1842 年的结果证明你对了吗？">询问后来结局</button></div><div class="chat-input"><input data-chat-question placeholder="基于史料继续追问…"><button data-chat-send>发送</button></div><div class="response-card"><small>SYSTEM BOUNDARY</small><b>${safe(s.result)}</b></div></section><aside class="notebook"><small>EVIDENCE NOTEBOOK</small>${s.saved.length?s.saved.map((x,i)=>`<article><b>${safe(x.actor)}</b><p>${safe(x.text)}</p><span>${x.sources.join(' · ')}</span></article>`).join(''):'<p>保存一条有来源的判断；它会留到视角比较阶段。</p>'}<small>LEARNER TRACE</small>${traceHtml(s.trace)}</aside></div><div class="revision-zone compare-revision"><div><small>PERSPECTIVES SEEN</small><p>${[...new Set(s.messages.filter(x=>x.actor).map(x=>x.actor))].join(' ↔ ')||'尚未比较'}</p></div><label><small>REVISE YOUR INTERPRETATION</small><textarea data-chat-revision placeholder="同一危机为何会被不同角色理解成不同问题？">${safe(s.revision)}</textarea></label><button class="primary" data-chat-revise>保存解释</button></div></div>${goldExplanation(exp,s.saved.length?'Chat 只是界面；真正的教学机制是史料约束、证据保存、视角切换与解释修订。':'每个回答都暴露来源边界，超出人物历史视野的问题会被明确拒绝。')}`;
  }

  function renderGoldWorked(){
    const exp=goldExperiences.find(x=>x.id===activeGold)||goldExperiences[0];activeGold=exp.id;const s=ensureGoldState();
    q('.worked-grid').classList.add('gold-mode');
    q('#worked-rail').innerHTML=`<div class="rail-intro"><small>GOLD EXPERIENCES</small><p>先玩，再读解释。</p></div>${goldExperiences.map(x=>`<button data-gold-select="${x.id}" class="${x.id===activeGold?'active':''}"><small>${safe(x.id)} · ${safe(x.module)}</small><b>${safe(x.title)}</b><span>${safe(x.problem)}</span></button>`).join('')}<button class="rail-reset" data-gold-reset>↺ 重置当前体验</button>`;
    q('#worked-agent').innerHTML='';
    q('#worked-screen').innerHTML=activeGold==='EN-G01'?englishPerception(exp,s):activeGold==='EN-G02'?englishProduction(exp,s):activeGold==='HI-G01'?historyEvidence(exp,s):historyChat(exp,s);
    qa('[data-gold-select]',q('#worked-rail')).forEach(b=>b.onclick=()=>{activeGold=b.dataset.goldSelect;renderWorked()});
    q('[data-gold-reset]',q('#worked-rail')).onclick=()=>{goldState[activeGold]=newGoldState(activeGold);renderWorked()};
    bindGoldInteractions(exp,s);
  }

  function bindGoldInteractions(exp,s){
    const root=q('#worked-screen');const one=(sel,fn)=>{const el=q(sel,root);if(el)el.onclick=fn};
    if(activeGold==='EN-G01'){
      one('[data-listen]',()=>{s.plays++;s.trace.push(`09:${41+s.plays}　播放${s.help===1?'目标区间 should’ve':'完整句'}（第 ${s.plays} 次）`);s.result=s.help?'系统只重播最小声音区间，不打开全文字幕。':'请把听到的缺口写下来。';renderGoldWorked()});
      one('[data-perception-submit]',()=>{s.attempt=q('[data-perception-input]',root).value.trim();if(/(should\s*have|should['’]?ve)/i.test(s.attempt)){s.success=true;s.result='✓ 重建成功。边界、重音和书写展开全部撤除，回到原速完整句。';s.trace.push('09:47　正确重建 should’ve；success signal 命中 → fade support')}else{s.help=Math.max(1,s.help);s.result='漏写集中在弱读区间。下一步只重播 should’ve，不讲时态。';s.trace.push('09:42　只写出 should；弱读 ’ve 遗漏 → 感知风险')}renderGoldWorked()});
      one('[data-perception-help]',()=>{s.help=Math.min(4,s.help+1);s.result=['','只重播 should’ve；观察是否仍漏听。','边界出现：I / should’ve / told you / earlier。','只标出重音 SHOULD；弱读 ’ve 保持轻。','最后才展开 should’ve = should have。'][s.help];s.trace.push(`09:${42+s.help}　请求帮助 → ${['','target replay','boundary cue','stress cue','written expansion'][s.help]}`);renderGoldWorked()});
      qa('[data-perception-state]',root).forEach(b=>b.onclick=()=>{s.confidence={novice:'low',partial:'mid',ready:'high'}[b.dataset.perceptionState];s.help={novice:2,partial:1,ready:0}[b.dataset.perceptionState];s.success=false;s.result=`模拟 ${b.dataset.perceptionState}：推荐支架已根据证据改变。`;s.trace.push(`09:4${s.trace.length}　learner state → ${b.dataset.perceptionState}`);renderGoldWorked()});
    }
    if(activeGold==='EN-G02'){
      qa('[data-support]',root).forEach(b=>b.onclick=()=>{s.support=b.dataset.support;s.trace.push(`10:0${s.trace.length+2}　support → ${s.support}`);renderGoldWorked()});
      qa('[data-meaning]',root).forEach(b=>b.onclick=()=>{s.mapped=b.dataset.meaning;s.result='英语与中文共享同一语义颜色；对齐发生在 phrase，而不是单词。';s.trace.push(`10:03　查看 meaning chunk ${s.mapped}`);renderGoldWorked()});
      one('[data-mrp-next]',()=>{s.support='none';s.stage=1;s.result='中文已撤除；现在检验能否从记忆重建语块。';s.trace.push('10:04　主动关闭中文支持 → retrieval probe');renderGoldWorked()});
      one('[data-reconstruct-submit]',()=>{s.reconstruct=q('[data-reconstruct]',root).value.trim();if(/for\s+you/i.test(s.reconstruct)){s.stage=2;s.result='✓ 语块重建成功。进入时态意义对比。';s.trace.push('10:05　reconstructed “for you” without L1 support')}else{s.result='先恢复语块边界，不恢复整句翻译。';s.support='chunks';s.trace.push('10:05　reconstruction failed → restore boundaries only')}renderGoldWorked()});
      qa('[data-mrp-contrast]',root).forEach(b=>b.onclick=()=>{s.contrast=b.dataset.mrpContrast;if(s.contrast==='called'){s.stage=3;s.result='✓ should have called 指向过去未完成的行动。现在提取结构。';s.trace.push('10:06　minimal contrast correct')}else{s.result='这句是现在/将来的建议；请保留两句并排再比较。';s.trace.push('10:06　contrast confusion → keep both examples visible')}renderGoldWorked()});
      one('[data-partial-submit]',()=>{s.partial=q('[data-partial]',root).value.trim();if(/^should$/i.test(s.partial)){s.stage=4;s.result='✓ 零提示提取成功；框架只保留一个意义槽。';s.trace.push('10:07　retrieved should with hint_cost 0')}else{s.result='只给首字母 s_____，不显示完整答案。';s.partial='s_____';s.trace.push('10:07　retrieval pause → one-letter cue')}renderGoldWorked()});
      one('[data-frame-submit]',()=>{s.frame=q('[data-frame]',root).value.trim();if(s.frame){s.stage=5;s.result='句型已进入个人语境。下一步不是更多填空，而是 plus-one 写作。';s.trace.push('10:08　saved learner-generated sentence → writing transfer')}else{s.result='先承担一个意义槽；系统不会替你完成句子。';renderGoldWorked()}});
      qa('[data-argument]',root).forEach(b=>b.onclick=()=>{const id=b.dataset.argument;s.arguments=s.arguments.includes(id)?s.arguments.filter(x=>x!==id):[...s.arguments,id].slice(-2);s.result='已根据你选的观点推荐骨架；观点仍是你的，不是 Agent 生成的。';s.trace.push(`10:09　selected argument: ${id}`);renderGoldWorked()});
      one('[data-writing-submit]',()=>{s.draft=q('[data-draft]',root).value.trim();s.result=s.draft?'结构反馈：你完成了 concession 后的立场句。下一轮可撤掉 given starter；内容不被 AI 改写。':'先完成 blank 部分。Plus-one 必须让学生实际写。';if(s.draft)s.trace.push('10:11　learner wrote blank slot → structural feedback only');renderGoldWorked()});
    }
    if(activeGold==='HI-G01'){
      qa('[data-source][data-relation]',root).forEach(b=>b.onclick=()=>{s.claim=q('[data-history-claim]',root).value.trim()||s.claim;s.classify[b.dataset.source]=b.dataset.relation;s.result=`Source ${b.dataset.source} 已记为 ${b.dataset.relation}。账本更新的是你的证据覆盖，不是“正确因果权重”。`;s.trace.push(`11:${10+Object.keys(s.classify).length}　Source ${b.dataset.source} → ${b.dataset.relation}`);renderGoldWorked()});
      one('[data-history-revise]',()=>{s.revised=q('[data-history-revision]',root).value.trim();s.result=s.revised?'✓ 修订已与原始主张并排保存。检查它是否承认至少两类原因。':'修订不能留空；历史解释的成果是 claim revision。';if(s.revised)s.trace.push('11:16　revised claim after evidence tension');renderGoldWorked()});
    }
    if(activeGold==='HI-G02'){
      qa('[data-actor]',root).forEach(b=>b.onclick=()=>{s.actor=b.dataset.actor;s.result=`视角切换到 ${s.actor}；此前保存的证据不会消失。`;s.trace.push(`13:${20+s.trace.length}　switch perspective → ${s.actor}`);renderGoldWorked()});
      const sendQuestion=text=>{const later=/1842|后来|结果|条约|战争赢/i.test(text);s.messages.push({who:'student',text});if(later){s.messages.push({who:'actor',actor:s.actor,text:'这个问题超出了我在 1839 年能够知道的范围。我可以说明当时的担忧，但不能把后来结果当成我的既有知识。',sources:['S1','S2']});s.result='已触发 historical horizon boundary：拒绝事后全知。';s.trace.push('13:24　question exceeded historical horizon → refusal')}else{const replies={林则徐:['我最担心鸦片继续侵蚀民生、白银与法纪；在我的职责范围内，这首先是必须执行的国家禁令。',['S1']], 'Charles Elliot':['我必须保护英国臣民及其财产，同时处理商人交出鸦片造成的损失与责任。',['S2']], '广州行商':['我担心的是信用与生计同时断裂；合法贸易、走私与官府责任已经缠在一起。',['S3']]};const [answer,sources]=replies[s.actor];s.messages.push({who:'actor',actor:s.actor,text:answer,sources});s.highlight=sources[0];s.result='回答已限定在史料包；点击引用可回看证据。';s.trace.push(`13:2${s.trace.length}　${s.actor} answered from ${sources.join(', ')}`)}renderGoldWorked()};
      qa('[data-question]',root).forEach(b=>b.onclick=()=>sendQuestion(b.dataset.question));one('[data-chat-send]',()=>{const text=q('[data-chat-question]',root).value.trim();if(text)sendQuestion(text)});
      qa('[data-source-ref]',root).forEach(b=>b.onclick=()=>{s.highlight=b.dataset.sourceRef;s.result=`已回到 ${s.highlight}。回答不替代史料。`;s.trace.push(`13:2${s.trace.length}　opened citation ${s.highlight}`);renderGoldWorked()});
      qa('[data-save-message]',root).forEach(b=>b.onclick=()=>{const m=s.messages[+b.dataset.saveMessage];if(m&&m.who==='actor')s.saved.push({actor:m.actor,text:m.text,sources:m.sources});s.result='判断已保存到证据笔记本；切换人物后仍然保留。';s.trace.push(`13:2${s.trace.length}　saved grounded claim from ${m?.actor}`);renderGoldWorked()});
      one('[data-chat-revise]',()=>{s.revision=q('[data-chat-revision]',root).value.trim();s.result=s.revision?'✓ 解释修订已保存。成功不是聊得更久，而是能用多视角和史料重写判断。':'先写一条自己的解释，Agent 不代写。';if(s.revision)s.trace.push('13:31　revised interpretation across perspectives');renderGoldWorked()});
    }
  }

  function buildRoutes(){
    const content=tools.filter(x=>x.kind==='content'),moves=tools.filter(x=>x.kind==='scaffold'),probes=tools.filter(x=>x.kind==='diagnostic'),agents=tools.filter(x=>x.kind==='agent');
    return [
      {name:'从内容对象到可见学习证据',time:'10–15 MIN',desc:'先让关键关系可操作，再加入一次承诺或比较，最后只采集一个区分性证据。',ids:[content[0]?.id,moves[0]?.id,probes[0]?.id].filter(Boolean)},
      {name:'从学生产物到下一步',time:'5–10 MIN',desc:'保留学生原始操作，由 Agent skill 提出多种解释和最便宜的下一探针。',ids:[content[1]?.id,moves[1]?.id,agents[0]?.id,probes[0]?.id].filter(Boolean)}
    ];
  }

  function demoShell(kicker,title,body,footer='先操作，再看系统根据你的动作留下什么证据。'){
    return `<div class="micro-product"><header><span>${safe(kicker)}</span><b>${safe(title)}</b><i>LIVE</i></header><div class="micro-body">${body}</div><footer data-demo-status>${safe(footer)}</footer></div>`;
  }

  function englishDemoFor(t){
    const id=t.sourceId;
    if(id==='attention-cue')return demoShell('LISTENING PLAYER','你一直漏掉的是哪一小段？',`<div class="demo-toggle"><button data-mode="raw" class="active">原样</button><button data-mode="focus">目标块</button><button data-mode="stress">重音</button><button data-mode="weak">弱读</button></div><div class="demo-sentence" data-sentence>I should have gone already.</div><div class="signal-row"><span>replay_count <b>3</b></span><span>gloss_count <b>0</b></span></div>`,'反复重听但没有查词：先缩窄注意，不讲语法。');
    if(id==='boundary-detection')return demoShell('CHUNK LAB','在你听到停顿的地方切一刀',`<p class="demo-hint">点击圆点，切成自然语块。</p><div class="chunk-line" data-chunks>I <button data-gap="0">·</button> would’ve <button data-gap="1">·</button> liked <button data-gap="2">·</button> to go <button data-gap="3">·</button> with you.</div><button class="demo-action" data-check-chunks>检查切分</button>`);
    if(id==='acoustic-alignment')return demoShell('AUDIO ALIGNMENT','点一个词，只播它自己',`<div class="demo-sentence word-clicks"><button>I</button><button>should</button><button>have</button><button>gone</button></div><div class="waveform">${Array.from({length:28},(_,i)=>`<i style="height:${20+((i*17)%65)}%"></i>`).join('')}</div><div class="signal-row"><span>目标区间 <b data-audio-range>—</b></span><span>回放 <b data-audio-count>0</b></span></div>`,'系统记录“哪 0.6 秒”被反复播放，而不只记录总次数。');
    if(id==='lexical-gloss')return demoShell('CONTEXT GLOSS','只给这一处的意思',`<div class="demo-toggle"><button data-gloss-mode="context" class="active">语境式</button><button data-gloss-mode="dictionary">词典式</button></div><div class="demo-sentence">Can you <button class="inline-word" data-gloss="pick up">pick up</button> the phone? I’m <button class="inline-word" data-gloss="tied up">tied up</button>.</div><div class="demo-result" data-gloss-out>点高亮词组。</div>`);
    if(id==='semantic-chunk-mapping')return demoShell('BILINGUAL MAPPING','两种语言共享同一组意义颜色',`<p class="demo-hint">悬停或点击任一块；对应意义会同时亮起。</p><div class="bilingual"><div><small>ENGLISH</small><button data-map="a">I’ve been waiting</button><button data-map="b">for you</button><button data-map="c">all morning</button></div><div><small>中文</small><button data-map="a">一直在等</button><button data-map="b">等的是你</button><button data-map="c">整整一上午</button></div></div><div class="demo-result">整句翻译会盖掉结构；块对块让结构保持可见。</div>`);
    if(id==='visual-grounding')return demoShell('VISUAL GROUNDING','哪个动作是 pour？',`<div class="demo-sentence">She <mark>poured</mark> it slowly.</div><div class="picture-options"><button data-picture="pour">🫗<small>动作 A</small></button><button data-picture="stir">🥄<small>动作 B</small></button><button data-picture="freeze">🧊<small>动作 C</small></button></div><div class="demo-result" data-picture-out>选一个画面，不先读定义。</div>`);
    if(id==='context-expansion')return demoShell('SCENE REVEAL','“handle it” 为什么在这里带着不信任？',`<div class="demo-sentence">She said she’d <mark>handle it</mark>.</div><div class="reveal-grid"><button data-context="上一句">上一句</button><button data-context="下一句">下一句</button><button data-context="人物关系">人物关系</button><button data-context="场景">场景</button></div><div class="context-stack" data-context-out></div>`,'一次只补一条语境；语气不是靠语法说明得出来的。');
    if(id==='pattern-extraction')return demoShell('PATTERN FINDER','点击三句里位置相同的骨架',`<div class="pattern-lines">${['Would you mind waiting?','Would you like some tea?','Would you rather stay?'].map((s,i)=>`<button data-pattern="${i}">${s}</button>`).join('')}</div><button class="demo-action" data-pattern-check>显示共同骨架</button><div class="demo-result" data-pattern-out>先观察，不先给术语。</div>`);
    if(id==='contrast')return demoShell('MINIMAL CONTRAST','选一句：“我正在逐渐习惯早起”',`<div class="contrast-cards"><button data-contrast="used">I used to get up early.</button><button data-contrast="be">I’m used to getting up early.</button><button data-contrast="get">I’m getting used to getting up early.</button></div><div class="demo-result" data-contrast-out>三个形式并排；差异必须由一个真实语境触发。</div>`);
    if(id==='analogy')return demoShell('BRIDGE','把新结构挂到已有表达上',`<div class="bridge"><span>中文：我<b>本来应该</b>早点打电话</span><b>⇄</b><span>English: I <mark>should have</mark> called earlier.</span></div><button class="demo-action" data-bridge>用自己的经历替换 called</button><div class="demo-result" data-bridge-out>桥搭上就停，不顺势展开四种用法。</div>`);
    if(id==='rule-induction')return demoShell('RULE INDUCTION','先写你的规则，再解锁参考',`<div class="mini-examples">I should have called.　You could have told me.　They might have left.</div><textarea data-rule-input placeholder="用自己的话说共同点…"></textarea><div><button class="demo-action" data-rule-submit>提交我的说法</button><button class="demo-action ghost" data-rule-reference disabled>参考归纳</button></div><div class="demo-result" data-rule-out>参考答案暂时锁住。</div>`);
    if(id==='minimal-grammar')return demoShell('3-SENTENCE LIMIT','语法卡必须短到能立刻转练',`<textarea data-grammar>should have + 过去分词，表示过去本应该做但没有做。</textarea><div class="signal-row"><span>句数 <b data-grammar-count>1 / 3</b></span><span>字符 <b data-char-count>35 / 90</b></span></div><button class="demo-action" data-grammar-check>检查并转练</button>`);
    if(id==='sentence-frame'||id==='word-bank'||id==='partial-completion')return demoShell('PRODUCTION BUILDER',id==='word-bank'?'从三个词里选一个，再撤掉词库':id==='partial-completion'?'每次只揭一个字母':'只留一个真正需要学生承担的空',`<div class="demo-sentence">I should have <span class="blank" data-production-blank>______</span> earlier.</div>${id==='word-bank'?'<div class="word-bank"><button>called</button><button>left</button><button>asked</button></div>':id==='partial-completion'?'<button class="demo-action" data-letter>给一个字母</button>':'<input data-production-input placeholder="called / left / asked…"><button class="demo-action" data-production-submit>说出来</button>'}<div class="demo-result" data-production-out>提示用量会成为掌握度证据。</div>`);
    if(id==='guided-retelling')return demoShell('RETELLING','关键词一次释放一个',`<div class="keyword-row" data-keywords><span>waiting</span></div><textarea data-retell placeholder="用已出现的关键词把故事讲下去…"></textarea><button class="demo-action" data-more-keyword>下一个关键词</button><button class="demo-action ghost" data-retell-check>检查覆盖</button><div class="demo-result" data-retell-out>没用上的词，才是需要回头练的。</div>`);
    if(id==='shadowing-support'||id==='pronunciation-focus')return demoShell('SPEAKING PLAYER',id==='shadowing-support'?'播放一句，自动等你跟读':'一次只练一个语音现象',`<div class="shadow-lines"><button class="active">I’ve been waiting all morning.</button><button>He never showed up.</button><button>He should have called.</button></div><button class="demo-action" data-shadow>${id==='shadowing-support'?'▶ 开始自动停顿':'切换：弱读 /əv/'}</button><div class="demo-result" data-shadow-out>等待操作。</div>`);
    if(['detection','cue','elicitation','metalinguistic-hint','reformulation','full-model'].includes(id))return demoShell('FEEDBACK LADDER',`当前一级：${t.name}`,`<div class="chat-mini"><div class="student">Yesterday I go to the store.</div><div class="coach" data-feedback-coach>${id==='detection'?'这句里有一处时态问题。找找看？':id==='cue'?'再看看时态。':id==='elicitation'?'你觉得哪个词有点怪？':id==='metalinguistic-hint'?'这里需要过去时。':id==='reformulation'?'Oh, you went to the store yesterday? What did you get?':'Yesterday I went to the store. 现在换一个时间词重说。'}</div></div><input data-feedback-input placeholder="学生在这里修正…"><button class="demo-action" data-feedback-submit>提交修正版</button><div class="demo-result" data-feedback-out>本级仍保留的学生工作：${id==='full-model'?'重说与迁移':'定位并生成正确形式'}。</div>`);
    if(id==='prediction')return demoShell('PREDICT BEFORE PLAY','“I waited two hours…” 下一句最可能是什么？',`<div class="choice-stack"><button data-predict="right">He never showed up.</button><button data-predict="wrong">I love waiting.</button><button data-predict="wrong">The coffee was cold.</button></div><div class="demo-result" data-predict-out>选完立刻播放；猜错也会提高注意。</div>`);
    if(id==='confidence-rating'||id==='error-reflection')return demoShell('LEARNER SIGNAL',id==='confidence-rating'?'这句你听懂了吗？':'刚刚为什么没答对？',id==='confidence-rating'?`<div class="confidence"><button data-confidence="high">🙂<small>清楚</small></button><button data-confidence="mid">😐<small>半懂</small></button><button data-confidence="low">😟<small>没懂</small></button></div><div class="demo-result" data-signal-out>这不是评价；它是下一支架的路由信号。</div>`:`<div class="choice-stack"><button data-reflect="perception">没听清</button><button data-reflect="lexis">不认识词</button><button data-reflect="retrieval">知道但反应不过来</button><button data-reflect="rule">规则记混了</button></div><div class="demo-result" data-signal-out>同一个错误，四种归因导向四条不同路线。</div>`);
    if(id==='strategy-suggestion')return demoShell('EVIDENCE ROUTER','让数据而不是口头禅决定建议',`<div class="evidence-table"><span>重听次数 <b>7</b></span><span>查词次数 <b>1</b></span><span>词汇题 <b>92%</b></span><span>切分任务 <b>41%</b></span></div><button class="demo-action" data-strategy>生成一条可执行建议</button><div class="demo-result" data-strategy-out>等待证据诊断。</div>`);
    if(id==='progress-reflection'||id==='transfer-prompt')return demoShell('TRANSFER',id==='progress-reflection'?'学生先说突破，数据后出现':'用你自己的生活生成两个新场景',`<textarea data-transfer placeholder="${id==='progress-reflection'?'今天最大的突破是什么？':'场景 1：我本来应该…\n场景 2：我本来应该…'}"></textarea><button class="demo-action" data-transfer-submit>提交</button><div class="demo-result" data-transfer-out>${id==='progress-reflection'?'系统还没有抢先给成绩单。':'三天后复习会使用学生自己的句子。'}</div>`);
    return demoShell('DIFFICULTY REGULATOR','同一个目标，临时调节支持强度',`<label class="range-label">支持强度 <b data-range-label>2 / 4</b><input type="range" min="1" max="4" value="2" data-difficulty></label><div class="difficulty-preview" data-difficulty-out>关键词字幕 + 一次区间重放</div><button class="demo-action" data-original-speed>回到原任务验证</button>`,'调节不是永久降低要求；每次都要回到原任务验证。');
  }

  function initEnglishDemo(root,t){
    if(!root)return;const id=t.sourceId,status=q('[data-demo-status]',root);const say=msg=>{if(status)status.textContent=msg};
    qa('[data-mode]',root).forEach(b=>b.onclick=()=>{qa('[data-mode]',root).forEach(x=>x.classList.remove('active'));b.classList.add('active');const s=q('[data-sentence]',root),m=b.dataset.mode;s.innerHTML=m==='raw'?'I should have gone already.':m==='focus'?'I <mark>should have</mark> gone already.':m==='stress'?'I <strong>SHOULD</strong> have <strong>GONE</strong> already.':'I should <span class="faded">əv</span> gone already.';say({raw:'恢复真实输入。',focus:'范围缩到两个词。',stress:'重音让信息骨架浮现。',weak:'have 的弱读终于变得可感知。'}[m])});
    const chunkCheck=q('[data-check-chunks]',root);if(chunkCheck){const cuts=new Set();qa('[data-gap]',root).forEach(b=>b.onclick=()=>{cuts.has(b.dataset.gap)?cuts.delete(b.dataset.gap):cuts.add(b.dataset.gap);b.classList.toggle('cut')});chunkCheck.onclick=()=>say(cuts.has('2')&&cuts.has('3')?'✓ 切出了 liked / to go / with you。现在撤掉圆点再听。':`切了 ${cuts.size} 刀。提示：to go 必须保持在同一块。`)}
    let audioCount=0;qa('.word-clicks button',root).forEach((b,i)=>b.onclick=()=>{audioCount++;q('[data-audio-range]',root).textContent=`${(i*.42).toFixed(2)}–${(i*.42+.6).toFixed(2)}s`;q('[data-audio-count]',root).textContent=audioCount;qa('.waveform i',root).forEach((x,j)=>x.classList.toggle('on',j>=i*6&&j<i*6+7));say(`只播放 “${b.textContent}”。这个点击位置已成为诊断证据。`)});
    let glossMode='context';qa('[data-gloss-mode]',root).forEach(b=>b.onclick=()=>{glossMode=b.dataset.glossMode;qa('[data-gloss-mode]',root).forEach(x=>x.classList.toggle('active',x===b))});qa('[data-gloss]',root).forEach(b=>b.onclick=()=>{const map={"pick up":['接（电话）','拾起／接听／搭载／学会／好转…'],"tied up":['走不开','捆绑／占用／冻结／无法脱身…']};q('[data-gloss-out]',root).textContent=map[b.dataset.gloss][glossMode==='context'?0:1];say(glossMode==='context'?'只解除当前阻塞。':'词典义项带来了新的选择负担。')});
    qa('[data-map]',root).forEach(b=>{const set=on=>qa(`[data-map="${b.dataset.map}"]`,root).forEach(x=>x.classList.toggle('mapped',on));b.onmouseenter=()=>set(true);b.onmouseleave=()=>set(false);b.onclick=()=>{set(true);say('两侧共享同一颜色：学生看见意义是怎样被组装的。')}});
    qa('[data-picture]',root).forEach(b=>b.onclick=()=>{q('[data-picture-out]',root).textContent=b.dataset.picture==='pour'?'✓ 对。到此为止，不再追加一段定义。':'还不是。看动作方向：液体从容器进入另一个容器。';say(b.dataset.picture==='pour'?'首选正确：可直接进入产出。':'错误选项暴露了动作概念边界。')});
    const ctx={上一句:'“The client is furious about the delay.”',下一句:'“…and she has not called back since.”',人物关系:'她是负责该客户的下属。',场景:'周五下班前，问题仍未解决。'};qa('[data-context]',root).forEach(b=>b.onclick=()=>{b.classList.add('active');q('[data-context-out]',root).insertAdjacentHTML('beforeend',`<p><b>${safe(b.dataset.context)}</b>${safe(ctx[b.dataset.context])}</p>`);b.disabled=true;say('新增一条语境，不把所有信息一次性倒给学生。')});
    qa('[data-pattern]',root).forEach(b=>b.onclick=()=>b.classList.toggle('selected'));const pc=q('[data-pattern-check]',root);if(pc)pc.onclick=()=>{q('[data-pattern-out]',root).innerHTML='<b>Would you ___ ...?</b> 第三个位置才是变化槽。';say('共同骨架来自例子，不是先由术语告知。')};
    qa('[data-contrast]',root).forEach(b=>b.onclick=()=>{qa('[data-contrast]',root).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');q('[data-contrast-out]',root).textContent=b.dataset.contrast==='get'?'✓ 正在逐渐习惯 → getting used to。':'这句分别表示过去习惯或已经习惯，不是“正在逐渐”。';say('一次选择留下了可区分的概念证据。')});
    const bridge=q('[data-bridge]',root);if(bridge)bridge.onclick=()=>{q('[data-bridge-out]',root).innerHTML='I should have <input aria-label="替换动作" value="left earlier">.';say('学生只替换一个意义槽，认知桥仍保持可见。')};
    const ruleSubmit=q('[data-rule-submit]',root);if(ruleSubmit)ruleSubmit.onclick=()=>{const v=q('[data-rule-input]',root).value.trim();if(v.length<4){say('先写一句自己的说法，写错也比先看答案有价值。');return}q('[data-rule-reference]',root).disabled=false;q('[data-rule-out]',root).textContent='你的说法已保存。现在可以对照，但系统不会覆盖原文。';say('学生的规则表述成为可诊断产物。')};const ruleRef=q('[data-rule-reference]',root);if(ruleRef)ruleRef.onclick=()=>q('[data-rule-out]',root).innerHTML='<b>情态动词 + have + 过去分词</b>，在这里表达对过去未发生事情的判断。';
    const grammar=q('[data-grammar]',root);if(grammar){const count=()=>{const n=grammar.value.split(/[。.!?！？\n]/).filter(x=>x.trim()).length;q('[data-grammar-count]',root).textContent=`${n} / 3`;q('[data-char-count]',root).textContent=`${grammar.value.length} / 90`;return n};grammar.oninput=count;q('[data-grammar-check]',root).onclick=()=>say(count()<=3&&grammar.value.length<=90?'✓ 通过。现在停止解释，立刻转入一次产出。':'超过上限：删到三句、90 字以内。')}
    qa('.word-bank button',root).forEach(b=>b.onclick=()=>{q('[data-production-blank]',root).textContent=b.textContent;q('[data-production-out]',root).textContent=`I should have ${b.textContent} earlier. 下一轮撤掉词库。`;say('选项减少了检索负担，但不会永久留下。')});let letters=0;const letter=q('[data-letter]',root);if(letter)letter.onclick=()=>{letters++;q('[data-production-blank]',root).textContent='should'.slice(0,letters)+'_'.repeat(6-letters);q('[data-production-out]',root).textContent=`hint_cost = ${letters}`;say('提示成本被记录；成本过高时应退回词库，不继续揭。')};const prod=q('[data-production-submit]',root);if(prod)prod.onclick=()=>{const v=q('[data-production-input]',root).value.trim();q('[data-production-blank]',root).textContent=v||'______';q('[data-production-out]',root).textContent=v?`✓ I should have ${v} earlier. 现在整句说一遍。`:'先填一个意义槽。';say(v?'产出已发生；下一轮可以减少框架。':'仍然沉默：下一步只增加三个候选词。')};
    const keywords=['all morning','never showed up','should have called'];let ki=0;const more=q('[data-more-keyword]',root);if(more)more.onclick=()=>{if(ki<keywords.length)q('[data-keywords]',root).insertAdjacentHTML('beforeend',`<span>${keywords[ki++]}</span>`);say('关键词逐个释放，防止学生照读整列。')};const retell=q('[data-retell-check]',root);if(retell)retell.onclick=()=>{const v=q('[data-retell]',root).value.toLowerCase();const all=['waiting',...keywords.slice(0,ki)];const hit=all.filter(x=>v.includes(x.split(' ')[0])).length;q('[data-retell-out]',root).textContent=`覆盖 ${hit}/${all.length}；未使用项才进入下一轮。`;say('系统只报覆盖，不在流利表达中途改语法。')};
    const shadow=q('[data-shadow]',root);if(shadow)shadow.onclick=()=>{q('[data-shadow-out]',root).textContent=id==='shadowing-support'?'播放 1.6s → 自动留白 2s → 进入下一句':'should əv GONE：本轮只练 have 的弱读';say('可观察结果：循环次数与卡点被记录。')};
    const feedback=q('[data-feedback-submit]',root);if(feedback)feedback.onclick=()=>{const v=q('[data-feedback-input]',root).value.toLowerCase(),ok=v.includes('went');q('[data-feedback-out]',root).textContent=ok?'✓ 学生自己改对，反馈链立即停止。':'还没改对：只升级一级，不直接跳到完整答案。';say(ok?'success_signal 命中：停止并撤除。':'failure_signal 命中：下一次只增加一个线索。')};
    qa('[data-predict]',root).forEach(b=>b.onclick=()=>{q('[data-predict-out]',root).textContent=b.dataset.predict==='right'?'✓ 预测与叙事线索一致。现在带着假设去听。':'没有猜中也没关系：播放时你会特别注意这个落差。';say('预测把被动播放变成假设检验。')});
    qa('[data-confidence]',root).forEach(b=>b.onclick=()=>{const route={high:'继续，不加支架',mid:'进入意义块映射',low:'回到注意提示 / 声音对齐'}[b.dataset.confidence];q('[data-signal-out]',root).innerHTML=`route_to: <b>${route}</b>`;say('一次点击直接改变下一组件，而不是生成鼓励语。')});qa('[data-reflect]',root).forEach(b=>b.onclick=()=>{const route={perception:'chunk listening',lexis:'语境词汇复习',retrieval:'提取练习',rule:'最小对比'}[b.dataset.reflect];q('[data-signal-out]',root).innerHTML=`下一步：<b>${route}</b>`;say('归因不同，路线也不同。')});
    const strategy=q('[data-strategy]',root);if(strategy)strategy.onclick=()=>{q('[data-strategy-out]',root).innerHTML='<b>你不是词汇问题，是切分问题。</b><br>今天做 10 分钟 chunk listening，不背新词。';say('结论由重听、查词和任务准确率共同推出。')};
    const transfer=q('[data-transfer-submit]',root);if(transfer)transfer.onclick=()=>{const v=q('[data-transfer]',root).value.trim();q('[data-transfer-out]',root).innerHTML=v?`<b>已保存学生原文。</b><br>${id==='progress-reflection'?'重听 12→4；无提示产出 1→5。':'3 天后使用这些自生场景复习。'}`:'先留下一个属于自己的答案。';say(v?'学生产物先出现，系统数据后出现。':'系统不替学生生成反思。')};
    const diff=q('[data-difficulty]',root);if(diff)diff.oninput=()=>{const labels=['原速无字幕','关键词字幕 + 重放','慢速 + 块标记','完整文本 + 教师示范'];q('[data-range-label]',root).textContent=`${diff.value} / 4`;q('[data-difficulty-out]',root).textContent=labels[diff.value-1];say('支持强度改变，但学习目标没有改变。')};const orig=q('[data-original-speed]',root);if(orig)orig.onclick=()=>say('已回到原任务：只有原条件下通过才算掌握。');
  }

  function buildShell(){
    document.title=`${meta.name}教学工作台 · EduOS`;
    q('#subject-mark').textContent=meta.mark;q('#subject-name').textContent=`${meta.name}教学工作台`;q('#subject-en').textContent=`${meta.en} STUDIO · UNIFIED 0.2`;
    if(goldExperiences.length){q('[data-view="routes"]').innerHTML='⌁　Experiences';q('#worked-nav-label').textContent='Gold examples';}
    q('#view-title').textContent=meta.title;q('#side-note').innerHTML=`<b>这不是 overview。</b><br>${meta.note}<br><a href="../subjects/${subject}.html">查看学科说明 →</a>`;
    if(goldExperiences.length){q('#routes-view .section-intro').innerHTML='<small>EXPERIENCE-FIRST GALLERY</small><h2>先进入学习困境，再感受支架改变了什么。</h2><p>这里不是组件目录的另一种排版。每个 Experience 都保留真实内容、学习者行动、可见证据、条件分支与持续演化的 learner artifact。</p>';q('#worked-view .section-intro').innerHTML='<small>GOLD INTERACTION SPEC</small><h2>Demo 是 specification，不是 specification 的插图。</h2><p>隐藏右侧解释也应该能看懂学习问题；体验之后再查看 Decision Contract、边界、组合方式和可交给 Agent 的实现指令。</p>'}
    renderFilters();renderIndex();renderStage();renderRoutes();renderWorked();renderSequence();
    if(goldExperiences.length)setView('worked');
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
    if(subject==='english')return `<div class="embedded-demo">${englishDemoFor(t)}</div>`;
    if(t.previewUrl)return `<iframe class="stage-frame" src="${safe(t.previewUrl)}" title="${safe(t.name)}" loading="lazy"></iframe>`;
    if(t.demo)return `<div class="embedded-demo">${t.demo}</div>`;
    return `<div class="agent-demo"><small>AGENT-READABLE SKILL</small><h3>${safe(t.name)}</h3><p>${safe(t.claim)}</p><textarea aria-label="Agent input">${safe(t.input||'在这里放入教师目标、内容和学习者证据。')}</textarea><button data-agent-run>运行最小路由</button><div class="agent-output"><b>输出不是标准答案：</b><br>${safe(t.output||'候选解释、推荐组件、被拒绝的替代方案与下一 probe。')}</div></div>`;
  }

  function renderStage(){
    const t=byId(selected);if(!t){q('#stage').innerHTML='';q('#inspector').innerHTML='';return}
    q('#stage').innerHTML=`<header class="stage-head"><span>${safe(t.symbol||roleIcon[t.kind])}</span><div><h2>${safe(t.name)}</h2><p>${safe(t.claim)}</p></div><button id="add-component">＋ 加入链路</button></header><div class="preview-label">学生 / 教师 / Agent 真正看到的可操作结果</div><div class="stage-preview">${previewFor(t)}</div>`;
    q('#inspector').innerHTML=`<section class="inspect-card"><h3>何时调用与何时撤</h3><dl><dt>TRIGGER</dt><dd>${safe(t.trigger||'由教师目标或学习者证据触发。')}</dd><dt>SUCCESS SIGNAL</dt><dd>${safe(t.success||'产生可检查的学习者行动或产物。')}</dd><dt>FADE / NEXT</dt><dd>${safe(t.fade||'成功后撤除提示，失败时只增加一个最小支撑。')}</dd></dl></section><section class="inspect-card"><h3>老师 / Agent 可以这样说</h3><blockquote class="agent-prompt">“为当前${safe(meta.name)}学习目标调用「${safe(t.name)}」。先呈现可操作界面，记录学生动作；命中 success signal 就撤掉支持，失败时只增加一个最小线索。”</blockquote></section><section class="inspect-card"><h3>内容槽与来源</h3><div class="slots">${(t.slots||[]).map(s=>`<span>${safe(s)}</span>`).join('')}</div><dl><dt>PROVENANCE</dt><dd>${safe(t.origin||t.provenance||'EduOS catalog seed')}</dd></dl></section><section class="inspect-card refusal"><h3>它不是什么</h3><p>${safe(t.not||'不是与学习目标脱离的通用活动。')}</p></section><pre class="contract">${safe(t.contract||'contract: pending')}</pre>`;
    q('#add-component').onclick=()=>{sequence.push(t.id);renderSequence(true)};
    if(t.init)t.init(q('.embedded-demo',q('#stage')));
    if(subject==='english')initEnglishDemo(q('.embedded-demo',q('#stage')),t);
    qa('[data-reveal]',q('#stage')).forEach(b=>b.onclick=()=>{const a=b.parentElement.querySelector('.answer')||q('.answer',q('#stage'));if(a)a.classList.add('show')});
    const run=q('[data-agent-run]',q('#stage'));if(run)run.onclick=()=>q('.agent-output',q('#stage')).classList.add('show');
    const sound=q('[data-sound]',q('#stage'));if(sound)sound.onclick=()=>{sound.textContent='播放中 · /ʃʊdəv/';setTimeout(()=>sound.textContent='▶ 再播一次 /ʃʊdəv/',900)};
  }

  function renderRoutes(){
    if(goldExperiences.length){
      q('#route-grid').innerHTML=goldExperiences.map((r,i)=>`<article class="route-card experience-card"><small>${safe(r.id)} · ${safe(r.module)}</small><h3>${safe(r.title)}</h3><p class="experience-problem">${safe(r.problem)}</p><div class="route-flow">${r.flow.map((x,j)=>`${j?'<b>→</b>':''}<span>${safe(x)}</span>`).join('')}</div><div class="experience-promise"><b>VISITOR WILL FEEL</b>${safe(r.promise)}</div><button data-open-gold="${r.id}">打开 Live Experience →</button></article>`).join('');
      qa('[data-open-gold]',q('#route-grid')).forEach(b=>b.onclick=()=>{activeGold=b.dataset.openGold;ensureGoldState();renderWorked();setView('worked')});return;
    }
    q('#route-grid').innerHTML=routes.map((r,i)=>`<article class="route-card"><small>${safe(r.time||`ROUTE ${i+1}`)}</small><h3>${safe(r.name)}</h3><p>${safe(r.desc)}</p><div class="route-flow">${r.ids.map((id,j)=>`${j?'<b>→</b>':''}<span>${safe(id)} ${safe(byId(id)?.name||'')}</span>`).join('')}</div><div class="route-branch"><span><b>IF SUCCESS</b> stop / fade 当前支持</span><span><b>IF FAIL</b> 依据证据进入下一组件</span></div><button data-route="${i}">载入本节课链路</button></article>`).join('');
    qa('[data-route]',q('#route-grid')).forEach(b=>b.onclick=()=>{sequence=[...routes[+b.dataset.route].ids];renderSequence(true)});
  }

  function normalizedWorked(){
    if(subject==='history')return worked.map(w=>({label:`${w.time} · ${w.id}`,name:w.name,screen:w.screen,support:w.why,evidence:Object.entries(w.e).map(([k,v])=>`${k}: ${v}`).join('\n'),fade:'根据新证据修订判断；不以猜中历史结果作为成功。'}));
    if(subject==='mathematics')return worked.map((w,i)=>({label:`${String(i+1).padStart(2,'0')} · ${w.phase}`,name:w.name,screen:w.screen,support:w.support,evidence:w.evidence,fade:w.fade}));
    if(subject==='english'){
      const route=routes[0]||{ids:[]};return route.ids.map((id,i)=>{const t=byId(id);return {label:`${String(i+1).padStart(2,'0')} · ${t?.id}`,name:t?.name,screen:`<div class="embedded-demo">${englishDemoFor(t)}</div>`,support:t?.trigger,evidence:t?.success,fade:t?.fade}})
    }
    const ex=examples[0];if(!ex)return [];
    return ex.flow.map((step,i)=>({label:`${String(i+1).padStart(2,'0')} · ${step}`,name:step,screen:`<iframe src="${demoUrl('example',ex.id)}" title="${safe(ex.title)}"></iframe>`,support:i===0?ex.goal:`当前动作：${step}。保留前一步的学生产物，不替换成 AI 生成答案。`,evidence:ex.observations[Math.min(i,ex.observations.length-1)]||ex.probe,fade:i===ex.flow.length-1?ex.conditions[0]?.preserve||'结束支持并保存迁移证据。':`成功后进入“${ex.flow[i+1]}”；失败时使用 cheap probe：${ex.probe}`}));
  }

  function renderWorked(){
    if(goldExperiences.length){renderGoldWorked();return}
    q('.worked-grid').classList.remove('gold-mode');
    const items=normalizedWorked();
    q('#worked-rail').innerHTML=items.map((w,i)=>`<button data-worked="${i}" class="${i===workedIndex?'active':''}"><small>${safe(w.label)}</small><b>${safe(w.name)}</b></button>`).join('')||'<p style="padding:16px">Worked example 尚待建设。</p>';
    qa('[data-worked]',q('#worked-rail')).forEach(b=>b.onclick=()=>{workedIndex=+b.dataset.worked;workedComplete=false;renderWorked()});
    const w=items[workedIndex];if(!w){q('#worked-screen').innerHTML='';q('#worked-agent').innerHTML='';return}
    const runLabel=subject==='english'?(workedComplete?'已成功：支持已撤除':'成功：撤掉并结束'):(workedIndex===items.length-1?'完成并撤除支持':'记录学生行动 → 下一阶段');
    q('#worked-screen').innerHTML=`<div class="workflow-runtime"><div><small>LIVE LESSON STATE</small><b>${workedTrace.length?safe(workedTrace[workedTrace.length-1]):'等待学生第一次行动'}</b></div><div class="runtime-metrics"><span>stage <b>${workedIndex+1}/${items.length}</b></span><span>extra help <b>${workedHelp}</b></span></div></div><div class="worked-artifact">${w.screen}</div><div class="worked-controls"><button data-workflow-next>${runLabel}</button><button data-workflow-help>仍卡住：只加一个线索</button><button data-workflow-reset>重置回放</button></div>`;
    q('#worked-agent').innerHTML=`<h3>这一阶段如何连接</h3><dl><dt>SUPPORT / CONTENT</dt><dd>${safe(w.support)}</dd><dt>OBSERVE</dt><dd>${safe(w.evidence)}</dd><dt>FADE / NEXT</dt><dd>${safe(w.fade)}</dd></dl><h3>Agent 决策日志</h3><ol class="decision-log">${workedTrace.length?workedTrace.map(x=>`<li>${safe(x)}</li>`).join(''):'<li>尚未发生动作。</li>'}</ol>`;
    q('[data-workflow-next]').disabled=workedComplete;
    q('[data-workflow-help]').disabled=workedComplete;
    q('[data-workflow-next]').onclick=()=>{workedTrace.push(`${w.name}：记录到可见学生行动`);if(subject==='english'){workedComplete=true;workedTrace.push('成功信号命中：停止路线并撤除当前支持')}else if(workedIndex<items.length-1)workedIndex++;else workedTrace.push('成功信号命中：停止链路并撤除支持');renderWorked()};
    q('[data-workflow-help]').onclick=()=>{workedHelp++;workedTrace.push(`${w.name}：失败信号 → 仅增加一个最小线索`);if(subject==='english'&&workedIndex<items.length-1)workedIndex++;renderWorked()};
    q('[data-workflow-reset]').onclick=()=>{workedIndex=0;workedHelp=0;workedTrace=[];workedComplete=false;renderWorked()};
    if(subject==='english'){const t=byId(routes[0]?.ids[workedIndex]);if(t)initEnglishDemo(q('.embedded-demo',q('#worked-screen'))||q('.worked-artifact',q('#worked-screen')),t)}
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
  function setView(view){qa('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));qa('.wb-view').forEach(v=>v.classList.toggle('active',v.id===`${view}-view`));const copy=goldExperiences.length?{library:['COMPONENT LAB',meta.title],routes:['LIVE EXPERIENCES','从学习困境进入，而不是从组件名称进入。'],worked:['GOLD INTERACTION','亲自操作一个完整的微型学习产品。']}[view]:{library:['COMPONENT LAB',meta.title],routes:['LESSON ROUTES','让学生证据决定下一步，而不是活动顺序。'],worked:['WORKED EXAMPLE','看 content、pedagogy 与 Agent 如何连接成课堂成品。']}[view];q('#view-kicker').textContent=copy[0];q('#view-title').textContent=copy[1]}

  q('#search').oninput=e=>{query=e.target.value;renderIndex()};qa('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));q('#open-sequence').onclick=()=>toggleSequence(true);q('#close-sequence').onclick=()=>toggleSequence(false);q('#scrim').onclick=()=>toggleSequence(false);q('#clear-sequence').onclick=()=>{sequence=[];renderSequence()};
  buildShell();
})();
