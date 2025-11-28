"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "../client";
import { type Role, ROLES, getRoleLabel } from "../rbac";

type UserButtonProps = {
  showRoleBadge?: boolean;
  settingsUrl?: string;
};

/**
 * Get initials from a name string
 */
const getInitials = (name: string | null | undefined): string => {
  if (!name) {
    return "U";
  }
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get badge classes for role display
 */
const getRoleBadgeClasses = (role: Role): string => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium";
  switch (role) {
    case ROLES.ADMIN:
      return `${baseClasses} border-transparent bg-primary text-primary-foreground`;
    case ROLES.MODERATOR:
      return `${baseClasses} border-transparent bg-secondary text-secondary-foreground`;
    case ROLES.USER:
    default:
      return `${baseClasses} text-foreground`;
  }
};

export const UserButton = ({
  showRoleBadge = true,
  settingsUrl = "/settings",
}: UserButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userRole = (user as unknown as { role?: Role }).role || ROLES.USER;
  const showBadge = showRoleBadge && userRole !== ROLES.USER;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <span className="font-medium text-sm">{getInitials(user.name)}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 min-w-[14rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm leading-none">{user.name}</p>
                {showBadge && (
                  <span className={getRoleBadgeClasses(userRole)}>
                    {getRoleLabel(userRole)}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </div>
          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            type="button"
            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              router.push(settingsUrl);
              setIsOpen(false);
            }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            type="button"
            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
