
from rest_framework import generics , viewsets
from .models import User
from .serializers import UserRegistrationSerializer , UserSerializer
from rest_framework.permissions import AllowAny ,IsAuthenticatedOrReadOnly

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
