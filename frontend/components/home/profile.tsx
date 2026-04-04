'use client';
import { useState } from 'react';
import { Navigation } from './navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useProfile } from '@/hooks/use-profile';
import { profileSchema, ProfileFormValues } from '@/schemas/profile-schema';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
export const Profile = () => {
  const { profile, handleUpdateProfile, updateMutation } = useProfile();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      username: profile?.username || '',
      email: profile?.email || '',
      contact: profile?.contact || '',
      plateNumber: profile?.plateNumber || '',
    },
  });
  const update = (data: ProfileFormValues) => {
    handleUpdateProfile(data);
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
            <div className="bg-secondary p-6 rounded-xl text-primary md:col-span-7 md:order-2 shadow-sm dark:bg-[#121212] border">
              <h1 className="font-semibold text-lg mb-5">Account Status:</h1>
              <ul className="space-y-4">
                <div className="flex justify-between border-b border-primary/20 pb-2">
                  <li className="list-none">Member Since:</li>
                  <span className="font-bold">
                    {' '}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )
                      : '-'}
                  </span>
                </div>
                {/* <div className="flex justify-between border-b border-primary/20 pb-2">
                  <li className="list-none">Total Booking:</li>
                  <span className="font-bold">0</span>
                </div> */}
                <div className="flex justify-between">
                  <li className="list-none">Active Now:</li>
                  <span className="font-bold">Yes</span>
                </div>
              </ul>
            </div>

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
                    {profile?.username}
                  </h1>
                  <p className="text-text/50 text-sm text text dark:text-white">
                    {profile?.email}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <form className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Username
                    </label>
                    <Input type="text" {...register('username')} readOnly />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Email Address
                    </label>
                    <Input type="email" {...register('email')} readOnly />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Contact Number
                    </label>
                    <Input type="text" {...register('contact')} readOnly />
                    {errors.contact && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-text/50 uppercase dark:text-primary/70">
                      Plate Number
                    </label>
                    <Input type="text" {...register('plateNumber')} readOnly />
                    {errors.plateNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.plateNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      className="w-full mt-4 px-5 py-3 bg-text font-semibold text-primary rounded-xl hover:bg-secondary transition-all duration-300 shadow-md hover:cursor-pointer border"
                      onClick={() => setProfileModalOpen(!profileModalOpen)}
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

      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="bg-primary rounded-3xl p-8 border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-text">
              Edit Information
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit(update)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <Label>Username</Label>
                <Input {...register('username')} />
                {errors.username && (
                  <p className="text-red-500 text-xs">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Contact Number</Label>
                <Input {...register('contact')} />
                {errors.contact && (
                  <p className="text-red-500 text-xs">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Plate Number</Label>
                <Input {...register('plateNumber')} />
                {errors.plateNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.plateNumber.message}
                  </p>
                )}
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : ' Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
