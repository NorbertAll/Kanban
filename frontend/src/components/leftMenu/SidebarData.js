import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [

  {
    title: 'Board',
    path: '/board',
icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },

  {
    title: 'Team',
    path: '/team',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'User',
    path: '/user',
icon: <IoIcons.IoIosPerson />,
    cName: 'nav-text'
  }
];