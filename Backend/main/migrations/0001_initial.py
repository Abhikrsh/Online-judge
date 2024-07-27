# Generated by Django 5.0.6 on 2024-07-23 21:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Problem",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
                (
                    "difficulty",
                    models.CharField(
                        choices=[
                            ("easy", "Easy"),
                            ("medium", "Medium"),
                            ("hard", "Hard"),
                        ],
                        max_length=50,
                    ),
                ),
                ("categories", models.JSONField()),
                ("time_limit", models.IntegerField(default=2)),
            ],
        ),
        migrations.CreateModel(
            name="Submission",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("status", models.CharField(max_length=50)),
                ("runtime", models.CharField(max_length=50)),
                ("language", models.CharField(max_length=50)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                (
                    "problem",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.problem"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="TestCase",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("input", models.TextField()),
                ("expected_output", models.TextField()),
                (
                    "problem",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.problem"
                    ),
                ),
            ],
        ),
    ]