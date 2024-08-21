'use client'

import Link from 'next/link';
import { Button } from './button';
import { ModeToggle } from '../themeSwitcher';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from '@/hook/useUserData';


const NavbarUser = () => {

  const { userData } = useUserData();

  return (
    <>
      <nav className=" p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold ">
            <ModeToggle />
          </div>
          <div className="flex space-x-4">
            <Avatar>
              {userData && userData.userImage ? (
                <AvatarImage src={userData.userImage as string} />
              ) : (
                <AvatarFallback>
                  {userData ? `${userData.firstName[0]}${userData.lastName[0]}` : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" className=" p-3 ">
              <Link href="/">Contact</Link>
            </Button>
          </div>
        </div>
      </nav>
      <div className="" />
    </>
  );
};

export default NavbarUser;
