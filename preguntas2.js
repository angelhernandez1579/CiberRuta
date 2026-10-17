// Preguntas adicionales: cada lección tendrá al menos 4 preguntas. Se cargan después de modulo16.js.
const PREGUNTAS_EXTRA2={
"0.2":["¿Cuál de estas frases de paso es más sólida?",["mesa-rio-nube-faro","Juan1990"],0,"Palabras poco comunes y aleatorias dan longitud y dificultad."],
"0.3":["¿Dónde conviene guardar el código de recuperación de tu gestor?",["En un lugar físico seguro y separado","En una nota del celular sin cifrar"],0,"Así no depende de un dispositivo que pueda perderse o ser comprometido."],
"1.2":["Un mensaje dice que tu correo será cerrado si no entras con un enlace. ¿Qué haces?",["Entro por la app oficial del correo","Hago clic para evitar el cierre"],0,"Los proveedores de correo no piden entrar por enlaces de SMS."],
"1.3":["Alguien dice ser de tu banco y pide instalar una app para 'proteger tu cuenta'. ¿Qué haces?",["Cuelgo y no instalo nada","La instalo para ayudar"],0,"Instalar apps a petición de un tercero puede dar control remoto de tu teléfono."],
"2.2":["¿Qué ayuda a detectar a un intermediario en una conexión?",["Advertencias de certificado no confiable","Un fondo de pantalla nuevo"],0,"Un certificado que no coincide con el sitio puede indicar que alguien intercepta la conexión."],
"2.3":["Una cámara conserva la contraseña de fábrica. ¿Qué haces?",["Cambiarla y actualizar su firmware","Dejarla así si funciona"],0,"La clave de fábrica suele ser conocida por los atacantes."],
"3.2":["¿Qué señal sugiere un archivo malicioso?",["Extensión doble, como .pdf.exe","Un nombre con fecha"],0,"Ocultar la extensión real es una técnica clásica de engaño."],
"3.3":["¿Qué bloquea un firewall?",["Conexiones no autorizadas según sus reglas","Publicidad en los videos"],0,"Filtra el tráfico que entra y sale del equipo o de la red."],
"4.2":["¿Qué ajuste reduce el rastreo entre sitios?",["Bloquear cookies de terceros","Aceptar todas las cookies"],0,"Las cookies de terceros son las que siguen tu navegación entre páginas."],
"4.3":["Antes de compartir una carpeta en la nube, ¿qué revisas?",["Quién tiene el enlace y qué permisos tiene","El color de la carpeta"],0,"El acceso depende de los permisos y del tipo de enlace."],
"5.2":["Una oferta caduca en 5 minutos. ¿Qué haces?",["Verifico la tienda antes de pagar","Pago para no perderla"],0,"La prisa es una táctica para evitar que compares y verifiques."],
"5.3":["Un QR en un cartel pide escribir tu contraseña. ¿Qué haces?",["No la escribo y reviso el origen del cartel","La escribo para continuar"],0,"Un código en un lugar público puede llevar a un sitio falso."],
"6.2":["¿Qué dato de tu perfil público conviene limitar?",["Tu rutina y tus horarios","Tu película favorita"],0,"Los horarios permiten anticipar dónde estarás."],
"6.3":["Un desconocido pide en un chat que no le digas nada a tus papás. ¿Qué es?",["Una señal de alerta de grooming","Una broma entre amigos"],0,"Pedir secreto a un menor es una de las señales más claras de grooming."],
"7.2":["Perdiste tu iPhone. ¿Qué haces primero?",["Activar Buscar y cambiar la clave de tu cuenta Apple","Esperar a que aparezca"],0,"Así se protege la cuenta y se puede localizar o borrar el equipo."],
"8.0":["Una base de datos cambia calificaciones sin autorización. ¿Qué principio se afecta?",["Integridad","Disponibilidad"],0,"Alterar datos sin permiso rompe la integridad."],
"8.1":["¿Qué diferencia hay entre cifrado y hash?",["El cifrado se revierte con una clave; el hash no se revierte","Son lo mismo"],0,"El hash es unidireccional; el cifrado se revierte con la clave adecuada."],
"8.2":["¿Qué ventaja tiene una passkey sobre una contraseña?",["No se puede escribir ni dictar en un sitio falso","Es más larga"],0,"Está ligada al sitio real, así que un sitio falso no la acepta."],
"8.3":["Una app de calculadora pide acceso a tus fotos. ¿Qué haces?",["La niego","La acepto"],0,"La calculadora no necesita tus fotos para su función."],
"8.0b":["Un ataque hace que un sitio no responda durante horas. ¿Qué principio se afecta?",["Disponibilidad","Confidencialidad"],0,"Un servicio que no responde cuando se necesita afecta la disponibilidad."],
"8.2b":["Perdiste el teléfono con tus passkeys. ¿Qué debes tener para recuperar el acceso?",["Un método de recuperación configurado de antemano","Tu contraseña escrita en el teléfono"],0,"Conviene configurar métodos de recuperación antes de perder el dispositivo."],
"8.1b":["¿Para qué sirve un hash en la verificación de un archivo descargado?",["Comprobar que no fue alterado","Ocultar su tamaño"],0,"Si el hash coincide con el publicado por el fabricante, el archivo es el original."],
"8.3b":["¿Qué riesgo aumenta con permisos innecesarios?",["Más daño si la app se compromete","Más consumo de batería"],0,"Un permiso de más amplía lo que un atacante puede hacer."]
};
U.forEach((u,ui)=>u.L.forEach((l,li)=>{
  const k=ui+'.'+li;
  const extra=[PREGUNTAS_EXTRA2[k],PREGUNTAS_EXTRA2[k+'b']].filter(Boolean);
  if(extra.length)l.q=l.q.concat(extra);
}));
