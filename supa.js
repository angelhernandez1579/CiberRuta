// Supabase: solo se usa la clave PUBLICABLE. La clave secreta y el secreto de Google nunca van aquí.
const SUPA_URL="https://nngiwwbovpxfltootjsg.supabase.co";
const SUPA_KEY="sb_publishable_FNaIKQRJiTsbW98P-dOYlw_K5SIiptd";
const sb=supabase.createClient(SUPA_URL,SUPA_KEY);
let sbUser=null;
const sessionReady=sb.auth.getSession().then(({data})=>{sbUser=data.session?.user||null;return sbUser});
sb.auth.onAuthStateChange((_e,s)=>{sbUser=s?.user||null});

function newP(username){return{username,xp:0,coins:0,streak:0,day:"",bonusDay:"",done:[],badges:[],guides:{},phishOK:0,genCount:0,sims:[],review:[],daily:{day:"",done:[]},inv:{},equip:"",dxUntil:0,freeze:0,diag:null}}
async function loadProfile(){
  const {data:pf}=await sb.from("perfiles").select("*").eq("id",sbUser.id).maybeSingle();
  const {data:pr}=await sb.from("progreso").select("data").eq("id",sbUser.id).maybeSingle();
  if(!pf){
    let base=(sbUser.user_metadata?.username||sbUser.user_metadata?.full_name||sbUser.email.split("@")[0]).replace(/\W/g,"").slice(0,12)||"usuario";
    for(let i=0;i<5;i++){
      const name=i?base+Math.floor(1000+Math.random()*8999):base;
      const {error}=await sb.from("perfiles").insert({id:sbUser.id,username:name});
      if(!error){await sb.from("progreso").insert({id:sbUser.id,data:{}});return newP(name)}
    }
    return newP(base);
  }
  return {...newP(pf.username),...(pr?.data||{}),username:pf.username,xp:pf.xp,coins:pf.coins,streak:pf.streak,avatar:pf.avatar_url};
}
async function signUp(email,password,username){
  const {data,error}=await sb.auth.signUp({email,password,options:{data:{username}}});
  if(error)return{error:traduce(error.message)};
  sbUser=data.user;
  if(!data.session)return{needsConfirm:true};
  return{};
}
async function signIn(email,password){
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  if(error)return{error:traduce(error.message)};
  sbUser=data.user;return{};
}
function signGoogle(){
  sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:"https://angelhernandez1579.github.io/CiberRuta/"}});
}
async function signOut(){await sb.auth.signOut();sbUser=null}
function traduce(m){
  if(/Invalid login/i.test(m))return"Correo o contraseña incorrectos";
  if(/already registered/i.test(m))return"Ese correo ya tiene cuenta";
  if(/Password should/i.test(m))return"La contraseña es demasiado débil";
  if(/rate limit/i.test(m))return"Demasiados intentos. Espera un momento";
  return m;
}
let saveT;
function queueSave(){clearTimeout(saveT);saveT=setTimeout(saveNow,800)}
async function saveNow(){
  if(!sbUser||!P)return;
  await sb.from("perfiles").upsert({id:sbUser.id,username:P.username,xp:P.xp,coins:P.coins,streak:P.streak,badges_n:P.badges.length,updated_at:new Date().toISOString()});
  await sb.from("progreso").upsert({id:sbUser.id,data:{done:P.done,badges:P.badges,guides:P.guides,day:P.day,bonusDay:P.bonusDay,phishOK:P.phishOK,genCount:P.genCount,sims:P.sims,review:P.review,daily:P.daily,inv:P.inv,equip:P.equip,dxUntil:P.dxUntil,freeze:P.freeze,diag:P.diag}});
}
async function fetchRanking(){
  await sessionReady;
  const q=sb.from("perfiles").select("username,xp,badges_n,avatar_url").order("xp",{ascending:false}).limit(50)
    .then(({data,error})=>({data:data||[],error:error?error.message:null}));
  const t=new Promise(r=>setTimeout(()=>r({data:null,error:"La consulta no respondió en 8 segundos. Revisa la conexión y recarga la página."}),8000));
  return Promise.race([q,t]);
}

async function updateUsername(name){
  const {error}=await sb.from("perfiles").update({username:name,updated_at:new Date().toISOString()}).eq("id",sbUser.id);
  if(error)return/duplicate|unique/i.test(error.message)?"Ese nombre ya está en uso":"No se pudo cambiar el nombre";
  return null;
}
function resizeImg(file){
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement("canvas");c.width=c.height=256;
      const s=Math.min(img.width,img.height);
      c.getContext("2d").drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,256,256);
      c.toBlob(b=>b?res(b):rej(new Error("No se pudo procesar la imagen")),"image/jpeg",.9);
    };
    img.onerror=()=>rej(new Error("Archivo de imagen no válido"));
    img.src=URL.createObjectURL(file);
  });
}
async function uploadAvatar(file){
  const blob=await resizeImg(file);
  const path=sbUser.id+"/avatar.jpg";
  const {error}=await sb.storage.from("avatares").upload(path,blob,{upsert:true,contentType:"image/jpeg"});
  if(error)return{error:error.message};
  const url=sb.storage.from("avatares").getPublicUrl(path).data.publicUrl+"?t="+Date.now();
  const {error:e2}=await sb.from("perfiles").update({avatar_url:url}).eq("id",sbUser.id);
  if(e2)return{error:e2.message};
  return{url};
}
