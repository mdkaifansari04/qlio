"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { APP_DESCRIPTION, APP_NAME } from "@/constants";

export default function Footer() {
  const paths = usePathname().split("/");

  if (paths.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="mt-20 pt-10 px-4 md:px-6 bg-background border-t">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <Link className="flex items-center gap-2" href="/">
              <Logo />
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{APP_DESCRIPTION}</p>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  <Link href="/">Home</Link>
                </li>
                <li className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                  <Link href="https://github.com/mdkaifansari04/qlio">Github</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h1 className="font-eb-garamond text-center md:text-left text-[5rem] md:text-[8rem] lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900">
          qlio.
        </h1>
      </div>
    </footer>
  );
}
