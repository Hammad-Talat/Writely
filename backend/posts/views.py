from rest_framework import viewsets
from .models import BlogPost, Like , Comment
from .serializers import LikeSerializer , BlogPostSerializer ,CommentSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('-created_at')
    serializer_class = LikeSerializer