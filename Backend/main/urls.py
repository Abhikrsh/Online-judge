from django.urls import path
from .views import ProblemListView , RunCodeView , ProblemDetailView , SubmitCodeView , SubmissionListView , LeaderboardView , ProfileView

urlpatterns = [
    path('problems/', ProblemListView.as_view(), name='problem-list'),
    path('problems/<int:pk>/',ProblemDetailView.as_view() , name='problem-detail'),
    path('run-code/',RunCodeView.as_view() , name='run-code'),
    path('submit-code/',SubmitCodeView.as_view() , name='submit-code'),
    path('submissions/' , SubmissionListView.as_view() , name='submission'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile-detail'),

]
