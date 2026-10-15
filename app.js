const $=id=>document.getElementById(id);
const app=$('app');
let S=JSON.parse(localStorage.getItem('ciberruta')||'{"xp":0,"done":[],"streak":0,"day":""}');
const save=()=>localStorage.setItem('ciberruta',JSON.stringify(S));
const ALL=[];
U.forEach((u,ui)=>u.L.forEach((l,li)=>ALL.push({id:ui+'.'+li,ui,li})));
let cur,qi,hearts,correct,muted=false,ctx,mi=0;
const SIGNS=["Urgencia o amenaza","Dominio extraño","Enlace sospechoso","Pide datos o contraseñas","Saludo genérico"];
const MAILS=[
{from:"soporte@bancomx-seguridad.com",subj:"URGENTE: tu cuenta será suspendida",body:"Estimado usuario, detectamos actividad sospechosa. Verifica tus datos en 24 horas en http://bancomx-seguridad.verif-login.net",bad:[0,1,2,3,4]},
{from:"no-reply@amazon.com",subj:"Tu pedido fue enviado",body:"Hola Ana, tu pedido #4821 va en camino. Consulta el estado desde tu cuenta entrando a amazon.com por tu cuenta.",bad:[]}
];
const COMMON=['123456','password','qwerty','111111','12345678','abc123','letmein','admin','iloveyou','contraseña'];
let gen={len:16,up:true,num:true,sym:true};

function beep(f,d,type,when=0){
  if(muted)return;
  ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
  const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+when;
  o.type=type;o.frequency.value=f;o.connect(g);g.connect(ctx.destination);
  g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.start(t);o.stop(t+d);
}
const SFX={
  click:()=>beep(520,.06,'triangle'),
  ok:()=>{beep(660,.12,'sine');beep(990,.18,'sine',.1)},
  bad:()=>beep(180,.3,'sawtooth'),
  win:()=>[523,659,784,1046].forEach((f,i)=>beep(f,.3,'triangle',i*.13))
};
function tgl(){muted=!muted;$('mute').textContent=muted?'🔇':'🔊'}
function stats(){$('xp').textContent=S.xp;$('sk').textContent=S.streak}

function home(){
  stats();
  let h=`<div class="tools">
    <button onclick="checker()">🔍<span>Verificador</span></button>
    <button onclick="generator()">🎲<span>Generador</span></button>
    <button onclick="detector()">🎣<span>Phishing</span></button></div>
    <h1 class="center" style="margin:6px 0 16px">Tu ruta de ciberseguridad</h1>`;
  U.forEach((u,ui)=>{
    h+=`<section class="unit" style="border-color:${u.c}"><h2 style="color:${u.c}">${u.n}</h2>`;
    u.L.forEach((l,li)=>{
      const i=ALL.findIndex(x=>x.ui===ui&&x.li===li), id=ui+'.'+li;
      const done=S.done.includes(id), open=i===0||S.done.includes(ALL[i-1].id);
      const cls=done?'done':open?'cur':'lock';
      h+=`<div class="row" style="margin-left:${li%2?'36px':'0'}"><button class="node ${cls}" ${open?'':'disabled'} onclick="lesson(${ui},${li})">${done?'✔':open?'★':'🔒'}</button><span>${l.t}</span></div>`;
    });
    h+='</section>';
  });
  app.innerHTML=h;
}

