// ===== Badges de dominio =====
Object.assign(BADGES,{dom_cuentas:['🔐','Maestro: Cuentas'],dom_estafas:['🎣','Maestro: Estafas'],dom_privacidad:['🕵️','Maestro: Privacidad'],dom_dispositivos:['📱','Maestro: Dispositivos'],dom_incidentes:['🚨','Maestro: Incidentes']});
const hoy=()=>new Date().toDateString();
const RAMAS=[
{id:'cuentas',n:'🔐 Protección de cuentas',c:'#22c55e',units:[0,6],sims:['login']},
{id:'estafas',n:'🎣 Estafas digitales',c:'#f97316',units:[1,5],sims:['correo','sms','llamada']},
{id:'privacidad',n:'🕵️ Privacidad',c:'#a855f7',units:[4],sims:[]},
{id:'dispositivos',n:'📱 Dispositivos',c:'#38bdf8',units:[2,3,7],sims:[]},
{id:'incidentes',n:'🚨 Respuesta a incidentes',c:'#ef4444',units:[],sims:['cuenta']}
];
const SIMS=[
{id:'correo',rama:'estafas',icon:'📧',t:'Correo de phishing',msg:'De: aviso@bancosol-seguridad.net<br>Asunto: Actividad inusual: tu acceso será suspendido hoy<br><br>Confirma tus datos en las próximas 2 horas: https://bancosol-seguridad.net/verificar',pregunta:'¿Qué haces?',ops:['Hago clic en el enlace y confirmo mis datos','Entro a la app del banco por mi cuenta y reviso','Respondo el correo pidiendo aclaraciones'],ok:1,signals:['Dominio que imita al banco pero no es el oficial','Urgencia artificial: solo 2 horas','El enlace lleva a otro sitio, no al del banco','Pide confirmar datos personales por correo'],why:'Un banco legítimo no te obliga a actuar en horas ni a confirmar datos por correo. Lo seguro es entrar tú mismo a su app o sitio oficial.'},
{id:'sms',rama:'estafas',icon:'📦',t:'SMS de paquetería',msg:'Tu paquete no pudo entregarse. Paga $15 de gestión aquí: https://rastreo-envios-mx.top/pago',pregunta:'¿Qué decides?',ops:['Pago los $15 para recibirlo','Reviso el número de guía en la app oficial de la paquetería','Reenvío el SMS a mis contactos para que lo confirmen'],ok:1,signals:['Cuota pequeña pedida mediante un enlace','Dominio con extensión poco confiable (.top)','No incluye un número de guía verificable','Sensación de urgencia'],why:'Las paqueterías no piden pagos por enlaces de SMS. Revisar el número de guía en la app oficial te dice la verdad.'},
{id:'login',rama:'cuentas',icon:'🔑',t:'Página de inicio de sesión falsa',msg:'Llegaste desde un anuncio a: correo-micuenta-login.com<br>La página tiene el logo correcto y el candado en la barra.<br>Mensaje: "Tu sesión expiró. Vuelve a iniciar sesión."',pregunta:'¿Qué haces?',ops:['Ingreso mi contraseña de siempre','Cierro la pestaña y escribo la dirección oficial yo mismo','Pruebo con una contraseña falsa para ver qué pasa'],ok:1,signals:['El dominio tiene palabras extra (login)','Llegaste desde un anuncio, no desde la web oficial','El candado solo indica cifrado, no que el sitio sea legítimo','Expiración de sesión inventada para apurarte'],why:'Escribir tu contraseña en una página falsa se la entrega al atacante. Escribir la dirección tú mismo evita caer en la copia.'},
{id:'llamada',rama:'estafas',icon:'📞',t:'Llamada de alguien que dice ser el banco',msg:'"Hola, soy del área de seguridad de BancoSol. Detectamos un cargo de $8,400. Para cancelarlo, dígame el código que le acaba de llegar por SMS."',pregunta:'¿Qué haces?',ops:['Le dicto el código para cancelar el cargo','Cuelgo y llamo al número del reverso de mi tarjeta','Le pregunto su nombre y sigo la llamada'],ok:1,signals:['Pide el código de verificación','Crea miedo con un cargo inesperado','Presiona para actuar en el momento','Un banco nunca pide códigos por teléfono'],why:'El código SMS es la llave de tu cuenta. Quien te lo pide es el atacante, aunque sepa tu nombre.'},
{id:'cuenta',rama:'incidentes',icon:'🚨',t:'Cuenta de WhatsApp robada',msg:'Tu WhatsApp aparece activo en otro teléfono.<br>Recibiste un código de 6 dígitos que no pediste.<br>Tus contactos te escriben pidiendo dinero desde tu cuenta.',pregunta:'¿Qué haces primero?',ops:['Espero a que el sistema lo arregle solo','Le pido el código a un amigo para volver a entrar','Cierro sesiones, reactivo mi cuenta en la app oficial y aviso a mis contactos'],ok:2,signals:['Sesión activa en un dispositivo que no reconoces','Códigos que no pediste','Contactos recibiendo mensajes extraños'],why:'Actúa rápido: cierra sesiones desde la app oficial, reactiva la cuenta con tu número, avisa a tus contactos para que no envíen dinero y reporta el caso.'}
];
const RED_SIGNS=["Urgencia para actuar hoy","Enlace que no coincide con la marca","Pide tu código de verificación"];
const OK_SIGNS=["Remitente con el dominio oficial de la empresa","Te invita a revisar tu cuenta en la app oficial","Número de pedido que tú realizaste"];
const SIGNS2=[...RED_SIGNS,...OK_SIGNS];
const CASO={pistas:["Un correo dice 'Factura pendiente' desde facturacion@empresa-pagos.co","Adjunta un archivo llamado factura.pdf.exe","Pide responder en 10 minutos"],ops:["Lo abro para ver la factura","No lo abro: verifico la factura con la empresa por su canal oficial y reporto el correo","Lo reenvío a un colega"],ok:1};
const CHK=["Contraseña larga y única para esta cuenta","Autenticación en dos pasos activada","Correo de recuperación que controlo","Sesiones revisadas y dispositivos desconocidos cerrados"];
const MISIONES=[
{id:'sig',t:'Encuentra 3 señales de estafa',d:'Marca solo las tres señales de alerta. (2 min)'},
{id:'chk',t:'Configura una cuenta de forma segura',d:'Revisa cada paso de una configuración segura. (2 min)'},
{id:'case',t:'Resuelve un caso con pistas',d:'Lee las pistas y decide. (3 min)'},
{id:'sim',t:'Completa un simulacro',d:'Toma una decisión en una situación real. (5 min)'}
];
const DIAG=[
{q:'¿Usas autenticación en dos pasos en tu correo principal?',s:'cuentas'},
{q:'¿Reconoces un enlace sospechoso antes de hacer clic?',s:'estafas'},
{q:'¿Tienes copias de respaldo de tus fotos y documentos?',s:'dispositivos'},
{q:'¿Sabes cómo recuperar una cuenta si te la roban?',s:'incidentes'}
];
const TIENDA=[
{id:'freeze',i:'🛟',n:'Protector de racha',d:'Salva tu racha si olvidas un día (máx. 3).',p:120},
{id:'dx',i:'⚡',n:'Doble XP 30 min',d:'Todo el XP se duplica durante 30 minutos.',p:100},
{id:'gold',i:'🟡',n:'Marco dorado',d:'Cosmético para tu avatar.',p:200},
{id:'neon',i:'🟢',n:'Marco neón',d:'Cosmético para tu avatar.',p:250}
];

