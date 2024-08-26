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
                  <Link href="">Store</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
             
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick('/dashboard/team')}>
                  <Link href="/dashboard/team">Team</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex space-x-2  items-center">
  
          <CommandDialogDemo />
          <p className='text-sm font-regular'> {userData.firstName}</p>
          <Link href={'/dashboard/settings'}>
          <Avatar>
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
      </nav>
     
    </>
  );
};

export default NavbarUser;