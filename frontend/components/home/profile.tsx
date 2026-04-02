'use client';
import { useState } from 'react';
import { Navigation } from './navigation';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Profile = () => {
  //personal information
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  //show password
  const [showPassword, setShowPassword] = useState(false);

  // Sample User State (Para editable mamaya)
  const [user, setUser] = useState({
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'username@gmail.com',
    password: 'john_Doe16',
    phone: '09123456789',
  });

  const { first_name, last_name, password, email, phone } = user;

  const handleSaveChanges = (e: React.FormEvent) => {
    // Logic for saving...
    e.preventDefault();
    console.log('Saving user:', user);

    setProfileModalOpen(false);
    alert('Profile updated!');
  };

  //register vehicle table
  const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);

  const [userVehicle, setUserVehicle] = useState({
    plate_no: 'ABC123',
    wheel_type: '2-Wheel',
  });

  const { plate_no, wheel_type } = userVehicle;

  const handleUpdateChanges = (e: React.FormEvent) => {
    // Logic for saving...
    e.preventDefault();
    console.log('Saving Vehicle Status:', user);

    setVehicleModalOpen(false);
    alert('Vehicle Status updated!');
  };

  return (
    <div className="bg-body min-h-screen dark:bg-text">
      <Navigation />

      <section id="profile-container">
        <div className="container-1 pt-20">
          <div className="my-10">
            <h1 className="font-semibold text-3xl mb-3 text-text dark:text-white">
              My Profile
            </h1>
            <p className="text-text/70 font-semibold dark:text-white">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-15 md:grid-cols-12 items-start">
            {/* Account Status Card - md:order-2 para mapunta sa kanan sa desktop */}
            <div className="bg-secondary p-6 rounded-xl text-primary md:col-span-7 md:order-2 shadow-sm dark:bg-[#121212] border">
              <h1 className="font-semibold text-lg mb-5">Account Status:</h1>
              <ul className="space-y-4">
                <div className="flex justify-between border-b border-primary/20 pb-2">
                  <li className="list-none">Member Since:</li>
                  <span className="font-bold">January 2025</span>
                </div>
                <div className="flex justify-between border-b border-primary/20 pb-2">
                  <li className="list-none">Total Booking:</li>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <li className="list-none">Active Now:</li>
                  <span className="font-bold">Yes</span>
                </div>
              </ul>
            </div>

            {/* Personal Information Card */}
            <div className="md:col-span-5 bg-primary p-6 rounded-xl shadow-sm border  dark:bg-[#121212]">
              <h1 className="text-text font-semibold text-lg mb-5 text text dark:text-white">
                Personal Information:
              </h1>

              <div className="flex gap-5 border-b-2 pb-5 items-center">
                <div className="bg-secondary rounded-full p-6 w-16 h-16 flex items-center justify-center text-primary text-xl font-bold">
                  JD
                </div>
                <div>
                  <h1 className="font-semibold text-text text-xl text text dark:text-white">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-text/50 text-sm text text dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <form className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      First Name:
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="text-text/70 font-semibold px-3 py-2 mt-1 block w-full bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      value={first_name}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Last Name:
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="text-text/70 font-semibold px-3 py-2 mt-1 block w-full bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      value={last_name}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      readOnly
                      className="text-text/70 font-semibold px-3 py-2 mt-1 block w-full bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      value={email}
                    />
                  </div>

                  <div className="col-span-1 relative">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Password:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        readOnly
                        className="text-text/70 font-semibold px-3 py-2 mt-1 block w-full bg-gray-50 rounded-lg border border-gray-200 outline-none"
                        value={password}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-4 text-text/50"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Contact Number:
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="text-text/70 font-semibold px-3 py-2 mt-1 block w-full bg-gray-50 rounded-lg border border-gray-200 outline-none"
                      value={phone}
                    />
                  </div>

                  <div className="col-span-1">
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      type="button"
                      className="w-full mt-4 px-5 py-3 bg-text font-semibold text-primary rounded-xl hover:bg-secondary transition-all duration-300 shadow-md hover:cursor-pointer border"
                    >
                      Edit Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="register-vehicle">
        <div className="bg-primary dark:bg-[#121212] py-10 h-80 md:h-100 transition-colors duration-300">
          <div className="md:max-w-7xl md:mx-auto">
            <h1 className=" mx-3 text-center font-semibold text-xl  mb-5 md:text-start dark:text-white">
              Registered Vehicle:
            </h1>

            <div className="mt-10 overflow-x-auto  container-1">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-text/50 font-bold uppercase text-xs tracking-wider dark:text-white">
                    <th className="px-4 py-3 border-b border-gray-100">
                      Plate No.
                    </th>
                    <th className="px-4 py-3 border-b border-gray-100">
                      Wheel Type:
                    </th>
                    <th className="px-4 py-3 border-b border-gray-100 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="text-text font-semibold text-sm">
                  <tr className="hover:bg-dark/10 rounded-4xl transition-colors duration-200 dark:text-white">
                    <td className="px-4 py-4 uppercase">{plate_no}</td>
                    <td className="px-4 py-4">{wheel_type}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setVehicleModalOpen(true)}
                        className="bg-gray-200 text-text px-6 py-1.5 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all duration-300 text-xs hover:cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="bg-primary rounded-3xl p-8 border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-text">
              Edit Information
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input
                  value={first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  value={last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div className="space-y-1 relative">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-text/50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label>Contact Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setProfileModalOpen(false)}
                className="flex-1 rounded-xl bg-text/10 text-text font-semibold text-sm hover:bg-secondary duration-300 ease-out hover:text-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-text text-primary rounded-xl hover:bg-secondary duration-300 ease-out font-semibold"
              >
                {' '}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isVehicleModalOpen} onOpenChange={setVehicleModalOpen}>
        <DialogContent className="max-w-sm rounded-3xl px-10 border-none bg-primary">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text">
              Update Vehicle
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateChanges} className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Plate Number</Label>
              <Input
                value={userVehicle.plate_no}
                onChange={(e) =>
                  setUserVehicle({
                    ...userVehicle,
                    plate_no: e.target.value.toUpperCase(),
                  })
                }
                className="uppercase"
              />
            </div>

            <div className="space-y-1 mt-5">
              <Label>Wheel Type</Label>
              <Select
                value={userVehicle.wheel_type}
                onValueChange={(value) =>
                  setUserVehicle({ ...userVehicle, wheel_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-Wheel">2-Wheel</SelectItem>
                  <SelectItem value="4-Wheel">4-Wheel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl bg-text/10 hover:bg-secondary duration-300 ease-in-out font-semibold text-sm hover:text-primary"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="flex-1 bg-text text-primary font-semibold rounded-xl hover:bg-secondary duration-300 ease-out "
              >
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
