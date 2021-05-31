from rest_framework import viewsets
from .serializers import *
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
import re as spliter
import os


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Delete_task': '/task-delete/<str:pk>/',
        'Delete_col': '/column-delete/<str:pk>/',
        'Delete_topic': '/topic-delete/<str:pk>/',
    }

    return Response(api_urls)


class TasksViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializerDEFAULT
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class ColumnsViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class BoardsViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class UserDetailViewSet(viewsets.ModelViewSet):
    queryset = UserDetail.objects.all()
    serializer_class = UserDetailSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)


class TopicDetailViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)

@api_view(['GET'])
@authentication_classes([TokenAuthentication, ])
def returnBoards(request):
    token = Token.objects.get(key=request.headers.get('Authorization').split()[-1])
    user = User.objects.get(id=token.user_id)
    teams = Team.objects.all().filter(users__in=[user.id])
    boardResponse = BoardSerializer(Board.objects.all().filter(teams__in=teams), many=True).data
    return Response(boardResponse)


@api_view(['GET'])
@authentication_classes([TokenAuthentication, ])
def returnUsers_and_Teams(request):
    users = UserDetailSerializer1(UserDetail.objects.all(), many=True).data
    teams = TeamSerializer1(Team.objects.all(), many=True).data
    result = [{'users': users}] + [{'teams': teams}]

    return Response(result)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def taskDelete(request, pk):
    try:
        task_delete(pk)
    except:
        return Response('Task not successfully  delete!')

    return Response('Task successfully  delete!')


def task_delete(ID):
    task = Task.objects.get(id=ID)
    column = Column.objects.get(id=task.column.id)

    tasksOrders = spliter.split('[,"\[\]]', column.taskOrder)
    result = ''
    startPoint = '['
    endPoint = ']'

    while '' in tasksOrders:
        tasksOrders.remove('')

    for elem in tasksOrders:
        if int(elem) != task.id:
            result += '\"' + elem + '\"' + ','

    result = startPoint + result[:-1] + endPoint

    column.taskOrder = result
    column.save()
    task.delete()


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def columnDelete(request, pk):
    column = Column.objects.get(id=pk)
    board = Board.objects.get(id=column.board_id)

    columnsOrders = spliter.split('[,"\[\]]', board.columnOrder)

    result = ''
    startPoint = '['
    endPoint = ']'

    while '' in columnsOrders:
        columnsOrders.remove('')

    for elem in columnsOrders:
        if elem != column.title:
            result += '\"' + elem + '\"' + ','

    result = startPoint + result[:-1] + endPoint

    board.columnOrder = result
    board.save()
    column.delete()

    return Response('Column successfully  delete!')

#blok kodu ng
#
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def topicDelete(request, pk):
    topic = Topic.objects.get(id=pk)

    board = Board.objects.get(id=topic.board_id)

    topicsOrders = spliter.split('[,"\[\]]', board.topicOrder)

    result = ''
    startPoint = '['
    endPoint = ']'

    while '' in topicsOrders:
        topicsOrders.remove('')

    for elem in topicsOrders:
        if elem != topic.title:
            result += '\"' + elem + '\"' + ','

    result = startPoint + result[:-1] + endPoint

    board.topicOrder = result
    board.save()

    topic.delete()

    return Response('Topic succsesfully delete!')

