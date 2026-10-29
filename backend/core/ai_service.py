import os
import json
import requests
from django.conf import settings

class MontessoriAIService:
    """
    Servicio de Inteligencia Artificial para MontesSori.
    Maneja la integración con Gemini API desde el servidor y cuenta
    con un motor pedagógico de respaldo (modo demostración) para entornos
    sin clave API o con conectividad limitada.
    """

    @classmethod
    def get_api_key(cls):
        return getattr(settings, 'GEMINI_API_KEY', '') or os.getenv('GEMINI_API_KEY', '')

    @classmethod
    def is_live_available(cls):
        return bool(cls.get_api_key().strip())

    @classmethod
    def call_gemini(cls, system_instruction: str, user_prompt: str) -> dict:
        api_key = cls.get_api_key()
        if not api_key:
            return {"status": "demo", "content": None}

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_instruction}\n\nConsulta o Instrucción:\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 1024,
            }
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return {"status": "live", "content": parts[0].get("text", "")}
            return {"status": "error", "error": f"API error {response.status_code}: {response.text[:200]}"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    @classmethod
    def tutor_respond(cls, message: str, mode: str = 'simple', topic: str = '', grade_level: str = 'General', history: list = None) -> dict:
        """
        Genera una respuesta pedagógica para el estudiante según el método Montessori:
        aprendizaje activo, guiado, que fomenta la reflexión y la autoevaluación.
        """
        system_instruction = (
            "Eres el Tutor Inteligente de MontesSori, una plataforma educativa de alto impacto orientada "
            "al desafío MIT Solve Global Learning Challenge. Tu pedagogía se inspira en el método de aprendizaje activo: "
            "orientas con calidez, rigor adaptativo, claridad y nunca entregas soluciones directas para que el estudiante "
            "solo copie. En su lugar, promueves el razonamiento socrático, el desglose de ideas y la motivación intrínseca.\n\n"
            f"Modo pedagógico solicitado: {mode}.\n"
            f"Nivel del estudiante: {grade_level}.\n"
            f"Tema contextual: {topic or 'General'}.\n"
            "Responde siempre en español claro, empático y estructurado."
        )

        # Intento con Gemini en vivo si existe clave
        if cls.is_live_available():
            result = cls.call_gemini(system_instruction, message)
            if result.get("status") == "live" and result.get("content"):
                return {
                    "role": "assistant",
                    "content": result["content"],
                    "mode": mode,
                    "is_demo": False,
                    "provider": "Gemini 1.5 Flash (Servidor Seguro)",
                    "suggested_followups": cls._get_suggested_followups(message, mode)
                }

        # Modo Demostración Pedagógico de Alta Calidad (cuando no hay clave API configurada)
        demo_content = cls._generate_pedagogical_demo_response(message, mode, topic)
        return {
            "role": "assistant",
            "content": demo_content,
            "mode": mode,
            "is_demo": True,
            "provider": "Modo Demostración Educativo MontesSori (Sin clave API en servidor)",
            "suggested_followups": cls._get_suggested_followups(message, mode)
        }

    @classmethod
    def teacher_generate(cls, generation_type: str, topic: str, subject: str, grade_level: str, extra_prompt: str = '') -> dict:
        """
        Asistente de Inteligencia Artificial para el Docente:
        Genera borradores estructurados de planes de clase, evaluaciones y ejercicios.
        El docente mantiene siempre el control editorial para editar y aprobar.
        """
        system_instruction = (
            "Eres el Asistente Pedagógico para Docentes de MontesSori. "
            "Tu objetivo es ayudar a los profesores a ahorrar tiempo diseñando materiales inclusivos, "
            "evaluaciones formativas y planes de clase diferenciados. Responde con estructura estructurada JSON o Markdown claro."
        )
        prompt = (
            f"Tipo de recurso solicitado: {generation_type}\n"
            f"Asignatura: {subject}\n"
            f"Tema curricular: {topic}\n"
            f"Nivel escolar: {grade_level}\n"
            f"Detalles adicionales: {extra_prompt}\n"
        )

        if cls.is_live_available():
            result = cls.call_gemini(system_instruction, prompt)
            if result.get("status") == "live" and result.get("content"):
                return {
                    "is_demo": False,
                    "provider": "Gemini 1.5 Flash",
                    "data": cls._parse_or_wrap_teacher_response(generation_type, result["content"], topic, subject)
                }

        # Generador pedagógico de demostración para docentes
        return {
            "is_demo": True,
            "provider": "Modo Demostración MontesSori",
            "data": cls._generate_teacher_demo_data(generation_type, topic, subject, grade_level)
        }

    @classmethod
    def _get_suggested_followups(cls, message: str, mode: str) -> list:
        lowered = message.lower()
        if "fraccion" in lowered or "matematica" in lowered:
            return [
                "¿Podemos ver un ejemplo con una pizza o chocolate?",
                "¿Cómo sumo fracciones con distinto denominador paso a paso?",
                "Dame 2 ejercicios prácticos para verificar mi comprensión."
            ]
        elif "celula" in lowered or "fotosintesis" in lowered or "ciencia" in lowered:
            return [
                "¿Cuál es la diferencia entre célula animal y vegetal?",
                "¿Qué ocurriría en la Tierra si las plantas no hicieran fotosíntesis?",
                "Quiero un resumen de 3 puntos clave para mi examen."
            ]
        elif "ensayo" in lowered or "lectura" in lowered or "comunicacion" in lowered:
            return [
                "¿Cómo redacto una introducción que atrape al lector?",
                "¿Cuál es la diferencia entre tesis y argumento?",
                "Revisa las ideas principales que he preparado."
            ]
        else:
            return [
                "¿Podrías explicarlo con una analogía cotidiana?",
                "Muéstrame un ejemplo paso a paso.",
                "Ponme a prueba con una pregunta rápida sobre este tema."
            ]

    @classmethod
    def _generate_pedagogical_demo_response(cls, message: str, mode: str, topic: str) -> str:
        intro_mode_map = {
            'simple': (
                "🌱 **Explicación clara y accesible (Método MontesSori):**\n\n"
                f"Analizando tu consulta sobre *{message}*:\n\n"
                "Imagina este concepto como un puente en la vida real. Todo principio complejo "
                "se compone de pequeños bloques comprensibles e intuitivos.\n\n"
                "1. **Punto de partida:** Lo esencial que debes observar es la relación causa-efecto.\n"
                "2. **Analogía sencilla:** Cuando aplicamos esto en el día a día, es semejante a seguir una receta donde cada ingrediente cumple una función insustituible.\n"
                "3. **Conclusión clave:** Si comprendes el propósito de cada parte, resolver cualquier ejercicio se vuelve natural.\n\n"
                "💡 *¿Qué parte de esta idea te parece más interesante explorar juntos ahora?*"
            ),
            'detailed': (
                "🔬 **Análisis conceptual riguroso:**\n\n"
                f"Profundizando en: *{message}*\n\n"
                "### Fundamento Teórico\n"
                "El concepto se articula a través de tres dimensiones fundamentales:\n"
                "- **Definición formal:** Estructura de propiedades invariantes y relaciones lógicas.\n"
                "- **Mecanismo operativo:** Secuencia de transformaciones o leyes naturales que rigen el fenómeno.\n"
                "- **Contexto de aplicación:** Resolución de problemas multidimensionales en contextos reales.\n\n"
                "### Razonamiento Guiado\n"
                "Para interiorizar este conocimiento, reflexiona en cómo se conectan los datos iniciales con la incógnita planteada.\n\n"
                "📌 *Sugerencia pedagógica: Intenta formular con tus propias palabras la ley o principio principal antes de continuar.*"
            ),
            'practical': (
                "🛠️ **Ejemplos prácticos y aplicaciones reales:**\n\n"
                f"Veamos cómo se aplica *{message}* fuera del libro de texto:\n\n"
                "**Caso 1: En tu comunidad o entorno cotidiano**\n"
                "Observamos este principio al medir proporciones, calcular trayectorias o entender el clima local.\n\n"
                "**Caso 2: En la tecnología y la ciencia moderna**\n"
                "Los algoritmos de navegación y las energías renovables utilizan exactamente este modelo para optimizar recursos.\n\n"
                "✨ *Desafío para ti: ¿En qué otra situación cotidiana se te ocurre que podríamos aplicar este mismo principio?*"
            ),
            'step_by_step': (
                "🪜 **Resolución guiada paso a paso:**\n\n"
                f"Abordemos el problema relacionado con: *{message}*\n\n"
                "**Paso 1: Identificar lo conocido y lo desconocido**\n"
                "Anota claramente los datos que tenemos y cuál es la meta u objetivo que queremos alcanzar.\n\n"
                "**Paso 2: Elegir la estrategia adecuada**\n"
                "No memorices fórmulas sin sentido; busca qué relación matemática o conceptual une los datos.\n\n"
                "**Paso 3: Ejecutar el cálculo o razonamiento**\n"
                "Revisamos cada paso aritmético o lógico manteniendo el orden.\n\n"
                "**Paso 4: Validación crítica**\n"
                "¿Tiene sentido el resultado obtenido en el contexto del problema?\n\n"
                "🎯 *Escribe cuál crees que es el primer paso en tu ejercicio y te confirmaré si vas por buen camino.*"
            ),
            'practice_quiz': (
                "📝 **Práctica interactiva de autoevaluación:**\n\n"
                f"Aquí tienes un mini-reto sobre *{message}* para medir tu comprensión:\n\n"
                "**Pregunta 1:** ¿Cuál es el factor principal que determina este fenómeno?\n"
                "- A) La interacción directa entre las variables clave.\n"
                "- B) Una constante aleatoria sin relación causa-efecto.\n"
                "- C) El cambio de escala únicamente.\n\n"
                "**Pregunta 2:** Si duplicamos el valor inicial, ¿qué esperarías que ocurra con el resultado?\n\n"
                "💭 *Responde con tu opción preferida (A, B o C) y te explicaré el porqué de cada alternativa.*"
            )
        }
        return intro_mode_map.get(mode, intro_mode_map['simple'])

    @classmethod
    def _generate_teacher_demo_data(cls, generation_type: str, topic: str, subject: str, grade_level: str) -> dict:
        if generation_type == 'quiz':
            return {
                "title": f"Evaluación Formativa: {topic}",
                "subject": subject,
                "grade_level": grade_level,
                "questions": [
                    {
                        "order": 1,
                        "text": f"¿Cuál de las siguientes afirmaciones describe con mayor precisión el concepto de {topic}?",
                        "type": "multiple_choice",
                        "options": [
                            {"id": 0, "text": f"Es un proceso fundamental que regula las relaciones en {subject}.", "is_correct": True, "feedback": "¡Correcto! Define con exactitud la función principal."},
                            {"id": 1, "text": "Es una variable secundaria sin impacto en el sistema.", "is_correct": False, "feedback": "Incorrecto. Este elemento sí influye activamente en el resultado."},
                            {"id": 2, "text": "Ocurre únicamente en condiciones artificiales de laboratorio.", "is_correct": False, "feedback": "Incorrecto. Se manifiesta en situaciones naturales y cotidianas."},
                        ],
                        "explanation": f"El dominio de {topic} requiere entender su rol activo y continuo dentro de {subject}."
                    },
                    {
                        "order": 2,
                        "text": f"Si un estudiante aplica {topic} en un caso práctico, ¿qué evidencia demuestra comprensión real?",
                        "type": "multiple_choice",
                        "options": [
                            {"id": 0, "text": "Repetir de memoria la definición del libro sin ejemplos.", "is_correct": False, "feedback": "Memorizar no equivale a comprensión profunda."},
                            {"id": 1, "text": "Capacidad de predecir el resultado y justificar el razonamiento paso a paso.", "is_correct": True, "feedback": "¡Excelente! La justificación y predicción revelan competencia real."},
                            {"id": 2, "text": "Resolver el ejercicio solo si tiene las fórmulas anotadas al lado.", "is_correct": False, "feedback": "La dependencia de ayudas externas indica necesidad de refuerzo."},
                        ],
                        "explanation": "La taxonomía de Bloom y el enfoque MontesSori valoran la aplicación y justificación sobre la mera memorización."
                    }
                ]
            }
        elif generation_type == 'lesson_plan':
            return {
                "title": f"Plan de Clase Inclusivo: {topic}",
                "subject": subject,
                "grade_level": grade_level,
                "duration": "60 minutos",
                "pedagogical_objective": f"Que los estudiantes descubran y fundamenten el principio de {topic} a través de la experimentación y el debate socrático.",
                "differentiated_learning": "Adaptaciones para estudiantes con ritmos diversos: tarjetas visuales, lectura en voz alta TTS y desafíos de extensión.",
                "phases": [
                    {"phase": "Apertura y Asombro (10 min)", "activity": "Pregunta disparadora sin respuesta obvia y conexión con experiencias de la comunidad."},
                    {"phase": "Exploración Activa (25 min)", "activity": f"Trabajo en duplas con material manipulativo o simulaciones digitales sobre {topic}."},
                    {"phase": "Conceptualización y Síntesis (15 min)", "activity": "Puesta en común donde los estudiantes enuncian las leyes o reglas descubiertas."},
                    {"phase": "Cierre y Evaluación Formativa (10 min)", "activity": "Ticket de salida con autoevaluación rápida en la plataforma MontesSori."}
                ]
            }
        else: # exercise / activity_prompt
            return {
                "title": f"Taller de Aplicación: {topic}",
                "subject": subject,
                "grade_level": grade_level,
                "instructions": f"Guía práctica diseñada para fortalecer las competencias de los estudiantes en {topic}.",
                "activities": [
                    {"step": "Actividad 1: Observación y Registro", "detail": "Identificar patrones y variables en el problema inicial."},
                    {"step": "Actividad 2: Modelado Guiado", "detail": "Representar el fenómeno utilizando esquemas visuales o numéricos."},
                    {"step": "Actividad 3: Transferencia Comunitaria", "detail": "Explicar cómo resolver un problema real de su localidad aplicando lo aprendido."}
                ]
            }

    @classmethod
    def _parse_or_wrap_teacher_response(cls, generation_type: str, raw_text: str, topic: str, subject: str) -> dict:
        try:
            # Si Gemini retornó JSON en un bloque de código
            clean = raw_text.strip()
            if clean.startswith("```json"):
                clean = clean[7:]
            if clean.startswith("```"):
                clean = clean[3:]
            if clean.endswith("```"):
                clean = clean[:-3]
            return json.loads(clean.strip())
        except Exception:
            return {
                "title": f"Recurso Generado: {topic}",
                "subject": subject,
                "raw_content": raw_text
            }
