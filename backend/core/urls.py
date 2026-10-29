from django.urls import path
from .views import (
    RegisterView, LoginView, QuickDemoLoginView, MeView,
    CourseListView, CourseDetailView, CourseEnrollView,
    ActivityDetailView, ActivityCompleteView,
    EvaluationListView, EvaluationDetailView, EvaluationSubmitView,
    StudentDashboardView, StudentMasteryView,
    AITutorChatView, AITutorSessionDetailView,
    TeacherDashboardView, TeacherAIGenerateView,
    AdminOverviewView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/quick-demo/', QuickDemoLoginView.as_view(), name='quick_demo'),
    path('auth/me/', MeView.as_view(), name='me'),

    # Courses & Activities
    path('courses/', CourseListView.as_view(), name='courses_list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:pk>/enroll/', CourseEnrollView.as_view(), name='course_enroll'),
    path('activities/<int:pk>/', ActivityDetailView.as_view(), name='activity_detail'),
    path('activities/<int:pk>/complete/', ActivityCompleteView.as_view(), name='activity_complete'),

    # Evaluations
    path('evaluations/', EvaluationListView.as_view(), name='evaluations_list'),
    path('evaluations/<int:pk>/', EvaluationDetailView.as_view(), name='evaluation_detail'),
    path('evaluations/<int:pk>/submit/', EvaluationSubmitView.as_view(), name='evaluation_submit'),

    # Student Hub
    path('student/dashboard/', StudentDashboardView.as_view(), name='student_dashboard'),
    path('student/mastery/', StudentMasteryView.as_view(), name='student_mastery'),

    # AI Tutor
    path('tutor/chat/', AITutorChatView.as_view(), name='tutor_chat'),
    path('tutor/sessions/<int:pk>/', AITutorSessionDetailView.as_view(), name='tutor_session_detail'),

    # Teacher Hub
    path('teacher/dashboard/', TeacherDashboardView.as_view(), name='teacher_dashboard'),
    path('teacher/ai-generate/', TeacherAIGenerateView.as_view(), name='teacher_ai_generate'),

    # Admin
    path('admin-overview/', AdminOverviewView.as_view(), name='admin_overview'),
]