# koniec bloku kodu ng
@api_view(['POST'])
@authentication_classes([TokenAuthentication, ])
def columnOrderingUpdateTwoColumns(request):
    destination_column_id = request.POST.get('destination_column_id')
    destination_column_taskOrder = returnWithOutSpace(str(request.POST.get('destination_column_taskOrder')))
    new_destination_column_taskOrder = returnWithOutSpace(str(request.POST.get('new_destination_column_taskOrder')))
    new_source_column_taskorder = returnWithOutSpace(str(request.POST.get('new_source_column_taskorder')))
    source_column_id = request.POST.get('source_column_id')
    source_column_taskorder = returnWithOutSpace(str(request.POST.get('source_column_taskorder')))
    task_id = request.POST.get('task_id')
    new_topic = request.POST.get('new_topic')

    columnOLD = Column.objects.get(id=source_column_id)
    columnNEW = Column.objects.get(id=destination_column_id)
    task = Task.objects.get(id=task_id)

    if str(columnOLD.taskOrder) == source_column_taskorder and columnNEW.taskOrder == destination_column_taskOrder:
        tasks = Task.objects.all().filter(userAssigned__isnull=False)
        if task.column.id == int(source_column_id):
            # Check limit per old column
            if ReturnQuantityOfTasks(new_source_column_taskorder) > columnOLD.limit > 0:
                return Response('Columns ordering update not succsesful! Limit on column ' + str(
                    columnOLD.id) + ' have the max quantity of tasks!!')
            else:
                # Check limit per user in old column
                CheckTheLimit_User(new_source_column_taskorder, columnOLD, tasks)

                # Check limit per team in old column
                CheckTheLimit_Team(new_source_column_taskorder, columnOLD, tasks)

                columnOLD.taskOrder = new_source_column_taskorder

            # Check limit per new column
            if ReturnQuantityOfTasks(new_destination_column_taskOrder) > columnNEW.limit > 0:
                return Response('Columns ordering update not succsesful! Limit on column ' + str(
                    columnNEW.id) + ' have the max quantity of tasks!!')
            else:
                # Check limit per user in new column
                CheckTheLimit_User(new_destination_column_taskOrder, columnNEW, tasks)

                # Check limit per team in new column
                CheckTheLimit_Team(new_destination_column_taskOrder, columnNEW, tasks)

                columnNEW.taskOrder = new_destination_column_taskOrder

            task.column = columnNEW

            topic = Topic.objects.get(id=new_topic)
            task.topic = topic
            task.save()
            columnOLD.save()
            columnNEW.save()
            return Response('Columns ordering update successfully !')
    else:
        return Response('Columns ordering update not succsesful!')


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def topicDelete(request, pk):
    try:
        topic = Topic.objects.get(id=pk)
    except:
        return Response('Topic not successfully delete!')

    tasks = Task.objects.all().filter(topic=topic)
    quantityOfTasks = len(tasks)
    tmp = 0
    for task in tasks:
        task_delete(task.id)
        tmp += 1

    if tmp == quantityOfTasks:
        topic.delete()
        if tmp == 0:
            return Response('Topic successfully delete!')
        return Response('Topic and all tasks successfully deleted!')
    else:
        return Response('Topic successfully delete!')


@api_view(['POST'])
@authentication_classes([TokenAuthentication, ])
def columnOrderingUpdateOneColumn(request):
    column_id = request.POST.get('column_id')
    current_taskOrder = returnWithOutSpace(str(request.POST.get('current_taskOrder')))
    new_taskOrder = returnWithOutSpace(str(request.POST.get('new_taskOrder')))

    column = Column.objects.get(id=column_id)

    if column.taskOrder == current_taskOrder:
        column.taskOrder = new_taskOrder
        column.save()
        return Response('Columns ordering update successfully !')
    else:
        return Response('Columns ordering update not successful!!')


@api_view(['POST'])
@authentication_classes([TokenAuthentication, ])
def boardColumnsOrdering(request):
    board_id = request.POST.get('board_id')
    current_columnOrder = returnWithOutSpace(str(request.POST.get('current_columnOrder')))
    new_columnOrder = returnWithOutSpace(str(request.POST.get('new_columnOrder')))

    board = Board.objects.get(id=board_id)

    if board.columnOrder == current_columnOrder:
        board.columnOrder = new_columnOrder
        board.save()
        return Response('Board ordering update successfully !')
    else:
        return Response('It isn\'t necessary to update board ordering. The currently ordering team is the same!')
