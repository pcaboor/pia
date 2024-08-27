'use client'
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from '@/hook/useUserData';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

} from "@/components/ui/breadcrumb"
import { CommandDialogDemo } from '../command-dialog-menu';
import { Home } from 'lucide-react';


const NavbarUser = () => {
  const { userData, loading } = useUserData();
  let isActive = '';

  if (loading) {  
    return 
  }

  return (
    <>
        <div className=" flex justify-between items-center p-4 bg-muted/40">
        <div className='flex font-bold'>
        Buster
        </div>
          <div className="flex space-x-2  items-center">
          <CommandDialogDemo />
          <p className='text-sm font-regular'> {userData.firstName}</p>
          <Link href={'/dashboard/settings'}>
          <Avatar className='h-7 w-7'>
              {userData && userData.userImage ? (
                <AvatarImage src={userData.userImage as string} />
              ) : (
                <AvatarFallback>
                  {userData ? `${userData.firstName[0]}${userData.lastName[0]}` : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
           
          
            
          </div>
        </div>
      
     
    </>
  );
};

export default NavbarUser;