// ---- Lecciones ----
function lesson(ui,li){
  cur=U[ui].L[li];cur.id=ui+'.'+li;SFX.click();
  app.innerHTML=`<div class="card pop"><p class="tag">TEORÍA · ${U[ui].n}</p><h2 class="q">${cur.t}</h2><p class="txt">${cur.th}</p><button class="btn" onclick="startQ()">Empezar ▶</button></div>`;
  window.scrollTo(0,0);
}
function startQ(){qi=0;hearts=3;correct=0;ask()}
function ask(){
  const q=cur.q[qi];
  app.innerHTML=`<div class="top"><button class="x" onclick="home()">✕</button><div class="bar"><div style="width:${qi/cur.q.length*100}%"></div></div><span>❤️ ${hearts}</span></div>
  <div class="card slide"><h2 class="q">${q[0]}</h2>${q[1].map((o,i)=>`<button class="opt" onclick="answer(${i})">${o}</button>`).join('')}</div><div id="fb"></div>`;
}
function answer(i){
  const q=cur.q[qi],ok=i===q[2];
  document.querySelectorAll('.opt').forEach((b,j)=>{
    b.disabled=true;
    if(j===q[2])b.classList.add('good');
    else if(j===i)b.classList.add('bad');
  });
  if(ok){correct++;SFX.ok()}
  else{hearts--;SFX.bad();document.querySelector('.card').classList.add('shake')}
  $('fb').innerHTML=`<div class="fb ${ok?'okb':'badb'}"><b>${ok?'¡Correcto! ✅':'Incorrecto ❌'}</b><p style="margin:6px 0 4px">${q[3]}</p><button class="btn" onclick="next()">Continuar</button></div>`;
}
function next(){
  if(hearts<=0)return lost();
  qi++;
  qi<cur.q.length?ask():finish();
}
function lost(){
  app.innerHTML=`<div class="card pop center"><div class="big">💔</div><h2 class="q">Te quedaste sin corazones</h2><p class="txt">No pasa nada: repasa la teoría e inténtalo de nuevo.</p><button class="btn" onclick="startQ()">Reintentar</button><button class="btn alt" onclick="home()">Volver al mapa</button></div>`;
  SFX.bad();
}
function finish(){
  const first=!S.done.includes(cur.id);
  const gain=first?10*correct+5:0;
  if(first)S.done.push(cur.id);
  S.xp+=gain;
  const today=new Date().toDateString(),yest=new Date(Date.now()-864e5).toDateString();
  if(S.day!==today){S.streak=S.day===yest?S.streak+1:1;S.day=today}
  save();stats();SFX.win();burst();
  app.innerHTML=`<div class="card pop center"><div class="big">🏆</div><h2 class="q">¡Lección completada!</h2><p class="txt">Respuestas correctas: ${correct}/${cur.q.length}<br>+${gain} XP</p><button class="btn" onclick="home()">Continuar en el mapa</button></div>`;
}
function burst(){
  for(let i=0;i<30;i++){
    const c=document.createElement('span');
    c.className='conf';
    c.textContent=['🎉','⭐','🛡️','✨'][i%4];
    c.style.left=Math.random()*100+'vw';
    c.style.animationDelay=Math.random()*.6+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3500);
  }
}

