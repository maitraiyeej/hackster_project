import React from "react";
import { FloatingDock } from "./ui/floating-dock"; // Ensure path is correct
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
  IconHome,
  IconSearch,
  IconPlus,
  IconUser,
  IconLogout,
  IconLogin,
  IconTrophy,
  IconUserPlus
} from "@tabler/icons-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-white" />,
      href: "/",
      color: '#314158'
    },
    {
      title: "Explore",
      icon: <IconSearch className="h-full w-full text-white" />,
      href: "/explore",
      color: "#62748e"
    },
    {
  title: "Leaderboard",
  icon: <IconTrophy className="h-full w-full text-white" />,
  href: "/leaderboard",
  color: "#FFD700"
},
    ...(isAdmin ? [{
      title: "Create Event",
      icon: <IconPlus className="h-full w-full text-black" />,
      href: "/admin",
      color: '#b9f8cf'
    }] : []),
    ...(user ? [
      {
        title: `Profile`,
        icon: <IconUser className="h-full w-full text-black" />,
        href: `/user/${user._id}`,
        color: '#BBDEFB'
      },
      {
        title: "Logout",
        icon: <IconLogout className="h-full w-full text-black" />,
        onClick: handleLogout,
        href: "#",
        color: "#ffa1ad",
      }
    ] : [
      {
        title: "Login",
        icon: <IconLogin className="h-full w-full text-black" />,
        href: "/login",
        color: '#91E1F2'

      },
      {
        title: "Register",
        icon: <IconUserPlus className="h-full w-full text-black" />,
        href: "/register",
        color: '#BEF264'


      }
    ]),
  ];

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingDock
            items={links}
            desktopClassName="bg-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;