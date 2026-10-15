const EXTRA=[
"Caso real: en filtraciones masivas, miles de cuentas tenían contraseñas como 123456 o Password. Los atacantes prueban esas listas primero. Una frase de cuatro palabras poco comunes, como mesa-rio-nube-lunes, es mucho más segura que una clave corta con un símbolo al final.",
"Caso real: quien roba la contraseña de tu correo puede restablecer las demás cuentas. Por eso el correo debe ser tu cuenta más protegida. Revisa también los inicios de sesión con otras cuentas, porque también dan acceso.",
"Caso real: el smishing es phishing por SMS, con avisos de paquetes retenidos y enlaces cortos. Pagar una pequeña cuota en una página falsa basta para robar los datos de tu tarjeta. Ningún servicio legítimo te pedirá pagar aduanas desde un enlace.",
"Caso real: antes, los correos con errores ortográficos eran la señal principal, pero hoy los atacantes usan IA y textos impecables. Fíjate en el remitente, en el destino real de los enlaces y en si la petición tiene sentido.",
"Caso real: el evil twin es un punto de acceso falso con el mismo nombre que una red legítima. Quien se conecta puede ver tráfico no cifrado. El HTTPS y una VPN reducen el daño incluso si la red no es confiable.",
"Caso real: muchos routers antiguos siguen con WEP o con la clave de fábrica, y pueden comprometerse en minutos. Revisa también si tienes acceso remoto activado, porque una puerta abierta a internet es un riesgo constante.",
"Caso real: el ransomware ha obligado a cancelar cirugías en hospitales. Muchos ataques empiezan con una factura falsa en Word que pide habilitar macros. Desconfía de cualquier documento que pida activar contenido para verse bien.",
"Caso real: varios ataques grandes aprovecharon vulnerabilidades ya corregidas meses antes, pero que nadie había instalado. Activa las actualizaciones automáticas y reinicia el equipo cuando termine una actualización importante.",
"Caso real: adivinar la mascota, la ciudad natal o la escuela de alguien suele ser el primer paso para recuperar una cuenta. Esos datos se encuentran en redes sociales. Usa respuestas de seguridad inventadas y guárdalas en tu gestor.",
"Caso real: apps de linterna y de juegos han sido retiradas de tiendas oficiales por recopilar ubicación y contactos sin relación con su función. Revisar permisos después de instalar es un hábito simple que evita muchos problemas.",
"Caso real: en fraudes del tipo CEO, los atacantes clonan la voz o el correo de un directivo para pedir transferencias urgentes. Ante cualquier petición de dinero fuera de lo normal, confirma en persona o llamando a un número que ya conocías.",
"Caso real: sitios falsos de descarga ofrecen versiones modificadas de programas populares con malware. Descarga siempre desde el sitio del fabricante y verifica la firma o el hash del archivo cuando esté disponible.",
"Caso real: muchas cuentas se pierden cuando una app antigua conectada a la red social se filtra. Revisa periódicamente qué aplicaciones tienen acceso y elimina las que ya no usas. Un solo permiso olvidado puede abrir tu cuenta.",
"Caso real: delincuentes clonan perfiles de influencers y venden productos o inversiones falsas en los comentarios. Si una cuenta oficial te escribe primero, desconfía y verifica desde su perfil verificado.",
"Caso real: una laptop robada en un café basta para leer correos, fotos y contraseñas guardadas en el navegador. Activar el cifrado de disco y cerrar sesión en equipos ajenos cuesta segundos y evita este riesgo.",
"Caso real: en las estafas del mensaje de un familiar, alguien pide reenviar un código SMS. Ese código sirve para tomar tu cuenta. Nunca compartas un código de verificación, aunque la persona parezca conocida."
];
U.forEach((u,ui)=>u.L.forEach((l,li)=>{l.ex=EXTRA[ui*2+li]}));
