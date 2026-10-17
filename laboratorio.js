// ===== Laboratorio de phishing: correos sintéticos generados sin fin (dominios de ejemplo, sin enlaces reales) =====
const LAB={m:null,ok:0,n:0};
const LAB_MARCAS=['BancoDemo','PaqueDemo','TiendaDemo','NubeDemo','ClinicaDemo'];
const LAB_NOMBRES=['Ana','Luis','Sofía','Mateo','Valeria','Diego'];
function labMail(){
  const marca=pickR(LAB_MARCAS),base=marca.toLowerCase().replace('demo',''),nm=pickR(LAB_NOMBRES);
  const fake=base+'-'+pickR(['seguridad','verif','soporte','acceso'])+pickR(['.xyz','.top','.click']);
  const real=base+'demo.mx';
  const plantillas=[
    ()=>({from:'alertas@'+fake,subj:'Actividad inusual en tu cuenta',body:`Hola ${nm}, detectamos un inicio de sesión sospechoso. Verifica tu identidad hoy en http://${fake}/verificar`,bad:[0,1,2,3]}),
    ()=>({from:'envios@'+fake,subj:'Tu paquete no pudo entregarse',body:`Paga $25 de gestión para reprogramarlo: https://${fake}/pago`,bad:[1,2,3]}),
    ()=>({from:'soporte@'+fake,subj:'Error en tu cuenta',body:`${nm}, responde con tu contraseña para reactivar el acceso.`,bad:[1,3,4]}),
    ()=>({from:'premios@'+fake,subj:'¡Ganaste un premio!',body:`Reclama tu premio en 24 horas: https://${fake}/premio`,bad:[0,1,2,4]}),
    ()=>({from:'facturacion@'+fake,subj:'Factura pendiente',body:'Revisa la factura adjunta: factura.pdf.exe',bad:[1,2,4]}),
    ()=>({from:'pedidos@'+real,subj:'Tu pedido fue enviado',body:`${nm}, tu pedido va en camino. Consulta el estado entrando tú mismo a https://${real}/pedidos`,bad:[]}),
    ()=>({from:'citas@'+real,subj:'Confirmación de tu cita',body:'Tu cita es mañana a las 10:00. Para cambios, llama al número de tu comprobante.',bad:[]}),
    ()=>({from:'avisos@'+real,subj:'Revisa tu actividad',body:`${nm}, consulta tu actividad en la app oficial. No necesitas responder este correo.`,bad:[]})
  ];
  return pickR(plantillas)();
}
function laboratorio(){
  LAB.m=null;LAB.ok=0;LAB.n=0;
  app.innerHTML=`<div class="card pop"><p class="tag">LABORATORIO · PHISHING</p><h2 class="q">Bandeja infinita de práctica</h2>
  <p class="txt">Cada correo es sintético y generado al azar. Decide si es legítimo o phishing; después verás las señales y por qué.</p>
  <button class="btn" onclick="labSiguiente()">Empezar ▶</button></div>`;
}
function labSiguiente(){
  LAB.m=labMail();
  app.innerHTML=`<div class="card pop"><div class="hrow"><p class="tag">CORREO ${LAB.n+1} · ${LAB.ok} acertados</p></div>
  <div class="mail"><p><b>De:</b> ${esc(LAB.m.from)}</p><p><b>Asunto:</b> ${esc(LAB.m.subj)}</p><p>${esc(LAB.m.body)}</p></div>
  <div class="grid2"><button class="btn" onclick="labDecidir(false)">Legítimo</button><button class="btn danger" onclick="labDecidir(true)">Phishing</button></div>
  <div id="labfb"></div>
  <button class="btn alt" onclick="laboratorio()">Terminar práctica</button></div>`;
}
function labDecidir(diceFraude){
  const esFraude=LAB.m.bad.length>0,acierto=diceFraude===esFraude;
  LAB.n++;
  if(acierto){
    LAB.ok++;
    if(!P.labHoy||P.labHoy.day!==hoy())P.labHoy={day:hoy(),n:0};
    if(P.labHoy.n<15){P.labHoy.n++;addXP(3,1)}
    save();SFX.ok();
  }else SFX.bad();
  const senales=LAB.m.bad.length?LAB.m.bad.map(k=>SIGNS[k].toLowerCase()).join(', '):'ninguna';
  document.querySelectorAll('.grid2 button').forEach(b=>b.disabled=true);
  $('labfb').innerHTML=`<div class="mail"><b>${acierto?'✅ Bien decidido':'❌ Revisa esta pista'}</b>
  <p>${esFraude?'Es phishing. Señales: '+senales+'.':'Es legítimo. Aun así, nunca sigas enlaces de correos: entra por tu cuenta.'}</p></div>
  <button class="btn" onclick="labSiguiente()">Siguiente correo ▶</button>`;
}
