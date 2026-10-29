from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('student', 'Estudiante'),
        ('teacher', 'Docente'),
        ('admin', 'Administrador'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    grade_level = models.CharField(max_length=100, blank=True, default='Educación Básica')
    school_name = models.CharField(max_length=200, blank=True, default='Comunidad de Aprendizaje MontesSori')
    avatar_url = models.CharField(max_length=500, blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    preferred_learning_style = models.CharField(max_length=50, blank=True, default='Visual y Práctico')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='BookOpen')
    color_accent = models.CharField(max_length=20, default='#111111')

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='courses')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='taught_courses')
    grade_level = models.CharField(max_length=100, default='General')
    cover_image = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Activo'),
        ('completed', 'Completado'),
        ('paused', 'En Pausa'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    last_accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} en {self.course.title}"


class Activity(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Introductorio'),
        ('intermediate', 'Intermedio'),
        ('advanced', 'Avanzado'),
    ]
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=200)
    topic = models.CharField(max_length=150)
    description = models.TextField()
    content_markdown = models.TextField(help_text="Contenido educativo en Markdown")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')
    estimated_minutes = models.IntegerField(default=15)
    order = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class ActivityProgress(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completada'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_progresses')
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='progresses')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ('student', 'activity')


class Evaluation(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='evaluations')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    topic = models.CharField(max_length=150)
    duration_minutes = models.IntegerField(default=20)
    passing_score = models.IntegerField(default=70)
    total_points = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluación: {self.title} ({self.course.title})"


class Question(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Opción Múltiple'),
        ('open_text', 'Respuesta Abierta'),
        ('true_false', 'Verdadero o Falso'),
    ]
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=30, choices=QUESTION_TYPES, default='multiple_choice')
    options = models.JSONField(
        default=list,
        help_text="Lista de objetos: [{'id': 0, 'text': '...', 'is_correct': True, 'feedback': '...'}]"
    )
    explanation = models.TextField(
        blank=True,
        help_text="Explicación detallada del razonamiento pedagógico de la respuesta."
    )
    points = models.IntegerField(default=20)
    order = models.IntegerField(default=1)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"P{self.order}: {self.text[:50]}..."


class EvaluationAttempt(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluation_attempts')
    score = models.IntegerField(default=0)
    passed = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_offline_synced = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.evaluation.title} ({self.score}pts)"


class StudentAnswer(models.Model):
    attempt = models.ForeignKey(EvaluationAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option_index = models.IntegerField(null=True, blank=True)
    text_response = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)
    score_obtained = models.IntegerField(default=0)
    feedback = models.TextField(blank=True)


class StudentMastery(models.Model):
    MASTERY_LEVELS = [
        ('mastered', 'Dominado (85-100%)'),
        ('standard_met', 'Nivel Alcanzado (70-84%)'),
        ('nearly_met', 'En Progreso (50-69%)'),
        ('needs_reinforcement', 'Necesita Refuerzo (<50%)'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mastery_records')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    topic = models.CharField(max_length=150)
    mastery_level = models.CharField(max_length=30, choices=MASTERY_LEVELS, default='nearly_met')
    score_average = models.FloatField(default=65.0)
    evaluations_count = models.IntegerField(default=1)
    strengths = models.TextField(blank=True)
    areas_to_improve = models.TextField(blank=True)
    last_evaluated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'subject', 'topic')

    def __str__(self):
        return f"{self.student.username} - {self.topic} ({self.get_mastery_level_display()})"


class LearningRecommendation(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'Alta'),
        ('medium', 'Media'),
        ('low', 'Baja'),
    ]
    ACTION_TYPES = [
        ('tutor_session', 'Consultar al Tutor IA'),
        ('practice_exercise', 'Práctica Guiada'),
        ('lesson_review', 'Repasar Lección'),
        ('evaluation', 'Nueva Autoevaluación'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations')
    title = models.CharField(max_length=200)
    description = models.TextField()
    topic = models.CharField(max_length=150)
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES, default='practice_exercise')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - Rec: {self.title}"


class AITutorSession(models.Model):
    MODE_CHOICES = [
        ('simple', 'Explicación Sencilla'),
        ('detailed', 'Explicación Detallada'),
        ('practical', 'Ejemplos Prácticos'),
        ('step_by_step', 'Resolver Paso a Paso'),
        ('practice_quiz', 'Crear Práctica'),
    ]
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_tutor_sessions')
    title = models.CharField(max_length=200, default='Consulta Educativa')
    mode = models.CharField(max_length=30, choices=MODE_CHOICES, default='simple')
    topic = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username} - {self.title}"


class AIMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'Usuario'),
        ('assistant', 'MontesSori Tutor'),
        ('system', 'Sistema'),
    ]
    session = models.ForeignKey(AITutorSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    suggested_followups = models.JSONField(default=list, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_demo_generated = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role} @ {self.timestamp.strftime('%H:%M')}"


class TeacherAIGeneration(models.Model):
    TYPE_CHOICES = [
        ('quiz', 'Cuestionario de Preguntas'),
        ('lesson_plan', 'Borrador de Plan de Clase'),
        ('exercise', 'Ejercicios Prácticos'),
        ('activity_prompt', 'Propuesta de Actividad Inclusiva'),
    ]
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_generations')
    generation_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    grade_level = models.CharField(max_length=100)
    prompt = models.TextField()
    result_data = models.JSONField(help_text="Estructura generada por la IA editable por el docente")
    is_saved_as_course_material = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher.username} - {self.get_generation_type_display()} ({self.topic})"
