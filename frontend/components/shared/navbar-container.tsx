"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../ui/navbar";

export default function NavbarContainer() {
  const paths = usePathname().split("/");

  if (paths.includes("dashboard")) {
    return null;
  }

  return <Navbar />;
}
