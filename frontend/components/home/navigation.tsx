'use client';
import Link from 'next/link';
import {
  Menu,
  X,
  House,
  LayoutDashboard,
  BookOpen,
  SquareUserRound,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@base-ui/react';
import Image from 'next/image';

export const Navigation = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle('dark');
  // };

  const buttonNav = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '0px';
    }
  }, [isOpen]);

  return (
    <div className="navigation-container relative w-full">
      <div className="fixed top-0 left-0 w-full z-50 bg-primary/80 dark:bg-[#0f172a] shadow-md">
        <div className="mx-4 md:max-w-7xl md:mx-auto flex items-center justify-between h-16 py-10">
          <div className="flex items-center gap-2">
            <button
              id="nav-bar"
              onClick={buttonNav}
              className="group p-2 text-text rounded-4xl text-2xl cursor-pointer hover:bg-secondary transition duration-300 lg:hidden"
            >
              <Menu
                size={24}
                strokeWidth={3}
                className="text-text dark:text-white group-hover:text-primary transition-colors duration-300"
              />
            </button>

            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="w-32 h-18 max-lg:hidden"
            />
          </div>
          <nav className="hidden lg:flex items-center gap-8 dark:text-white">
            <Link
              href="/main-page"
              className="text-lg font-medium text-text hover:text-secondary transition dark:text-white"
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  href="/user-dashboard"
                  className="text-lg font-medium text-text hover:text-secondary transition dark:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/parking-reserve"
                  className="text-lg font-medium text-text hover:text-secondary transition dark:text-white"
                >
                  Book Reservation
                </Link>
                <Link
                  href="/profile"
                  className="text-lg font-medium text-text hover:text-secondary transition dark:text-white"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
          <div className="flex justify-center items-center gap-3">
            {/* <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-text dark:bg-slate-800 text-primary dark:text-yellow-400 hover:scale-110 transition-all"
          >
            {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button> */}

            {session ? (
              <Button
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
                className="hidden md:inline-flex text-base font-semibold text-text hover:bg-secondary hover:text-primary py-2 px-6 hover:rounded-full transition-all duration-300 ease-in-out dark:text-white"
              >
                Log Out
              </Button>
            ) : (
              <Link
                href="/sign-in"
                className="hidden md:inline-flex text-base font-semibold text-text hover:bg-secondary hover:text-primary py-2 px-6 hover:rounded-full transition-all duration-300 ease-in-out dark:text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        id="backdrop"
        onClick={buttonNav}
        className={`fixed inset-0 bg-backdrop/50 opacity-0 transition-opacity duration-300 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      ></div>

      {/* Side Nav */}
      <aside
        id="side-nav"
        className={`fixed top-0 left-0 w-65 h-full dark:bg-slate-950 bg-primary/60 backdrop-blur-md border-r border-primary shadow-xl transform transition-transform duration-300 ease-in-out overflow-auto z-60 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-baseline py-5 gap-9 mx-5 border-b border-primary dark:text-white">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="w-24 h-10 "
          />
          <X
            id="exit-nav"
            onClick={buttonNav}
            strokeWidth={3}
            className="p-2 w-10 h-10 cursor-pointer hover:bg-secondary duration-300 ease-out rounded-full hover:text-primary"
          />
        </div>

        <div className="p-4">
          <nav className="border-b-2 pb-10 dark:border-slate-800">
            <ul className="flex flex-col gap-7 mt-5 text-text dark:text-slate-200">
              <Link href="/main-page">
                <li className="link-nav dark:text-slate-200">
                  <House size={25} strokeWidth={3} />
                  <span>Home</span>
                </li>
              </Link>
              {session && (
                <>
                  <Link href="/user-dashboard">
                    <li className="link-nav dark:text-slate-200">
                      <LayoutDashboard size={25} strokeWidth={3} />
                      <span>Dashboard</span>
                    </li>
                  </Link>
                  <Link href="/parking-reserve">
                    <li className="link-nav dark:text-slate-200">
                      <BookOpen size={25} strokeWidth={3} />
                      <span>Reservation</span>
                    </li>
                  </Link>
                  <Link href="/profile">
                    <li className="link-nav dark:text-slate-200">
                      <SquareUserRound size={25} strokeWidth={3} />
                      <span>User Profile</span>
                    </li>
                  </Link>
                </>
              )}
            </ul>

            {!session && (
              <Link
                href="/sign-up"
                className="inline-flex mx-3 mt-10 py-3 px-10 bg-text text-primary text-base font-semibold rounded-2xl hover:bg-secondary hover:text-primary transition duration-300 ease-in-out"
              >
                Sign Up
              </Link>
            )}

            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
                className="inline-flex mx-3 mt-5 py-3 px-10 bg-primary text-text text-base font-semibold rounded-2xl hover:bg-secondary hover:text-primary transition duration-300 ease-in-out"
              >
                Log Out
              </button>
            )}
          </nav>
        </div>
      </aside>
    </div>
  );
};
