from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import (
    UserProfile, Subject, Course, Enrollment, Activity, ActivityProgress,
    Evaluation, Question, EvaluationAttempt, StudentAnswer,
    StudentMastery, LearningRecommendation
)
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Popula la base de datos de MontesSori AI con datos pedagógicos realistas listos para demostración'

    def handle(self, *args, **kwargs):
        self.stdout.write("Sembrando datos de MontesSori AI...")

        # 1. Crear o actualizar usuarios clave
        # Estudiante Demo
        student_user, _ = User.objects.get_or_create(
            username='estudiante_demo',
            defaults={
                'email': 'mateo.rios@montessori.edu',
                'first_name': 'Mateo',
                'last_name': 'Ríos',
                'is_staff': False
            }
        )
        student_user.set_password('password123')
        student_user.save()
        UserProfile.objects.update_or_create(
            user=student_user,
            defaults={
                'role': 'student',
                'grade_level': '2° Secundaria (Aceleración)',
                'school_name': 'Colegio de Innovación Rural MontesSori',
                'preferred_learning_style': 'Visual y Práctico con Guía Socrática',
                'bio': 'Apasionado por la ciencia, las matemáticas cotidianas y la astronomía.'
            }
        )

        # Docente Demo
        teacher_user, _ = User.objects.get_or_create(
            username='profesora_elena',
            defaults={
                'email': 'elena.torres@montessori.edu',
                'first_name': 'Elena',
                'last_name': 'Torres',
                'is_staff': True
            }
        )
        teacher_user.set_password('password123')
        teacher_user.save()
        UserProfile.objects.update_or_create(
            user=teacher_user,
            defaults={
                'role': 'teacher',
                'grade_level': 'Docente Titular STEM',
                'school_name': 'Red Educativa MontesSori MIT Solve',
                'bio': 'Especialista en metodologías activas e inclusión pedagógica.'
            }
        )

        # Administrador Demo
        admin_user, _ = User.objects.get_or_create(
            username='admin_montessori',
            defaults={
                'email': 'admin@montessori.edu',
                'first_name': 'Camila',
                'last_name': 'Vargas',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('password123')
        admin_user.save()
        UserProfile.objects.update_or_create(
            user=admin_user,
            defaults={
                'role': 'admin',
                'grade_level': 'Coordinación Global',
                'school_name': 'MontesSori Global Learning Initiative',
                'bio': 'Supervisora de métricas pedagógicas e impacto de accesibilidad.'
            }
        )

        # 2. Asignaturas
        matematica, _ = Subject.objects.update_or_create(
            code='MAT-101',
            defaults={
                'name': 'Matemáticas y Razonamiento Lógico',
                'description': 'Aritmética contextualizada, álgebra visual y resolución de problemas cotidianos.',
                'icon_name': 'Compass',
                'color_accent': '#111111'
            }
        )
        ciencias, _ = Subject.objects.update_or_create(
            code='CIE-102',
            defaults={
                'name': 'Ciencias Naturales y Ecosistemas',
                'description': 'Biología, física aplicada y sostenibilidad ambiental para comunidades.',
                'icon_name': 'Globe',
                'color_accent': '#18181B'
            }
        )
        lenguaje, _ = Subject.objects.update_or_create(
            code='LEN-103',
            defaults={
                'name': 'Comunicación y Pensamiento Crítico',
                'description': 'Comprensión lectora, argumentación respetuosa y redacción analítica.',
                'icon_name': 'BookOpen',
                'color_accent': '#27272A'
            }
        )
        computacion, _ = Subject.objects.update_or_create(
            code='TEC-104',
            defaults={
                'name': 'Pensamiento Computacional e Inclusión Digital',
                'description': 'Lógica algorítmica, resolución de retos y ciudadanía digital ética.',
                'icon_name': 'Cpu',
                'color_accent': '#3F3F46'
            }
        )

        # 3. Cursos
        curso_mate, _ = Course.objects.update_or_create(
            title='Fracciones, Proporciones y Finanzas Comunitarias',
            defaults={
                'subject': matematica,
                'teacher': teacher_user,
                'description': 'Aprende a interpretar fracciones y razones a través de situaciones reales: comercio justo, recetas e inventarios comunitarios.',
                'grade_level': 'Secundaria - Nivel 2',
                'cover_image': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
                'is_active': True
            }
        )

        curso_ciencias, _ = Course.objects.update_or_create(
            title='Ecosistemas Locales y Conservación del Agua',
            defaults={
                'subject': ciencias,
                'teacher': teacher_user,
                'description': 'Explora los ciclos biogeoquímicos, la fotosíntesis y técnicas sostenibles para proteger cuencas hídricas en tu región.',
                'grade_level': 'Secundaria - Nivel 2',
                'cover_image': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
                'is_active': True
            }
        )

        curso_lenguaje, _ = Course.objects.update_or_create(
            title='Lectura Crítica y Debate de Ideas',
            defaults={
                'subject': lenguaje,
                'teacher': teacher_user,
                'description': 'Aprende a detectar sesgos, analizar argumentos y expresar tus ideas con claridad y evidencia contrastable.',
                'grade_level': 'Secundaria - Nivel 2',
                'cover_image': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
                'is_active': True
            }
        )

        # 4. Inscripciones para el estudiante demo
        Enrollment.objects.update_or_create(
            student=student_user,
            course=curso_mate,
            defaults={'progress_percentage': 68, 'status': 'active'}
        )
        Enrollment.objects.update_or_create(
            student=student_user,
            course=curso_ciencias,
            defaults={'progress_percentage': 85, 'status': 'active'}
        )
        Enrollment.objects.update_or_create(
            student=student_user,
            course=curso_lenguaje,
            defaults={'progress_percentage': 40, 'status': 'active'}
        )

        # 5. Actividades / Lecciones
        act1, _ = Activity.objects.update_or_create(
            course=curso_mate,
            title='1. Introducción Visual a las Fracciones Equivalentes',
            defaults={
                'topic': 'Fracciones Equivalentes',
                'description': 'Descubre por qué 2/4 representa exactamente la misma porción que 1/2 mediante modelos visuales interactivos.',
                'content_markdown': (
                    "### ¿Qué significa que dos fracciones sean equivalentes?\n\n"
                    "En el método MontesSori, representamos el todo como una unidad tangible. "
                    "Si divides una barra de pan en 2 partes iguales y tomas 1, tienes **1/2**.\n\n"
                    "Si tomas esa misma barra y la divides en 4 partes iguales, necesitarás tomar **2 partes** "
                    "para tener exactamente la misma cantidad: **2/4**.\n\n"
                    "Matemáticamente: multiplicamos o dividimos numerador y denominador por el mismo número."
                ),
                'difficulty': 'beginner',
                'estimated_minutes': 15,
                'order': 1
            }
        )
        ActivityProgress.objects.update_or_create(
            student=student_user,
            activity=act1,
            defaults={'status': 'completed', 'time_spent_minutes': 14, 'completed_at': timezone.now() - timedelta(days=2)}
        )

        act2, _ = Activity.objects.update_or_create(
            course=curso_mate,
            title='2. Suma y Resta con Denominadores Distintos',
            defaults={
                'topic': 'Operaciones con Fracciones',
                'description': 'Aprende a encontrar el mínimo común denominador usando analogías de intercambio.',
                'content_markdown': (
                    "### El reto de las partes desiguales\n\n"
                    "No puedes sumar directamente 1/2 manzana con 1/3 de manzana sin convertirlas primero a un tamaño común.\n\n"
                    "Ese tamaño común se llama **mínimo común múltiplo (mcm)**.\n"
                    "Para 2 y 3, el múltiplo común es 6.\n"
                    "- 1/2 = 3/6\n"
                    "- 1/3 = 2/6\n"
                    "Al sumarlos: 3/6 + 2/6 = **5/6**."
                ),
                'difficulty': 'intermediate',
                'estimated_minutes': 20,
                'order': 2
            }
        )
        ActivityProgress.objects.update_or_create(
            student=student_user,
            activity=act2,
            defaults={'status': 'completed', 'time_spent_minutes': 18, 'completed_at': timezone.now() - timedelta(days=1)}
        )

        act3, _ = Activity.objects.update_or_create(
            course=curso_mate,
            title='3. Aplicación Práctica: Presupuesto y Comercio Justo',
            defaults={
                'topic': 'Proporciones en Finanzas',
                'description': 'Calcula porcentajes y márgenes en un proyecto de emprendimiento escolar.',
                'content_markdown': (
                    "### Caso Práctico\n\n"
                    "Tu grupo escolar desea vender productos cosechados en el huerto. "
                    "El 40% de los ingresos se reinvierte en semillas, el 30% en herramientas "
                    "y el 30% restante se destina al fondo de emergencias de la escuela."
                ),
                'difficulty': 'intermediate',
                'estimated_minutes': 25,
                'order': 3
            }
        )

        # 6. Evaluaciones y Preguntas
        eval_mate, _ = Evaluation.objects.update_or_create(
            course=curso_mate,
            title='Evaluación Diagnóstica: Dominio de Fracciones y Proporciones',
            defaults={
                'description': 'Comprueba tu comprensión conceptual de fracciones equivalentes y operaciones cotidianas.',
                'topic': 'Fracciones y Razones',
                'duration_minutes': 15,
                'passing_score': 70,
                'total_points': 100,
                'is_active': True
            }
        )

        # Preguntas
        q1, _ = Question.objects.update_or_create(
            evaluation=eval_mate,
            order=1,
            defaults={
                'text': '¿Cuál de las siguientes fracciones es equivalente a 3/4?',
                'question_type': 'multiple_choice',
                'options': [
                    {'id': 0, 'text': '6/8', 'is_correct': True, 'feedback': '¡Correcto! Multiplicamos numerador y denominador por 2: (3×2)/(4×2) = 6/8.'},
                    {'id': 1, 'text': '4/5', 'is_correct': False, 'feedback': 'Incorrecto. 4/5 representa el 80%, mientras que 3/4 es el 75%.'},
                    {'id': 2, 'text': '9/16', 'is_correct': False, 'feedback': 'Incorrecto. Si multiplicamos el numerador por 3 (3×3=9), el denominador debería ser 12 (4×3=12).'},
                    {'id': 3, 'text': '6/12', 'is_correct': False, 'feedback': 'Incorrecto. 6/12 equivale a 1/2 (50%).'}
                ],
                'explanation': 'Para que dos fracciones sean equivalentes, la proporción entre numerador y denominador debe ser idéntica.',
                'points': 25
            }
        )

        q2, _ = Question.objects.update_or_create(
            evaluation=eval_mate,
            order=2,
            defaults={
                'text': 'Si un estudiante tiene 1/2 litro de agua y agrega 1/4 de litro más, ¿cuánta agua tiene en total?',
                'question_type': 'multiple_choice',
                'options': [
                    {'id': 0, 'text': '2/6 de litro', 'is_correct': False, 'feedback': 'Error común: no debes sumar numeradores y denominadores directamente.'},
                    {'id': 1, 'text': '3/4 de litro', 'is_correct': True, 'feedback': '¡Excelente! Convertimos 1/2 a 2/4; luego 2/4 + 1/4 = 3/4.'},
                    {'id': 2, 'text': '1/4 de litro', 'is_correct': False, 'feedback': 'Incorrecto. Al agregar agua, la cantidad total debe aumentar, no disminuir.'},
                    {'id': 3, 'text': '1 litro completo', 'is_correct': False, 'feedback': 'Incorrecto. Faltaría otro 1/4 para completar el litro.'}
                ],
                'explanation': 'La suma con denominadores distintos requiere unificar la escala al común múltiplo 4.',
                'points': 25
            }
        )

        q3, _ = Question.objects.update_or_create(
            evaluation=eval_mate,
            order=3,
            defaults={
                'text': 'En una cooperativa de 20 estudiantes, 3/5 deciden sembrar hortalizas. ¿Cuántos estudiantes sembrarán?',
                'question_type': 'multiple_choice',
                'options': [
                    {'id': 0, 'text': '15 estudiantes', 'is_correct': False, 'feedback': 'Incorrecto. 15 de 20 equivaldría a 3/4 (75%).'},
                    {'id': 1, 'text': '12 estudiantes', 'is_correct': True, 'feedback': '¡Correcto! (20 ÷ 5) × 3 = 4 × 3 = 12 estudiantes.'},
                    {'id': 2, 'text': '10 estudiantes', 'is_correct': False, 'feedback': 'Incorrecto. 10 de 20 es exactamente la mitad (1/2).'},
                    {'id': 3, 'text': '8 estudiantes', 'is_correct': False, 'feedback': 'Incorrecto. 8 de 20 corresponde a 2/5 (40%).'}
                ],
                'explanation': 'Calcular la fracción de un total consiste en dividir por el denominador y multiplicar por el numerador.',
                'points': 25
            }
        )

        q4, _ = Question.objects.update_or_create(
            evaluation=eval_mate,
            order=4,
            defaults={
                'text': 'Explica con tus propias palabras: ¿Por qué es fundamental que las partes sean exactamente iguales al dividir un entero en fracciones?',
                'question_type': 'open_text',
                'options': [],
                'explanation': 'La equidad de las partes garantiza que cada fracción represente una magnitud medible y comparable estándar.',
                'points': 25
            }
        )

        # 7. Intento previo de evaluación para el estudiante demo
        attempt1, _ = EvaluationAttempt.objects.update_or_create(
            evaluation=eval_mate,
            student=student_user,
            defaults={
                'score': 75,
                'passed': True,
                'feedback': '¡Buen desempeño general! Has demostrado buen manejo de equivalencias y operaciones básicas.',
                'completed_at': timezone.now() - timedelta(days=1),
                'is_offline_synced': False
            }
        )

        # 8. Registro de Maestría ("Mi Aprendizaje")
        StudentMastery.objects.update_or_create(
            student=student_user,
            subject=matematica,
            topic='Fracciones Equivalentes',
            defaults={
                'mastery_level': 'mastered',
                'score_average': 92.0,
                'strengths': 'Identificación rápida de múltiplos comunes y modelos gráficos.',
                'areas_to_improve': 'Acelerar la simplificación a términos mínimos.'
            }
        )
        StudentMastery.objects.update_or_create(
            student=student_user,
            subject=matematica,
            topic='Suma con Distinto Denominador',
            defaults={
                'mastery_level': 'standard_met',
                'score_average': 75.0,
                'strengths': 'Conversión adecuada de denominadores simples.',
                'areas_to_improve': 'Reforzar operaciones con tres o más fracciones combinadas.'
            }
        )
        StudentMastery.objects.update_or_create(
            student=student_user,
            subject=matematica,
            topic='Proporciones Inversas',
            defaults={
                'mastery_level': 'needs_reinforcement',
                'score_average': 48.0,
                'strengths': 'Interés activo en formular preguntas.',
                'areas_to_improve': 'Confusión frecuente entre proporcionalidad directa e inversa.'
            }
        )
        StudentMastery.objects.update_or_create(
            student=student_user,
            subject=ciencias,
            topic='Ciclo del Agua y Cuencas',
            defaults={
                'mastery_level': 'mastered',
                'score_average': 88.0,
                'strengths': 'Excelente capacidad para conectar la evaporación con el clima comunitario.',
                'areas_to_improve': 'Profundizar en la infiltración en acuíferos profundos.'
            }
        )
        StudentMastery.objects.update_or_create(
            student=student_user,
            subject=lenguaje,
            topic='Identificación de Tesis y Argumentos',
            defaults={
                'mastery_level': 'nearly_met',
                'score_average': 64.0,
                'strengths': 'Lectura fluida y retención de ideas secundarias.',
                'areas_to_improve': 'Diferenciar entre hechos objetivos y opiniones del autor.'
            }
        )

        # 9. Recomendaciones de Aprendizaje Adaptativas
        LearningRecommendation.objects.update_or_create(
            student=student_user,
            topic='Proporciones Inversas',
            defaults={
                'title': 'Consultar al Tutor IA: Proporciones en la Vida Real',
                'description': 'Pide al tutor que te explique la diferencia entre más trabajadores vs. tiempo requerido con analogías sencillas.',
                'action_type': 'tutor_session',
                'priority': 'high',
                'is_completed': False
            }
        )
        LearningRecommendation.objects.update_or_create(
            student=student_user,
            topic='Operaciones con Fracciones',
            defaults={
                'title': 'Práctica Guiada: Sumas con Mínimo Común Múltiplo',
                'description': 'Realiza 3 ejercicios breves interactivos con corrección inmediata.',
                'action_type': 'practice_exercise',
                'priority': 'medium',
                'is_completed': False
            }
        )

        self.stdout.write(self.style.SUCCESS("¡Base de datos sembrada con éxito con datos listos para MontesSori AI!"))
