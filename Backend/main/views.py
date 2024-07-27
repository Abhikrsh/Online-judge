from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Problem, TestCase, Submission
from .serializer import ProblemSerializer , RunCodeSerializer , SubmissionSerializer , LeaderboardSerializer

from django.shortcuts import get_object_or_404
import os
import subprocess
import platform
import time
import json
import uuid

class ProblemListView(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated]

class ProblemDetailView(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated]
    

class SubmissionListView(generics.ListAPIView):
    queryset = Submission.objects.all().select_related('user', 'problem')
    serializer_class = SubmissionSerializer

class RunCodeView(APIView):
    def post(self, request):
        serializer = RunCodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            language = serializer.validated_data['language']
            input_data = serializer.validated_data['input']

            if not code or not language:
                return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

            # Define temp file paths with appropriate extensions
            if language == 'py':
                code_file = 'codef.py'
                command = f'py {code_file}'
            elif language == 'cpp':
                code_file = 'codef.cpp'
                if platform.system() == "Windows":
                    command = f'g++ {code_file} -o codef.exe && codef.exe'
                else:
                    command = f'g++ {code_file} -o codef && ./codef'
            elif language == 'java':
                code_file = 'codef.java'
                command = f'javac {code_file} && java codef'
            else:
                return Response({'error': 'Unsupported language'}, status=status.HTTP_400_BAD_REQUEST)

            input_file = 'codef_input.txt'
            output_file = 'codef_output.txt'

            # Clean up any existing temp files
            for temp_file in [code_file, input_file, output_file, 'codef', 'codef.exe', 'codef.class']:
                if os.path.exists(temp_file):
                    os.remove(temp_file)

            # Write the code to a file
            with open(code_file, 'w') as f:
                f.write(code)

            # Write the input to a file
            with open(input_file, 'w') as f:
                f.write(input_data)

            # Execute the command
            process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            stdout, stderr = process.communicate(input=input_data.encode())
            runtime = process.returncode

            # Check for errors and return appropriate response
            if process.returncode != 0:
                verdict = 'Error'
                output = stderr.decode('utf-8')
            else:
                verdict = 'Success'
                output = stdout.decode('utf-8')

            # Clean up temporary files
            for temp_file in [code_file, input_file, output_file, 'codef', 'codef.exe', 'codef.class']:
                if os.path.exists(temp_file):
                    os.remove(temp_file)

            return Response({'output': output, 'verdict': verdict}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class SubmitCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        problem_id = request.data.get('problem_id')
        code = request.data.get('code')
        language = request.data.get('language')

        if language not in ["java", "cpp", "py"]:
            return Response({"error": "Invalid language"}, status=status.HTTP_400_BAD_REQUEST)

        problem = get_object_or_404(Problem, id=problem_id)
        test_cases = TestCase.objects.filter(problem=problem)

        folder_name = "InputCodes"
        curr_dir = os.getcwd()
        input_folder_path = os.path.join(curr_dir, folder_name)
        os.makedirs(input_folder_path, exist_ok=True)

        unique_filename = f"{uuid.uuid4().hex}.{language.lower()}"
        file_path = os.path.join(input_folder_path, unique_filename)

        with open(file_path, "w") as f:
            f.write(code)

        verdict = "Accepted"
        total_runtime = 0

        for test_case in test_cases:
            input_data = test_case.input
            expected_output = test_case.expected_output
            try:
                start_time = time.time()
                generated_output = self.run_code(file_path, language, input_data, input_folder_path, unique_filename)
                end_time = time.time()
                runtime = end_time - start_time
                total_runtime += runtime

                if generated_output.strip() != expected_output.strip():
                    verdict = "Wrong Answer"
                    break
            except Exception as e:
                verdict = f"Error: {str(e)}"
                break

        # self.cleanup_files(file_path, language, input_folder_path, unique_filename)

        Submission.objects.create(
            user=user,
            problem=problem,
            status=verdict,
            runtime=total_runtime,
            language=language
        )

        return Response({"verdict": verdict, "runtime": total_runtime}, status=status.HTTP_200_OK)

    def run_code(self, file_path, language, input_data, input_folder_path, unique_filename):
        if language == "java":
            result = subprocess.run(["javac", file_path], capture_output=True, text=True)
            if result.returncode == 0:
                return self.execute_java(input_data, input_folder_path, unique_filename)
        elif language == "cpp":
            result = subprocess.run(["g++", file_path, "-o", os.path.join(input_folder_path, unique_filename.split('.')[0])], capture_output=True, text=True)
            if result.returncode == 0:
                return self.execute_cpp(input_data, input_folder_path, unique_filename.split('.')[0])
            else:
                raise Exception(f"G++ Compilation Error: {result.stderr}")
        elif language == "py":
            return self.execute_python(file_path, input_data)

        raise Exception("Compilation Error")

    def execute_java(self, input_data, input_folder_path, unique_filename):
        input_file = os.path.join(input_folder_path, "input.txt")
        with open(input_file, "w") as f:
            f.write(input_data)
        output_file = os.path.join(input_folder_path, f"{uuid.uuid4().hex}.txt")
        with open(output_file, "w") as f:
            subprocess.run(
                ["java", "-cp", input_folder_path, unique_filename.split('.')[0]],
                stdin=open(input_file, "r"),
                stdout=f
            )
        with open(output_file, "r") as f:
            return f.read()

    def execute_cpp(self, input_data, input_folder_path, executable_filename):
        input_file = os.path.join(input_folder_path, "input.txt")
        with open(input_file, "w") as f:
            f.write(input_data)
        output_file = os.path.join(input_folder_path, f"{uuid.uuid4().hex}.txt")
        with open(output_file, "w") as f:
            subprocess.run(
                [os.path.join(input_folder_path, executable_filename)],
                stdin=open(input_file, "r"),
                stdout=f
            )
        with open(output_file, "r") as f:
            return f.read()

    def execute_python(self, file_path, input_data):
        process = subprocess.Popen(
            ["python3", file_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate(input=input_data.encode())
        if stderr:
            raise Exception(stderr.decode())
        return stdout.decode()

    def cleanup_files(self, file_path, language, input_folder_path, unique_filename):
        os.remove(file_path)
        if language == "java":
            class_file = os.path.join(input_folder_path, f"{unique_filename.split('.')[0]}.class")
            if os.path.exists(class_file):
                os.remove(class_file)
        elif language == "cpp":
            executable_file = os.path.join(input_folder_path, unique_filename)
            if os.path.exists(executable_file):
                os.remove(executable_file)

from django.db.models import Count

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leaderboard_data = (Submission.objects
                            .filter(status="Accepted")
                            .values('user')
                            .annotate(accepted_problems_count=Count('problem', distinct=True))
                            .order_by('-accepted_problems_count'))

        users = User.objects.filter(id__in=[item['user'] for item in leaderboard_data])
        user_data = {user.id: user.username for user in users}

        leaderboard = [
            {'username': user_data[item['user']], 'accepted_problems_count': item['accepted_problems_count']}
            for item in leaderboard_data
        ]

        return Response(leaderboard)
    

class ProfileView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            # Get the list of unique accepted submissions
            solved_problems = Submission.objects.filter(user=user, status='Accepted').values_list('problem__title', flat=True).distinct()
            
            # Calculate the number of unique accepted submissions
            num_unique_solved_problems = len(solved_problems)
            
            response_data = {
                'username': user.username,
                'email': user.email,
                'problemssolved': list(solved_problems),
                'num_unique_solved_problems': num_unique_solved_problems,  # Add count here
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
