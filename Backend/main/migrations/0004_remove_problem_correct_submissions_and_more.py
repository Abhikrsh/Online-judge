# Generated by Django 5.0.6 on 2024-07-24 20:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0003_problem_correct_submissions_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="problem",
            name="correct_submissions",
        ),
        migrations.RemoveField(
            model_name="problem",
            name="total_submissions",
        ),
    ]