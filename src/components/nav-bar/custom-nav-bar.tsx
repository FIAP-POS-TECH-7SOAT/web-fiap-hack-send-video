"use client";


import { signOut, useSession } from "next-auth/react";

import { GiVideoCamera } from "react-icons/gi";
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";

import { usePathname } from "next/navigation";



function CustomNavbarItem({isActive, title, href,isButton}:any){

  return (
    <NavbarItem isActive={isActive} >
      {isButton?
        <Button as={Link} color={!isActive?'default':'primary'} href={href} variant={!isActive?'light':'flat'}>
          {title}
        </Button> :
        <Link  href={href} className={!isActive?"text-white":""} >
          {title}
        </Link>
    }
      

      
    </NavbarItem>
  )
}

export default function CustomNavBar() {
  const { data: session } = useSession();
  const pathname = usePathname()

  function teste(){
    signOut({redirectTo:'/login'})
  }
  
  return (
    <Navbar>
      <NavbarBrand>
        <GiVideoCamera  size={40}/>
        <p className="ml-2 font-bold text-inherit">FrameStream</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {session && 
          <>
              <CustomNavbarItem isActive={pathname === "/"} href="/" title="Home"/>
              <CustomNavbarItem isActive={pathname === "/uploads"} href="/uploads" title="My uploads"/>
          </>
        }

      
      </NavbarContent>
      <NavbarContent justify="end">
        {session?
          <NavbarItem>
            <Button color="primary"  variant="flat" onPress={teste}>
            Sign Out
            </Button>
          </NavbarItem> :
          <>
          <CustomNavbarItem isActive={pathname === "/login"} href="/login" title="Login"/>
          <CustomNavbarItem isActive={pathname === "/login/register"} href="/login/register" title="Sign up" isButton/>
        
          </>
        }
        
      </NavbarContent>
  </Navbar>
  )
}
