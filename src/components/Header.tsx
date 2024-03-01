import Image from "next/image";
import React from "react";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  return (
    <header>
      <div className="z-50 flex h-20 w-full items-center justify-between p-12 shadow-lg">
        <Image src="/RM-LOGO.png" width={250} height={500} alt="logo name" />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
