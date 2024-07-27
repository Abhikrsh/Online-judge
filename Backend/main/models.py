from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    statement = models.TextField(null=False)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, null=False)
    time_limit = models.IntegerField(null=False, default=2)
    total_submissions = models.IntegerField(default=0)
    correct_submissions = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class TestCase(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    input = models.TextField(null=False)
    expected_output = models.TextField(null=False)

    def __str__(self):
        return f"TestCase for {self.problem.title}"

class Submission(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, null=False)
    runtime = models.CharField(max_length=50, null=False)
    language = models.CharField(max_length=50, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.problem}"


