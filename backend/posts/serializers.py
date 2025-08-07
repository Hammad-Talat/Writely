from rest_framework import serializers
from .models import BlogPost
from .models import Comment
from .models import Like



class BlogPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'author', 'author_username', 'created_at', 'updated_at', 'is_published', 'tags']
        read_only_fields = ['id', 'created_at', 'updated_at', 'author_username']

class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_username', 'blog_post', 'content', 'created_at']
        read_only_fields = ['id', 'created_at', 'user_username']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'blog_post', 'created_at']
        read_only_fields = ['id', 'created_at']

