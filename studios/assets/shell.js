document.querySelector('#studio-root').innerHTML=`
<div class="wb-shell">
  <aside class="wb-side">
    <a class="wb-brand" href="../index.html"><span id="subject-mark"></span><div><b id="subject-name"></b><small id="subject-en"></small></div></a>
    <nav class="wb-nav" aria-label="工作区">
      <button class="active" data-view="library">▦　组件实验室</button>
      <button data-view="routes">⌁　教学链路</button>
      <button data-view="worked">▶　<span id="worked-nav-label">Worked example</span></button>
    </nav>
    <div class="wb-label">按功能筛选</div><div class="wb-filter" id="filters"></div>
    <div class="wb-side-note" id="side-note"></div>
  </aside>
  <main class="wb-main">
    <header class="wb-top"><div><p id="view-kicker">COMPONENT LAB</p><h1 id="view-title"></h1></div><button class="sequence-open" id="open-sequence">本节课链路 <b id="sequence-count">0</b></button></header>
    <section class="wb-view active" id="library-view"><div class="workbench">
      <aside class="component-index"><div class="index-tools"><input id="search" type="search" placeholder="搜索组件、主题或学习动作…"><div class="index-count" id="index-count"></div></div><div id="component-list"></div></aside>
      <article class="component-stage" id="stage"></article><aside class="inspector" id="inspector"></aside>
    </div></section>
    <section class="wb-view" id="routes-view"><div class="routes-wrap"><header class="section-intro"><small>EVIDENCE-ROUTED PATHWAYS</small><h2>不是固定教案，而是根据学生证据选择下一步。</h2><p>每条路线都把内容表征、domain-native scaffold、cheap diagnostic probe 和 fade 条件连接起来。</p></header><div class="route-grid" id="route-grid"></div></div></section>
    <section class="wb-view" id="worked-view"><div class="worked-wrap"><header class="section-intro"><small>CONTENT × PEDAGOGY × AGENT</small><h2>看一条教学成品怎样从支持走向撤除。</h2><p>左边是阶段，中央是学生真正看到的结果，右边解释 Agent 何时调用、观察什么和怎样进入下一步。</p></header><div class="worked-grid"><div class="worked-rail" id="worked-rail"></div><div class="worked-screen" id="worked-screen"></div><aside class="worked-agent" id="worked-agent"></aside></div></div></section>
  </main>
</div>
<aside class="sequence" id="sequence" aria-hidden="true"><header><div><small>LESSON SEQUENCE</small><h2>本节课链路</h2></div><button id="close-sequence">×</button></header><p>成功时即可撤除或停止。链路表达条件，不是要求全部走完的活动菜单。</p><div id="sequence-items"></div><div id="sequence-checks"></div><button id="clear-sequence">清空链路</button></aside><div class="scrim" id="scrim"></div>`;
