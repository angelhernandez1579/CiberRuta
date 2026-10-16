// ===== Comunidad: muro público de texto, moderado =====
function comunidad(){
  app.innerHTML=`<div class="card pop"><div class="hrow"><div><p class="tag">COMUNIDAD</p><h2 class="q" style="margin:0">Muro de la comunidad</h2></div><button class="refresh" onclick="comunidadCargar()" aria-label="Actualizar">↻</button></div>
  <p class="txt" style="font-size:.85rem">Solo texto y sin enlaces. Respeta a los demás: el lenguaje ofensivo se bloquea. Máximo 5 publicaciones por hora.</p>
  <textarea id="cpt" class="inp" maxlength="280" rows="3" placeholder="Comparte un consejo de seguridad..." oninput="$('cpc').textContent=this.value.length+'/280'"></textarea>
  <div class="rowbtn"><small id="cpc" class="tag">0/280</small><button class="btn sm" onclick="comunidadPublicar()">Publicar</button></div>
  <p id="cpm" class="tag" style="min-height:20px"></p>
  <div id="cfeed"></div></div>`;
  comunidadCargar();
}
async function comunidadCargar(){
  $('cfeed').innerHTML='<div class="sk"></div><div class="sk"></div>';
  const {data,error}=await sb.from('comunidad').select('id,texto,creado,autor,perfiles(username,avatar_url)').order('creado',{ascending:false}).limit(30);
  if(error)return $('cfeed').innerHTML=`<div class="mail">${esc(error.message)}</div>`;
  $('cfeed').innerHTML=(data||[]).map(p=>`<div class="post">
    <div class="phead">${avatarHTML(p.perfiles?.avatar_url,32,p.perfiles?.username)}<div><b>${esc(p.perfiles?.username||'usuario')}</b><small class="ttl">${new Date(p.creado).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'})}</small></div></div>
    <p class="ptxt">${esc(p.texto)}</p>
    <div class="pact">${sbUser&&p.autor!==sbUser.id?`<button class="mini ghost" onclick="reportar(${p.id})">Reportar</button>`:''}${P.is_admin?`<button class="mini danger2" onclick="borrarPost(${p.id})">Eliminar</button>`:''}</div></div>`).join('')
    ||'<p class="tag">Todavía no hay publicaciones.</p>';
}
async function comunidadPublicar(){
  const t=$('cpt').value.trim();
  if(t.length<3)return $('cpm').textContent='Escribe al menos 3 caracteres';
  if(!cool('post',30000))return $('cpm').textContent='Espera 30 segundos entre publicaciones';
  $('cpm').textContent='Publicando...';
  const {error}=await sb.from('comunidad').insert({texto:t});
  if(error)return $('cpm').textContent=error.message;
  $('cpt').value='';$('cpc').textContent='0/280';$('cpm').textContent='✅ Publicado';
  SFX.ok();comunidadCargar();
}
async function reportar(id){
  const {error}=await sb.from('reportes').insert({post_id:id,motivo:'reportado por un usuario'});
  if(error)return toast(/duplicate|unique/i.test(error.message)?'Ya reportaste esta publicación':error.message);
  toast('Gracias. Revisaremos la publicación.');
}
async function borrarPost(id){
  const {error}=await sb.from('comunidad').delete().eq('id',id);
  if(error)return toast(error.message);
  await adLogWrite('eliminar publicación','post '+id,'eliminada desde comunidad');
  toast('Publicación eliminada');
  if($('cfeed'))comunidadCargar();
  else adReportes();
}
async function adReportes(){
  $('ad').innerHTML='<div class="sk"></div>';
  const {data,error}=await sb.from('reportes').select('id,motivo,creado,comunidad(id,texto,perfiles(username))').order('creado',{ascending:false}).limit(30);
  if(error)return $('ad').innerHTML=`<div class="mail">${esc(error.message)}</div>`;
  $('ad').innerHTML=(data||[]).map(r=>`<div class="rk col">
    <small class="ttl">${esc(r.comunidad?.perfiles?.username||'')} · ${new Date(r.creado).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'})}</small>
    <p class="ptxt">${esc(r.comunidad?.texto||'(publicación ya eliminada)')}</p>
    ${r.comunidad?`<button class="mini danger2" onclick="borrarPost(${r.comunidad.id})">Eliminar publicación</button>`:''}</div>`).join('')
    ||'<p class="tag">Sin reportes.</p>';
}

// ===== Toque: recordar a alguien que estudie (sin texto libre, con enfriamiento en el servidor) =====
async function toque(id){
  if(!cool('toque'+id,3000))return;
  const {error}=await sb.from('toques').insert({para:id});
  if(error)return toast(error.message);
  SFX.click();toast('👋 Recordatorio enviado');
}
async function revisarToques(){
  if(!sbUser)return;
  const visto=localStorage.getItem('cr_toques_visto')||'1970-01-01T00:00:00Z';
  const {count}=await sb.from('toques').select('*',{count:'exact',head:true}).eq('para',sbUser.id).gt('creado',visto);
  if(count)toast(`👋 Alguien te recordó que estudies (${count})`);
  localStorage.setItem('cr_toques_visto',new Date().toISOString());
}

// ===== Ficha pública de un usuario (desde el ranking). Solo datos públicos. =====
async function verPerfil(u){
  const {data:pf,error}=await sb.from('perfiles').select('id,username,xp,badges_n,avatar_url,streak,marco_fundador').eq('username',u).maybeSingle();
  if(error||!pf)return toast('No se pudo cargar el perfil');
  const L=lvl(pf.xp),yo=sbUser&&pf.id===sbUser.id;
  app.innerHTML=`<div class="card pop center">
    ${avatarBadge(avatarHTML(pf.avatar_url,96,pf.username),pf.streak)}
    <h2 class="q" style="margin:12px 0 2px">${pf.marco_fundador?'👑 ':''}${esc(pf.username)}</h2>
    <p class="tag">${L.title}</p>
    <div class="grid2" style="margin-top:12px">
      <div class="mcard2"><small>Nivel</small><b>${L.l}</b></div>
      <div class="mcard2"><small>XP</small><b>${pf.xp}</b></div>
      <div class="mcard2"><small>Logros</small><b>${pf.badges_n}</b></div>
      <div class="mcard2"><small>Racha</small><b>${pf.streak} 🔥</b></div>
    </div>
    ${yo?'':`<button class="btn" onclick="toque('${pf.id}')">👋 Recordar que estudie</button>`}
    <button class="btn alt" onclick="ranking()">Volver al ranking</button></div>`;
}
