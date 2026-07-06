/* ============================================================
   Deck admin mode — comment + edit. Activate with ?edit (or ?admin) in the URL.
   Comments & edits persist in localStorage; "Export for Claude" copies a
   markdown summary to the clipboard AND downloads deck-comments.json so an
   agent can read it and apply changes to the slide source.
   Relies on window.DECK = {slides, contentNo, show, cur, total, version}.
   ============================================================ */
(function () {
  const params = new URLSearchParams(location.search);
  if (!params.has("edit") && !params.has("admin")) return;
  const D = window.DECK;
  if (!D) { console.warn("admin: window.DECK missing"); return; }

  const KEY = "deck-admin-v" + (D.version || "x");
  const store = Object.assign({ comments: [], edits: {} }, load());
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } }
  function save() { localStorage.setItem(KEY, JSON.stringify(store)); refreshCount(); }
  const uid = () => Math.random().toString(36).slice(2, 9);
  const slideNo = (idx) => D.contentNo[idx] ? "Slide " + D.contentNo[idx] : "Divider";

  // ---- styles ----
  const css = document.createElement("style");
  css.textContent = `
    body.admin-on{--admin:#ea824e}
    #admin-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:400;
      display:flex;align-items:center;gap:10px;background:rgba(20,18,24,.96);border:1px solid rgba(234,130,78,.4);
      border-radius:999px;padding:9px 12px;font-family:Inter,system-ui,sans-serif;color:#faf8f4;
      box-shadow:0 8px 30px rgba(0,0,0,.5);backdrop-filter:blur(8px)}
    #admin-bar .grp{display:flex;background:rgba(255,255,255,.06);border-radius:999px;padding:3px}
    #admin-bar .grp button{background:none;border:none;color:#b3a8aa;font:inherit;font-size:13px;font-weight:600;
      padding:6px 16px;border-radius:999px;cursor:pointer;letter-spacing:.02em}
    #admin-bar .grp button.on{background:#ea824e;color:#1a1008}
    #admin-bar .ab{background:none;border:1px solid rgba(255,255,255,.14);color:#faf8f4;font:inherit;font-size:13px;
      font-weight:500;padding:7px 14px;border-radius:999px;cursor:pointer;white-space:nowrap}
    #admin-bar .ab:hover{border-color:#ea824e;color:#ea824e}
    #admin-bar .ab.primary{background:#ea824e;color:#1a1008;border-color:#ea824e}
    #admin-bar .badge{background:rgba(234,130,78,.2);color:#f2a878;border-radius:999px;padding:2px 9px;font-size:12px;font-weight:600}
    #admin-bar .tag{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7f86;padding-left:6px}
    body.admin-comment .slide.active{cursor:crosshair}
    .cmt-pin{position:absolute;z-index:60;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50% 50% 50% 2px;
      background:#ea824e;border:2px solid #1a1008;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:pointer;
      display:flex;align-items:center;justify-content:center;font:600 12px Inter,sans-serif;color:#1a1008;transform:rotate(0)}
    .cmt-pin.resolved{background:#3a6a3a;opacity:.5}
    .cmt-pop{position:absolute;z-index:401;width:300px;background:#17151b;border:1px solid rgba(234,130,78,.4);
      border-radius:12px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.6);font-family:Inter,sans-serif}
    .cmt-pop textarea{width:100%;height:74px;background:#0f0e12;border:1px solid rgba(255,255,255,.12);border-radius:8px;
      color:#faf8f4;font:14px Inter,sans-serif;padding:9px;resize:none;outline:none}
    .cmt-pop .row{display:flex;gap:8px;margin-top:9px;justify-content:flex-end}
    .cmt-pop button{font:inherit;font-size:13px;font-weight:600;border-radius:7px;padding:6px 12px;cursor:pointer;border:none}
    .cmt-pop .save{background:#ea824e;color:#1a1008}.cmt-pop .del{background:none;color:#b3a8aa;border:1px solid rgba(255,255,255,.14)}
    .cmt-pop .res{background:none;color:#7ec07e;border:1px solid rgba(126,192,126,.4)}
    [data-eid]{outline:none}
    body.admin-edit [data-eid]:hover{box-shadow:inset 0 0 0 1px rgba(234,130,78,.4);border-radius:3px}
    body.admin-edit [data-eid][contenteditable]:focus{box-shadow:inset 0 0 0 2px #ea824e;border-radius:3px;background:rgba(234,130,78,.06)}
    [data-eid].edited{box-shadow:inset 0 0 0 1px rgba(126,192,126,.5)}
    #admin-toast{position:fixed;left:50%;bottom:74px;transform:translateX(-50%);z-index:401;background:#17151b;
      border:1px solid rgba(234,130,78,.4);color:#faf8f4;font:13px Inter,sans-serif;padding:9px 16px;border-radius:8px;
      opacity:0;transition:opacity .2s;pointer-events:none}
    #admin-toast.show{opacity:1}`;
  document.head.appendChild(css);
  document.body.classList.add("admin-on");

  // ---- toolbar ----
  const bar = document.createElement("div");
  bar.id = "admin-bar";
  bar.innerHTML = `<span class="tag">Admin</span>
    <div class="grp"><button data-mode="comment" class="on">Comment</button><button data-mode="edit">Edit</button></div>
    <span class="badge" id="admin-count">0</span>
    <button class="ab" id="admin-export">Export for Claude</button>
    <button class="ab primary" id="admin-savedits" style="display:none">Save edits</button>`;
  document.body.appendChild(bar);
  const toast = document.createElement("div"); toast.id = "admin-toast"; document.body.appendChild(toast);
  function flash(m){ toast.textContent=m; toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),1600); }

  let mode = "comment";
  document.body.classList.add("admin-comment");
  bar.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    bar.querySelectorAll("[data-mode]").forEach(x => x.classList.toggle("on", x === b));
    document.body.classList.toggle("admin-comment", mode === "comment");
    document.body.classList.toggle("admin-edit", mode === "edit");
    bar.querySelector("#admin-savedits").style.display = mode === "edit" ? "" : "none";
    setEditable(mode === "edit");
    renderPins();
  }));

  function refreshCount(){
    const open = store.comments.filter(c=>!c.resolved).length;
    const ed = Object.values(store.edits).filter(e=>e.newText!==e.oldText).length;
    bar.querySelector("#admin-count").textContent = open + (ed?(" · "+ed+" edits"):"");
  }

  // ---- COMMENTS ----
  function renderPins(){
    document.querySelectorAll(".cmt-pin").forEach(p=>p.remove());
    if(mode!=="comment") return;
    store.comments.forEach(c=>{
      const s = D.slides[c.slide]; if(!s) return;
      const pin=document.createElement("div"); pin.className="cmt-pin"+(c.resolved?" resolved":"");
      pin.style.left=c.xPct+"%"; pin.style.top=c.yPct+"%"; pin.textContent=(store.comments.indexOf(c)+1);
      pin.addEventListener("click",e=>{e.stopPropagation();openPop(c,s);});
      s.appendChild(pin);
    });
  }
  function slideClick(e){
    if(mode!=="comment") return;
    if(e.target.closest(".cmt-pin,.cmt-pop,#admin-bar")) return;  // let pins/pop/bar handle themselves
    const s=e.target.closest("section.slide.active"); if(!s) return;
    e.stopPropagation(); e.preventDefault();   // don't navigate or bubble-close
    const r=s.getBoundingClientRect();
    const xPct=((e.clientX-r.left)/r.width*100), yPct=((e.clientY-r.top)/r.height*100);
    const idx=D.slides.indexOf(s);
    const c={id:uid(),slide:idx,contentNo:D.contentNo[idx],xPct:+xPct.toFixed(1),yPct:+yPct.toFixed(1),text:"",resolved:false};
    store.comments.push(c); renderPins(); openPop(c,s,true);
  }
  document.addEventListener("click",slideClick,true);

  let pop=null;
  function openPop(c,s,isNew){
    closePop();
    pop=document.createElement("div"); pop.className="cmt-pop";
    pop.style.left=Math.min(c.xPct,72)+"%"; pop.style.top=Math.min(c.yPct+3,80)+"%";
    pop.innerHTML=`<textarea placeholder="Comment for Claude…">${c.text||""}</textarea>
      <div class="row"><button class="del">Delete</button>${c.resolved?'<button class="res">Reopen</button>':'<button class="res">Resolve</button>'}<button class="save">Save</button></div>`;
    s.appendChild(pop);
    const ta=pop.querySelector("textarea"); ta.focus();
    pop.querySelector(".save").onclick=()=>{c.text=ta.value.trim(); if(!c.text){del();return;} c.resolved=false; save(); renderPins(); closePop(); flash("Comment saved");};
    pop.querySelector(".del").onclick=del;
    pop.querySelector(".res").onclick=()=>{c.text=ta.value.trim()||c.text; c.resolved=!c.resolved; save(); renderPins(); closePop();};
    function del(){ store.comments=store.comments.filter(x=>x!==c); save(); renderPins(); closePop(); }
    pop.addEventListener("click",e=>e.stopPropagation());
  }
  function closePop(){ if(pop){pop.remove();pop=null;} }

  // ---- EDIT (contentEditable text) ----
  const EDIT_SEL="h1,.title,.eyebrow b,.lead,.statement,.intro,.closer,.card p,.card h4,ul.bullets li,.mcard p,.adv-row dt,.adv-row dd,.hero-panel b,.hero-panel span,.stat span,table.data td,table.data th,.dv-t,.dv-d,.bkt p,.va p,.lk p,.tier span,.lbl";
  let tagged=false;
  function tag(){
    if(tagged) return; tagged=true;
    D.slides.forEach((s,idx)=>{
      let k=0;
      s.querySelectorAll(EDIT_SEL).forEach(el=>{
        if(el.closest(".foot,.foot-wm,.foot-pg")) return;
        if(el.querySelector("[data-eid]")) return; // don't double-tag nested
        el.dataset.eid = "s"+idx+"-"+(k++);
      });
    });
  }
  function setEditable(on){
    tag();
    document.querySelectorAll("[data-eid]").forEach(el=>{
      if(on){ el.setAttribute("contenteditable","true");
        if(!el.dataset.orig) el.dataset.orig=el.textContent;
        el.addEventListener("input",onEdit);
      } else { el.removeAttribute("contenteditable"); el.removeEventListener("input",onEdit); }
    });
  }
  function onEdit(e){
    const el=e.target.closest("[data-eid]"); if(!el) return;
    const idx=D.slides.indexOf(el.closest("section.slide"));
    store.edits[el.dataset.eid]={slide:idx,contentNo:D.contentNo[idx],eid:el.dataset.eid,
      oldText:el.dataset.orig,newText:el.textContent.trim()};
    el.classList.toggle("edited", el.textContent.trim()!==el.dataset.orig);
    clearTimeout(onEdit._t); onEdit._t=setTimeout(save,400);
  }
  bar.querySelector("#admin-savedits").onclick=()=>{save();flash("Edits saved locally — Export for Claude to apply to source");};

  // ---- EXPORT ----
  function buildReport(){
    const open=store.comments.filter(c=>c.text);
    const edits=Object.values(store.edits).filter(e=>e.newText!==e.oldText);
    let md=`# Deck feedback — v${D.version}  (${new Date().toISOString().slice(0,16).replace("T"," ")})\n\n`;
    md+=`## Comments (${open.length})\n`;
    if(!open.length) md+="_none_\n";
    open.forEach((c,i)=>{ md+=`\n${i+1}. **${slideNo(c.slide)}** ${c.resolved?"(resolved) ":""}@(${c.xPct}%,${c.yPct}%)\n   > ${c.text}\n`; });
    md+=`\n## Direct edits (${edits.length})\n`;
    if(!edits.length) md+="_none_\n";
    edits.forEach(e=>{ md+=`\n- **${slideNo(e.slide)}** [${e.eid}]\n  - was: ${e.oldText}\n  - now: ${e.newText}\n`; });
    return md;
  }
  bar.querySelector("#admin-export").onclick=async()=>{
    const md=buildReport();
    try{ await navigator.clipboard.writeText(md); }catch{}
    const blob=new Blob([JSON.stringify(store,null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="deck-comments.json"; a.click();
    flash("Copied to clipboard + downloaded deck-comments.json");
  };

  // reposition pins on slide change
  const _show=D.show;
  window.addEventListener("hashchange",()=>setTimeout(renderPins,60));
  refreshCount(); renderPins();
  console.log("%cDeck admin mode ON","color:#ea824e;font-weight:bold");
})();
