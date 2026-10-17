# 🛡️ CiberRuta

**Aprende ciberseguridad jugando.** CiberRuta es una aplicación web educativa, pensada para celular, que enseña seguridad digital a personas sin formación técnica: contraseñas, phishing, privacidad, redes, dispositivos y respuesta a incidentes, con lecciones cortas, simulacros, misiones y un sistema de progreso.

- **Versión:** 1.1.5
- **Autor:** Angel Abraham Hernandez Aguilar
- **Institución:** CUGDL
- **Fecha:** 16 de octubre de 2026
- **Demo:** https://angelhernandez1579.github.io/CiberRuta/

---

## 1. Problema

Millones de personas usan internet sin herramientas básicas para protegerse. Reutilizan contraseñas, caen en mensajes fraudulentos y comparten datos sin pensar. Gran parte de los incidentes de seguridad involucra un error humano, y ese riesgo es mayor en quienes no tuvieron acceso a formación técnica.

Las campañas de fraude en México son frecuentes: mensajes falsos de bancos, paqueterías y dependencias, llamadas de supuestos soportes técnicos y cuentas de redes sociales secuestradas. La mayoría de las personas afectadas no sabe qué señales debía notar ni qué hacer después.

## 2. Solución

CiberRuta convierte la educación en ciberseguridad en un recorrido corto y práctico:

- **Aprender:** lecciones con teoría en dos páginas (concepto y caso real) y preguntas con explicación.
- **Practicar:** simulacros de decisión, un laboratorio de phishing con correos generados al azar y herramientas de análisis.
- **Consolidar:** repaso inteligente de los errores, pruebas finales por rama y misiones diarias.
- **Mantener el hábito:** XP, niveles, rachas, logros, tienda cosmética y ranking.

**Público objetivo:** estudiantes, familias y adultos mayores que usan teléfono para banca, compras y comunicación.

## 3. Objetivos de Desarrollo Sostenible

| ODS | Relación con el proyecto |
|---|---|
| **ODS 4. Educación de calidad** (principal) | Meta 4.4: aumenta las competencias digitales necesarias para el empleo y la ciudadanía. |
| **ODS 9. Industria, innovación e infraestructura** | Promueve la adopción segura e informada de la tecnología digital. |
| **ODS 16. Paz, justicia e instituciones sólidas** | Reduce el riesgo de cibercrimen y fortalece la confianza en el entorno digital. |

## 4. Funcionalidades

**Aprendizaje**
- 9 módulos y 35 lecciones, cada una con 4 o más preguntas.
- Preguntas con opciones que se barajan en cada intento, para que la respuesta correcta no siempre quede en la misma posición.
- Repaso inteligente: las preguntas falladas regresan después de 2 días.
- Árbol de habilidades con 5 ramas, pruebas finales y medallas por dominio.

**Práctica**
- **Simulacros:** decisiones ante un correo de phishing, un SMS de paquetería, una página de inicio de sesión falsa, una llamada de falso banco y una cuenta robada. Al responder se muestran las señales que había y por qué.
- **Simulacros aleatorios sin límite**, generados a partir de plantillas.
- **Laboratorio de phishing infinito:** correos sintéticos generados al azar. Decides si son legítimos o fraudulentos y recibes la explicación.
- **Misiones diarias** de 2 a 5 minutos.

**Herramientas**
- Verificador de contraseñas: nivel de fortaleza calculado en el propio navegador, sin enviar la contraseña.
- Revisión de filtraciones con el método de k-anonimato: solo se envían 5 caracteres de un hash SHA-1.
- Generador de contraseñas con aleatoriedad criptográfica del navegador.
- Detector de phishing y analizador de enlaces, que revisa el texto de una URL sin abrirla.
- Guías para iPhone: VPN, Relé privado de iCloud, limitar el rastreo de IP y dirección Wi-Fi privada.
- Mapa de ataques (simulado), noticias de ciberseguridad (INCIBE y MuySeguridad), centro de emergencia y diagnóstico de hábitos.

**Comunidad**
- Ranking global, ficha pública de cada usuario y toques para recordar a alguien que estudie (con enfriamiento).
- Muro público de texto, moderado: filtro de lenguaje ofensivo, sin enlaces, antispam y reportes.

