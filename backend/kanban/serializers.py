from rest_framework import serializers
from .models import *
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
import re as spliter
from django.contrib.auth.models import User


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetail
        fields = ['user', 'userName', 'avatar_url']

class UserDetailSerializer1(serializers.ModelSerializer):
    id = serializers.SerializerMethodField('get_id')
    lastName = serializers.SerializerMethodField('get_lastName')
    firstName = serializers.SerializerMethodField('get_firstName')
    email = serializers.SerializerMethodField('get_email')

    class Meta:
        model = UserDetail
        fields = ['id', 'userName', 'firstName', 'lastName', 'email', 'avatar_url']

    def get_id(self, obj):
        return obj.user.id

    def get_lastName(self, obj):
        return obj.user.last_name

    def get_firstName(self, obj):
        return obj.user.first_name

    def get_email(self, obj):
        return obj.user.email


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password':{'required': True, 'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'avatar_url', 'users', 'board']

class TeamSerializer1(serializers.ModelSerializer):
    users = UserDetailSerializer1(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'users']


class TaskSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField('get_alternate_name')

    class Meta:
        model = Task
        fields = ['id', 'title', 'content', 'column', 'user', 'topic']

    def get_alternate_name(self, obj):
        return obj.userAssigned.id

class TaskSerializerDEFAULT(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'content', 'column', 'userAssigned', 'topic']


class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ['id', 'title', 'limit', 'limitPerTeam', 'limitPerUser', 'taskOrder', 'board', 'tasks']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'board', 'title']

class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)
    teams = TeamSerializer1(many=True, read_only=True)
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'columnOrder', 'columns', 'teams', 'topics']


@receiver(post_save, sender=Task)
def taskBeforeSave(sender, instance, **kwargs):
    task = instance
    column = Column.objects.get(id=task.column_id)

    limitExceeded = False
    allTasksInColumn = Task.objects.all().filter(column_id=column.id)
    tasksThatUserInThisColumn = Task.objects.all().filter(column_id=column.id, userAssigned=task.userAssigned)
    if column.limit < len(allTasksInColumn) and column.limit > 0:
        limitExceeded = True
    elif column.limitPerUser < len(tasksThatUserInThisColumn) and column.limitPerUser >0:
        limitExceeded = True
    else:
        board = column.board
        teams = Team.objects.all().filter(board=board)
        dictTMP = {}
        for elem in allTasksInColumn:
            for team in teams:
                members = list(team.users.all())
                for member in members:
                    if member == elem.userAssigned:
                        if team.id in dictTMP.keys():
                            dictTMP[team.id] += 1
                        else:
                            dictTMP[team.id] = 1

        for key in dictTMP:
            if dictTMP[key] > column.limitPerTeam and column.limitPerTeam > 0:
                limitExceeded = True
                break

    if limitExceeded:
        task.delete()
    else:
        result = ''
        tmp = column.taskOrder

        startPoint = '['
        endPoint = ']'

        taskIsExist = False
        if tmp != '':
            x = spliter.split('[,"\[\]]', tmp)

            for elem in x:
                if elem != '':
                    if task.id == int(elem):
                        taskIsExist = True

            for elem in x:
                if elem != '':
                    result += '\"' + elem + '\"' + ','

            if taskIsExist == False:
                result += '\"' + str(task.id) + '\"'
            else:
                result = result[:-1]

            result = startPoint + result + endPoint
        else:
            result = startPoint + '\"' + str(task.id) + '\"' + endPoint

        column.taskOrder = result
        column.save()


@receiver(post_save, sender=Column)
def ColumnBeforeSave(sender, instance, **kwargs):
    column = instance
    board = Board.objects.get(id=column.board_id)
    tmp = board.columnOrder

    startPoint = '['
    endPoint = ']'
    result = ''
    if tmp != '':
        x = spliter.split('[,"\[\]]', tmp)
        columIsExist = False
        for elem in x:
            if elem == column.title:
                columIsExist = True
                break

        for elem in x:
            if elem != '':
                result += '\"' + elem + '\"' + ','

        if columIsExist == False:
            result += '\"' + column.title + '\"'
        else:
            result = result[:-1]

        result = startPoint + result + endPoint
    else:
        result = startPoint + '\"' + column.title + '\"' + endPoint

    board.columnOrder = result
    board.save()

@receiver(pre_save, sender=Column)
def ColumnUpdate(sender, instance, **kwargs):
    column = instance
    board = Board.objects.get(id=column.board_id)
    tmp = board.columnOrder

    startPoint = '['
    endPoint = ']'
    result = ''
    columnNameChanged = False

    if tmp != '':
        x = spliter.split('[,"\[\]]', tmp)

        try:
            if board.columns.get(id=column.id) is not None:
                col = board.columns.get(id=column.id)
                if col.title != column.title:
                    for elem in x:
                        if elem != '':
                            if elem == col.title:
                                result += '\"' + column.title + '\"' + ','
                            else:
                                result += '\"' + elem + '\"' + ','

                    result = startPoint + result[:-1] + endPoint

                    board.columnOrder = result
                    board.save()
        except:
            columnNameChanged = False