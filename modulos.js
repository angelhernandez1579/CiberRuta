// ---- Guías prácticas para iPhone ----
const GUIAS=[
{id:"vpn",t:"VPN",i:"🛡️",que:"Una VPN crea un túnel cifrado entre tu iPhone y un servidor. Cifra tu tráfico en redes Wi-Fi públicas y oculta tu IP ante los sitios que visitas. Ojo: una VPN cambia a quién confías tus datos; no te vuelve anónimo.",pasos:["Elige un proveedor con buena reputación y descarga su app desde la App Store.","Abre la app, crea tu cuenta y acepta el perfil de VPN cuando iOS lo pida.","Ve a Ajustes > General > VPN y gestión de dispositivos y confirma que aparece registrada.","Activa el interruptor de la VPN desde la app o desde Ajustes > VPN.","Verifica que el icono de VPN aparece arriba en la barra de estado."]},
{id:"relay",t:"Relé privado",i:"🔒",que:"Relé privado de iCloud envía tu tráfico de Safari a través de dos servidores, así que ni tu proveedor ni el sitio ven tu IP real. Requiere un plan de iCloud+. Algunos sitios o redes pueden bloquearlo.",pasos:["Abre Ajustes y toca tu nombre, en la parte superior.","Entra a iCloud y después a Relé privado.","Activa el interruptor Relé privado.","Elige Mantener la ubicación general si quieres que los sitios vean tu región y no tu ubicación exacta."]},
{id:"limit",t:"Limitar rastreo de IP",i:"🚫",que:"Esta opción evita que los rastreadores usen tu dirección IP para relacionar tu actividad y ubicarte con precisión. Se configura por red Wi-Fi, así que conviene activarla en las redes que frecuentas.",pasos:["Abre Ajustes y entra a Wi-Fi.","Toca el símbolo (i) junto a la red que usas.","Activa la opción Limitar rastreo de IP.","Repite el proceso en tu red de casa y en tu trabajo."]},
{id:"rot",t:"IP rotatoria y MAC privada",i:"🔄",que:"iOS no tiene un interruptor llamado IP rotatoria. Lo más parecido es Relé privado, que cambia tu IP al navegar en Safari, y la Dirección Wi-Fi privada, que cambia tu dirección MAC en cada red para que no te sigan entre lugares.",pasos:["Abre Ajustes, entra a Wi-Fi y toca el (i) de tu red.","Activa Dirección Wi-Fi privada.","Si una red pide registrar tu dispositivo, puede que necesites usar la dirección fija solo para esa red."]}
];
function guias(){
  if(!P.guides)P.guides={};
  app.innerHTML=`<div class="card pop"><p class="tag">GUÍAS · iPHONE</p><h2 class="q">Protege tu iPhone paso a paso</h2>
  ${GUIAS.map(g=>{const d=(P.guides[g.id]||[]).length;return `<div class="gcard" onclick="guia('${g.id}')"><span class="ic">${g.i}</span><div><b>${g.t}</b><div class="bar"><div style="width:${d/g.pasos.length*100}%"></div></div></div><span>${d}/${g.pasos.length}</span></div>`}).join('')}
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function guia(id){
  if(!P.guides)P.guides={};
  const g=GUIAS.find(x=>x.id===id),done=P.guides[id]||[];
  app.innerHTML=`<div class="card pop"><p class="tag">${g.i} ${g.t}</p><h2 class="q">¿Qué es?</h2><p class="txt">${g.que}</p>
  <h3 class="sub2">Cómo activarlo</h3>
  ${g.pasos.map((s,i)=>`<label class="chk"><input type="checkbox" ${done.includes(i)?'checked':''} onchange="mark('${id}',${i},this.checked)"><span>${s}</span></label>`).join('')}
  <button class="btn alt" onclick="guias()">Volver a guías</button></div>`;
}
function mark(id,i,on){
  const arr=P.guides[id]||[];
  if(on&&!arr.includes(i)){arr.push(i);SFX.ok()}
  if(!on){const k=arr.indexOf(i);if(k>=0)arr.splice(k,1)}
  P.guides[id]=arr;
  const g=GUIAS.find(x=>x.id===id);
  if(arr.length===g.pasos.length&&!P.guides['x_'+id]){P.guides['x_'+id]=true;addXP(15,10);toast('✅ Guía completada: '+g.t+' +15 XP +10 🪙')}
  save();
}

// ---- Verificador de filtraciones (k-anonymity: solo se envían 5 caracteres del hash SHA-1) ----
async function pwnedCount(pw){
  const b=await crypto.subtle.digest('SHA-1',new TextEncoder().encode(pw));
  const hex=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
  const r=await fetch('https://api.pwnedpasswords.com/range/'+hex.slice(0,5));
  if(!r.ok)throw new Error('HTTP '+r.status);
  const line=(await r.text()).split('\n').find(l=>l.split(':')[0].trim()===hex.slice(5));
  return line?parseInt(line.split(':')[1]):0;
}
function breach(){
  const v=$('pw').value;if(!v)return;
  $('pbr').textContent='Consultando filtraciones...';
  pwnedCount(v).then(n=>{
    $('pbr').innerHTML=n?`⚠️ Aparece <b>${n.toLocaleString('es-MX')}</b> veces en filtraciones conocidas. Cámbiala ya.`:'✅ No aparece en las filtraciones conocidas. Aun así, usa una contraseña única para cada cuenta.';
    SFX[n?'bad':'ok']();
  }).catch(e=>$('pbr').textContent='No se pudo consultar ('+e.message+'). Revisa tu conexión.');
}

// ---- Mapa de ataques (simulado) ----
const CITIES=[[19.4,-99.1,'CDMX'],[40.7,-74,'Nueva York'],[51.5,-0.1,'Londres'],[35.7,139.7,'Tokio'],[-23.5,-46.6,'São Paulo'],[28.6,77.2,'Delhi'],[-33.9,151.2,'Sídney'],[55.7,37.6,'Moscú'],[6.5,3.4,'Lagos'],[1.3,103.8,'Singapur'],[37.6,-122.4,'San Francisco'],[-1.3,36.8,'Nairobi']];
function mapa(){
  app.innerHTML=`<div class="card pop"><p class="tag">MAPA · SIMULADO</p><h2 class="q">Ataques en tiempo real</h2>
  <canvas id="map" width="460" height="230"></canvas>
  <div class="mstats"><span>🔴 <b id="cnt">0</b> intentos</span><span>Último: <b id="top">—</b></span></div>
  <p class="txt" style="font-size:.85rem">Visualización ilustrativa con datos simulados. Para datos reales, consulta los mapas públicos de proveedores de seguridad.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
  const c=$('map'),x=c.getContext('2d'),W=c.width,H=c.height,arcs=[];
  let n=0;
  const pr=(la,lo)=>[(lo+180)/360*W,(90-la)/180*H];
  function frame(){
    if(!$('map'))return;
    x.fillStyle='#0b1324';x.fillRect(0,0,W,H);
    x.strokeStyle='#1e3a5f';x.lineWidth=1;
    for(let g=-60;g<=60;g+=30){const y=pr(g,0)[1];x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()}
    for(let g=-150;g<=150;g+=30){const q=pr(0,g)[0];x.beginPath();x.moveTo(q,0);x.lineTo(q,H);x.stroke()}
    if(Math.random()<.08){const a=R(CITIES),b=R(CITIES);if(a!==b){arcs.push({a,b,t:0,c:R(['#f87171','#facc15','#4ade80'])});n++;$('cnt').textContent=n;$('top').textContent=b[2]}}
    CITIES.forEach(([la,lo,nm])=>{const[px,py]=pr(la,lo);x.fillStyle='#38bdf8';x.beginPath();x.arc(px,py,2.5,0,7);x.fill()});
    for(let i=arcs.length-1;i>=0;i--){
      const A=arcs[i];A.t+=.012;
      const[x1,y1]=pr(A.a[0],A.a[1]),[x2,y2]=pr(A.b[0],A.b[1]);
      const mx=(x1+x2)/2,my=Math.min(y1,y2)-45,t=Math.min(A.t,1);
      const px=(1-t)*(1-t)*x1+2*(1-t)*t*mx+t*t*x2,py=(1-t)*(1-t)*y1+2*(1-t)*t*my+t*t*y2;
      x.strokeStyle=A.c;x.lineWidth=1.5;x.beginPath();x.moveTo(x1,y1);x.quadraticCurveTo(mx,my,px,py);x.stroke();
      x.fillStyle=A.c;x.beginPath();x.arc(px,py,3.5,0,7);x.fill();
      if(A.t>1.3)arcs.splice(i,1);
    }
    requestAnimationFrame(frame);
  }
  frame();
}

