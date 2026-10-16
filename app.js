const $=id=>document.getElementById(id), app=$('app');
const DB=()=>JSON.parse(localStorage.getItem('cr_users')||'{}');
const putDB=d=>localStorage.setItem('cr_users',JSON.stringify(d));
let USERS=DB(), ME=localStorage.getItem('cr_session'), P=(ME&&USERS[ME])||null;
const ALL=[];
U.forEach((u,ui)=>u.L.forEach((l,li)=>ALL.push({id:ui+'.'+li,ui,li})));
const SIGNS=["Urgencia o amenaza","Dominio extraño","Enlace sospechoso","Pide datos o contraseñas","Saludo genérico"];
const BADGES={first:['🥇','Primera lección'],perfect:['💯','Lección perfecta'],unit:['🏅','Unidad completa'],streak3:['🔥','Racha de 3 días'],phish:['🎣','Cazador de phishing'],gen:['🎲','Generador activo'],check:['🔍','Contraseña fuerte']};
const TITLES=['Novato','Explorador','Protector','Guardián','Defensor','Experto','Maestro cibernético'];
const TIPS=["Una frase larga es más segura que una contraseña corta con símbolos.","Nunca compartas un código de verificación, ni con soporte.","Pasa el cursor sobre un enlace antes de hacer clic.","Activa la autenticación en dos pasos en tu correo primero.","Actualiza tu equipo: muchas brechas usan fallos ya corregidos."];
const COMMON=['123456','password','qwerty','111111','12345678','abc123','letmein','admin','iloveyou','contraseña'];
const LOGO=`<svg viewBox="0 0 64 64" width="34" height="34"><path d="M32 4 L56 14 V32 C56 46 46 56 32 60 C18 56 8 46 8 32 V14 Z" fill="#22c55e"/><path d="M22 32 l7 7 l13-14" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const MASC=(s=110,cls='bob')=>`<svg viewBox="0 0 120 130" width="${s}" class="${cls}"><ellipse cx="60" cy="126" rx="34" ry="5" fill="#000" opacity=".3"/><path d="M60 8 L104 24 V62 C104 92 84 112 60 120 C36 112 16 92 16 62 V24 Z" fill="#38bdf8"/><circle cx="44" cy="58" r="7" fill="#0f172a"/><circle cx="76" cy="58" r="7" fill="#0f172a"/><circle cx="46" cy="56" r="2" fill="#fff"/><circle cx="78" cy="56" r="2" fill="#fff"/><path d="M42 80 Q60 96 78 80" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="34" cy="74" r="5" fill="#f9a8d4"/><circle cx="86" cy="74" r="5" fill="#f9a8d4"/></svg>`;
let ctx,muted=false,cur,qi,correct,pg=0,authMode='login',D={m:null,ok:0,n:0};

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

// ---- Estado, niveles y recompensas ----
$('logo').innerHTML=LOGO+' CiberRuta';
function lvl(xp){let l=1,need=100,x=xp;while(x>=need){x-=need;l++;need+=50}return{l,cur:x,need,title:TITLES[Math.min(l-1,TITLES.length-1)]}}
function save(){if(!P)return;USERS[ME]=P;putDB(USERS);stats()}
function stats(){if(!P)return;$('xp').textContent=P.xp;$('coins').textContent=P.coins;$('sk').textContent=P.streak}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2800)}
function addXP(x,c){const a=lvl(P.xp).l;P.xp+=x;P.coins+=c;const b=lvl(P.xp);if(b.l>a)toast(`🎉 ¡Nivel ${b.l}! ${b.title}`)}
function award(k){if(!P||P.badges.includes(k))return;P.badges.push(k);P.coins+=25;toast(BADGES[k][0]+' Logro: '+BADGES[k][1]+' (+25 🪙)')}
function touchStreak(){
  const today=new Date().toDateString(),yest=new Date(Date.now()-864e5).toDateString();
  if(P.day!==today){P.streak=P.day===yest?P.streak+1:1;P.day=today}
  if(P.streak>=3)award('streak3');
}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}

// ---- Portada ----
function enter(){P?home():auth()}
function intro(){
  app.innerHTML=`<section class="hero"><div class="float">${MASC(150)}</div>
  <h1>CiberRuta</h1><p class="sub">Aprende a protegerte en el mundo digital, jugando.</p>
  <button class="btn" onclick="enter()">Empezar ▶</button>
  <button class="btn alt" onclick="document.getElementById('que').scrollIntoView({behavior:'smooth'})">Conocer el proyecto</button></section>
  <section id="que" class="rv"><h2>¿Qué es CiberRuta?</h2><p>CiberRuta es una plataforma educativa gratuita para enseñar seguridad digital y ciberseguridad a cualquier persona. Combina teoría breve, casos reales, práctica interactiva y recompensas, para que aprender sobre contraseñas, phishing o privacidad sea tan natural como un juego.</p></section>
  <section class="rv"><h2>El problema</h2><p>Millones de personas usan internet sin herramientas básicas para protegerse: reutilizan contraseñas, caen en mensajes fraudulentos y comparten datos sin pensar. El factor humano participa en gran parte de las brechas de seguridad, y el riesgo es mayor para quienes no tuvieron acceso a formación técnica.</p></section>
  <section class="rv"><h2>Nuestra solución</h2>
  <div class="feat"><span class="ic">🧭</span><div><b>Aprende</b>16 lecciones en 8 unidades, con teoría en páginas, casos reales y preguntas con explicación.</div></div>
  <div class="feat"><span class="ic">🎣</span><div><b>Practica</b>Un detector de phishing infinito, un verificador de contraseñas y un generador seguro.</div></div>
  <div class="feat"><span class="ic">🏆</span><div><b>Compite</b>XP, niveles, logros, bonificaciones diarias y un ranking entre usuarios.</div></div></section>
  <section class="rv"><h2>Objetivos de Desarrollo Sostenible</h2>
  <div class="ods"><b>ODS 4 · Educación de calidad (principal)</b><br>Meta 4.4: aumentar las competencias digitales para el empleo y la ciudadanía.</div>
  <div class="ods"><b>ODS 9 · Industria, innovación e infraestructura</b><br>Fomenta la adopción segura e informada de la tecnología digital.</div>
  <div class="ods"><b>ODS 16 · Paz, justicia e instituciones sólidas</b><br>Reduce el riesgo de cibercrimen y fortalece la confianza en el entorno digital.</div></section>
  <footer class="ft"><p class="tag">Democratizando la educación en ciberseguridad mediante juegos, comunidad y buenas prácticas, alineados a los Objetivos de Desarrollo Sostenible de la ONU.</p>
  <div class="fcols"><div><b>Plataforma</b><a href="#" onclick="enter();return false">Aprendizaje</a><a href="#" onclick="enter();return false">Herramientas</a><a href="#" onclick="enter();return false">Ranking</a></div>
  <div><b>Legal & contacto</b><a href="#">Aviso de Privacidad</a><a href="#">Términos de Servicio</a><a href="mailto:contacto@ciberruta.example">contacto@ciberruta.example</a></div></div></footer>`;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  window.scrollTo(0,0);
}

// ---- Cuentas ----
function auth(){
  app.innerHTML=`<div class="card pop"><p class="tag">CUENTA</p><h2 class="q">${authMode==='login'?'Inicia sesión':'Crea tu cuenta'}</h2>
  <input id="un" class="inp" placeholder="Usuario (3-16 caracteres)" maxlength="16" autocomplete="username">
  <input id="up" class="inp" type="password" placeholder="Contraseña (mín. 6)" autocomplete="current-password">
  <p id="ae" style="color:#f87171;min-height:22px;margin-top:6px"></p>
  <button class="btn" onclick="doAuth()">${authMode==='login'?'Entrar':'Registrarme'}</button>
  <button class="btn alt" onclick="authMode=authMode==='login'?'reg':'login';auth()">${authMode==='login'?'No tengo cuenta':'Ya tengo cuenta'}</button>
  <button class="btn alt" onclick="intro()">← Volver a la portada</button></div>`;
}
async function doAuth(){
  const u=$('un').value.trim(),p=$('up').value;
  if(!/^\w{3,16}$/.test(u))return $('ae').textContent='Usuario: 3-16 letras, números o _';
  if(p.length<6)return $('ae').textContent='La contraseña debe tener al menos 6 caracteres';
  const h=await sha(p);USERS=DB();
  if(authMode==='reg'){
    if(USERS[u])return $('ae').textContent='Ese usuario ya existe';
    USERS[u]={h,xp:0,coins:0,badges:[],done:[],streak:0,day:'',bonusDay:'',phishOK:0,genCount:0};
  }else if(!USERS[u]||USERS[u].h!==h)return $('ae').textContent='Usuario o contraseña incorrectos';
  ME=u;P=USERS[u];localStorage.setItem('cr_session',u);
  save();home();
}
function logout(){localStorage.removeItem('cr_session');ME=null;P=null;authMode='login';intro()}

// ---- Inicio (mapa) ----
function home(){
  if(!P)return auth();
  const today=new Date().toDateString();
  if(P.bonusDay!==today){P.bonusDay=today;addXP(20,10);toast('🎁 Bonificación diaria +20 XP +10 🪙');save()}
  stats();
  const L=lvl(P.xp),tip=TIPS[new Date().getDate()%TIPS.length];
  let h=`<div class="card lvlc">${MASC(70,'wave')}<div style="flex:1"><p class="tag">NIVEL ${L.l} · ${L.title}</p>
    <div class="bar"><div style="width:${L.cur/L.need*100}%"></div></div>
    <p class="txt" style="margin:6px 0 0;font-size:.82rem">${L.cur}/${L.need} XP</p></div></div>
    <div class="tip">💡 ${tip}</div>
    <div class="tools" style="margin-top:14px">
    <button onclick="checker()">🔍<span>Verificador</span></button>
    <button onclick="generator()">🎲<span>Generador</span></button>
    <button onclick="detector()">🎣<span>Phishing</span></button>
    <button onclick="ranking()">🏆<span>Ranking</span></button>
    <button onclick="profile()">👤<span>Perfil</span></button></div><div class="tools" style="margin-top:8px"><button onclick="guias()">📘<span>Guías</span></button><button onclick="mapa()">🌍<span>Mapa</span></button><button onclick="noticias()">📰<span>Noticias</span></button><button style="background:#7f1d1d" onclick="emergencia()">🆘<span>Emergencia</span></button></div>
    <h1 class="center" style="margin:18px 0 16px">Tu ruta de ciberseguridad</h1>`;
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

// ---- Lecciones paginadas: teoría (2 páginas) y luego práctica ----
function lesson(ui,li){cur=U[ui].L[li];cur.id=ui+'.'+li;pg=0;SFX.click();showPg()}
function showPg(){
  const pages=[['TEORÍA',cur.th],['PROFUNDIZA',cur.ex||'']];
  const [tag,txt]=pages[pg];
  app.innerHTML=`<div class="card pop"><p class="tag">${tag} · ${pg+1}/${pages.length}</p><h2 class="q">${cur.t}</h2><p class="txt">${txt}</p>
  <div class="dots">${pages.map((_,i)=>`<i class="${i===pg?'on':''}"></i>`).join('')}</div>
  ${pg>0?'<button class="btn alt" onclick="pg--;showPg()">← Anterior</button>':''}
  ${pg<pages.length-1?'<button class="btn" onclick="pg++;showPg()">Siguiente →</button>':'<button class="btn" onclick="startQ()">Practicar ▶</button>'}
  <button class="btn alt" onclick="home()">Volver al mapa</button></div>`;
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
  const [ui]=cur.id.split('.').map(Number),n=cur.q.length;
  let gx=0,gc=0;
  if(!P.done.includes(cur.id)){P.done.push(cur.id);gx=10*correct+5;gc=5*correct;addXP(gx,gc)}
  touchStreak();award('first');
  if(correct===n)award('perfect');
  if(U[ui].L.every((_,k)=>P.done.includes(ui+'.'+k))&&!P.badges.includes('unit')){award('unit');addXP(40,50);toast('🎁 Cofre de unidad: +40 XP +50 🪙')}
  save();SFX.win();burst();
  app.innerHTML=`<div class="card pop center"><div class="big">🏆</div><h2 class="q">¡Lección completada!</h2><p class="txt">Correctas: ${correct}/${n}<br>Recompensa: +${gx} XP y +${gc} 🪙 ${gx?'':'(ya la habías completado)'}</p>${MASC(90)}<button class="btn" onclick="home()">Continuar en el mapa</button></div>`;
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
  <button class="btn" onclick="breach()">Revisar en filtraciones conocidas</button><p id="pbr" class="txt"></p><p class="tag" style="margin-top:14px">Tu contraseña no sale de tu navegador: se analiza solo aquí.</p>
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

// ---- Detector de phishing infinito ----
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
  if(ok){D.ok++;addXP(5,2);P.phishOK++;if(P.phishOK>=10)award('phish');save()}
  const explica=m.bad.length
    ?'Este correo es phishing. Señales reales: '+m.bad.map(i=>SIGNS[i].toLowerCase()).join(', ')+'.'
    :'Este correo parece legítimo. Aun así, entra desde la app o el sitio oficial en lugar de seguir enlaces.';
  $('res').innerHTML=`<div class="mail"><b>${ok?'¡Acertaste todas! +5 XP +2 🪙':'Fallaste alguna señal'}</b><p>${explica}</p></div>
  <button class="btn" onclick="D.m=genMail();showMail()">Siguiente correo</button>`;
  SFX[ok?'ok':'bad']();
}

// ---- Ranking y perfil ----
function ranking(){
  USERS=DB();
  const arr=Object.entries(USERS).map(([n,u])=>({n,xp:u.xp,b:u.badges.length})).sort((a,b)=>b.xp-a.xp);
  app.innerHTML=`<div class="card pop"><p class="tag">RANKING</p><h2 class="q">Clasificación</h2>
  ${arr.map((u,i)=>`<div class="rk ${u.n===ME?'me':''}"><b>#${i+1}</b><span>${u.n}</span><span>Nv ${lvl(u.xp).l} · ${u.xp} XP · 🏅${u.b}</span></div>`).join('')||'<p>Aún no hay usuarios.</p>'}
  <p class="tag" style="margin-top:14px">Ranking local: incluye las cuentas creadas en este navegador.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function profile(){
  const L=lvl(P.xp);
  app.innerHTML=`<div class="card pop"><p class="tag">PERFIL</p><h2 class="q">${ME}</h2>
  <div class="lvlc">${MASC(70,'float')}<div><p class="txt" style="margin:0">Nivel ${L.l} · ${L.title}<br>${P.xp} XP · 🪙 ${P.coins} · 🔥 ${P.streak} días</p>
  <div class="bar"><div style="width:${L.cur/L.need*100}%"></div></div></div></div>
  <h3 style="margin:16px 0 8px">Logros</h3><div class="badges">
  ${Object.entries(BADGES).map(([k,[e,n]])=>`<div class="bd ${P.badges.includes(k)?'on':''}">${e}<span>${n}</span></div>`).join('')}</div>
  <button class="btn" onclick="home()">Volver</button><button class="btn alt" onclick="logout()">Cerrar sesión</button></div>`;
}

intro();