##################################
#blok kodu ng
#@api_view(['POST'])
#@authentication_classes([TokenAuthentication, ])
#def boardTopicsOrdering(request):
#    board_id = request.POST.get('board_id')
#    current_topicOrder = returnWithOutSpace(str(request.POST.get('current_topicOrder')))
#    new_topicOrder = returnWithOutSpace(str(request.POST.get('new_topicOrder')))
#
#    board = Board.objects.get(id=board_id)
#
#    if board.topicOrder == current_topicOrder:
#        board.topicOrder = new_topicOrder
#        board.save()
#        return Response('Board ordering update succsesfully!')
#    else:
#        return Response('It isn\'t necessary to update board ordering. The currently ordering team is the same!')
#koniec bloku ng

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def addUser(request):
    userName = request.POST.get('username')
    password = request.POST.get('password')

    try:
        print('file: ' + str(request.FILES['avatar']))
    except:
        print('text: ' + str(request.POST.get('avatar')))

    try:
        firstName = request.POST.get('firstname')
    except:
        firstName = ''
    try:
        lastName = request.POST.get('lastname')
    except:
        lastName = ''
    try:
        email = request.POST.get('email')
    except:
        email = ''

    for elem in User.objects.all():
        if elem.username == userName:
            return Response('User add not successful!! User with that name already exists!!!')

    newUser = User.objects.create_user(username=userName, password=password, email=email, first_name=firstName, last_name=lastName)

    errorMessage = ''
    try:
        userDetail = UserDetail.objects.get(user_id=newUser.id)
        userDetail.avatar_url = request.FILES['avatar']
        userDetail.save()
    except:
        errorMessage = ' User\'s avatar not loaded.'

    return Response('User add successful!' + errorMessage)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def removeUser(request, pk):
    errorMessage = False
    try:
        user = User.objects.get(id=pk)
        userDetail = UserDetail.objects.get(user_id=pk)

        if str(userDetail.avatar_url) != '':
            try:
                os.remove(userDetail.avatar_url.path)
            except:
                errorMessage = True

        tasks = Task.objects.all().filter(userAssigned__user=user)
        for task in tasks:
            task_delete(task.id)

        teams = Team.objects.filter(users__team__in=[user.id]).distinct()
        for team in teams:
            team.users.remove(user.id)

        userDetail.delete()
        user.delete()
        if errorMessage:
            return Response('User remove successful, but the user\'s avatar couldn\'t  be deleted.')
        else:
            return Response('User remove successful!')
    except:
        return Response('User remove not successful!! User with id ' + str(pk) + ' is not exist!!!!')


@api_view(['POST'])
@authentication_classes([TokenAuthentication, ])
def addTeam(request):
    name = request.POST.get('name')
    board = request.POST.get('board')
    if request.POST.get('users') != '':
        users = returnListIDs(request.POST.get('users'))
    else:
        users = '[]'

    try:
        board = Board.objects.get(id=board)
    except:
        return Response('Team add not successful, the indicated array does not exist!!')

    teamUsers = []
    userNotExists = ''
    errorMessage = ''
    if users != '[]':
        for elem in users:
            try:
                user = UserDetail.objects.get(id=elem)
                teamUsers.append(user)
            except:
                if userNotExists == '':
                    userNotExists += elem
                else:
                    userNotExists += ', ' + elem

        if userNotExists != '':
            if len(teamUsers) == 0:
                if len(userNotExists.split()) == 1:
                    return Response(
                        'Add to team assigned users not successfully! User with id ' + userNotExists + ' is not exist!!')
                else:
                    return Response(
                        'Add to team assigned users not successfully! Users with ids ' + userNotExists + ' aren\'t exist!!')
            else:
                try:
                    Team.objects.create(name=name, users=teamUsers, avatar_url=request.FILES['avatar'], board=board)
                except:
                    Team.objects.create(name=name, users=teamUsers, board=board)
                    errorMessage = ' Team\'s avatar not loaded.'

                if len(userNotExists.split()) == 1:
                    return Response(
                        'Add to team assigned users successfully with out user with id ' + userNotExists + '. That user is not exist!!' + errorMessage)
                else:
                    return Response(
                        'Add to team assigned users successfully with out users with ids ' + userNotExists + '. That users aren\'t exist!!' + errorMessage)

    try:
        Team.objects.create(name=name, avatar_url=request.FILES['avatar'], board=board)
    except:
        Team.objects.create(name=name, board=board)
        errorMessage = ' Team avatar\'s not loaded.'

    return Response('Team add successful!' + errorMessage)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication, ])
