from rest_framework import viewsets , filters
from .models import BlogPost, Like , Comment
from .serializers import LikeSerializer , BlogPostSerializer ,CommentSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'tags']
    ordering_fields = ['created_at', 'title']
    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return BlogPost.objects.filter(author__id=user_id).order_by('-created_at')
        return BlogPost.objects.all().order_by('-created_at')
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return Comment.objects.filter(user__id=user_id).order_by('-created_at')
        return Comment.objects.all().order_by('-created_at')
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('-created_at')
    serializer_class = LikeSerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return Like.objects.filter(user__id=user_id).order_by('-created_at')
        return Like.objects.all().order_by('-created_at')

   
