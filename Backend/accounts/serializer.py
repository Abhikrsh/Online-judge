from django.contrib.auth.models import User 
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User doesn't exist")

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return {
                "username": user.username,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            }
        else:
            raise serializers.ValidationError("Wrong password")



class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate(self, data):
        """
        Check if username and email are unique before creating the user.
        """
        username = data.get('username')
        email = data.get('email')

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username already exists.")

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already registered.")

        return data

    def create(self, validated_data):
        """
        Create a new user with validated data.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user