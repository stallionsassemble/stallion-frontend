"use client";

import { useFcmToken } from "@/hooks/use-fcm-token";
import React from "react";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, permission } = useFcmToken();

  return <>{children}</>;
};
