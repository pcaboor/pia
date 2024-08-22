'use client'
import Link from 'next/link';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from '@/hook/useUserData';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CommandDialogDemo } from '../command-dialog-menu';
import { Loader2 } from 'lucide-react';

const NavbarUser = () => {
  const { userData, loading } = useUserData();
  let isActive = '';

  if (loading) {
    return 
  }

  const handleBreadcrumbClick = (href: string) => {
    isActive = href;
  };

  return (
    <>
      <nav className=" p-4">
        
        <div className="container mx-auto flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>  
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick('/dashboard')}>
                  <Link href="/dashboard">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
                <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick('/dashboard/settings')}>
                  <Link href="/dashboard/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
             
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick('/dashboard/team')}>
                  <Link href="/dashboard/team">Team</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex space-x-4  items-center">
          <CommandDialogDemo />
            <Avatar>
              {userData && userData.userImage ? (
                <AvatarImage src={userData.userImage as string} />
              ) : (
                <AvatarFallback>
                  {userData ? `${userData.firstName[0]}${userData.lastName[0]}` : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
          
            
          </div>
        </div>
      </nav>
      {isActive && (
        <div className="bg-gray-200 p-4">
          <p>Vous avez cliqué sur le lien : {isActive}</p>
        </div>
      )}
    </>
  );
};

export default NavbarUser;