// ---- Herramienta 1: verificador de contraseñas ----
function checker(){
  app.innerHTML=`<div class="card pop"><p class="tag">HERRAMIENTA</p><h2 class="q">Verificador de contraseñas</h2>
  <input id="pw" class="inp" type="text" placeholder="Escribe una contraseña de prueba" oninput="check(this.value)" autocomplete="off">
  <div class="bar"><div id="pwb" style="width:0"></div></div>
  <p id="pwl" class="txt"></p><ul id="pwt" class="tips"></ul>
  <p class="tag" style="margin-top:14px">Tu contraseña no sale de tu navegador: se analiza solo aquí.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function check(p){
  let pool=(/[a-z]/.test(p)?26:0)+(/[A-Z]/.test(p)?26:0)+(/\d/.test(p)?10:0)+(/[^a-zA-Z0-9]/.test(p)?33:0);
  let bits=p.length&&pool?p.length*Math.log2(pool):0;
  const tips=[];
  if(COMMON.includes(p.toLowerCase())){bits=Math.min(bits,8);tips.push('Está en listas de contraseñas filtradas: cámbiala de inmediato.')}
  if(/(.)\1{2,}/.test(p))tips.push('Evita repetir el mismo carácter varias veces.');
  if(/^(abc|123|qwe)/i.test(p))tips.push('Evita secuencias obvias como 123 o abc.');
  if(p&&p.length<12)tips.push('Usa al menos 12 caracteres.');
  if(p&&pool<52)tips.push('Mezcla mayúsculas, minúsculas, números y símbolos.');
  const lv=bits<28?['Muy débil','#ef4444']:bits<50?['Débil','#f97316']:bits<70?['Aceptable','#eab308']:bits<90?['Fuerte','#22c55e']:['Muy fuerte','#16a34a'];
  $('pwb').style.width=Math.min(bits,100)+'%';
  $('pwb').style.background=p?lv[1]:'transparent';
  $('pwl').textContent=p?`Nivel: ${lv[0]} · ~${Math.round(bits)} bits de entropía estimada`:'';
  $('pwt').innerHTML=tips.map(t=>`<li>${t}</li>`).join('');
}

// ---- Herramienta 2: generador de contraseñas ----
function generator(){
  app.innerHTML=`<div class="card pop"><p class="tag">HERRAMIENTA</p><h2 class="q">Generador de contraseñas</h2>
  <label>Longitud: <b id="gl">${gen.len}</b></label>
  <input type="range" min="8" max="32" value="${gen.len}" class="rng" oninput="gen.len=+this.value;$('gl').textContent=this.value;mk()">
  <label class="chk"><input type="checkbox" ${gen.up?'checked':''} onchange="gen.up=this.checked;mk()"> Mayúsculas</label>
  <label class="chk"><input type="checkbox" ${gen.num?'checked':''} onchange="gen.num=this.checked;mk()"> Números</label>
  <label class="chk"><input type="checkbox" ${gen.sym?'checked':''} onchange="gen.sym=this.checked;mk()"> Símbolos</label>
  <div class="out" id="out"></div>
  <button class="btn" onclick="mk()">Generar otra</button>
  <button class="btn alt" onclick="cp()">Copiar</button>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
  mk();
}
function mk(){
  let pool='abcdefghijklmnopqrstuvwxyz';
  if(gen.up)pool+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(gen.num)pool+='0123456789';
  if(gen.sym)pool+='!@#$%^&*-_=+?';
  const a=new Uint32Array(gen.len);
  crypto.getRandomValues(a);
  $('out').textContent=[...a].map(n=>pool[n%pool.length]).join('');
}
function cp(){
  navigator.clipboard?.writeText($('out').textContent).catch(()=>{});
  SFX.ok();
}

// ---- Herramienta 3: detector de phishing ----
function detector(){mi=0;showMail()}
function showMail(){
  const m=MAILS[mi];
  app.innerHTML=`<div class="card pop"><p class="tag">DETECTOR · CORREO ${mi+1}/${MAILS.length}</p>
  <div class="mail"><p><b>De:</b> ${m.from}</p><p><b>Asunto:</b> ${m.subj}</p><p>${m.body}</p></div>
  <p class="txt">Marca las señales de alerta que encuentres:</p>
  ${SIGNS.map((s,i)=>`<label class="chk"><input type="checkbox" id="s${i}"> ${s}</label>`).join('')}
  <button class="btn" onclick="judge()">Analizar</button><div id="res"></div></div>`;
}
function judge(){
  const m=MAILS[mi];
  const hit=SIGNS.map((s,i)=>$('s'+i).checked===m.bad.includes(i));
  const ok=hit.filter(Boolean).length;
  const explica=m.bad.length
    ?'Este correo es phishing. Señales reales: '+m.bad.map(i=>SIGNS[i].toLowerCase()).join(', ')+'.'
    :'Este correo parece legítimo. Aun así, entra a la app o al sitio oficial en lugar de seguir enlaces.';
  const sigPaso=mi<MAILS.length-1
    ?'<button class="btn" onclick="mi++;showMail()">Siguiente correo</button>'
    :'<button class="btn" onclick="home()">Terminar</button>';
  $('res').innerHTML=`<div class="mail"><b>Acertaste ${ok} de ${SIGNS.length}</b><p>${explica}</p></div>${sigPaso}`;
  SFX[ok===SIGNS.length?'ok':'bad']();
}

home();
