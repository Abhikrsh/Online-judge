from rest_framework import serializers
from .models import Problem , Submission
from django.contrib.auth import get_user_model

User = get_user_model()

class ProblemSerializer(serializers.ModelSerializer):
    acceptance = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = ['id', 'title', 'statement', 'difficulty', 'acceptance']

    def get_acceptance(self, obj):
        # Annotate the Problem instance in the view to include these values
        total_submissions = obj.total_submissions or 0
        correct_submissions = obj.correct_submissions or 0
        if total_submissions > 0:
            return "{:.2f}%".format((correct_submissions / total_submissions) * 100)
        return "N/A"


class RunCodeSerializer(serializers.Serializer):
    code = serializers.CharField() 
    language = serializers.ChoiceField(choices=[('py', 'py'), ('cpp', 'cpp'), ('java', 'java')])
    input = serializers.CharField(required=False, allow_blank=True)



class CodeSubmissionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    problem_id = serializers.IntegerField()
    code = serializers.CharField()
    language = serializers.CharField()


class SubmissionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)

    class Meta:
        model = Submission
        fields = ['username', 'problem_title', 'status', 'runtime', 'language', 'timestamp']




class LeaderboardSerializer(serializers.ModelSerializer):
    accepted_problems_count = serializers.IntegerField()

    class Meta:
        model = User
        fields = ['username', 'accepted_problems_count']