const $=id=>document.getElementById(id), app=$('app');
const DB=()=>JSON.parse(localStorage.getItem('cr_users')||'{}');
const putDB=d=>localStorage.setItem('cr_users',JSON.stringify(d));
let ME=null,P=null;
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
function save(){if(!P)return;stats();queueSave()}
function stats(){if(!P)return;$('xp').textContent=P.xp;$('coins').textContent=P.coins;$('sk').textContent=P.streak}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2800)}
function addXP(x,c){const a=lvl(P.xp).l;const mx=Date.now()<(P.dxUntil||0)?2:1;P.xp+=x*mx;P.coins+=c;const b=lvl(P.xp);if(b.l>a)toast(`🎉 ¡Nivel ${b.l}! ${b.title}`)}
function award(k){if(!P||P.badges.includes(k))return;P.badges.push(k);P.coins+=25;toast(BADGES[k][0]+' Logro: '+BADGES[k][1]+' (+25 🪙)')}
function touchStreak(){
  const today=new Date().toDateString(),yest=new Date(Date.now()-864e5).toDateString();
  const d2=new Date(Date.now()-2*864e5).toDateString();if(P.day!==today){if(P.day===yest)P.streak++;else if(P.day===d2&&P.freeze>0){P.freeze--;P.streak++;toast('🛟 Protector de racha usado: tu racha sigue')}else P.streak=1;P.day=today}
  if(P.streak>=3)award('streak3');
}
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}

// ---- Portada ----
function enter(){P?home():auth()}
function intro(){
  app.innerHTML=`${instalarCard()}<section class="hero"><div class="float">${MASC(150)}</div>
  <h1>CiberRuta</h1><p class="sub">Aprende a protegerte en el mundo digital, jugando.</p>
  <button class="btn" id="start">Empezar ▶</button>
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
  ${footerHTML()}`;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
  $('start').addEventListener('click',()=>{window.scrollTo(0,0);P?home():auth()});
  window.scrollTo(0,0);
}

// ---- Cuentas (Supabase) ----
function auth(){
  app.innerHTML=`<div class="card pop"><p class="tag">CUENTA</p><h2 class="q">${authMode==='login'?'Inicia sesión':'Crea tu cuenta'}</h2>
  ${authMode==='reg'?'<input id="un" class="inp" placeholder="Usuario (3-16 caracteres)" maxlength="16" autocomplete="username">':''}
  <input id="ue" class="inp" type="email" placeholder="Correo" autocomplete="email">
  <input id="up" class="inp" type="password" placeholder="Contraseña (mín. 6)" autocomplete="current-password">
  <p id="ae" style="color:#f87171;min-height:22px;margin-top:6px"></p>
  <button class="btn" onclick="doAuth()">${authMode==='login'?'Entrar':'Registrarme'}</button>
  <button class="gbtn" onclick="signGoogle()">${GOOGLE_G}<span>Continuar con Google</span></button>
  <p style="display:block;width:100%;text-align:center;margin:8px 0 0;font-size:.85rem;line-height:1.4;color:#94a3b8">El acceso con Google es solo para cuentas del dominio .udg.mx</p>
  <button class="btn alt" onclick="authMode=authMode==='login'?'reg':'login';auth()">${authMode==='login'?'No tengo cuenta':'Ya tengo cuenta'}</button></div>`;
}
let FAILS=0;
async function doAuth(){
  if(FAILS>=5&&!cool('login',30000))return $('ae').textContent='Demasiados intentos. Espera 30 segundos.';
  const e=$('ue').value.trim(),p=$('up').value,u=authMode==='reg'?$('un').value.trim():'';
  const err=m=>$('ae').textContent=m;
  if(authMode==='reg'&&!/^\w{3,16}$/.test(u))return err('Usuario: 3-16 letras, números o _');
  if(!e.includes('@'))return err('Escribe un correo válido');
  if(p.length<6)return err('La contraseña debe tener al menos 6 caracteres');
  err('Procesando...');
  const r=authMode==='reg'?await signUp(e,p,u):await signIn(e,p);
  if(r.error){FAILS++;return err(r.error)}
  FAILS=0;
  if(r.needsConfirm)return err('Revisa tu correo para confirmar la cuenta y luego entra.');
  P=await loadProfile();ME=P.username;home();
}
async function logout(){await signOut();ME=null;P=null;authMode='login';intro()}

