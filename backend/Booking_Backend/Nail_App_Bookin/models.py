from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Nail(models.Model):
    NAIL_TYPES = [
        ('Biab', 'Biab'),
        ('Biab Refill', 'Biab Refill'),
        ('Gel Polish', 'Gel Polish'),
        ('Gel Polish Refill', 'Gel Polish Refill')
    ]

    DESIGN_TYPE = [
        ('Plain', 'Plain'),
        ('Tier 1 Design', 'Tier 1 Design'),
        ('Tier 2 Design', 'Tier 2 Design'),
        ('Tier 3 Design', 'Tier 3 Design')
    ]
    name = models.CharField(max_length=50)
    service_type = models.CharField(max_length=100, choices=NAIL_TYPES)
    design = models.CharField(max_length=100, choices=DESIGN_TYPE)
    price = models.IntegerField(default=30)
    description = models.TextField(max_length=200)

class NailImage(models.Model):
    image = models.ImageField(upload_to='nail_images/')
    caption = models.CharField(max_length=255, blank=True,null=True)
    nail = models.ForeignKey(Nail, related_name='images', on_delete=models.CASCADE)

    def __str__(self):
        return f'Image for {self.nail.name} - {self.caption or "No caption."}'
    
class OccupiedDates(models.Model):
    nail = models.ForeignKey(Nail, on_delete=models.CASCADE, related_name='occupiedDates')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='booked_dates')
    date = models.DateField()

    def __str__(self):
        return f'{self.date} - {self.nail.name} booked by {self.user.username}'

class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, default="")
