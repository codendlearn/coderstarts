import BookIcon from "@material-ui/icons/Book"
import HomeIcon from "@material-ui/icons/Home"
import HowToRegIcon from "@material-ui/icons/HowToReg"
import React from 'react'
import Home from '../pages/Home'
import VideoConsultation from "../pages/videocall/VideoConsultation"
import {IMenuItem} from "../types/IMenuItem"

export const menuItems: IMenuItem[] = [
  {
    title: 'Home',
    path: '/',
    component: Home,
    icon: <HomeIcon className='text-white' />,
  },
  {
    title: 'About',
    path: '/about',
    component: Home,
    icon: <BookIcon className='text-white' />,
  },
  {
    title: 'Blog',
    path: '/blog',
    component: Home,
    icon: <HowToRegIcon className='text-white' />,
  },
  {
    title: 'Consultation',
    path: '/consultation',
    component: VideoConsultation,
    icon: <HowToRegIcon className='text-white' />,
  },
]


