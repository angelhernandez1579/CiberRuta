const $=id=>document.getElementById(id), app=$('app');
const DB=()=>JSON.parse(localStorage.getItem('cr_users')||'{}');
const putDB=d=>localStorage.setItem('cr_users',JSON.stringify(d));
let USERS=DB(), ME=localStorage.getItem('cr_session'), P=(ME&&USERS[ME])||null;
const ALL=[];
U.forEach((u,ui)=>u.L.forEach((l,li)=>ALL.push({id:ui+'.'+li,ui,li})));
const SIGNS=["Urgencia o amenaza","Dominio extraño","Enlace sospechoso","Pide datos o contraseñas","Saludo genérico"];
const BADGES={first:['🥇','Primera lección'],perfect:['💯','Lección perfecta'],unit:['🏅','Unidad completa'],streak3:['🔥','Racha de 3 días'],phish:['🎣','Cazador de phishing'],gen:['🎲','Generador activo'],check:['🔍','Contraseña fuerte']};
const COMMON=['123456','password','qwerty','111111','12345678','abc123','letmein','admin','iloveyou','contraseña'];
let ctx,muted=false,cur,qi,correct,authMode='login',D={m:null,ok:0,n:0};

// ---- Sonido ----
function beep(f,d,type,when=0){
  if(muted)return;
  ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
  const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+when;
  o.type=type;o.frequency.value=f;o.connect(g);g.connect(ctx.destination);
  g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.start(t);o.stop(t+d);
}
const SFX={click:()=>beep(520,.06,'triangle'),ok:()=>{beep(660,.12,'sine');beep(990,.18,'sine',.1)},bad:()=>beep(180,.3,'sawtooth'),win:()=>[523,659,784,1046].forEach((f,i)=>beep(f,.3,'triangle',i*.13))};
function tgl(){muted=!muted;$('mute').textContent=muted?'🔇':'🔊'}

// ---- Estado, cuentas y recompensas ----
function save(){if(!P)return;USERS[ME]=P;putDB(USERS);stats()}
function stats(){
  if(!P)return;
  $('xp').textContent=P.xp;$('coins').textContent=P.coins;$('sk').textContent=P.streak;
}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function award(k){if(!P||P.badges.includes(k))return;P.badges.push(k);P.coins+=25;toast(BADGES[k][0]+' Logro: '+BADGES[k][1]+' (+25 🪙)')}
function touchStreak(){
  const today=new Date().toDateString(),yest=new Date(Date.now()-864e5).toDateString();
  if(P.day!==today){P.streak=P.day===yest?P.streak+1:1;P.day=today}
  if(P.streak>=3)award('streak3');
}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function auth(){
  app.innerHTML=`<div class="card pop"><p class="tag">CUENTA</p><h2 class="q">${authMode==='login'?'Inicia sesión':'Crea tu cuenta'}</h2>
  <input id="un" class="inp" placeholder="Usuario (3-16 caracteres)" maxlength="16" autocomplete="username">
  <input id="up" class="inp" type="password" placeholder="Contraseña (mín. 6)" autocomplete="current-password">
  <p id="ae" style="color:#f87171;min-height:22px;margin-top:6px"></p>
  <button class="btn" onclick="doAuth()">${authMode==='login'?'Entrar':'Registrarme'}</button>
  <button class="btn alt" onclick="authMode=authMode==='login'?'reg':'login';auth()">${authMode==='login'?'No tengo cuenta':'Ya tengo cuenta'}</button></div>`;
}
async function doAuth(){
  const u=$('un').value.trim(),p=$('up').value;
  if(!/^\w{3,16}$/.test(u))return $('ae').textContent='Usuario: 3-16 letras, números o _';
  if(p.length<6)return $('ae').textContent='La contraseña debe tener al menos 6 caracteres';
  const h=await sha(p);USERS=DB();
  if(authMode==='reg'){
    if(USERS[u])return $('ae').textContent='Ese usuario ya existe';
    USERS[u]={h,xp:0,coins:0,badges:[],done:[],streak:0,day:'',phishOK:0,genCount:0};
  }else if(!USERS[u]||USERS[u].h!==h)return $('ae').textContent='Usuario o contraseña incorrectos';
  ME=u;P=USERS[u];localStorage.setItem('cr_session',u);
  save();home();
}
function logout(){localStorage.removeItem('cr_session');ME=null;P=null;authMode='login';auth()}