**Cuenta**
- Inicio de sesión con correo y con Google, personalizado para cuentas institucionales.
- Foto de perfil, cambio de nombre de usuario, descarga de los propios datos y eliminación de la cuenta.

**Administración**
- Panel con búsqueda de usuarios, ajustes de XP, monedas y racha, marco especial, renombrado, suspensión con motivo, reinicio de progreso, estadísticas, reportes y registro de actividad. Las mismas acciones están disponibles desde el perfil de cada usuario.

## 5. Arquitectura y tecnologías

| Capa | Tecnología | Función |
|---|---|---|
| Interfaz | HTML, CSS y JavaScript sin frameworks | Aplicación de una sola página, responsiva y con animaciones sobrias |
| Sonido y gráficos | Web Audio API, Canvas | Efectos de sonido y mapa animado |
| Autenticación, datos y archivos | Supabase (Auth, PostgreSQL, Storage) | Cuentas, progreso, ranking, comunidad y fotos |
| Seguridad de datos | Reglas de nivel de fila (RLS), funciones y disparadores en PostgreSQL | Control de acceso y validaciones en el servidor |
| Alojamiento | GitHub Pages | Publicación gratuita por HTTPS |
| Aplicación instalable | Manifiesto web (PWA) | Se puede añadir a la pantalla de inicio de iPhone y Android |

El cliente se comunica con Supabase usando únicamente la **clave publicable**. La clave secreta y el secreto de Google nunca se incluyen en el código.

## 6. Seguridad (aplicación de la triada CIA)

| Principio | Control implementado |
|---|---|
| **Confidencialidad** | Contraseñas gestionadas por el proveedor de autenticación (nunca en texto plano). El progreso y los datos privados solo los ve su dueño. La revisión de filtraciones no envía la contraseña completa. |
| **Integridad** | Reglas que impiden que un usuario cambie su XP, su marco, su estado de suspensión o su rol de administrador. Límite de 500 XP por escritura para usuarios normales. Los nombres y los mensajes se validan en el servidor. |
| **Disponibilidad** | Límites de frecuencia: cambio de nombre, subida de fotos, publicaciones (5 por hora), toques (6 horas por persona) e intentos de inicio de sesión. Caché del ranking. Límite de tamaño y tipo para las fotos (2 MB, JPG, PNG o WebP). |

Otros controles:
- **Validación de entradas y prevención de XSS:** todo texto de usuario se escapa antes de mostrarse, y las URLs de fotos solo se aceptan si apuntan al bucket del proyecto.
- **Filtro de lenguaje ofensivo** aplicado a nombres de usuario y publicaciones, también en el servidor.
- **Antiphishing en la comunidad:** las publicaciones no pueden contener enlaces.
- **Acciones administrativas registradas** con fecha y responsable.
- **Sin mensajes privados entre usuarios:** por diseño, para proteger a los menores de contacto con desconocidos.

## 7. Estructura del proyecto

```
ciberruta/
├── index.html          Estructura, estilos y carga de scripts
├── supa.js             Conexión con Supabase, cuentas, progreso y validaciones del cliente
├── app.js              Lógica principal: lecciones, ruta, perfil, verificador y generador
├── modulos.js          Navegación, portada, herramientas, administración y datos de cuenta
├── skills.js           Simulacros, misiones, árbol de habilidades, repaso, tienda y analizador
├── comunidad.js        Comunidad, toques, reportes y ficha pública
├── laboratorio.js      Laboratorio de phishing infinito
├── lessons.js          Contenido de los módulos 1 a 8
├── lessons2.js         Lecciones adicionales de los módulos 1 a 8
├── extra.js            Explicaciones "Profundiza"
├── modulo16.js         Módulo 9: Fundamentos técnicos
├── preguntas.js        Preguntas adicionales (primera tanda)
├── preguntas2.js       Preguntas adicionales (segunda tanda)
├── news.js             Noticias de INCIBE y MuySeguridad
├── privacidad.html     Aviso de Privacidad
├── terminos.html       Términos de Servicio
├── contacto.html       Contacto
├── manifest.json       Configuración de la app instalable
├── icon-*.png          Íconos
└── *.sql               Esquema y políticas de la base de datos
```

