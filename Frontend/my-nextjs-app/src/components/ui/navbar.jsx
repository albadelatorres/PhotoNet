"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";

const MyNavbar = () => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="text-lg font-bold">EMTInfo</p>
      </NavbarBrand>
      <NavbarContent hideIn="xs" variant="highlight-rounded">
        <NavbarItem>
          <Link href="/">Inicio</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/mapas">Mapas</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/logs">Logs</Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MyNavbar;