def removeTeam(request, pk):
    try:
        team = Team.objects.get(id=pk)

        errorMessage = False
        if str(team.avatar_url) != '':
            try:
                os.remove(team.avatar_url.path)
            except:
                errorMessage = True

        team.delete()

        if errorMessage:
            return Response('Team remove successful, but the team\'s avatar couldn\'t  be deleted.')
        else:
            return Response('Team remove successful!')
    except:
        return Response('Team remove not successful!! Team with id ' + str(pk) + ' is not exist!!!!')


@api_view(['POST'])
@authentication_classes([TokenAuthentication, ])
def assignUsersForTeam(request):
    team_id = request.POST.get('team_id')
    current_assignedUsers = returnListIDs(request.POST.get('current_assignedUsers'))
    if request.POST.get('new_assignedUsers') != '':
        new_assignedUsers = returnListIDs(request.POST.get('new_assignedUsers'))
    else:
        new_assignedUsers = '[]'

    team = Team.objects.get(id=team_id)

    teamUsers = []
    for elem in team.users.all():
        teamUsers.append(str(elem.user.id))

    if current_assignedUsers != teamUsers:
        return Response('Team assigned users update not successfully!')

    if current_assignedUsers == new_assignedUsers:
        return Response(
            'It is not necessary to update users assigned to team. The currently assigned users is the same.')

    teamUsers = []
    userNotExists = ''
    if new_assignedUsers != '[]':
        for elem in new_assignedUsers:
            try:
                user = UserDetail.objects.get(id=elem)
                teamUsers.append(user)
            except:
                if userNotExists == '':
                    userNotExists += elem
                else:
                    userNotExists += ', ' + elem

        if userNotExists != '':
            if len(teamUsers) == 0:
                if len(userNotExists.split()) == 1:
                    return Response(
                        'Team assigned users update not successfully! User with id ' + userNotExists + ' is not exist!!')
                else:
                    return Response(
                        'Team assigned users update not successfully! Users with ids ' + userNotExists + ' aren\'t exist!!')
            else:
                team.users.set(teamUsers)
                team.save()

                if len(userNotExists.split()) == 1:
                    return Response(
                        'Team assigned users update successfully with out user with id ' + userNotExists + '. That user is not exist!!')
                else:
                    return Response(
                        'Team assigned users update successfully with out users with ids ' + userNotExists + '. That users aren\'t exist!!')

    team.users.set(teamUsers)
    team.save()
    return Response('Team assigned users update successfully!')


def returnWithOutSpace(text):
    result = text.replace("'", '"')
    result = result.replace(", ", ",")
    return result


def returnListIDs(text):
    result = returnWithOutSpace(text)
    tmp = spliter.split('[,\[\]]|"', result)
    result = []
    for elem in tmp:
        if elem != '' and elem != ' ':
            result.append(elem)
    return result


def CheckTheLimit_User(taskOrder, column, all_tasks):
    dictTMP = {}
    for elem in all_tasks:
        for newElm in returnListIDs(taskOrder):
            if int(newElm) == elem.id:
                if elem.userAssigned.id in dictTMP.keys():
                    dictTMP[elem.userAssigned.id] += 1
                else:
                    dictTMP[elem.userAssigned.id] = 1

    for key in dictTMP:
        if dictTMP[key] > column.limitPerUser > 0:
            return Response('Columns ordering update not succsesful! Limit per user on column ' + str(
                column.id) + ' have the max quantity of tasks!!')


def CheckTheLimit_Team(taskOrder, column, all_tasks):
    result = {}
    for elem in all_tasks:
        for newElm in returnListIDs(taskOrder):
            teams = Team.objects.all().filter(board=column.board)

            for team in teams:
                members = list(team.users.all())
                for member in members:
                    if int(newElm) == elem.id and member == elem.userAssigned:
                        if team.id in result.keys():
                            result[team.id] += 1
                        else:
                            result[team.id] = 1

    for key in result:
        if result[key] > column.limitPerUser > 0:
            return Response('Columns ordering update not succsesful! Limit per user on column ' + str(
                column.id) + ' have the max quantity of tasks!!')


def ReturnQuantityOfTasks(taskOrder):
    return len(returnListIDs(taskOrder))