function noticias(){
  app.innerHTML=`<div class="card pop"><p class="tag">NOTICIAS · ${NEWS.fecha}</p><h2 class="q">Ciberseguridad hoy</h2>
  ${NEWS.items.map((n,i)=>`<div class="nw" style="animation-delay:${i*.15}s"><p>${n.t}</p><small>${n.d} · ${n.f} · <a href="${n.u}" target="_blank" rel="noopener">Leer</a></small></div>`).join('')}
  <p class="tag" style="margin-top:12px">Fuentes: RSS de INCIBE y MuySeguridad. Se actualiza editando news.js.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}

// ---- Emergencia ----
const EMERG=[
["🆘","Emergencias","911","Emergencias inmediatas, incluidas amenazas físicas."],
["🚓","Policía Cibernética (SSPC)","gob.mx","Denuncia fraude, extorsión, suplantación y robo de cuentas. Busca Policía Cibernética en gob.mx."],
["🏦","CONDUSEF","800 999 8080","Orientación ante cargos o fraudes bancarios."],
["🕵️","Denuncia anónima","089","Reporte anónimo de delitos."],
["💬","Línea de la Vida","800 911 2000","Apoyo emocional y en crisis."]
];
function emergencia(){
  app.innerHTML=`<div class="card pop"><p class="tag">EMERGENCIA</p><h2 class="q">¿Te hackearon o te estafaron?</h2>
  <ol class="tips"><li>Cambia la contraseña desde otro dispositivo.</li><li>Cierra todas las sesiones activas.</li><li>Activa la autenticación en dos pasos.</li><li>Revisa reenvíos de correo y apps conectadas.</li><li>Avisa a tu banco y guarda capturas como evidencia.</li><li>Denuncia ante la Policía Cibernética.</li></ol>
  <h3 class="sub2" style="margin-top:14px">Contactos importantes</h3>
  ${EMERG.map((e,i)=>{const num=e[2].replace(/\D/g,'');return `<div class="em" style="animation-delay:${i*.1}s"><span class="ic">${e[0]}</span><div><b>${e[1]}</b><p>${e[3]}</p>${num.length>=3?`<a href="tel:${num}">Llamar ${e[2]}</a>`:`<small>${e[2]}</small>`}</div></div>`}).join('')}
  <p class="tag" style="margin-top:10px">Verifica los números en fuentes oficiales antes de una emergencia, porque pueden cambiar.</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}

