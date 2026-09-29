# 📍 GeoProspector AI - Santa Fe

Webapp de prospección comercial en terreno para venta de **Servicios de Inteligencia Artificial** y **Optimización de Fichas de Google Business / Google Maps**.

Diseñada especialmente para salir a la calle con el celular y prospectar consultorios médicos, odontólogos, centros de estética, ferreterías y cualquier comercio local.

---

## 🚀 Cómo Iniciar la Webapp

### Opción 1: Con un solo clic (Windows)
Haz doble clic sobre el archivo:
```
iniciar.bat
```
Esto abrirá tu navegador automáticamente en `http://localhost:3000`.

### Opción 2: Desde la terminal con Node.js
```bash
cd prospector-app
node server.js
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

### Opción 3: Abrir directamente sin servidor
También puedes hacer doble clic directamente sobre `index.html` y abrirlo en Chrome, Edge o Firefox.

---

## ⚙️ Configuración de APIs (En el botón ⚙️ de la app)

La aplicación **ya funciona de inmediato** con los consultorios y ferreterías reales de Santa Fe precargados. Para activar los superpoderes en vivo, tienes dos campos en Ajustes:

### 1. Google Maps / Places API Key (Opcional para búsqueda en vivo)
* **¿Para qué sirve?**: Te permite escribir en la app cualquier rubro nuevo (*"ferreterías"*, *"veterinarias"*, *"talleres"*) y buscar en vivo sobre cualquier zona de Santa Fe trayendo las fichas oficiales de Google.
* **Costo**: Google Cloud regala **$200 USD todos los meses**, lo que alcanza para miles de búsquedas sin pagar nada.
* **Dónde obtenerla**: [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials) -> Habilitar *Maps JavaScript API* y *Places API*.

### 2. Google Gemini API Key (Recomendado para generar Pitches en vivo)
* **¿Para qué sirve?**: Analiza cada consultorio o negocio y te redacta en 2 segundos:
  * El **Gancho de entrada (Hook)** para hablar con el dueño.
  * Los **Servicios de IA recomendados** específicos para ese rubro.
  * Respuestas a las **Objeciones típicas**.
* **Costo**: **100% GRATIS** para desarrollo y uso personal.
* **Dónde obtenerla**: [Google AI Studio](https://aistudio.google.com/app/apikey) (se obtiene en 30 segundos con tu cuenta de Google).

---

## 📱 Cómo usarla en el celular mientras caminan por Santa Fe

1. **En la misma red WiFi**: Si tienes la app corriendo en tu notebook, mira la IP local de tu PC (ej: `http://192.168.1.X:3000`) y ábrela en el navegador de tu celular.
2. **Subirla a internet (Gratis en 1 minuto)**: Puedes arrastrar la carpeta `prospector-app` a [Netlify Drop](https://app.netlify.com/drop) o Vercel y tendrás un enlace HTTPS público para llevar en el celular a cualquier parte.

---

## 💼 Funcionalidades de Venta Incluidas

* **Ficha idéntica a Google Business**: Foto, calificación, cantidad de reseñas, estado (abierto/cerrado), dirección y botón "Abrir en Google Maps".
* **Auditoría de Oportunidad**: Detecta al instante si el comercio no tiene sitio web, si tiene pocas reseñas o si su presencia digital es débil (¡el gancho perfecto para entrar a ofrecer tus servicios!).
* **CRM de Terreno**: Marca el estado (*Pendiente*, *Interesado*, *Volver a pasar*, *Cerrado*), anota el nombre de la secretaria o doctor y teléfonos de contacto. Se guarda automáticamente en el teléfono.
* **GPS en Vivo**: Botón para centrar el mapa en tu ubicación real mientras caminan.
* **Exportar a Excel/CSV**: Descarga todos los contactos y notas tomadas para seguimiento.
