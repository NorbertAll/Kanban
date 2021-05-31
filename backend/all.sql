DELETE FROM `kanban_task`;
DELETE FROM `kanban_column`;
DELETE FROM `kanban_topic`;
DELETE FROM `kanban_team_users`;
DELETE FROM `kanban_team`;
DELETE FROM `kanban_userdetail`;
DELETE FROM `authtoken_token`;
DELETE FROM `auth_user`;
DELETE FROM `kanban_board`;


INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$216000$s1KLIWYfTMw2$P/J5/Gk2al0e/aSU2DUsr1rHeFXxU+gAXCtcjrL564E=', NULL, 0, 'Zdzichu', '', '', '', 0, 1, '2021-05-01 18:30:59.778229'),
(2, 'pbkdf2_sha256$216000$LfNOuLJGJYdW$kOC43nv0XQyUVLozoMjPT0w6M4zqxidMkIKIQBPWXMc=', NULL, 0, 'Krzychu', '', '', '', 0, 1, '2021-05-01 18:32:22.765786'),
(3, 'pbkdf2_sha256$216000$7rBTWnllWiGZ$9ZQ3jY4jySzxbUocehNWdLZr3XjAJZcfVglX6QzOUt8=', NULL, 0, 'Pioter', '', '', '', 0, 1, '2021-05-01 18:34:03.770436'),
(4, 'pbkdf2_sha256$216000$eiUMmt5u1WLF$EensUfPaYrOmspsA741AadJCjnaM4Vj2MXyibNQstQU=', NULL, 0, 'Piesel', '', '', '', 0, 1, '2021-05-01 18:35:10.821407');

INSERT INTO `authtoken_token` (`key`, `created`, `user_id`) VALUES
('2461eedbddf7c3ba0f804a89020b2db9de2ebc84', '2021-05-01 18:32:22.881712', 2),
('92340813aa663dd535a7d276fe06439a5eb33825', '2021-05-01 18:34:03.882355', 3),
('92c6181f8351a23e938457135ddd5ed137a82414', '2021-05-01 18:30:59.902900', 1),
('eee4dceca0b5102be9d319615bba42fd72c90e9e', '2021-05-01 18:35:10.934295', 4);

INSERT INTO `kanban_userdetail` (`id`, `userName`, `avatar_url`, `user_id`) VALUES
(1, 'Zdzichu', 'kanban/user-avatars/hakier.jpg', 1),
(2, 'Krzychu', 'kanban/user-avatars/krzychu.jpg', 2),
(3, 'Pioter', 'kanban/user-avatars/Pioter.jpg', 3),
(4, 'Piesel', 'kanban/user-avatars/piesel-shiba-inu.jpg', 4);

INSERT INTO `kanban_board` (`id`, `name`, `columnOrder`) VALUES
(1, 'Tablica 1', '[\"To do\",\"Next\",\"In progess\",\"Done\"]');

INSERT INTO `kanban_team` (`id`, `name`, `avatar_url`, `board_id`) VALUES
(1, 'Dream team', 'kanban/team-avatars/dreamTeam.jpg', 1);

INSERT INTO `kanban_team_users` (`id`, `team_id`, `userdetail_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4);

INSERT INTO `kanban_topic` (`id`, `title`, `board_id`) VALUES
(1, 'Testing', 1),
(2, 'Connecting backend and frontend', 1),
(3, 'Optimization', 1),
(4, 'Frontend', 1),
(5, 'Backend', 1);

INSERT INTO `kanban_column` (`id`, `title`, `limit`, `limitPerTeam`, `limitPerUser`, `taskOrder`, `board_id`) VALUES
(1, 'To do', 0, 0, 0, '[\"1\",\"2\",\"3\",\"8\",\"9\",\"13\"]', 1),
(2, 'Next', 0, 2, 0, '[\"7\",\"10\"]', 1),
(3, 'In progess', 4, 0, 1, '[\"4\",\"6\"]', 1),
(4, 'Done', 0, 0, 0, '[\"5\",\"12\"]', 1);

INSERT INTO `kanban_task` (`id`, `title`, `content`, `column_id`, `topic_id`, `userAssigned_id`) VALUES
(1, 'Task 1', '', 1, 5, 1),
(2, 'Task 2', '', 1, 5, 1),
(3, 'Task 3', '', 1, 4, 2),
(4, 'Task 4', '', 3, 4, 2),
(5, 'Task 5', 'Nothing working', 4, 1, 4),
(6, 'Task 6', '', 3, 3, 3),
(7, 'Task 7', '', 2, 4, 3),
(8, 'Task 8', '', 1, 5, 1),
(9, 'Task 9', '', 1, 5, 4),
(10, 'Task 10', '', 2, 1, 3),
(12, 'Task 12', '', 4, 2, 4),
(13, 'Task 13', '', 1, 1, 4);