'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator'; // Assurez-vous d'avoir ce composant
import { CommandDialogDemo } from '../command-dialog-menu';
import { ModeToggle } from '../themeSwitcher';
import { useUserData } from '@/hook/useUserData';

const Footer = () => {

    const { userData, loading } = useUserData();
  
    if (loading) {
      return 
    }
  
    return (
        <footer className="m-4 bg-muted/5">
            <Separator className="my-6" />
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center gap-8">
                    {/* Company Info */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex space-x-4">
                        <p className="text-sm ">@2024</p>
                            <Link href="/about">
                                <p className="text-sm text-muted-foreground hover:text-foreground font-light">About Us</p>
                            </Link>
                            <Link href="/services">
                                <p className="text-sm text-muted-foreground hover:text-foreground font-light" >Services</p>
                            </Link>
                            <Link href="/contact">
                                <p className="text-sm text-muted-foreground hover:text-foreground font-light">Contact</p>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <CommandDialogDemo />
                        </div>
                        <div className="flex items-center">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
