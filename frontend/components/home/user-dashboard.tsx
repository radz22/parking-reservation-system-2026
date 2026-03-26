//directory and react
"use client";
import { Navigation } from "./navigation"; // Tawagin ang Navigation
import Link from "next/link";
import { useState } from "react";

//luicide icon
import { Globe, AlertTriangle } from "lucide-react";

//shadcn 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const UserDashboard = ({ children }: { children?: React.ReactNode }) => {
  
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  
  const [accountReservation, setAccountReservation] = useState ([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      plate_no: "ABC123",
      wheel_type: "2-Wheel",
      start: "Feb 14, 2026 8:00am",
      end: "Feb 14, 2026 11:30am"
    }
  ])

  const handleCancel = () => {
  setAccountReservation([]); // For now, clear muna natin ang listahan
  setCancelModalOpen(false); // Isara ang modal
  alert("Reservation cancelled successfully!");
};

  return (
    <div className="dashboard-container dark:bg-[#0a0a0a] transition-all">
      {/* 1. Ikabit ang Navigation (Ulo/Braso) */}
      <Navigation />

         {children} {/*lagay ko lang :D*/} 

      {/* 2. Dito lalabas yung "Laman" o Page Content */}
    <main id="main-section" className="p-5 lg:px-20">
       <div className="max-w-5xl mx-auto mt-30 px-3 lg:max-w-7xl lg:mt-40">
      <div className="flex flex-col flex-1 gap-3">
    <h1 className="text-text text-4xl font-semibold dark:text-white">Welcome Back, <span className="font-bold text-secondary dark:text-white">User1234!</span></h1>
    <p className="text-dark text-base my-3 ">Manage your parking reservations and find available spaces</p>
    </div>

    <div className="mt-10">
      <button className="flex items-center justify-center px-5 pr-7 py-2 bg-text rounded-4xl text-primary hover:bg-secondary duration-300 ease-out border">
    <Globe size={18} strokeWidth={3}  className="mr-2" />
    <Link href="/parking-reserve">Browse Vacant Spaces</Link>
  </button>
    </div>

    <div id="dashboard-info" className="mt-20">
        <div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">

            <div className="dashboard-boxes dark:bg-[#121212]">
  <div className="flex justify-between items-center">
    <span className="text-text/60 text-sm font-medium text text dark:text-white">Your Total Activity:</span>
    <i className="fa-solid fa-parking text-secondary"></i>
  </div>
  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white"><span>12</span></h2>
  <p className="text-xs text-green-500 font-medium"></p>
</div>

          <div className="dashboard-boxes dark:bg-[#121212]">
  <div className="flex justify-between items-center">
    <span className="text-text/60 text-sm font-medium text text dark:text-white">Total Available Space:</span>
    <i className="fa-solid fa-check text-secondary"></i>
  </div>
  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white"><span>6</span></h2>
  <p className="text-xs text-green-500 font-medium">+1 Available since last week</p>
</div>

           <div className="dashboard-boxes dark:bg-[#121212]">
  <div className="flex justify-between items-center">
    <span className="text-text/60 text-sm font-medium text text dark:text-white">Available Space (2-Wheels)</span>
    <i className="fa-solid fa-motorcycle text-secondary"></i>
  </div>
  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white"><span>2</span></h2>
  <p className="text-xs text-green-500 font-medium"></p>
</div>

           <div className="dashboard-boxes dark:bg-[#121212]">
  <div className="flex justify-between items-center">
    <span className="text-text/60 text-sm font-medium dark:text-white">Available Space (4-Wheels)</span>
    <i className="fa-solid fa-car text-secondary"></i>
  </div>
  <h2 className="text-3xl font-bold text-text my-3 dark:text-white"><span>4</span></h2>
  <p className="text-xs text-green-500 font-medium">+1 Available since last week</p>
</div>

          </div>
        </div>
    </div>
    </div>
      </main>

<section id="reservation-info">
     <div id="reservation-table" className="mt-20 max-w-8xl mx-auto ">
      
       <div className="bg-primary dark:bg-[#121212] h-fit py-20 transition-colors duration-300">
        <div className="md:max-w-7xl md:mx-auto">
        <h1 className="font-semibold text-text text-2xl text-center md:text-start text text dark:text-white">Your Reservation:</h1>

        <div className="mt-10 overflow-x-auto  container-1 ">
          <table className="w-full text-left border-separate border-spacing-y-2" >
    <thead>
      <tr className="text-text/50 font-bold uppercase text-xs tracking-wider">
        <th className="px-4 py-3 border-b border-gray-100 text text dark:text-white">Name</th>
        <th className="px-4 py-3 border-b border-gray-100 text text dark:text-white">Vehicle</th>
        <th className="px-4 py-3 border-b border-gray-100 text text dark:text-white whitespace-nowrap">Wheel Type:</th>
        <th className="px-4 py-3 border-b border-gray-100 text text dark:text-white whitespace-nowrap">Start Time</th>
        <th className="px-4 py-3 border-b border-gray-100 text text dark:text-white whitespace-nowrap">End Time</th>
        <th className="px-4 py-3 border-b border-gray-100 text-right text text dark:text-white whitespace-nowrap">Action</th>
      </tr>
    </thead>

    <tbody className="text-text font-semibold text-sm">
      {accountReservation.length > 0 ? (
      accountReservation.map(({id, first_name, last_name, plate_no, wheel_type, start, end}) => (
      <tr key={id} className="hover:bg-dark/10 rounded-4xl transition-colors duration-200 text text dark:text-white">
        <td className="px-4 py-4 whitespace-nowrap">{first_name} {last_name}</td>
        <td className="px-4 py-4 uppercase whitespace-nowrap">{plate_no}</td>
        <td className="px-4 py-4 whitespace-nowrap">{wheel_type}</td>
        <td className="px-4 py-4 whitespace-nowrap">{start}</td>
        <td className="px-4 py-4 whitespace-nowrap">{end}</td>
        
        <td className="px-4 py-4 text-right text text dark:text-white">         
   {/* Cancel Button */}
    <button 
        onClick={() => setCancelModalOpen(true)} // Buksan ang modal
        className="bg-gray-200 text-text px-6 py-1.5 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all duration-300 text-xs hover:cursor-pointer"
      >  Cancel   
      </button>
        </td>

      </tr>
      ))
) : (

    <tr>
      <td colSpan={6} className="text-center py-10 text-text/40 italic">
        No active reservations found.
      </td>
    </tr>

      )}
      </tbody>
  </table>
</div>
</div>
       </div> 
    </div>
</section>

{/* React Way of Showing Modal */}
<AlertDialog open={isCancelModalOpen} onOpenChange={setCancelModalOpen}>
  <AlertDialogContent className="bg-primary rounded-3xl p-8 border-none max-w-sm text-center ">

    <AlertDialogHeader className="text-center md:text-left">
  {/* Container ng Icon */}
  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
    <AlertTriangle className="text-red-500" size={32} />
  </div>
  
  {/* Title at Description */}
  <AlertDialogTitle className="text-xl font-bold text-text mb-2">
    Cancel Reservation?
  </AlertDialogTitle>
  <AlertDialogDescription className="text-text/60">
    Are you sure you want to cancel your slot? This action cannot be undone.
  </AlertDialogDescription>
</AlertDialogHeader>
    
    <AlertDialogFooter className="flex flex-col gap-3 mt-6 sm:flex-col">
<div className="flex flex-col gap-3 md:flex-row">
  <AlertDialogAction 
        onClick={handleCancel} 
        className="w-full md:w-55 py-6 bg-red-500 text-primary rounded-xl font-semibold  transition-all hover:bg-secondary duration-300 ease-out "
      >
        Yes, Cancel
      </AlertDialogAction>

      <AlertDialogCancel className="w-full md:w-55 py-6 bg-gray-200 rounded-xl font-bold hover:bg-secondary hover:text-primary border-none ">
        No, Keep it
      </AlertDialogCancel>
    </div>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>

  );
};
