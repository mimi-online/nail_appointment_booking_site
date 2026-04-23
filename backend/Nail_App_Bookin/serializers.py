from rest_framework import serializers
from .models import Nail, NailImage, OccupiedDates, User
from django.contrib.auth.hashers import make_password

class NailImageSerializer(serializers.ModelSerializer):

    nail = serializers.HyperlinkedRelatedField(
        view_name = 'nail-detail',
        queryset = Nail.objects.all()
        )
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.image.url

    class Meta:
        model = NailImage
        fields = ['id', 'image', 'caption', 'nail']


class OccupiedDatesSerializer(serializers.HyperlinkedModelSerializer):

    nail = serializers.HyperlinkedRelatedField(
        view_name = 'nail-detail',
        queryset = Nail.objects.all()
    )

    user = serializers.HyperlinkedRelatedField(
        view_name = 'user-detail',
        queryset = User.objects.all()
    )

    class Meta:
        model = OccupiedDates
        fields = ["url", "id", "nail", "user", "date", "time"]


class NailSerializer(serializers.HyperlinkedModelSerializer):

    occupiedDates = OccupiedDatesSerializer(many=True,read_only=True)
    images = NailImageSerializer(many=True, read_only=True)
    class Meta:
        model = Nail
        fields = ['url', 'id', 'name', 'images', 'service_type', 'occupiedDates', 'price', 'design', 'description']
    


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'password', 'email', 'full_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'url': {'read_only': True}
        }

    def validate_password(self,value):
        return make_password(value)
    
    def create(self, validated_data):
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        
        user = User.objects.create(**validated_data)
        return user
