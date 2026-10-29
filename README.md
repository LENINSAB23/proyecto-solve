# MontesSori AI · MIT Solve Global Learning Challenge 2027

> **"Aprender no debería tener límites."**  
> Plataforma educativa integral, moderna e inclusiva con inteligencia artificial socrática orientada a reducir las brechas de aprendizaje en comunidades con conexiones lentas y ritmos diversos.

---

## 1. ¿Qué es MontesSori AI?

**MontesSori AI** es una plataforma educativa de aprendizaje autónomo y guiado inspirada en los principios de la pedagogía activa: los estudiantes descubren y comprenden conceptos a su propio ritmo, mientras que los docentes reciben analíticas en tiempo real y herramientas de inteligencia artificial para personalizar la enseñanza sin ser reemplazados.

Desarrollada para participar en el **MIT Solve Global Learning Challenge 2027**, la plataforma integra tutoría conversacional socrática con Gemini API, un sistema de evaluación formativa con retroalimentación instantánea, herramientas de accesibilidad universal nativas y un modo de conectividad intermitente (*offline-first*).

---

## 2. ¿Qué Problema Resuelve?

1. **Falta de Acompañamiento Personalizado:** En aulas con muchos alumnos, los docentes no pueden responder cada duda específica. MontesSori AI ofrece un tutor socrático disponible en todo momento.
2. **Detección Tardía de Dificultades:** Identifica vacíos de aprendizaje en autoevaluaciones y notifica tempranamente al docente sobre estudiantes que necesitan apoyo.
3. **Brecha de Conectividad:** Permite que estudiantes en zonas rurales descarguen contenidos y resuelvan actividades sin internet, sincronizando sus progresos automáticamente al reconectar.
4. **Sobrecarga Docente:** El Copiloto de IA para docentes asiste en la redacción de planes de clase, rúbricas y ejercicios diferenciados, manteniendo el docente el 100% del control editorial.
5. **Inclusión y Accesibilidad:** Integra lectura en voz alta (Web Speech API), ajuste tipográfico adaptable y alto contraste para baja visión sin dependencias de pago.

---

## 3. Principales Funcionalidades

### A. Para Estudiantes
- **Panel Personalizado:** Saludo, racha de estudio constante, horas dedicadas, cursos activos y cronograma semanal.
- **Tutor IA Socrático:** 5 modos pedagógicos (*Explicación sencilla*, *Explicación detallada*, *Ejemplos prácticos*, *Resolver paso a paso*, *Crear práctica interactiva*). No entrega respuestas para copiar, sino que guía el razonamiento.
- **Evaluaciones Diagnósticas:** Preguntas de opción múltiple y respuesta abierta con corrección inmediata y justificación conceptual detallada.
- **Mi Aprendizaje ("Diagnóstico de Maestría"):** Gráficos analíticos (Recharts) que desglosan temas dominados vs. temas que necesitan refuerzo, con recomendaciones de acción directa.
- **Accesibilidad Universal:** Lector en voz alta (TTS) nativo en cualquier lección o mensaje del tutor, escala de fuente (`A`, `A+`, `A++`) y modo de alto contraste.

### B. Para Docentes
- **Panel del Aula:** Monitoreo de maestría grupal, cursos a cargo y tasa de participación.
- **Alertas de Estudiantes en Riesgo:** Detección automática de alumnos con dificultades persistentes para intervención pedagógica temprana.
- **Copiloto Pedagógico con IA:** Generador de planes de clase inclusivos, cuestionarios y talleres prácticos listos para revisión y guardado.

### C. Para Administradores y Jueces MIT Solve
- **Selector Rápido de Rol (1-Click Demo):** Permite a los evaluadores alternar instantáneamente entre los roles de *Estudiante (Mateo)*, *Docente (Elena)* y *Administrador (Camila)*.
- **Panel de Supervisión:** Métricas globales del sistema, estado del motor de IA y auditoría de sincronizaciones.
- **Modo Demostración Honesto:** Si no se configura `GEMINI_API_KEY` o no hay internet, la plataforma opera su propio motor pedagógico local sin fingir llamadas al API exterior.

---

## 4. Tecnologías Utilizadas

- **Frontend:**
  - React 19 + TypeScript
  - Vite 6
  - Tailwind CSS v4
  - Lucide React (iconografía minimalista)
  - Recharts (gráficos de analíticas y maestría)
  - Web Speech API (síntesis de voz inclusiva)
- **Backend:**
  - Python 3.14 + Django 6.1
  - Django REST Framework (DRF)
  - Django Cors Headers
  - WhiteNoise (gestión de archivos estáticos en producción)
  - Gunicorn (servidor WSGI para producción)
- **Base de Datos:**
  - PostgreSQL (con soporte nativo para Render mediante `DATABASE_URL`)
  - SQLite (fallback automático y sin configuración para desarrollo local)
- **Inteligencia Artificial:**
  - Google Gemini API (servidor seguro, sin exponer credenciales al cliente)
  - Motor Pedagógico MontesSori (modo offline / demo)

---

## 5. Requisitos Previos

- **Python:** 3.10 o superior (Python 3.14 verificado).
- **Node.js:** v18 o superior (v24 verificado) con `npm`.
- **Git** (opcional para clonar el repositorio).

---

## 6. Instalación y Ejecución Local

### Paso 1: Configurar el Backend

1. Abre una terminal en la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Crea y activa tu entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   # En Linux/macOS:
   source venv/bin/activate
   ```
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Ejecuta las migraciones y puebla los datos iniciales de demostración:
   ```bash
   python manage.py migrate
   python manage.py seed_data
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *El backend estará disponible en `http://127.0.0.1:8000/`.*

---

### Paso 2: Configurar el Frontend

1. En una nueva terminal, navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala los paquetes de Node:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en **`http://localhost:5173/`**.

---

## 7. Cuentas de Acceso Rápido (Modo Demostración)

La barra de navegación superior incluye un selector de rol con 1 clic para evaluar la plataforma:

| Rol | Usuario | Contraseña | Perfil |
| :--- | :--- | :--- | :--- |
| **Estudiante** | `estudiante_demo` | `password123` | Mateo Ríos (2° Secundaria - Aceleración) |
| **Docente** | `profesora_elena` | `password123` | Prof. Elena Torres (STEM e Inclusión) |
| **Administrador** | `admin_montessori` | `password123` | Camila Vargas (Coordinación Global) |

---

## 8. Configuración de Google Gemini API

La integración con Gemini se realiza exclusivamente en el servidor backend para proteger la clave privada:

1. Obtén tu clave en [Google AI Studio](https://aistudio.google.com/).
2. En la carpeta `backend`, crea o edita tu archivo `.env`:
   ```env
   GEMINI_API_KEY=tu_clave_secreta_aqui
   ```
3. Reinicia el servidor Django. La plataforma detectará la clave y utilizará Gemini 1.5 Flash.
4. *Si no configuras ninguna clave*, la plataforma activará automáticamente su **Motor Pedagógico MontesSori**, garantizando una experiencia educativa 100% funcional y transparente.

---

## 9. Configuración de PostgreSQL

- **Desarrollo Local:** Si no se define `DATABASE_URL`, Django utiliza automáticamente SQLite (`db.sqlite3`), sin necesidad de instalar bases de datos locales.
- **Producción:** Configura la variable de entorno:
  ```env
  DATABASE_URL=postgresql://usuario:contraseña@servidor:5432/nombre_base_datos
  ```
  El módulo `dj-database-url` se encargará de conectar automáticamente con PostgreSQL.

---

## 10. Despliegue en Render Cloud

El repositorio incluye el archivo de automatización **`render.yaml`** (Render Blueprint) listo para producción.

### Pasos para Desplegar:

1. Sube tu código a un repositorio en **GitHub** o **GitLab**.
2. Ingresa a tu cuenta en [Render.com](https://render.com/).
3. Haz clic en **"New"** y selecciona **"Blueprint"**.
4. Conecta tu repositorio de MontesSori AI.
5. Render creará automáticamente los 3 componentes:
   - **`montessori-backend`**: Servicio web en Python con Gunicorn y WhiteNoise.
   - **`montessori-frontend`**: Sitio estático compilado con Vite y redirecciones SPA.
   - **`montessori-postgres`**: Base de datos gestionada PostgreSQL.
6. En las variables de entorno del servicio backend en Render, puedes agregar opcionalmente tu `GEMINI_API_KEY`.
7. El comando de build ejecutará automáticamente las migraciones, la carga de datos iniciales (`seed_data`) y la compilación de estáticos (`collectstatic`).

---

## 11. Seguridad y Privacidad

- **Protección de Menores:** No se recolectan datos personales sensibles ni se comparten con servicios de publicidad o entrenamiento de modelos externos.
- **Claves Protegidas:** La clave de Gemini jamás viaja al frontend ni al navegador del usuario.
- **Acceso Restringido:** Los docentes solo pueden visualizar las métricas y evaluaciones de sus estudiantes matriculados.

---

## 12. Créditos y Candidatura

Proyecto diseñado y desarrollado para el **MIT Solve Global Learning Challenge 2027**.  
*MontesSori AI: Reduciendo brechas educativas a través de la tecnología, la autonomía y la inclusión.*
