(function () {
  const SUBJECTS = {
    history:{name:"历史",en:"History",color:"#cc7b43",thesis:"把过去恢复成当时不确定的信息环境，再让地图、史料、人物立场和因果机制参与学生判断。",status:"完整工作台",coverage:"原始 catalog 有 3 个 content、2 个 pedagogy、2 个 skill contracts 与 1 个 worked example；工作台新增 12 个可操作组件、6 条讲课路线和赤壁回放。",gap:"下一轮继续补制度史、经济史、全球史尺度转换，以及更多非战争主题的史料包。"},
    mathematics:{name:"数学",en:"Mathematics",color:"#2fa686",thesis:"内容可视化负责让关系可见；脚手架负责让学生预测、解释、完成、诊断，并在证据足够时撤除。",status:"全量内容已收录 · 编排接入中",coverage:"127 个可独立打开的数学内容资产已完整收录。15 个深度教学组件包含 5 个 content mechanisms、7 个 scaffolds、2 个 diagnostic probes 与 1 个 metacognitive component；当前 6 条路线演示 M01–M15。",gap:"127 项资产与 M01–M15 的逐项配对尚未完成；下一轮补可调用条件、推荐 scaffold，并增加证明、建模、统计推断的 gold examples。"},
    english:{name:"英语",en:"English Learning",color:"#4b8ed4",thesis:"先判断瓶颈位于感知、意义、推理、产出还是反馈，再调用最低成本的支持，而不是默认讲语法或直接给答案。",status:"脚手架工作台 · 暂无语料库",coverage:"纳入既有 English Scaffold Studio：30 个 scaffold skills + 1 个 regulation policy、诊断台、教师 composer 和 3 条 route templates。",gap:"当前没有独立英语语料库；下一轮接入真实音频时间轴、学生历史与 review queue。content 由教师提供，不能把 should have 示例误当成完整语料。"},
    biology:{name:"生物",en:"Biology",color:"#65a653",thesis:"让变量关系和模型产生可检验预测，用扰动、竞争模型与实验设计替代目的论标签。",status:"Gold seeds",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts、1 个 composed example，以及 3 个更完整的 learner-facing Gold artifacts。",gap:"下一轮补进化、生态、细胞过程与分子生物，并把 3 个 Gold artifacts 组织成统一组件工作台。"},
    chinese:{name:"语文",en:"Chinese Language Arts",color:"#d66f69",thesis:"字面理解、情绪结构、修辞和论证需要不同的文本操作与证据约束，不能都压成高亮和问答。",status:"Seed coverage",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts 与 1 个 worked example。",gap:"下一轮补现代文、诗歌比较、写作 revision trace 与口语表达，并发展独立组件工作台。"},
    civics:{name:"政治／公民",en:"Civics & Politics",color:"#bda03c",thesis:"从关键词匹配走向概念边界、原则权衡、材料证据和规范论证。",status:"Seed coverage",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts 与 1 个 worked example。",gap:"下一轮补政策 stakeholder、事实—价值区分、公共行动与信息来源可信度。"},
    physics:{name:"物理",en:"Physics",color:"#4c98d4",thesis:"让系统边界、模型、预测、测量和不确定性形成可修订的闭环。",status:"Seed coverage",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts 与 1 个 worked example。",gap:"下一轮补能量、波、电学、场与 measurement uncertainty 的完整路线。"},
    chemistry:{name:"化学",en:"Chemistry",color:"#817ed0",thesis:"协调宏观观察、微观模型与符号表达，让表示之间的缺口成为诊断证据。",status:"Seed coverage",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts 与 1 个 worked example。",gap:"下一轮补反应族、定量化学、酸碱、实验安全与更多宏微符三层 worked examples。"},
    geography:{name:"地理",en:"Geography",color:"#3aa4a5",thesis:"只有当空间位置、尺度、路径或流动进入解释时，地图才是教学表示。",status:"Seed coverage",coverage:"已有 3 个 content representations、2 个 pedagogy mechanisms、2 个 agent contracts 与 1 个 worked example。",gap:"下一轮补人文地理、GIS evidence、投影、遥感与 field data 路线。"}
  };

  const ENGLISH_FAMILIES=[
    ["感知",3,"注意提示、边界切分、声音对齐"],["意义",4,"语境词义、意义块映射、视觉落地、语境展开"],["推理",5,"模式提取、对比、类比、规则归纳、最小语法"],["产出",6,"句框、词库、部分补全、复述、跟读、发音焦点"],["反馈",6,"检测、cue、诱导自修、元语言提示、重述、完整示范"],["元认知",6,"预测、信心标记、错误反思、策略建议、进步回看、迁移"],["调节",1,"simplify / reveal / replay / slow / compare / skip / review"]
  ];
  const ROUTES={
    history:[
      ["20 min","地图先行的微型讲授","H01 时间切片地图 → H11 证据打断讲授 → H04 出处揭示 → H07 因果机制链","知道事件却不能用空间解释选择","能闭图复原位置并提出空间主张","缩小地图范围并恢复关键标签"],
      ["35 min","三份史料探究课","H04 先下注 → H05 互证 → H07 有边界解释 → H08 反事实拆链","把单份史料当透明事实","引用两份以上来源形成有边界结论","退回 provenance，比较作者、日期与目的"],
      ["30 min","人物拟像决策课","H03 史料约束人物 → H01 时空定位 → H06 决策承诺 → H04 新史料","用后来结局评价历史行动者","问题引用处境，决定能随新证据修订","揭示人物不可知范围并限制对话"],
      ["25 min","跨区域比较复习","H09 同时性时间带 → H12 统一维度比较 → H07 解释差异","把区域历史记成互不相干章节","在同一时间窗按同一维度解释差异","先对齐时间尺度与比较维度"],
      ["15 min","一件文物进入社会史","H10 先观察器物 → H05 加入同类来源 → H07 形成机制解释","文物只是插图或结论标签","每条推断回指可见特征并保留边界","加入出处与同类材料，限制过度推断"],
      ["30 min","后见之明拆除课","H01 回到历史时点 → H06 提交判断 → H04 迟到证据 → H08 反事实","用结果反推当时选择‘显然’","指出哪条依据失效并形成修订理由","退回决策时点，遮住后来结果"]
    ],
    mathematics:[
      ["20–30 min","从符号搬运到等价变换","M05 变换账本 → M08 第一个无效步骤 → M10 自解释 → M07 例题淡出","会移项却不能解释解集为何不变","定位第一处分叉并引用等价保持性质","回到 balance / ledger，只显示一次同侧操作"],
      ["25 min","从看动画到建立函数模型","M06 先预测 → M01 联动表示 → M03 系统变例 → M13 反例探针","只拖滑杆，不会预测参数效应","能跨图—表—式预测并找边界例","一次只改变一个参数，缩小例子空间"],
      ["30 min","几何不变量到证明","M02 动态不变量 → M13 边界探针 → M14 证明骨架 → M10 自解释","观察到不变量但只能说‘看起来成立’","理由准确绑定到证明边并能撤骨架重建","恢复中间命题或给最小反例"],
      ["15 min","逼近概念微体验","M06 预测误差 → M04 操作逼近 → M15 估计—计算—检验","只会代公式，不会判断误差方向","先给合理范围，再用计算独立检查","放大局部或减少同时变化的参数"],
      ["25 min","一题多解策略课","M09 子目标 → M12 策略对照 → M15 选择并检查","把一种算法用于所有题","根据中间结构选择策略并说明标准","恢复子目标标签，对齐两条路线的阶段"],
      ["5–10 min","卡住时的最便宜诊断","M08 定位分叉 / M13 构造反例 → M11 错误型提示","只知道答案错或学生说‘不会’","识别 error family 且低提示成本恢复","转入错误家族对应的 content mechanism"]
    ],
    english:[
      ["10–15 min","听不见 should have","Attention Cue → Acoustic Alignment → Boundary Detection → Shadowing Support","同一区间反复重听但没有词义提问","能在原速中定位、切分并跟读目标块","慢放最小片段；仍失败则检查语料难度"],
      ["10–15 min","懂了却说不出来","Sentence Frame → Partial Completion → Cue → Error Reflection","理解通过但沉默或稳定漏掉目标形式","逐步撤框架后仍能完成并归因错误","恢复词库或回到意义层检查阻塞"],
      ["15 min","used to 三连混淆","Contrast → Rule Induction → Minimal Grammar → Transfer Prompt","相近形式在新句中反复混用","说出区分条件并迁移到两个自生场景","撤类比，回到最小对比与新例句"]
    ]
  };
  const GOLD={
    history:[
      ["赤壁决策室","../gold/history/red-cliffs-decision-room.html","回到 208 年先下注，再让新史料改写判断。"],
      ["史料侦探桌","../gold/history/source-detective.html","出处、日期和目的如何改变可信度。"],
      ["因果解释建构器","../gold/history/causal-explanation-builder.html","把原因、机制、证据与反事实接成解释。"]
    ],
    biology:[
      ["体温反馈实验室","../gold/biology/thermoregulation-feedback-lab.html","先预测曲线，再扰动系统并重跑。"],
      ["竞争遗传模型","../gold/biology/competing-genetics-models.html","用新家系信息淘汰或修订模型。"],
      ["实验设计工作台","../gold/biology/experiment-design-bench.html","修改变量、重复与分组，消除混杂。"]
    ]
  };
  const STUDIOS=Object.fromEntries(Object.entries(SUBJECTS).map(([id,s])=>[id,{href:`../studios/${id}.html`,title:`${s.name}教学工作台`,meta:id==="mathematics"?"142 components · 127 raw assets inside":id==="english"?"31 scaffold components · 3 routes":id==="history"?"12 components · 6 routes · 1 replay":"8 catalog components · 2 seed routes",desc:"与其他学科使用同一套左侧导航、组件索引、可操作课堂界面、Agent 解释、教学链路与 worked example 回放。"}]));

  const key=document.body.dataset.subject;
  const subject=SUBJECTS[key];
  const content=(window.EDUOS_CONTENT||[]).filter(x=>x.subject===key);
  const pedagogy=(window.EDUOS_PEDAGOGY||[]).filter(x=>x.subject===key);
  const skills=(window.EDUOS_SKILLS||[]).filter(x=>x.subject===key);
  const examples=(window.EDUOS_EXAMPLES||[]).filter(x=>x.subject===key);
  document.documentElement.style.setProperty("--subject",subject.color);
  const HERO_STATS={
    history:["12 operable components","6 lesson routes","3 Gold artifacts","7 catalog records"],
    mathematics:["127 content assets collected","15 deep teaching components","6 M01–M15 routes","asset-to-route mapping in progress"],
    english:["30 scaffold skills","1 regulation policy","3 route templates","no standalone corpus"]
  };

  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const chips=a=>(a||[]).map(x=>`<span class="chip">${x}</span>`).join("");
  const sectionHead=(n,title,desc)=>`<div class="layer-head"><span>${n}</span><div><h2>${title}</h2><p>${desc}</p></div></div>`;

  function liveCard(item,family){
    const href=`../demos/${family}/${item.id}.html`;
    const details=family==="content"
      ? [["学习对象",item.target],["表示形式",item.representation],["学科动作",item.domainMove],["何时使用",item.when],["不是什么",item.not]]
      : [["机制",item.mechanism],["学科原生性",item.native],["Activation",item.conditions],["不应使用",item.notWhen],["条件适配",item.adaptation]];
    return `<article class="live-card"><div class="card-top"><div><small>${item.role} · ${item.id}</small><h3>${item.title}</h3><p>${item.summary}</p></div><a href="${href}" target="_blank">单独打开 ↗</a></div><iframe src="${href}" title="${item.title}" loading="lazy"></iframe><details><summary>查看解释、条件与边界</summary><dl>${details.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl><div class="chips">${chips(item.keywords)}</div><p class="provenance">原始记录 · ${item.provenance}</p></details></article>`;
  }

  function studioBlock(){
    const s=STUDIOS[key]; if(!s)return "";
    return `<section class="studio-block" id="lab">${sectionHead("LAB","完整组件实验室","前面的统一学科层级负责说明关系；这里打开保留学科原生交互的完整工作台。")}
      <div class="studio-banner"><div><small>${s.meta}</small><h3>${s.title}</h3><p>${s.desc}</p></div><a href="${s.href}" target="_blank">打开完整工作台 ↗</a></div></section>`;
  }

  function contentBlock(){
    const mathLibrary=key==="mathematics"?`<div class="library-banner"><div><small>FULL SOURCE COVERAGE · 127/127 TOOLS</small><h3>math-viz-kit 已进入统一工作台</h3><p>127 个 raw HTML 不再作为另一个目录网站嵌入；现在与 15 个深度组件一起出现在数学工作台左侧，可搜索并在右侧直接操作。</p></div><a href="../studios/mathematics.html">进入统一工作台 ↗</a></div>`:"";
    const englishSlots=key==="english"?`<div class="content-slots"><article><b>音频／视频片段</b><p>真实声音、词级或句级时间轴。</p></article><article><b>Transcript / target sentence</b><p>目标句、chunk 边界、弱读与重音。</p></article><article><b>Meaning map</b><p>语境词义、意义块、人物与上下文。</p></article><article><b>Example set</b><p>用于 pattern / contrast / rule induction 的例句组。</p></article></div><p class="honesty"><strong>边界：</strong>31 个 scaffold 不是 31 份英语内容。Studio 里的 should have 只是替换样例；教师或上游 agent 必须提供真实语料。</p>`:"";
    return `<section id="content">${sectionHead("01","Content / Representation","可独立使用的内容表示。先把学科关系做对，再决定是否需要脚手架。")}${mathLibrary}${englishSlots}${content.length?`<div class="live-grid">${content.map(x=>liveCard(x,"content")).join("")}</div>`:`${key!=="english"?'<p class="empty">此学科尚未建立独立 content records。</p>':''}`}</section>`;
  }

  function mechanismBlock(){
    let overview="";
    if(key==="english") overview=`<div class="family-grid">${ENGLISH_FAMILIES.map(([n,c,d])=>`<article><b>${c}</b><h3>${n}</h3><p>${d}</p></article>`).join("")}</div>`;
    if(key==="history") overview=`<div class="family-grid"><article><b>3</b><h3>时空与变化</h3><p>时间切片、前后地图、同时性时间带</p></article><article><b>2</b><h3>史料证据</h3><p>出处延迟揭示、史料互证桌</p></article><article><b>2</b><h3>人物与决策</h3><p>史料约束人物拟像、历史决策室</p></article><article><b>5</b><h3>解释与比较</h3><p>因果链、反事实、物证、比较、讲授</p></article></div>`;
    if(key==="mathematics") overview=`<div class="family-grid"><article><b>5</b><h3>Content mechanics</h3><p>联动表示、不变量、变例、逼近、变换账本</p></article><article><b>7</b><h3>Scaffolds</h3><p>预测、淡出、子目标、自解释、提示、策略、证明</p></article><article><b>2</b><h3>Diagnostics</h3><p>第一个无效步骤、边界与反例探针</p></article><article><b>1</b><h3>Metacognition</h3><p>估计—计算—检验</p></article></div>`;
    const roleNote=key==="history"?"稳定 role：Content mechanism / Scaffold / Diagnostic probe；学科 family：时空、史料、人物、解释。":key==="mathematics"?"稳定 role：5 Content mechanisms / 7 Scaffolds / 2 Diagnostic probes / 1 Metacognitive component。":"稳定 role：30 Scaffolds + 1 Regulation policy；感知、意义、推理等是英语学科原生 family。";
    return `<section id="scaffolds">${sectionHead("02","Scaffolds & Diagnostic Probes","不是“活动名字”：每个机制都要有 trigger、学生动作、success signal、fade 与失败升级。")}${STUDIOS[key]?`<div class="role-legend"><b>跨学科 role</b><span>${roleNote}</span><em>Contract 是组件元数据，不是另一种 role。</em></div>`:""}${overview}${pedagogy.length?`<div class="live-grid">${pedagogy.map(x=>liveCard(x,"pedagogy")).join("")}</div>`:""}</section>`;
  }

  function routeBlock(){
    let routes=ROUTES[key];
    if(!routes&&content.length&&pedagogy.length)routes=[
      ["5–15 min","Seed route A · 从表示到判别",`${content[0].title} → ${pedagogy[0].title} → 保存学生证据 → 下一探针`,"学生能复述名词但不能执行学科动作","完成目标动作并给出可保存证据","缩小任务并返回第一表示"],
      ["10–20 min","Seed route B · 从第二表示到解释",`${content[1].title} → ${pedagogy[1].title} → 形成解释 → 撤除提示`,"学生看到关系但解释仍停在标签","形成有证据的解释并能撤提示","加入区分性 probe，不重复整段讲解"]
    ];
    return `<section id="routes">${sectionHead("03","Conditional Lesson Routes","路线从课堂痛点和可观察证据进入；成功可以提前停止，失败才升级。")}
      <div class="route-grid">${(routes||[]).map((r,i)=>`<article><small>ROUTE ${String(i+1).padStart(2,"0")} · ${r[0]}</small><h3>${r[1]}</h3><p>${r[2]}</p><div class="route-conditions"><div><b>ENTER EVIDENCE</b><span>${r[3]}</span></div><div><b>OBSERVE</b><span>学生操作、选择、解释与提示成本</span></div><div class="success"><b>IF SUCCESS · STOP / FADE</b><span>${r[4]}</span></div><div class="fail"><b>IF FAIL · NEXT</b><span>${r[5]}</span></div></div></article>`).join("")}</div></section>`;
  }

  function exampleBlock(){
    const gold=GOLD[key]||[];
    const catalogExamples=examples.map(item=>{const href=`../demos/worked-examples/${item.id}.html`;return `<article class="example-card"><div><small>COMPOSED RUNTIME · ${item.id}</small><h3>${item.title}</h3><p>${item.summary}</p><div class="flowline">${item.flow.map(x=>`<span>${x}</span>`).join("<b>→</b>")}</div></div><a href="${href}" target="_blank">运行完整例子 ↗</a></article>`}).join("");
    const goldCards=gold.map(([n,h,d])=>`<a class="gold-card" href="${h}" target="_blank"><small>LEARNER-FACING GOLD ARTIFACT</small><h3>${n}</h3><p>${d}</p><strong>直接进入课堂界面 ↗</strong></a>`).join("");
    const special=key==="mathematics"?`<article class="replay-note"><small>WORKED EXAMPLE FADING · 6 PHASES</small><h3>线性方程：完整示范怎样逐步消失</h3><p>MODEL → PREDICT → EXPLAIN → COMPLETE → DIAGNOSE → TRANSFER。每一阶段都说明 Agent 给什么、观察什么、什么时候撤。</p><a href="../studios/mathematics.html">在统一工作台打开回放 ↗</a></article>`:key==="english"?`<article class="replay-note"><small>3 PAIN-POINT ROUTES</small><h3>从“听不见 / 说不出 / 结构混淆”进入</h3><p>不是把 31 个 skill 排成课程；每条 worked route 只调用 4 个左右组件，并把成功和升级条件写进 composer YAML。</p><a href="../studios/english.html">在统一工作台打开 Route replay ↗</a></article>`:"";
    const title=key==="english"?"Route Templates / 组件组合范例":"Worked Examples";
    const desc=key==="english"?"当前英语材料展示组件组合与 composer contract；尚未具备逐阶段 learner UI、观测变化和分支回放，因此不冒充 Gold worked example。":"组件在这里真正连接：学生看到什么、Agent 为什么调用、证据怎样改变下一步。";
    return `<section id="examples">${sectionHead("04",title,desc)}${special}<div class="gold-grid">${goldCards}</div>${catalogExamples}</section>`;
  }

  function contractBlock(){
    const special=STUDIOS[key]?`<article class="contract-card featured"><small>COMPONENT-LEVEL CONTRACTS</small><h3>${STUDIOS[key].title} 内置规格</h3><p>每个组件都展示输入槽、trigger、success、fade / next、禁止事项或 Agent-readable YAML。它们是可检索 contract，不是把教学法藏进一段后台 prompt。</p><a href="${STUDIOS[key].href}" target="_blank">打开组件规格 ↗</a></article>`:"";
    return `<section id="contracts">${sectionHead("05","Agent / Teacher Explanations","教师看为什么与何时；Agent 看输入、拒绝、输出、成功、fade 和下一候选。")}
      <div class="contract-grid">${special}${skills.map(x=>`<article class="contract-card"><small>${x.role} · ${x.id}</small><h3>${x.title}</h3><p>${x.summary}</p><pre>trigger: ${esc(x.trigger)}\nrefusal: ${esc(x.refusal)}\ninput: ${esc(x.input)}\noutput: ${esc(x.output)}\nsearches:\n${x.searches.map(v=>`  - ${esc(v)}`).join("\n")}</pre><p class="provenance">原始记录 · ${x.provenance}</p></article>`).join("")}</div></section>`;
  }

  document.getElementById("subject-root").innerHTML=`
    <header class="subject-top"><a href="../index.html">← EduOS 教学组件图谱</a><nav><a href="#content">Content</a><a href="#scaffolds">Scaffolds</a><a href="#routes">Routes</a><a href="#examples">Examples</a><a href="#contracts">Explanations</a><a href="#coverage">Coverage</a>${STUDIOS[key]?'<a href="#lab">Lab</a>':''}</nav></header>
    <section class="subject-hero"><div><p class="eyebrow">${subject.en} · ${subject.status}</p><h1>${subject.name}</h1><p>${subject.thesis}</p><div class="hero-counts">${(HERO_STATS[key]||[`${content.length} content representations`,`${pedagogy.length} pedagogy mechanisms`,`${skills.length} agent contracts`,`${examples.length} composed example`]).map(x=>`<span>${x}</span>`).join("")}</div><p class="coverage-truth"><b>已有：</b>${subject.coverage} <b>未完成：</b>${subject.gap}</p></div><aside><b>从你的任务进入</b><a href="#routes">教师备课 · 从课堂痛点 / Route</a><a href="#content">寻找素材 · 从 Content</a><a href="#examples">研究评审 · 从 Example</a></aside></section>
    <main class="subject-main">${contentBlock()}${mechanismBlock()}${routeBlock()}${exampleBlock()}${contractBlock()}
      <section class="coverage" id="coverage">${sectionHead("06","Coverage & provenance","明确区分已经存在的材料与本轮为了组织它们所作的推断。")}
        <div class="coverage-grid"><article><small>原始材料已有</small><p>${subject.coverage}</p></article><article><small>本轮结构推断</small><p>统一六段学科页、Lesson Routes 的入口语言、成熟度标记与跨层浏览顺序；不宣称这些组织方式已经过效果验证。</p></article><article><small>下一轮缺口</small><p>${subject.gap}</p></article></div></section>
      ${studioBlock()}</main>`;
})();