// ---- Navegación inferior y ruta ----
function go(el,f){document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b===el));f()}
function syncChrome(){
  const isHome=!!app.querySelector('.banner'),isIntro=!!app.querySelector('.hero');
  $('nav').style.display=(P&&isHome)?'flex':'none';
  const inQuiz=!!app.querySelector('.fb');
  $('back2').style.display=(P&&!isHome&&!isIntro&&!inQuiz)?'block':'none';
}
new MutationObserver(syncChrome).observe(app,{childList:true,subtree:true});
function home(){
  if(!P)return auth();
  document.querySelectorAll('#nav button').forEach((b,i)=>b.classList.toggle('on',i===0));
  const today=new Date().toDateString();
  if(P.bonusDay!==today){P.bonusDay=today;addXP(20,10);toast('🎁 Bonificación diaria +20 XP +10 🪙');save()}
  stats();
  const L=lvl(P.xp),nxt=ALL.find(a=>!P.done.includes(a.id))||ALL[ALL.length-1],nl=U[nxt.ui].L[nxt.li];
  let h=`<div class="card lvlc" style="margin-top:0">${MASC(64,'wave')}<div style="flex:1"><p class="tag">NIVEL ${L.l} · ${L.title}</p>
    <div class="bar"><div style="width:${L.cur/L.need*100}%"></div></div><p class="txt" style="margin:6px 0 0;font-size:.8rem">${L.cur}/${L.need} XP</p></div></div>
    <div class="card mcard" onclick="misiones()"><span>🎯 Misiones de hoy</span><b>${missionsDone()}/3</b></div>
    <div class="banner" onclick="lesson(${nxt.ui},${nxt.li})"><div><small>MÓDULO ${nxt.ui+1} · LECCIÓN ${nxt.li+1}</small><b>${nl.t}</b></div><span>▶</span></div>`;
  let k=0;
  U.forEach((u,ui)=>{
    const dn=u.L.filter((_,li)=>P.done.includes(ui+'.'+li)).length,pct=dn/u.L.length;
    h+=`<div class="mod" style="--c:${u.c}"><svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="rbg"/><circle cx="22" cy="22" r="18" class="rfg" style="stroke-dasharray:${(pct*113).toFixed(1)} 113"/></svg><div><small>MÓDULO ${ui+1}</small><b>${u.n}</b></div><span>${dn}/${u.L.length}</span></div><div class="path">`;
    u.L.forEach((l,li)=>{
      const i=ALL.findIndex(x=>x.ui===ui&&x.li===li),id=ui+'.'+li;
      const done=P.done.includes(id),open=i===0||P.done.includes(ALL[i-1].id);
      const off=[0,-45,-65,-45,0,45,65,45][k%8];k++;
      h+=`<div class="pn" style="transform:translateX(${off}px)"><button class="node ${done?'done':open?'cur':'lock'}" ${open?'':'disabled'} onclick="lesson(${ui},${li})">${done?'✔':open?'★':'🔒'}</button><small>${l.t}</small></div>`;
      if(k%3===0)h+=`<div class="mas">${MASC(64,'bob')}<div class="tip">💡 ${TIPS[k%TIPS.length]}</div></div>`;
    });
    h+='</div>';
  });
  app.innerHTML=h+footerHTML();
}
function hub(){
  app.innerHTML=`<div class="card pop"><p class="tag">HERRAMIENTAS</p><h2 class="q">Tu caja de herramientas</h2>
  <div class="hgrid">${[['🔍','Verificador','checker()'],['🎲','Generador','generator()'],['🎣','Detector','detector()'],['📘','Guías iPhone','guias()'],['🌍','Mapa','mapa()'],['🆘','Emergencia','emergencia()'],['🎯','Misiones','misiones()'],['🎮','Simulacros','simulacros()'],['🌳','Habilidades','arbol()'],['📋','Diagnóstico','perfil()'],['🔁','Repaso','repaso()'],['🛒','Tienda','tienda()'],['🔗','Enlaces','analizador()'],...(P.is_admin?[['🛡️','Admin','admin()']]:[])].map(([i,t,f])=>`<button onclick="${f}"><i>${i}</i>${t}</button>`).join('')}</div></div>`;
}

