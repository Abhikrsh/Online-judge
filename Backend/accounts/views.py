from django.shortcuts import render
from accounts.serializer import UserLoginSerializer,UserRegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework import status
# Create your views here.

class UserLoginAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = UserLoginSerializer
    def post(self , request):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class UserLogoutAPIView(APIView):
    authentication_classes = []
    permission_classes=[]
    def post(self,request):
        try:
            refresh_token = request.data["refresh_token"]
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail":"Successfully logged out"})
        except Exception as e:
            return Response({"detail":"Invalid Token."} , status=400)


class UserRegistrationAPIView(generics.CreateAPIView):
    authentication_classes = []
    permission_classes = []
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    def post(self,request , *args , **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid() : 
            serializer.save()
            return Response(serializer.data , status=status.HTTP_201_CREATED)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)