// Laboratorio de phishing: correos sintéticos (dominios de ejemplo, sin enlaces reales)
const LAB_MAILS=[
{from:"avisos@tiendademo.mx",subj:"Tu pedido #A-2231 fue enviado",body:"Hola, tu pedido va en camino. Consulta el estado entrando tú mismo a https://tiendademo.mx/pedidos",bad:[]},
{from:"soporte@tiendademo-seguridad.xyz",subj:"URGENTE: tu cuenta será suspendida",body:"Verifica tus datos hoy en http://tiendademo-verif.xyz/login o perderás el acceso.",bad:[0,1,2,3]},
{from:"citas@clinicademo.mx",subj:"Confirmación de tu cita",body:"Tu cita es el jueves a las 10:00. Para cambios, llama al número que aparece en tu comprobante.",bad:[]},
{from:"premios@promo-rapida.top",subj:"¡Ganaste un premio!",body:"Reclama tu premio en 24 horas en https://promo-rapida.top/reclamar",bad:[0,1,2,4]},
{from:"alertas@bancodemo.mx",subj:"Nuevo inicio de sesión registrado",body:"Revisa tu actividad reciente en la app oficial de Banco Demo. No necesitas responder este correo.",bad:[]},
{from:"facturacion@pagos-empresa.co",subj:"Factura pendiente",body:"Adjuntamos tu factura. Abre el archivo factura.pdf.exe para revisarla.",bad:[1,2,4]}
];
const LAB={res:{}};
function laboratorio(){
  if(!P.lab)P.lab=[];
  const hechos=Object.keys(LAB.res).length;
  const ok=Object.values(LAB.res).filter(Boolean).length;
  app.innerHTML=`<div class="card pop"><p class="tag">LABORATORIO · PHISHING</p><h2 class="q">Bandeja de práctica</h2>
  <p class="txt" style="font-size:.85rem">Mensajes sintéticos. Decide si cada uno es legítimo o phishing y revisa las señales.</p>
  ${LAB_MAILS.map((m,i)=>`<div class="gcard" onclick="labAbrir(${i})"><span class="ic">${LAB.res[i]===undefined?'✉️':LAB.res[i]?'✅':'❌'}</span><div><b>${esc(m.subj)}</b><small>${esc(m.from)}</small></div></div>`).join('')}
  <p class="tag">Aciertos: ${ok}/${hechos}</p>
  ${hechos===LAB_MAILS.length?'<button class="btn" onclick="labReiniciar()">Practicar de nuevo</button>':''}</div>`;
}
function labAbrir(i){
  const m=LAB_MAILS[i],ya=LAB.res[i]!==undefined;
  app.innerHTML=`<div class="card pop"><p class="tag">CORREO ${i+1}/${LAB_MAILS.length}</p>
  <div class="mail"><p><b>De:</b> ${esc(m.from)}</p><p><b>Asunto:</b> ${esc(m.subj)}</p><p>${esc(m.body)}</p></div>
  ${ya?'':`<div class="grid2"><button class="btn" onclick="labDecidir(${i},false)">Legítimo</button><button class="btn danger" onclick="labDecidir(${i},true)">Phishing</button></div>`}
  <div id="labfb"></div>
  <button class="btn alt" onclick="laboratorio()">Volver a la bandeja</button></div>`;
}
function labDecidir(i,diceFraude){
  const m=LAB_MAILS[i],esFraude=m.bad.length>0,acierto=diceFraude===esFraude;
  LAB.res[i]=acierto;
  if(acierto&&!P.lab.includes(i)){P.lab.push(i);addXP(5,2)}
  save();SFX[acierto?'ok':'bad']();
  const senales=m.bad.length?m.bad.map(k=>SIGNS[k].toLowerCase()).join(', '):'ninguna';
  $('labfb').innerHTML=`<div class="mail"><b>${acierto?'✅ Bien decidido':'❌ Revisa esta pista'}</b>
  <p>${esFraude?'Este correo es phishing. Señales: '+senales+'.':'Este correo es legítimo. Aun así, nunca sigas enlaces de correos: entra por tu cuenta.'}</p></div>`;
  document.querySelectorAll('.grid2 button').forEach(b=>b.disabled=true);
}
function labReiniciar(){LAB.res={};laboratorio()}
