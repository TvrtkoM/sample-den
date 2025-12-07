"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

const DropdownMenuNotSignedIn = () => {
  const router = useRouter();

  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => router.push("/sign-in")}>
        Sign in
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const DropdownMenuSignedIn = ({ username }: { username: string }) => {
  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const UserDropdown = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Skeleton className="w-9 h-9 rounded-full"></Skeleton>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full w-9 h-9">
          <User></User>
        </Button>
      </DropdownMenuTrigger>
      {!session && <DropdownMenuNotSignedIn />}
      {session != null && (
        <DropdownMenuSignedIn username={session!.user.name} />
      )}
    </DropdownMenu>
  );
};

export default UserDropdown;
