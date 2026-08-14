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
  function setView(view){qa('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));qa('.wb-view').forEach(v=>v.classList.toggle('active',v.id===`${view}-view`));const copy={library:['COMPONENT LAB',meta.title],routes:['LESSON ROUTES','让学生证据决定下一步，而不是活动顺序。'],worked:[subject==='english'?'ROUTE WALKTHROUGH':'WORKED EXAMPLE',subject==='english'?'路线回放：看 scaffold 怎样在成功时撤除；这不是 Gold worked example。':'看 content、pedagogy 与 Agent 如何连接成课堂成品。']}[view];q('#view-kicker').textContent=copy[0];q('#view-title').textContent=copy[1]}

  q('#search').oninput=e=>{query=e.target.value;renderIndex()};qa('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));q('#open-sequence').onclick=()=>toggleSequence(true);q('#close-sequence').onclick=()=>toggleSequence(false);q('#scrim').onclick=()=>toggleSequence(false);q('#clear-sequence').onclick=()=>{sequence=[];renderSequence()};
  buildShell();
})();
