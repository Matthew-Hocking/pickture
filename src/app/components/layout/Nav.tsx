"use client"

import Link from "next/link"
import { Button, SpinCTA } from "../ui"
import { UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react";
import cn from 'classnames'



const Nav = () => {
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
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-2 no-underline">
            <span className="text-2xl md:text-4xl font-bold gradient-text mb-0">Pickture</span>
          </Link>
          <SpinCTA />
        </div>

        

        <nav className="hidden md:flex items-center space-x-4">
          <Button asLink href="/movies" variant="nav">Movies</Button>
          <Button asLink href="/tv-shows" variant="nav">TV Shows</Button>
          <Button asLink href="/my-list" variant="nav">My List</Button>
        </nav>

        <div className="flex items-center">
          <UserButton />

        </div>
      </div>
    </header>
  )
}
export default Nav