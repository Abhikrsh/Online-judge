from django.contrib import admin
from .models import Problem , TestCase , Submission


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'difficulty', 'time_limit', 'total_submissions', 'correct_submissions', 'acceptance')
    search_fields = ('title',)
    list_filter = ('difficulty',)
    
    def acceptance(self, obj):
        total_submissions = obj.total_submissions or 0
        correct_submissions = obj.correct_submissions or 0
        if total_submissions > 0:
            return "{:.2f}%".format((correct_submissions / total_submissions) * 100)
        return "N/A"

    acceptance.short_description = 'Acceptance Rate'

@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'problem', 'input', 'expected_output')
    search_fields = ('problem__title',)
    list_filter = ('problem',)

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'problem', 'status', 'runtime', 'language', 'timestamp')
    search_fields = ('user__name', 'problem__title', 'status', 'language')
    list_filter = ('status', 'language', 'timestamp')