// ===== Misiones diarias =====
function dailyIds(){const s=Math.floor(Date.now()/864e5)%MISIONES.length;return[0,1,2].map(k=>MISIONES[(s+k)%MISIONES.length].id)}
function dayDone(id){return P.daily&&P.daily.day===hoy()&&P.daily.done.includes(id)}
function missionsDone(){return dailyIds().filter(dayDone).length}
function markDaily(id){
  if(!P.daily||P.daily.day!==hoy())P.daily={day:hoy(),done:[]};
  if(P.daily.done.includes(id)||!dailyIds().includes(id))return;
  P.daily.done.push(id);addXP(15,5);toast('🎯 Misión lista +15 XP +5 🪙');
  if(dailyIds().every(x=>P.daily.done.includes(x))){addXP(20,0);toast('🏆 Misiones del día completas +20 XP')}
  save();
}
function misiones(){
  const ids=dailyIds();
  app.innerHTML=`<div class="card pop"><p class="tag">MISIONES DE HOY</p><h2 class="q">Retos cortos</h2>
  ${ids.map(id=>{const m=MISIONES.find(x=>x.id===id),ok=dayDone(id);return `<div class="gcard" ${ok?'':`onclick="runM('${id}')"`}><span class="ic">${ok?'✅':'🎯'}</span><div><b>${m.t}</b><small>${m.d}</small></div><span>${ok?'Listo':'+15 XP'}</span></div>`}).join('')}
  ${missionsDone()===3?'<p class="txt">🏆 ¡Completaste las 3! Bonus +20 XP</p>':''}
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function runM(id){
  if(id==='sim')return simulacros();
  if(id==='sig'){
    app.innerHTML=`<div class="card pop"><p class="tag">MISIÓN · 3 SEÑALES</p><h2 class="q">Marca las tres señales de estafa</h2>
    <div class="mail">De: soporte@bancosol-seguridad.net<br>Asunto: Confirma tu cuenta hoy<br>Haz clic aquí en menos de 10 minutos: https://bancosol-seguridad.net/c</div>
    ${SIGNS2.map((s,i)=>`<label class="chk"><input type="checkbox" id="m${i}"> ${s}</label>`).join('')}
    <button class="btn" onclick="chkSig()">Comprobar</button><div id="fb"></div></div>`;
  }
  if(id==='chk'){
    app.innerHTML=`<div class="card pop"><p class="tag">MISIÓN · CUENTA SEGURA</p><h2 class="q">Cuenta ficticia: marca cada paso</h2>
    ${CHK.map((s,i)=>`<label class="chk"><input type="checkbox" id="c${i}" onchange="chkAll()"> ${s}</label>`).join('')}
    <div id="fb"></div><button class="btn alt" onclick="misiones()">Volver a misiones</button></div>`;
  }
  if(id==='case'){
    app.innerHTML=`<div class="card pop"><p class="tag">MISIÓN · CASO</p><h2 class="q">Pistas</h2>
    <div class="mail">${CASO.pistas.map(p=>`<p>• ${p}</p>`).join('')}</div><p class="txt">¿Qué haces con el archivo?</p>
    ${CASO.ops.map((o,i)=>`<button class="opt" onclick="caseAns(${i})">${o}</button>`).join('')}<div id="fb"></div></div>`;
  }
}
function chkSig(){
  const ok=SIGNS2.every((_,i)=>$('m'+i).checked===(i<3));
  if(ok)markDaily('sig');
  $('fb').innerHTML=`<div class="mail"><b>${ok?'✅ ¡Correcto!':'Casi'}</b><p>Las señales eran: ${RED_SIGNS.join(', ').toLowerCase()}.</p></div><button class="btn alt" onclick="misiones()">Volver a misiones</button>`;
  SFX[ok?'ok':'bad']();
}
function chkAll(){
  if(CHK.every((_,i)=>$('c'+i).checked)){markDaily('chk');$('fb').innerHTML='<div class="mail"><b>✅ Cuenta configurada de forma segura</b></div><button class="btn alt" onclick="misiones()">Volver a misiones</button>';SFX.ok()}
}
function caseAns(i){
  const ok=i===CASO.ok;
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===CASO.ok)b.classList.add('good');else if(j===i)b.classList.add('bad')});
  if(ok)markDaily('case');
  $('fb').innerHTML=`<div class="mail"><b>${ok?'✅ Buena decisión':'❌ Esa decisión te expone'}</b><p>Un archivo ejecutable con nombre de documento es señal de malware, y la presión de tiempo busca que actúes sin pensar.</p></div><button class="btn alt" onclick="misiones()">Volver a misiones</button>`;
  SFX[ok?'ok':'bad']();
}

// ===== Simulacros (fijos + generador infinito) =====
let CURSIM=null;
const pickR=a=>a[Math.random()*a.length|0];
const shuffleR=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
function mkSim(icon,t,msg,pregunta,good,bads,signals,why,rama){
  const ops=shuffleR([good,...bads]);
  return{id:'rnd',rnd:true,rama,icon,t,msg,pregunta,ops,ok:ops.indexOf(good),signals,why};
}
function genSim(){
  const k=Math.floor(Math.random()*4),m=pickR(['BancoSol','PayFlow','MercadoSur','CloudBox','TiendaMX']),d=m.toLowerCase();
  const fake=d+'-'+pickR(['seguridad','verif','soporte','acceso'])+pickR(['.top','.xyz','.click','.live']);
  const hr=1+Math.floor(Math.random()*23),monto=(Math.floor(Math.random()*40)+5)*10;
  if(k===0)return mkSim('📧','Correo de phishing',`De: aviso@${fake}<br>Asunto: Actividad inusual en tu cuenta de ${m}<br><br>Verifica tu identidad en las próximas ${hr} horas: https://${fake}/verificar`,'¿Qué haces?',
    `Entro a la app o al sitio oficial de ${m} escribiendo la dirección yo mismo`,['Hago clic y verifico mi identidad','Respondo el correo pidiendo más información'],
    [`El dominio ${fake} no es el oficial de ${m}`,`Urgencia artificial: ${hr} horas`,`El enlace no lleva a ${d}.com`,'Pide verificar datos personales por correo'],
    'Las empresas legítimas no piden verificar identidad con plazo por correo. Entrar tú mismo al sitio oficial es lo seguro.','estafas');
  if(k===1)return mkSim('📦','SMS de paquetería',`Tu envío no pudo entregarse. Paga $${monto/10}.00 de gestión aquí: https://${fake}/pago`,'¿Qué decides?',
    'Reviso el número de guía en la app oficial de la paquetería',['Pago la cuota para recibirlo','Reenvío el mensaje a mis contactos'],
    [`Cuota pequeña pedida mediante un enlace`,`El dominio ${fake} no pertenece a la paquetería`,'Presión para pagar pronto'],
    'Las paqueterías no cobran por enlaces de SMS. El número de guía en su app oficial te dice la verdad.','estafas');
  if(k===2)return mkSim('🔑','Página de inicio de sesión falsa',`Llegaste desde un anuncio a: ${fake}/login<br>La página se parece a la de ${m}.<br>Mensaje: "Tu sesión expiró. Vuelve a iniciar sesión."`,'¿Qué haces?',
    'Cierro la pestaña y escribo la dirección oficial yo mismo',['Ingreso mi contraseña de siempre','Pruebo una contraseña falsa para ver qué pasa'],
    [`El dominio ${fake} no es el oficial`,'Llegaste desde un anuncio, no desde la web oficial','El candado solo indica cifrado, no legitimidad'],
    'Escribir tu contraseña en una página falsa se la entrega al atacante. Escribir la dirección tú mismo evita la copia.','cuentas');
  return mkSim('📞','Llamada de alguien que dice ser el banco',`"Hola, soy del área de seguridad de ${m}. Detectamos un cargo de $${monto}. Dígame el código que le llegó por SMS para cancelarlo."`,'¿Qué haces?',
    'Cuelgo y llamo al número oficial que aparece en mi tarjeta o app',['Le dicto el código para cancelar el cargo','Le pregunto su nombre y sigo la llamada'],
    ['Pide un código de verificación','Genera miedo con un cargo inesperado','Presiona para actuar en el momento'],
    'El código SMS es la llave de tu cuenta. Ninguna institución legítima lo pide por teléfono.','estafas');
}
function simulacros(){
  app.innerHTML=`<div class="card pop"><p class="tag">SIMULACROS</p><h2 class="q">Decide en situaciones reales</h2>
  <button class="btn" onclick="runRandom()">🎲 Simulacro aleatorio (ilimitado)</button>
  ${SIMS.map(s=>`<div class="gcard" onclick="runSim('${s.id}')"><span class="ic">${s.icon}</span><div><b>${s.t}</b><small>${RAMAS.find(r=>r.id===s.rama).n}</small></div><span>${(P.sims||[]).includes(s.id)?'✅':'+20 XP'}</span></div>`).join('')}
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function runRandom(){CURSIM=genSim();showSim()}
function runSim(id){CURSIM=SIMS.find(x=>x.id===id);showSim()}
function showSim(){
  const s=CURSIM;
  app.innerHTML=`<div class="card pop"><p class="tag">SIMULACRO · ${RAMAS.find(r=>r.id===s.rama).n}</p><h2 class="q">${s.icon} ${s.t}</h2>
  <div class="mail">${s.msg}</div><p class="txt">${s.pregunta}</p>
  ${s.ops.map((o,i)=>`<button class="opt" onclick="simAns(${i})">${o}</button>`).join('')}<div id="fb"></div></div>`;
}
function simAns(i){
  const s=CURSIM,ok=i===s.ok;
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===s.ok)b.classList.add('good');else if(j===i)b.classList.add('bad')});
  if(!s.rnd){
    const first=!(P.sims||[]).includes(s.id);
    if(first){P.sims=(P.sims||[]).concat(s.id);if(ok)addXP(20,8)}
  }else{
    if(!P.rnd||P.rnd.day!==hoy())P.rnd={day:hoy(),n:0};
    if(ok&&P.rnd.n<10){P.rnd.n++;addXP(10,3)}
  }
  markDaily('sim');save();
  $('fb').innerHTML=`<div class="fb ${ok?'okb':'badb'}"><b>${ok?'¡Buena decisión! ✅':'Esa decisión te expone ❌'}</b>
  <p><b>Señales que debías detectar:</b></p><ul class="tips">${s.signals.map(x=>`<li>${x}</li>`).join('')}</ul>
  <p><b>Por qué:</b> ${s.why}</p>
  <button class="btn" onclick="${s.rnd?'runRandom()':'simulacros()'}">${s.rnd?'Siguiente simulacro ▶':'Volver a simulacros'}</button>
  <button class="btn alt" onclick="simulacros()">Volver a la lista</button></div>`;
  SFX[ok?'ok':'bad']();
}

// ===== Habilidades =====
function dominio(r){
  let tot=0,dn=0;
  r.units.forEach(ui=>U[ui].L.forEach((_,li)=>{tot++;if(P.done.includes(ui+'.'+li))dn++}));
  r.sims.forEach(sid=>{tot++;if((P.sims||[]).includes(sid))dn++});
  return tot?Math.round(dn/tot*100):0;
}
function arbol(){
  app.innerHTML=`<div class="card pop"><p class="tag">ÁRBOL DE HABILIDADES</p><h2 class="q">Tus ramas</h2>
  ${RAMAS.map((r,ri)=>{
    const dm=dominio(r),lock=ri>0&&dominio(RAMAS[ri-1])<30,lv=Math.min(Math.floor(dm/20)+1,5);
    const tit=['Principiante','Aprendiz','Competente','Experto','Maestro'][lv-1];
    const listo=r.units.length&&r.units.every(ui=>U[ui].L.every((_,li)=>P.done.includes(ui+'.'+li)))&&r.sims.every(s=>(P.sims||[]).includes(s));
    return `<div class="rama ${lock?'lock':''}" style="--c:${r.c}"><div class="rh"><b>${r.n}</b><span>${lock?'🔒 Bloqueada':'Nv '+lv}</span></div>
    <div class="bar"><div style="width:${dm}%"></div></div><small>${dm}% de dominio · ${tit}</small>
    ${!lock&&listo&&!P.badges.includes('dom_'+r.id)?`<button class="btn" onclick="runFinal(${ri})">Prueba final</button>`:''}</div>`;
  }).join('')}
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
let FT=null;
function runFinal(ri){
  const r=RAMAS[ri],pool=[];
  r.units.forEach(ui=>U[ui].L.forEach(l=>l.q.forEach(q=>pool.push(q))));
  FT={r,qs:pool.sort(()=>Math.random()-.5).slice(0,3),i:0,ok:0};ftShow();
}
function ftShow(){
  const q=FT.qs[FT.i];
  app.innerHTML=`<div class="card pop"><p class="tag">PRUEBA FINAL · ${FT.r.n} · ${FT.i+1}/3</p><h2 class="q">${q[0]}</h2>
  ${q[1].map((o,i)=>`<button class="opt" onclick="ftAns(${i})">${o}</button>`).join('')}<div id="fb"></div></div>`;
}
function ftAns(i){
  const q=FT.qs[FT.i],ok=i===q[2];if(ok)FT.ok++;
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===q[2])b.classList.add('good');else if(j===i)b.classList.add('bad')});
  $('fb').innerHTML=`<div class="mail"><b>${ok?'✅ Correcto':'❌ Incorrecto'}</b><p>${q[3]}</p></div><button class="btn" onclick="ftNext()">Continuar</button>`;
}
function ftNext(){
  FT.i++;if(FT.i<3)return ftShow();
  const pass=FT.ok>=2;
  if(pass){award('dom_'+FT.r.id);SFX.win();burst()}else SFX.bad();
  app.innerHTML=`<div class="card pop center"><div class="big">${pass?'🏆':'📘'}</div><h2 class="q">${pass?'¡Prueba superada!':'Casi: necesitas 2 de 3'}</h2><p class="txt">Aciertos: ${FT.ok}/3</p>
  ${pass?'':`<button class="btn" onclick="runFinal(${RAMAS.indexOf(FT.r)})">Reintentar</button>`}<button class="btn alt" onclick="arbol()">Volver a habilidades</button></div>`;
}

