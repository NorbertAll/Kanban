from django.urls import include, path
from rest_framework import routers
from kanban import views
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register(r'task', views.TasksViewSet)
router.register(r'column', views.ColumnsViewSet)
router.register(r'board', views.BoardsViewSet)
router.register(r'user', views.UserViewSet)
router.register(r'user-detail', views.UserDetailViewSet)
router.register(r'team', views.TeamViewSet)
router.register(r'topic', views.TopicDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('task-delete/<str:pk>/', views.taskDelete, name="task-delete"),
    path('column-delete/<str:pk>/', views.columnDelete, name="column-delete"),
    path('topic-delete/<str:pk>/', views.topicDelete, name="topic-delete"),#topic delete
    path('tasks-ordering-update-two-columns/', views.columnOrderingUpdateTwoColumns, name="tasks-ordering-update-two-columns"),
    path('tasks-ordering-update-one-column/', views.columnOrderingUpdateOneColumn, name="tasks-ordering-update-one-column"),
    path('column-ordering-update/', views.boardColumnsOrdering, name="column-ordering-update"),
    path('api-token-auth/', obtain_auth_token),
    path('add-user/', views.addUser, name="add-user"),
    path('remove-user/<str:pk>/', views.removeUser, name="remove-user"),
    path('update-assigned-users-for-team/', views.assignUsersForTeam, name="update-assigned-users-for-team"),
    path('add-team/', views.addTeam, name="add-team"),
    path('remove-team/<str:pk>/', views.removeTeam, name="remove-team"),
    path('topic-delete/<str:pk>/', views.topicDelete, name="topic-delete"),
    path('return-boards/', views.returnBoards, name="return-boards"),
    path('users-and-teams/', views.returnUsers_and_Teams, name="users-and-teams"),
]
