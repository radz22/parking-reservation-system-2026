"use client"; //parang java.util.Scanner kailangan maging user interactive

import Link from "next/link";//pag may multi webpage ka

import { Menu, X, House, LayoutDashboard, BookOpen, SquareUserRound, SunIcon, MoonIcon} from "lucide-react"; //import icons

import {useState, useEffect} from "react"; //import components from react


export const Navigation = () => {
 /* VANILLA: const sideNav = document.querySelector('#side-nav'); 
     REACT: Hindi na natin kailangan i-select ang element. Gagawa tayo ng "State" 
     na magsisilbing switch (true/false) para sa lahat ng elements.
  */
  //pag false = sarado na pag true = bukas
 const [isOpen, setIsOpen] = useState(false);

 //State for DarkMode para maread ni react = dark mode switch
 const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  document.documentElement.classList.toggle("dark");
};

//sa vanilla gumagamit pa ng addEventListener para sa open navigation function at close navigation function. Pero sa react isang line function nalang para sa dalawang function na iisa lang ang variable at purpose. Ang UI na ang kusang mag-aadjust base sa value ng 'isOpen'.
const buttonNav = () => setIsOpen(!isOpen);

//scroll lock pag nakabukas yung aside navigation, need ng useEffect para mapagana yung mga sinet mo ng function imbes na addEventListener
  useEffect(() => {
    if(isOpen){ //pag pinindot para bumukas
      //yung content or mismong function cinopy ko lang sa vanilla js ko
       const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
       
       document.body.style.overflow = 'hidden';
       document.body.style.paddingRight = `${scrollbarWidth}px`;
    }else{//I-lock ang scroll at lagyan ng padding para hindi tumalon ang layout
     document.body.style.overflow = '';
     document.body.style.paddingRight = `0px`;
    }
  }, [isOpen]);

  return (

      <div className="navigation-container relative">
        {/* --- NAVBAR --- */}
        <div className="flex flex-row justify-between items-center p-5 lg:px-20 bg-primary fixed w-full top-0 z-50 shadow-md dark:bg-[#0f172a]  transition-colors duration-300">

          <div className="flex items-center gap-2">
   <button 
  id="nav-bar" 
  onClick ={buttonNav}//dito nadin icall yung function
  className="group p-2 text-text rounded-4xl text-2xl cursor-pointer hover:bg-secondary transition duration-300 lg:hidden"
>
  <Menu 
    size={24} 
    strokeWidth={3} 
    className="text-text dark:text-white group-hover:text-primary transition-colors duration-300" 
  />
</button>

    <h1 className="text-2xl font-bold text-text dark:text-white">Parking Hub</h1>
  </div>

<nav className="hidden lg:flex items-center gap-8 dark:text-white">
  <Link href="/main-page" className="text-lg font-medium text-text hover:text-secondary transition dark:text-white">Home</Link>
    <Link href="/user-dashboard" className="text-lg font-medium text-text hover:text-secondary transition dark:text-white">Dashboard</Link>
    <Link href="/parking-reserve" className="text-lg font-medium text-text hover:text-secondary transition dark:text-white">Book Reservation</Link>
    <Link href="/profile" className="text-lg font-medium text-text hover:text-secondary transition dark:text-white">Profile</Link>
  </nav>
    
   <div className="flex justify-center items-center gap-3"> 

    {/* Dark Mode Button with Icons */}
            <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full bg-text dark:bg-slate-800 text-primary dark:text-yellow-400 hover:scale-110 transition-all"
            >
                {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>

    <Link href="/sign-up" className="hidden md:inline-flex py-2 px-6 bg-text text-primary rounded-full font-semibold hover:bg-secondary transition duration-300">Sign Up</Link>
    
    <Link href="#" className="hidden md:inline-flex text-base font-semibold text-text hover:bg-secondary hover:text-primary  py-2 px-6 hover:rounded-full transition-all duration-300 ease-in-out dark:text-white">
      Log Out
    </Link>
  </div>
</div>

{/* --- BACKDROP --- */}
<div id="backdrop" onClick={buttonNav}//dito din para sa scroll lock at backdrop function

//i curly brace natin yung class kasi dito na natin ilalagay yung function para sa scroll lock at backdrop
className={`fixed inset-0 bg-backdrop/50 opacity-0 transition-opacity duration-300 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>


{/* --- ASIDE (SIDE NAV) --- */}
{/* VANILLA: sideNav.classList.add('-translate-x-full')
         REACT: Dynamic class mapping base sa 'isOpen' state
      */}
      
  <aside id="side-nav" 
  className={`fixed top-0 left-0 w-65 h-full dark:bg-slate-950 bg-primary/60 backdrop-blur-md border-r border-primary shadow-xl transform transition-transform duration-300 ease-in-out overflow-auto z-60  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      
      {/* VANILLA: exitNav.addEventListener('click', closeSideNav) */}
  <div className={`flex items-center justify-baseline py-5 gap-9 mx-5  border-b border-primary  dark:text-white`}>

<a href="#" className="text-2xl font-bold text-text dark:text-white">Parking Hub</a>
      <X 
      id="exit-nav"
      onClick={buttonNav} 
      strokeWidth={3} 
       className="p-2 w-10 h-10 cursor-pointer hover:bg-secondary duration-300 ease-out rounded-full hover:text-primary"/>
</div>

<div className="p-4">
    <nav className="border-b-2 pb-10 dark:border-slate-800">
    <ul className="flex flex-col gap-7 mt-5 text-text dark:text-slate-200">
      
    
    <Link href="/main-page"> <li className="link-nav dark:text-slate-200"> <House size={25} strokeWidth={3}/> 
      <span>Home</span> </li> </Link>

      <Link href="/user-dashboard"><li className="link-nav dark:text-slate-200"> <LayoutDashboard size={25} strokeWidth={3}/><span>Dashboard</span></li></Link>

      <Link href="/parking-reserve"><li className="link-nav dark:text-slate-200"><BookOpen size={25} strokeWidth={3}/><span>Reservation</span></li></Link>

       <Link href="/profile"><li className="link-nav dark:text-slate-200"><SquareUserRound size={25} strokeWidth={3}/><span>User Profile</span></li></Link>
    </ul>

    <Link href="/sign-up" className="inline-flex mx-3 mt-10 py-3 px-10 bg-text text-primary text-base font-semibold rounded-2xl hover:bg-secondary hover:text-primary transition duration-300 ease-in-out">Sign Up</Link>

    <Link href="#" className="inline-flex mx-3 mt-5 py-3 px-10 bg-primary text-text text-base font-semibold rounded-2xl hover:bg-secondary hover:text-primary transition duration-300 ease-in-out">Log Out</Link>
</nav>

</div>
    </aside>
</div>
        
  );
}