"use client"

import Link from "next/link"
import { Button } from "../ui"
import { UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import cn from 'classnames'



const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={cn('sticky top-0 z-50 transition duration-300 ease-in-out', {
      'bg-surface': isScrolled
    })}>
      <div className="container flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center space-x-2 no-underline">
          <span className="text-2xl md:text-4xl font-bold gradient-text mb-0">Pickture</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Discover</Button>
          <Button variant="ghost">My List</Button>
        </nav>

        <div className="flex items-center">
          <UserButton />

        </div>
      </div>
    </header>
  )
}
export default NavBar