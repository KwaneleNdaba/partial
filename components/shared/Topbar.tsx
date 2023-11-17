import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/logo.png";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";

export default function TopBar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex item-center gap-4">
        <Image src={logo} alt="logo" width={80} height={80} />
        <p
          className='="text-heading3-bold text-light-1 max-xs:hidden'
          style={{ color: "white" }}
        >
          Partial
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}