// ===== Perfil de seguridad (diagnóstico de hábitos, sin datos sensibles) =====
let DA={};
function diag(){
  DA={};
  app.innerHTML=`<div class="card pop"><p class="tag">DIAGNÓSTICO</p><h2 class="q">Tus hábitos de seguridad</h2>
  <p class="txt">Responde según lo que haces de verdad. No pedimos contraseñas ni datos sensibles.</p>
  ${DIAG.map((d,i)=>`<div class="dq"><p>${d.q}</p><div class="dopts">${[['Sí',2],['A veces',1],['No',0]].map(([t,v])=>`<button class="dbtn" onclick="dAns(${i},${v},this)">${t}</button>`).join('')}</div></div>`).join('')}
  <button class="btn" onclick="dSave()">Ver mi perfil</button><button class="btn alt" onclick="home()">Volver</button></div>`;
}
function dAns(i,v,btn){DA[i]=v;btn.parentNode.querySelectorAll('.dbtn').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel')}
function dSave(){
  if(Object.keys(DA).length<DIAG.length)return toast('Responde las 4 preguntas');
  P.diag={};DIAG.forEach((d,i)=>P.diag[d.s]=DA[i]);save();perfil();
}
function nextLesson(r){
  for(const ui of r.units)for(let li=0;li<U[ui].L.length;li++)if(!P.done.includes(ui+'.'+li))return{ui,li};
  return null;
}
function perfil(){
  if(!P.diag)return diag();
  const low=RAMAS.filter(r=>P.diag[r.id]!==undefined).sort((a,b)=>P.diag[a.id]-P.diag[b.id])[0];
  const nl=nextLesson(low);
  app.innerHTML=`<div class="card pop"><p class="tag">PERFIL DE SEGURIDAD</p><h2 class="q">Tu preparación</h2>
  ${RAMAS.filter(r=>P.diag[r.id]!==undefined).map(r=>`<div class="rama" style="--c:${r.c}"><div class="rh"><b>${r.n}</b><span>${['Bajo','Medio','Alto'][P.diag[r.id]]}</span></div>
  <div class="bar"><div style="width:${P.diag[r.id]*50}%"></div></div><small>Dominio en la ruta: ${dominio(r)}%</small></div>`).join('')}
  <p class="txt">💡 Recomendado: ${nl?`<button class="btn" onclick="lesson(${nl.ui},${nl.li})">Estudia “${U[nl.ui].L[nl.li].t}”</button>`:'Ya cubriste esa rama. Prueba un simulacro.'}</p>
  <button class="btn alt" onclick="diag()">Repetir diagnóstico</button><button class="btn alt" onclick="home()">Volver</button></div>`;
}

// ===== Repaso inteligente =====
function addReview(id,qi){
  P.review=P.review||[];
  if(!P.review.some(x=>x.id===id&&x.qi===qi))P.review.push({id,qi,due:Date.now()+2*864e5});
  save();
}
function dueRv(){return(P.review||[]).filter(x=>x.due<=Date.now())}
function repaso(){
  const n=dueRv().length;
  app.innerHTML=`<div class="card pop center"><p class="tag">REPASO INTELIGENTE</p><h2 class="q">${n?n+' preguntas para repasar':'Sin repasos pendientes'}</h2>
  <p class="txt">Las preguntas que fallaste regresan después de 2 días. Si vuelves a fallar, regresan al día siguiente.</p>
  ${n?'<button class="btn" onclick="rvNext()">Empezar repaso</button>':''}<button class="btn alt" onclick="home()">Volver</button></div>`;
}
let RV=null;
function rvNext(){
  const x=dueRv()[0];if(!x)return repaso();
  const [ui,li]=x.id.split('.').map(Number),q=U[ui].L[li].q[x.qi];
  RV={x,q};
  app.innerHTML=`<div class="card pop"><p class="tag">REPASO · ${U[ui].L[li].t}</p><h2 class="q">${q[0]}</h2>
  ${q[1].map((o,i)=>`<button class="opt" onclick="rvAns(${i})">${o}</button>`).join('')}<div id="fb"></div></div>`;
}
function rvAns(i){
  const {x,q}=RV,ok=i===q[2];
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;if(j===q[2])b.classList.add('good');else if(j===i)b.classList.add('bad')});
  if(ok){P.review=P.review.filter(y=>y!==x);addXP(5,2);SFX.ok()}else{x.due=Date.now()+864e5;SFX.bad()}
  save();
  $('fb').innerHTML=`<div class="mail"><b>${ok?'¡Bien! La dominas':'La volveremos a ver mañana'}</b><p>${q[3]}</p></div><button class="btn" onclick="rvNext()">Siguiente</button>`;
}

