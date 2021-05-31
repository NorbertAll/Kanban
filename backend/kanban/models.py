from django.db import models
from django.db.models import ImageField
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class Board(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=True)
    columnOrder = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Column(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False, blank=True)
    limit = models.IntegerField(default=0)
    limitPerTeam = models.IntegerField(default=0)
    limitPerUser = models.IntegerField(default=0)
    board = models.ForeignKey(Board, related_name='columns', on_delete=models.CASCADE)
    taskOrder = models.TextField(null=True, blank=True)

    def __str__(self):
        return '(' + self.board.name + ') ' + self.title


class UserDetail(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name='user', on_delete=models.CASCADE)
    userName = models.CharField(max_length=255, null=False, blank=True)
    avatar_url = ImageField(upload_to='kanban/user-avatars/', blank=True, null=True)

    def __str__(self):
        return self.user.username


class Team(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=True)
    users = models.ManyToManyField(UserDetail, blank=True)
    avatar_url = ImageField(upload_to='kanban/team-avatars/', blank=True, null=True)
    board = models.ForeignKey(Board, related_name='teams', on_delete=models.CASCADE)

    def __str__(self):
        quantityOfUser = len(self.users.all())
        return self.name + ' - quantity assigned users is ' + str(quantityOfUser)


class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    board = models.ForeignKey(Board, related_name='topics', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, null=False, blank=True)

    def __str__(self):
        return self.title + ' (' + str(self.board.id) + ')'


class Task(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False, blank=True)
    content = models.TextField(blank=True)
    column = models.ForeignKey(Column, related_name='tasks', on_delete=models.CASCADE)
    userAssigned = models.ForeignKey(UserDetail, related_name='userAssigned', on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, related_name='topic', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        UserDetail.objects.create(user=instance, userName=instance.username)