## 8. Instalación y configuración

**Requisitos:** una cuenta gratuita de Supabase, una cuenta de GitHub y un navegador moderno.

1. **Crear el proyecto en Supabase** y copiar la URL y la clave publicable en la constante `SUPA_URL` y `SUPA_KEY` de `supa.js`.
2. **Ejecutar los scripts SQL en este orden** desde el SQL Editor:
   1. `00_base.sql`: tablas, políticas y bucket de fotos.
   2. `seguridad.sql`: límites de datos y disparador anti-trampas.
   3. `admin.sql`: columnas y reglas de administración.
   4. `nombres.sql`: nombres únicos y reservados.
   5. `admin2.sql`: suspensiones, registro de actividad y políticas de administración.
   6. `community.sql`: comunidad, reportes, toques y filtro de lenguaje.
   7. `cuenta.sql`: eliminación de cuenta.
3. **Hacerse administrador** (una sola vez): en el SQL Editor, ejecutar `update public.perfiles set is_admin = true where username = 'TU_USUARIO';`.
4. **Configurar Authentication:** en *URL Configuration*, poner la URL del sitio como *Site URL* y como *Redirect URL*. Para Google, activar el proveedor en *Providers* con su Client ID y Client Secret, y registrar la URI de redirección de Supabase en Google Cloud.
5. **Publicar en GitHub Pages:** subir los archivos al repositorio, activar *Pages* desde la rama principal y abrir la dirección resultante.

Para ejecutar en local basta con abrir `index.html` con un servidor estático (por ejemplo, `python -m http.server`), porque las funciones de Supabase necesitan una dirección http.

## 9. Pruebas realizadas

- Verificación de sintaxis de todos los archivos JavaScript.
- Verificación automática del contenido: 9 módulos, 35 lecciones, 140 preguntas, sin índices de respuesta fuera de rango.
- Revisión del código de las reglas de la base de datos y de los flujos de cuenta, progreso y administración.

**Pendiente:** pruebas manuales en navegador y en iPhone/Android (inicio de sesión, progreso, ranking, comunidad y panel de administración), pruebas automatizadas de extremo a extremo y revisión de accesibilidad con lector de pantalla.

## 10. Limitaciones conocidas

- **Mapa de ataques:** es una simulación. No existe una fuente pública de ataques en tiempo real sin clave de API y sin un servidor propio.
- **Noticias:** se actualizan manualmente en `news.js`. Automatizarlo requiere un proceso programado.
- **Filtro de lenguaje:** es una lista inicial. Puede dejar pasar variantes nuevas o bloquear palabras inofensivas.
- **XP en el cliente:** el navegador calcula el progreso. El servidor limita los saltos grandes, pero una cuenta determinada podría acumular XP poco a poco. La solución completa requiere funciones de servidor.
- **Sin Content Security Policy:** GitHub Pages no permite cabeceras de seguridad, y una política estricta exigiría reorganizar el código para eliminar los scripts incrustados en el HTML.
- **Laboratorio:** solo existe el de phishing. Los de enlaces, ingeniería social, respuesta a incidentes, contraseñas y privacidad están planeados.
- **Políticas de privacidad y términos:** son plantillas de proyecto escolar y deben revisarse con el profesor antes de usarse como documentos definitivos.

## 11. Trabajo futuro

1. Laboratorios de análisis de enlaces, ingeniería social y respuesta a incidentes.
2. Casos narrativos con decisiones ramificadas.
3. Más módulos: identidad digital, fraudes financieros, IA y deepfakes.
4. Funciones de servidor para calcular el progreso.
5. Automatización de las noticias y pruebas de extremo a extremo.
6. Versión nativa para Android mediante una Trusted Web Activity.

## 12. Aviso de privacidad

CiberRuta trata los datos mínimos necesarios para funcionar: correo, nombre de usuario, foto opcional y progreso educativo. No vende datos ni muestra publicidad. El detalle completo está en [privacidad.html](privacidad.html), y las reglas de uso en [terminos.html](terminos.html).

## 13. Licencia

Proyecto académico. Las noticias enlazan a sus fuentes originales (INCIBE y MuySeguridad), cuyos derechos corresponden a sus autores.
