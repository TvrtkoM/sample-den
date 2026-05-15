"use client";

import { useSession } from "@/hooks/use-session";
import { signOut } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

const DropdownMenuNotSignedIn = () => {
  return (
    <>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/sign-in">Sign in</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/sign-up">Register</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </>
  );
};

const DropdownMenuSignedIn = ({ username }: { username: string }) => {
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center">
      <DropdownMenuContent>
        <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            queryClient.setQueryData(["cart"], { items: [] });
            await signOut();
            // this fixes bug in which after sign out we need to
            // trigger sign-in button twice to open sign-in form
            window.location.reload();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </div>
  );
};

const UserDropdown = () => {
  const { session } = useSession();

  const isAuth = session != null && session.user.isAnonymous !== true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full w-9 h-9 overflow-hidden"
        >
          {session?.user.image ? (
            <Image
              src={session.user.image}
              alt="user avatar"
              width={36}
              height={36}
              className="w-9 h-9 min-w-9"
            />
          ) : (
            <User></User>
          )}
        </Button>
      </DropdownMenuTrigger>
      {isAuth ? (
        <DropdownMenuSignedIn username={session.user.name} />
      ) : (
        <DropdownMenuNotSignedIn />
      )}
    </DropdownMenu>
  );
};

export default UserDropdown;
