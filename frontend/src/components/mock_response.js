const mock_response = {
    "id": 1,
    "name": "first board",
    "columnOrder": "[\"c0\",\"c1\",\"c2\",\"Done\",\"c4\"]",
    "columns": [
        {
            "id": 2,
            "title": "c0",
            "limit": 9,
            "limitPerUser": 2,
            "limitPerTeam": 6,
            "taskOrder": "[\"1\",\"2\",\"3\",\"4\",\"5\"]",
            "board": 1,
            "tasks": [
                {
                    "id": 1,
                    "title": "task1",
                    "content": "task content 1",
                    "column": 2,
                    "topic": 1,
                    "team":1,
                    "user":1
                },
                {
                    "id": 2,
                    "title": "task2",
                    "content": "task content 2",
                    "column": 2,
                    "topic": 1,
                    "team":1,
                    "user":1
                },
                {
                    "id": 3,
                    "title": "task3",
                    "content": "task content 3",
                    "column": 2,
                    "topic": 2,
                    "team":1,
                    "user":2
                },
                {
                    "id": 4,
                    "title": "task4",
                    "content": "task content 4",
                    "column": 2,
                    "topic": 2,
                    "team":1,
                    "user":2
                },
                {
                    "id": 5,
                    "title": "task5",
                    "content": "task content 5",
                    "column": 2,
                    "topic": 2,
                    "team":1,
                    "user":3
                }
            ]
        },
        {
            "id": 3,
            "title": "c1",
            "limit": 4,
            "limitPerUser": 2,
            "limitPerTeam": 7,
            "taskOrder": "[\"6\",\"7\",\"8\",\"9\"]",
            "board": 1,
            "tasks": [
                {
                    "id": 6,
                    "title": "task6",
                    "content": "task content 6",
                    "column": 3,
                    "topic": 1,
                    "team":1,
                    "user":1
                },
                {
                    "id": 7,
                    "title": "task7",
                    "content": "task content 7",
                    "column": 3,
                    "topic": 1,
                    "team":1,
                    "user":1
                },
                {
                    "id": 8,
                    "title": "task8",
                    "content": "task content 8",
                    "column": 3,
                    "topic": 3,
                    "team":1,
                    "user":2
                },
                {
                    "id": 9,
                    "title": "task9",
                    "content": "task content 9",
                    "column": 3,
                    "topic": 3,
                    "team":1,
                    "user":2
                }
            ]
        },
        {
            "id": 4,
            "title": "c2",
            "limit": 4,
            "limitPerUser": 3,
            "limitPerTeam": 7,
            "taskOrder": "[]",
            "board": 1,
            "tasks": []
        },
        {
            "id": 5,
            "title": "Done",
            "limit": 0,
            "limitPerUser": 0,
            "limitPerTeam": 0,
            "taskOrder": "[\"10\",\"11\",\"12\",\"13\"]",
            "board": 1,
            "tasks": [
                {
                    "id": 10,
                    "title": "task10",
                    "content": "task content 10",
                    "column": 5,
                    "topic": 1,
                    "team":1,
                    "user":3
                },
                {
                    "id": 11,
                    "title": "task11",
                    "content": "task content 11",
                    "column": 5,
                    "topic": 2,
                    "team":1,
                    "user":3
                },
                {
                    "id": 12,
                    "title": "task12",
                    "content": "task content 12",
                    "column": 5,
                    "topic": 2,
                    "team":1,
                    "user":3
                },
                {
                    "id": 13,
                    "title": "task13",
                    "content": "task content 13",
                    "column": 5,
                    "topic": 3,
                    "team":1,
                    "user":4
                }
            ]
        },
        {
            "id": 6,
            "title": "c4",
            "limit": 4,
            "limitPerUser": 3,
            "limitPerTeam": 7,
            "taskOrder": "[\"14\",\"15\",\"16\",\"17\",\"18\",\"19\",\"20\"]",
            "board": 1,
            "tasks": [
                {
                    "id": 14,
                    "title": "task14",
                    "content": "task content 14",
                    "column": 6,
                    "topic": 1,
                    "team":1,
                    "user":1
                },
                {
                    "id": 15,
                    "title": "task15",
                    "content": "task content 15",
                    "column": 6,
                    "topic": 1,
                    "team":1,
                    "user":2
                },
                {
                    "id": 16,
                    "title": "task16",
                    "content": "task content 16",
                    "column": 6,
                    "topic": 2,
                    "team":1,
                    "user":3
                },
                {
                    "id": 17,
                    "title": "task17",
                    "content": "task content 17",
                    "column": 6,
                    "topic": 2,
                    "team":1,
                    "user":4
                },
                {
                    "id": 18,
                    "title": "task18",
                    "content": "task content 18",
                    "column": 6,
                    "topic": 3,
                    "team":1,
                    "user":4
                },
                {
                    "id": 19,
                    "title": "task19",
                    "content": "task content 19",
                    "column": 6,
                    "topic": 3,
                    "team":1,
                    "user":3
                },
                {
                    "id": 20,
                    "title": "task20",
                    "content": "task content 20",
                    "column": 6,
                    "topic": 3,
                    "team":1,
                    "user":2
                }
            ]
        }
    ],
    "topics":[
        {
            "id":1,
            "board": 1,
            "title":"topic_1"
        },
        {
            "id":2,
            "board": 1,
            "title":"topic_2"
        },
        {
            "id":3,
            "board": 1,
            "title":"topic_3"
        },
    ],
    "teams":[
        {
            "id": 1,
            "name": "coronateam",
            "users":[
                {
                "id": 1,
                "username": "user_1",
                "avatar_url": "/icons/usersAvatars/SAN_ESCOBAR.png"
                },
                {
                "id": 2,
                "username": "user_2",
                "avatar_url": "/icons/usersAvatars/PL.png"
                },
                {
                "id": 3,
                "username": "user_3",
                "avatar_url": "/icons/usersAvatars/DE.png"
                },
                {
                "id": 4,
                "username": "user_4",
                "avatar_url": "/icons/usersAvatars/PL.png"
                }
            ]
        }

    ]
}
  

export default mock_response;