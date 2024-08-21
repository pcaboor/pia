// components/Navbar.tsx
import Link from 'next/link';
import { Button } from './button'; // Assurez-vous que le composant Button accepte la classe de style
import { ModeToggle } from '../themeSwitcher';


const Navbar = () => {
  return (
    <>
    <nav className=" p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold ">
          <ModeToggle/>
          <Link href="/" className="hover:underline">Home</Link>
        </div>
        <div className="flex space-x-4"> 
          <Button  className=" p-3"> 
            <Link href="/login">Login</Link>
          </Button>
          <Button  variant="outline" className=" p-3 ">
            <Link href="/">Contact</Link> 
          </Button>
        </div>
      </div>
    </nav>
    <div className="border-t" />
    </>
  );
};

export default Navbar;