function home(){
  if(!P)return auth();
  stats();
  let h=`<div class="tools">
    <button onclick="checker()">🔍<span>Verificador</span></button>
    <button onclick="generator()">🎲<span>Generador</span></button>
    <button onclick="detector()">🎣<span>Phishing</span></button>
    <button onclick="ranking()">🏆<span>Ranking</span></button>
    <button onclick="profile()">👤<span>Perfil</span></button></div>
    <h1 class="center" style="margin:6px 0 16px">Tu ruta de ciberseguridad</h1>`;
  U.forEach((u,ui)=>{
    h+=`<section class="unit" style="border-color:${u.c}"><h2 style="color:${u.c}">${u.n}</h2>`;
    u.L.forEach((l,li)=>{
      const i=ALL.findIndex(x=>x.ui===ui&&x.li===li),id=ui+'.'+li;
      const done=P.done.includes(id),open=i===0||P.done.includes(ALL[i-1].id);
      const cls=done?'done':open?'cur':'lock';
      h+=`<div class="row" style="margin-left:${li%2?'36px':'0'}"><button class="node ${cls}" ${open?'':'disabled'} onclick="lesson(${ui},${li})">${done?'✔':open?'★':'🔒'}</button><span>${l.t}</span></div>`;
    });
    h+='</section>';
  });
  app.innerHTML=h;
}

// ---- Lecciones (sin corazones: no hay penalización por fallar) ----
function lesson(ui,li){
  cur=U[ui].L[li];cur.id=ui+'.'+li;SFX.click();
  app.innerHTML=`<div class="card pop"><p class="tag">TEORÍA · ${U[ui].n}</p><h2 class="q">${cur.t}</h2><p class="txt">${cur.th}</p><p class="tag">PROFUNDIZA</p><p class="txt">${cur.ex||''}</p><button class="btn" onclick="startQ()">Empezar ▶</button><button class="btn alt" onclick="home()">Volver</button></div>`;
  window.scrollTo(0,0);
}
function startQ(){qi=0;correct=0;ask()}
function ask(){
  const q=cur.q[qi];
  app.innerHTML=`<div class="top"><button class="x" onclick="home()">✕</button><div class="bar"><div style="width:${qi/cur.q.length*100}%"></div></div><span>${qi+1}/${cur.q.length}</span></div>
  <div class="card slide"><h2 class="q">${q[0]}</h2>${q[1].map((o,i)=>`<button class="opt" onclick="answer(${i})">${o}</button>`).join('')}</div><div id="fb"></div>`;
}
function answer(i){
  const q=cur.q[qi],ok=i===q[2];
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===q[2])b.classList.add('good');else if(j===i)b.classList.add('bad')});
  if(ok){correct++;SFX.ok()}else{SFX.bad();document.querySelector('.card').classList.add('shake')}
  $('fb').innerHTML=`<div class="fb ${ok?'okb':'badb'}"><b>${ok?'¡Correcto! ✅':'Incorrecto ❌'}</b><p style="margin:6px 0 4px">${q[3]}</p><button class="btn" onclick="next()">Continuar</button></div>`;
}
function next(){qi++;qi<cur.q.length?ask():finish()}
function finish(){
  const [ui,li]=cur.id.split('.').map(Number),n=cur.q.length;
  if(!P.done.includes(cur.id)){P.done.push(cur.id);P.xp+=10*correct+5;P.coins+=5*correct}
  touchStreak();award('first');
  if(correct===n)award('perfect');
  if(U[ui].L.every((_,k)=>P.done.includes(ui+'.'+k)))award('unit');
  save();SFX.win();burst();
  app.innerHTML=`<div class="card pop center"><div class="big">🏆</div><h2 class="q">¡Lección completada!</h2><p class="txt">Correctas: ${correct}/${n}<br>Recompensa: +${10*correct+5} XP y +${5*correct} 🪙 la primera vez</p><button class="btn" onclick="home()">Continuar en el mapa</button></div>`;
}
function burst(){
  for(let i=0;i<30;i++){
    const c=document.createElement('span');c.className='conf';
    c.textContent=['🎉','⭐','🛡️','✨'][i%4];c.style.left=Math.random()*100+'vw';c.style.animationDelay=Math.random()*.6+'s';
    document.body.appendChild(c);setTimeout(()=>c.remove(),3500);
  }
}

// ---- Verificador de contraseñas ----
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
  if(bits>=70){award('check');save()}
  $('pwb').style.width=Math.min(bits,100)+'%';
  $('pwb').style.background=p?lv[1]:'transparent';
  $('pwl').textContent=p?`Nivel: ${lv[0]} · ~${Math.round(bits)} bits de entropía estimada`:'';
  $('pwt').innerHTML=tips.map(t=>`<li>${t}</li>`).join('');
}

// ---- Generador de contraseñas ----
let gen={len:16,up:true,num:true,sym:true};
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
  const a=new Uint32Array(gen.len);crypto.getRandomValues(a);
  $('out').textContent=[...a].map(n=>pool[n%pool.length]).join('');
  P.genCount++;if(P.genCount>=10)award('gen');save();
}
function cp(){navigator.clipboard?.writeText($('out').textContent).catch(()=>{});SFX.ok()}

