from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import generics
from .models import Nail, OccupiedDates, User
from .serializers import NailSerializer, OccupiedDatesSerializer, UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from .permissions import IsAdminorReadOnly
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'nails':reverse('nail-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
        'occupied-dates': reverse('occupieddates-list', request=request, format=format)
    })

class NailList(generics.ListCreateAPIView):
    queryset = Nail.objects.all()
    serializer_class = NailSerializer
    permission_classes = [IsAdminorReadOnly]

class NailDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Nail.objects.all()
    serializer_class = NailSerializer
    permission_classes = [IsAdminorReadOnly]

class OccupiedDatesList(generics.ListCreateAPIView):
    queryset = OccupiedDates.objects.all()
    serializer_class = OccupiedDatesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser and not user.is_staff:
            return OccupiedDates.objects.filter(user=user)
        return super().get_queryset()

class OccupiedDatesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = OccupiedDates.objects.all()
    serializer_class = OccupiedDatesSerializer
    permission_classes = [IsAdminorReadOnly]

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return User.objects.all()
        else:
            return User.objects.filter(id=user.id)

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer  

    def get_object(self):
        user = self.request.user
        obj = super().get_object()

        if obj == user or user.is_staff or user.is_superuser:
            return obj
        else:
            raise permissions.PermisionDenied('You do not have permission to access users details.')

class Register(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()

        token, created = Token.objects.get_or_create(user=user)

        self.response_data = {
            'user': {
                'id': user.id,
                'username': user.email,
                'email': user.email,
                'full_name': user.full_name
            },
            'token': token.key
        }

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response(self.response_data)
    
class Login(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Invalid username or password')
        
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'user': {
                'id': user.id,
                'username': user.email,
                'email': user.email,
                'full_name': user.full_name
            },
            'token': token.key
        })

class TestToken(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer