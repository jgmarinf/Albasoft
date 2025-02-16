"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const SessionAuthProvide = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionAuthProvide;