// ---- Detector de phishing: correos generados sin fin ----
const R=a=>a[Math.random()*a.length|0];
const BR=['BancoSol','PayFlow','Paquexpress','MercadoSur','CloudBox','SocialHub','TiendaMX'];
const NM=['Ana','Luis','Sofía','Mateo','Valeria','Diego'];
function genMail(){
  const b=R(BR).toLowerCase(),nm=R(NM),bad=Math.random()<.55;
  const f=bad?{u:Math.random()<.7,d:Math.random()<.85,l:Math.random()<.8,p:Math.random()<.8,g:Math.random()<.7}:{};
  if(bad&&!Object.values(f).some(Boolean))f.u=true;
  const fake=b+R(['-seguridad.com','-verif.net','-soporte.info','-login.xyz']),real=b+'.com';
  const greet=bad&&f.g?R(['Estimado usuario','Estimado cliente']):'Hola '+nm;
  const subj=bad?(f.u?R(['URGENTE: tu cuenta será suspendida','Actividad sospechosa: actúa hoy']):R(['Nuevo mensaje en tu cuenta','Revisa tu información'])):R(['Tu pedido fue enviado','Factura de tu suscripción','Confirmación de cita']);
  const from=bad&&f.d?'soporte@'+fake:'no-reply@'+real;
  const url=bad&&f.l?'https://'+fake+'/verificar':'https://'+real+'/cuenta';
  const body=bad
    ?`${greet}, ${f.p?'confirma tus datos y contraseña':'revisa tu cuenta'} aquí: ${url}`
    :`${greet}, tu mensaje fue procesado. Consulta los detalles en ${url}`;
  const flags=bad?[f.u,f.d,f.l,f.p,f.g]:[false,false,false,false,false];
  return {from,subj,body,bad:flags.map((x,i)=>x?i:-1).filter(i=>i>=0)};
}
function detector(){if(!D.m)D.m=genMail();showMail()}
function showMail(){
  const m=D.m;
  app.innerHTML=`<div class="card pop"><p class="tag">DETECTOR · ${D.n} revisados · ${D.ok} acertados</p>
  <div class="mail"><p><b>De:</b> ${m.from}</p><p><b>Asunto:</b> ${m.subj}</p><p>${m.body}</p></div>
  <p class="txt">Marca las señales de alerta que encuentres:</p>
  ${SIGNS.map((s,i)=>`<label class="chk"><input type="checkbox" id="s${i}"> ${s}</label>`).join('')}
  <button class="btn" onclick="judge()">Analizar</button><div id="res"></div>
  <button class="btn alt" onclick="home()">Volver al mapa</button></div>`;
}
function judge(){
  const m=D.m,ok=SIGNS.every((s,i)=>$('s'+i).checked===m.bad.includes(i));
  D.n++;
  if(ok){D.ok++;P.xp+=5;P.coins+=2;P.phishOK++;if(P.phishOK>=10)award('phish');save()}
  const explica=m.bad.length
    ?'Este correo es phishing. Señales reales: '+m.bad.map(i=>SIGNS[i].toLowerCase()).join(', ')+'.'
    :'Este correo parece legítimo. Aun así, entra desde la app o el sitio oficial en lugar de seguir enlaces.';
  $('res').innerHTML=`<div class="mail"><b>${ok?'¡Acertaste todas! +5 XP':'Fallaste alguna señal'}</b><p>${explica}</p></div>
  <button class="btn" onclick="D.m=genMail();showMail()">Siguiente correo</button>`;
  SFX[ok?'ok':'bad']();
}

// ---- Ranking y perfil ----
function ranking(){
  USERS=DB();
  const arr=Object.entries(USERS).map(([n,u])=>({n,xp:u.xp,b:u.badges.length})).sort((a,b)=>b.xp-a.xp);
  app.innerHTML=`<div class="card pop"><p class="tag">RANKING</p><h2 class="q">Clasificación</h2>
  ${arr.map((u,i)=>`<div class="rk ${u.n===ME?'me':''}"><b>#${i+1}</b><span>${u.n}</span><span>${u.xp} XP · 🏅${u.b}</span></div>`).join('')}
  <p class="tag" style="margin-top:14px">Ranking local: incluye las cuentas creadas en este navegador.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function profile(){
  app.innerHTML=`<div class="card pop"><p class="tag">PERFIL</p><h2 class="q">${ME}</h2>
  <p class="txt">Nivel ${Math.floor(P.xp/100)+1} · ${P.xp} XP · 🪙 ${P.coins} · 🔥 racha ${P.streak} días</p>
  <h3 style="margin-bottom:8px">Logros</h3><div class="badges">
  ${Object.entries(BADGES).map(([k,[e,n]])=>`<div class="bd ${P.badges.includes(k)?'on':''}">${e}<span>${n}</span></div>`).join('')}</div>
  <button class="btn" onclick="home()">Volver</button><button class="btn alt" onclick="logout()">Cerrar sesión</button></div>`;
}

home();
