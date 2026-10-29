from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Subject, Course, Enrollment, Activity, ActivityProgress,
    Evaluation, Question, EvaluationAttempt, StudentAnswer,
    StudentMastery, LearningRecommendation, AITutorSession, AIMessage, TeacherAIGeneration
)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'grade_level', 'school_name', 'avatar_url', 'phone', 'bio', 'preferred_learning_style']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'profile']

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.username


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class ActivityProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityProgress
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    student_status = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'

    def get_student_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = obj.progresses.filter(student=request.user).first()
            if progress:
                return progress.status
        return 'pending'


class CourseSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)
    teacher_name = serializers.SerializerMethodField()
    activities_count = serializers.SerializerMethodField()
    evaluations_count = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_teacher_name(self, obj):
        name = f"{obj.teacher.first_name} {obj.teacher.last_name}".strip()
        return name if name else obj.teacher.username

    def get_activities_count(self, obj):
        return obj.activities.count()

    def get_evaluations_count(self, obj):
        return obj.evaluations.count()

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            enrollment = obj.enrollments.filter(student=request.user).first()
            if enrollment:
                return enrollment.progress_percentage
        return 0


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='course', write_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class EvaluationSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()
    course_title = serializers.ReadOnlyField(source='course.title')

    class Meta:
        model = Evaluation
        fields = '__all__'

    def get_questions_count(self, obj):
        return obj.questions.count()


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'


class EvaluationAttemptSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)
    evaluation_title = serializers.ReadOnlyField(source='evaluation.title')
    topic = serializers.ReadOnlyField(source='evaluation.topic')

    class Meta:
        model = EvaluationAttempt
        fields = '__all__'


class StudentMasterySerializer(serializers.ModelSerializer):
    subject_name = serializers.ReadOnlyField(source='subject.name')

    class Meta:
        model = StudentMastery
        fields = '__all__'


class LearningRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningRecommendation
        fields = '__all__'


class AIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIMessage
        fields = '__all__'


class AITutorSessionSerializer(serializers.ModelSerializer):
    messages = AIMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AITutorSession
        fields = '__all__'


class TeacherAIGenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAIGeneration
        fields = '__all__'