// ---- Pie de página (también en la ruta) ----
function footerHTML(){
  return `<footer class="ft"><p class="tag">Democratizando la educación en ciberseguridad mediante juegos, comunidad y buenas prácticas, alineados a los Objetivos de Desarrollo Sostenible de la ONU.</p>
  <div class="fcols"><div><b>Legal & contacto</b><a href="privacidad.html">Aviso de Privacidad</a><a href="terminos.html">Términos de Servicio</a><a href="contacto.html">Contacto</a><a href="mailto:angel.hernandez1579@alumnos.udg.mx">angel.hernandez1579@alumnos.udg.mx</a></div></div></footer>`;
}
function instalarCard(){
  const standalone=window.navigator.standalone||matchMedia('(display-mode: standalone)').matches;
  if(standalone)return '';
  const ios=/iPhone|iPad|iPod/.test(navigator.userAgent);
  return `<div class="card instal"><b>📲 Añade CiberRuta a tu inicio</b><p class="txt" style="margin:8px 0 0">${ios?'En Safari, toca <b>Compartir</b> (cuadro con flecha) y luego <b>Agregar a pantalla de inicio</b>. Así se abre como app, a pantalla completa.':'Abre el menú de tu navegador y elige <b>Instalar aplicación</b> o <b>Agregar a la pantalla de inicio</b>.'}</p></div>`;
}

// ---- Administración (solo cuentas con is_admin; el servidor también lo verifica) ----
function admin(){
  if(!P.is_admin)return home();
  app.innerHTML=`<div class="card pop"><p class="tag">ADMINISTRACIÓN</p><h2 class="q">Marco fundador</h2>
  <input id="au" class="inp" placeholder="Nombre de usuario" maxlength="16" autocomplete="off">
  <button class="btn" onclick="fund(true)">⭐ Dar marco fundador</button>
  <button class="btn alt" onclick="fund(false)">Quitar marco</button>
  <p id="ae2" class="tag" style="min-height:20px"></p>
  <button class="btn alt" onclick="hub()">Volver</button></div>`;
}
async function fund(on){
  const u=$('au').value.trim();
  if(!/^\w{3,16}$/.test(u))return $('ae2').textContent='Usuario inválido';
  const err=await adminSetFounder(u,on);
  $('ae2').textContent=err||(on?'✅ Marco otorgado a '+u:'Marco retirado de '+u);
}
