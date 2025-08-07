from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, CommentViewSet, LikeViewSet

router = DefaultRouter()
router.register('content', BlogPostViewSet, basename='posts')
router.register('comments', CommentViewSet, basename='comments')
router.register('likes', LikeViewSet, basename='likes')

urlpatterns = [
    path('', include(router.urls)),
]
