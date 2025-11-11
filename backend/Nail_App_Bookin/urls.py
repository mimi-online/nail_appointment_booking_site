from django.urls import path
from Nail_App_Bookin import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('nails/', views.NailList.as_view(), name='nail-list'),
    path('nails/<int:pk>/', views.NailDetail.as_view(), name='nail-detail'),
    path('occupied-dates/',views.OccupiedDatesList.as_view(), name='occupieddates-list'),
    path('occupied-dates/<int:pk>/',views.OccupiedDatesDetail.as_view(), name='occupieddates-detail'),
    path('users/', views.UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('login/', views.Login.as_view(), name='login'),
    path('register/', views.Register.as_view(), name='register')
]

urlpatterns = format_suffix_patterns(urlpatterns)

