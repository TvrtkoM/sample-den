"use client";

import { useSession } from "@/hooks/use-session";
import { signOut } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import Image from "next/image";

const DropdownMenuNotSignedIn = () => {
  const router = useRouter();

  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => router.push("/sign-in")}>
        Sign in
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => router.push("/sign-up")}>
        Register
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const DropdownMenuSignedIn = ({ username }: { username: string }) => {
  const queryClient = useQueryClient();
  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          queryClient.setQueryData(["cart"], { items: [] });
          signOut();
        }}
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const UserDropdown = () => {
  const { data: session } = useSession();

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