// ---- Inicio (mapa) ----
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
  if(ok){correct++;SFX.ok()}else{SFX.bad();document.querySelector('.card').classList.add('shake')}if(!ok)addReview(cur.id,qi);
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
async function ranking(){
  app.innerHTML=`<div class="card pop"><p class="tag">RANKING</p><h2 class="q">Clasificación</h2><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>`;
  const {data:arr,error}=await fetchRanking();
  if(error){
    app.innerHTML=`<div class="card pop"><p class="tag">RANKING</p><h2 class="q">No se pudo cargar</h2><div class="mail">${error}</div><button class="btn" onclick="ranking()">Reintentar</button><button class="btn alt" onclick="home()">Volver</button></div>`;
    return;
  }
  app.innerHTML=`<div class="card pop"><p class="tag">RANKING GLOBAL</p><h2 class="q">Clasificación</h2>
  ${arr.map((u,i)=>`<div class="rk ${u.username===ME?'me':''}"><b>#${i+1}</b>${avatarHTML(u.avatar_url,32,u.username)}<span>${u.marco_fundador?"⭐ ":""}${esc(u.username)}</span><span>Nv ${lvl(u.xp).l} · ${u.xp} XP · 🏅${u.badges_n}</span></div>`).join('')||'<p>Aún no hay usuarios.</p>'}
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
const GOOGLE_G=`<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7-10 7-17.5z"/><path fill="#FBBC05" d="M10.4 28.8c-.5-1.5-.8-3-.8-4.8s.3-3.3.8-4.8l-7.8-6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.8l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.2-13.6-9.9l-7.8 6C6.5 42.6 14.6 48 24 48z"/></svg>`;
function avatarHTML(url,size=72,name=''){
  const st=`width:${size}px;height:${size}px`,u=safeUrl(url);
  return u?`<img src="${u}" class="av" style="${st}" alt="" referrerpolicy="no-referrer">`:`<div class="av ph" style="${st}">${esc((name||'?')[0].toUpperCase())}</div>`;
}
function profile(){
  const L=lvl(P.xp);
  app.innerHTML=`<div class="card pop center">
    <div class="frame-${P.equip||'none'}">${avatarHTML(P.avatar,96,P.username)}</div>
    <h2 class="q" style="margin:12px 0 4px">${esc(P.username)}</h2>
    <p class="txt" style="margin:4px 0">Nivel ${L.l} · ${L.title}<br>${P.xp} XP · 🪙 ${P.coins} · 🔥 ${P.streak} días</p>
    <label class="btn alt" style="cursor:pointer">📷 Cambiar foto<input type="file" accept="image/*" onchange="changePhoto(this)" hidden></label>
    <div class="edit"><input id="nn" class="inp" maxlength="16" placeholder="Nuevo nombre de usuario"><button class="btn" onclick="renameUser()">Guardar nombre</button></div>
    <p id="pe" class="tag" style="min-height:20px"></p>
    <h3 style="margin:14px 0 8px;text-align:left">Logros</h3><div class="badges">
    ${Object.entries(BADGES).map(([k,[e,n]])=>`<div class="bd ${P.badges.includes(k)?'on':''}">${e}<span>${n}</span></div>`).join('')}</div>
    <button class="btn" onclick="home()">Volver</button>${P.marco_fundador?`<button class="btn alt" onclick="equipFund()">${P.equip==='fundador'?'Quitar marco fundador':'⭐ Equipar marco fundador'}</button>`:''}<button class="btn alt" onclick="logout()">Cerrar sesión</button></div>`;
}
async function renameUser(){
  if(!cool('rename',10000))return $('pe').textContent='Espera unos segundos antes de cambiarlo otra vez';
  const n=$('nn').value.trim();
  if(!/^\w{3,16}$/.test(n))return $('pe').textContent='Usa de 3 a 16 letras, números o _';
  $('pe').textContent='Guardando...';
  const err=await updateUsername(n);
  if(err)return $('pe').textContent=err;
  P.username=n;ME=n;SFX.ok();toast('✅ Nombre actualizado');profile();
}
async function changePhoto(inp){
  const f=inp.files[0];
  const bad=validImage(f);
  if(bad)return $('pe').textContent=bad;
  if(!cool('photo',15000))return $('pe').textContent='Espera unos segundos antes de subir otra foto';
  $('pe').textContent='Subiendo foto...';
  const r=await uploadAvatar(f);
  if(r.error)return $('pe').textContent='Error al subir: '+r.error;
  P.avatar=r.url;SFX.ok();toast('📷 Foto actualizada');profile();
}
function equipFund(){P.equip=P.equip==='fundador'?'':'fundador';save();profile()}
async function boot(){
  localStorage.removeItem('cr_users');localStorage.removeItem('cr_session');
  await sessionReady;
  if(sbUser){P=await loadProfile();ME=P.username;home()}else intro();
}
window.addEventListener('load',boot);