// ===== Tienda =====
function tienda(){
  app.innerHTML=`<div class="card pop"><p class="tag">TIENDA</p><h2 class="q">Tus monedas: 🪙 ${P.coins}</h2>
  ${TIENDA.map(t=>{
    const frame=t.id==='gold'||t.id==='neon';
    const owned=frame&&!!(P.inv||{})[t.id];
    const btn=frame&&owned
      ?`<button class="mini" onclick="equipar('${t.id}')">${P.equip===t.id?'Equipado':'Equipar'}</button>`
      :`<button class="mini" onclick="comprar('${t.id}')">🪙 ${t.p}</button>`;
    return `<div class="gcard"><span class="ic">${t.i}</span><div><b>${t.n}</b><small>${t.d}</small></div>${btn}</div>`;
  }).join('')}
  <p class="tag">Protectores: ${P.freeze||0}/3 · Doble XP: ${Date.now()<(P.dxUntil||0)?'activo':'inactivo'}</p>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function comprar(id){
  const t=TIENDA.find(x=>x.id===id);
  if(P.coins<t.p)return toast('No tienes suficientes monedas 🪙');
  if(id==='freeze'){if((P.freeze||0)>=3)return toast('Máximo 3 protectores');P.freeze=(P.freeze||0)+1}
  else if(id==='dx'){P.dxUntil=Math.max(Date.now(),P.dxUntil||0)+30*60e3}
  else{P.inv=P.inv||{};if(P.inv[id])return toast('Ya lo tienes');P.inv[id]=true;P.equip=id}
  P.coins-=t.p;save();SFX.ok();toast('✅ Comprado: '+t.n);tienda();
}
function equipar(id){P.equip=P.equip===id?'':id;save();tienda()}

// ===== Analizador de enlaces (no abre el enlace) =====
const TUNEL=/(^|\.)(ngrok\.io|ngrok-free\.app|ngrok\.app|ngrok\.dev|serveo\.net|loca\.lt|localhost\.run|trycloudflare\.com|localtunnel\.me|pagekite\.me)$/;
const HOSTING=/(^|\.)(pages\.dev|workers\.dev|netlify\.app|vercel\.app|web\.app|firebaseapp\.com|glitch\.me|onrender\.com|repl\.co|replit\.dev|herokuapp\.com|000webhostapp\.com|weebly\.com|wixsite\.com|blogspot\.com|godaddysites\.com|sites\.google\.com)$/;
const ACORT=/^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly|shorturl\.at|tiny\.cc)$/;
const MARCAS={paypal:'paypal.com',amazon:'amazon.com',apple:'apple.com',icloud:'icloud.com',google:'google.com',gmail:'gmail.com',microsoft:'microsoft.com',outlook:'outlook.com',netflix:'netflix.com',whatsapp:'whatsapp.com',facebook:'facebook.com',instagram:'instagram.com',bbva:'bbva.mx',santander:'santander.com.mx',banorte:'banorte.com',banamex:'banamex.com',mercadolibre:'mercadolibre.com.mx',sat:'sat.gob.mx',imss:'imss.gob.mx'};
function analizador(){
  app.innerHTML=`<div class="card pop"><p class="tag">ANALIZADOR DE ENLACES</p><h2 class="q">Revisa un enlace sin abrirlo</h2>
  <input id="ur" class="inp" placeholder="Pega el enlace aquí" autocomplete="off">
  <button class="btn" onclick="analiza()">Analizar</button><div id="ua"></div>
  <button class="btn alt" onclick="home()">Volver</button></div>`;
}
function analiza(){
  const raw=$('ur').value.trim();if(!raw)return;
  let u;
  try{u=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw)}catch(e){return $('ua').innerHTML='<div class="mail">No es un enlace válido.</div>'}
  const host=u.hostname.toLowerCase(),path=(u.pathname+u.search).toLowerCase(),full=host+path;
  const tokens=host.split(/[.\-]/);
  const norm=tokens.map(t=>t.replace(/0/g,'o').replace(/1/g,'l').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/7/g,'t').replace(/8/g,'b'));
  const w=[],c=[];
  if(TUNEL.test(host))w.push('Usa un servicio de túnel: expone una computadora personal a internet y se usa mucho en phishing temporal.');
  else if(HOSTING.test(host))c.push('Está alojado en una plataforma gratuita. Cualquiera puede publicar ahí, así que revisa el contenido con cuidado.');
  if(ACORT.test(host))c.push('Es un acortador: oculta el destino real.');
  for(const [m,dom] of Object.entries(MARCAS)){
    const parece=tokens.includes(m)||norm.includes(m);
    if(parece&&!(host===dom||host.endsWith('.'+dom))){w.push(`Parece imitar a ${m}, pero su dominio oficial es ${dom}.`);break}
  }
  if(u.protocol!=='https:')w.push('No usa HTTPS: los datos viajan sin cifrar.');
  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(host))w.push('Usa una dirección IP en lugar de un nombre de dominio.');
  if(raw.includes('@'))w.push('Contiene "@", que puede ocultar el destino real.');
  if(host.includes('xn--'))w.push('Usa caracteres especiales (punycode) que pueden imitar letras.');
  if(/\.(top|xyz|click|zip|tk|ml|gq|cf|ga|buzz|live|support)$/.test(host))w.push('La extensión del dominio es poco confiable.');
  if(tokens.length>5)w.push('Tiene demasiados subdominios.');
  if(/login|verif|secure|seguro|account|cuenta|update|confirm|pago|pay|banco|bank|soporte|reset|recuper|wallet/.test(full))w.push('Usa palabras de acceso o urgencia (login, verificar, cuenta, pago...).');
  if(/\d{5,}/.test(host))w.push('El dominio tiene muchos números seguidos, típico de sitios generados en masa.');
  if(raw.length>100)c.push('Es un enlace muy largo; los engañosos suelen serlo para ocultar partes.');
  const nivel=w.length>=2?'🔴 Alto riesgo':(w.length||c.length)?'🟡 Revisar con cuidado':'🟢 Sin señales conocidas';
  $('ua').innerHTML=`<div class="mail"><b>${nivel}</b>
  ${w.length?'<ul class="tips">'+w.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}
  ${c.length?'<ul class="tips">'+c.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}
  <p><b>Dominio analizado:</b> ${esc(host)}</p>
  <p>Esta herramienta revisa el texto del enlace y no lo abre. Ningún análisis garantiza seguridad: si dudas, entra escribiendo la dirección oficial tú mismo.</p></div>`;
}
