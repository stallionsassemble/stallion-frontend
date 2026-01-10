"use client";

import { NotificationSettingsView } from "@/components/settings/notification-settings-view";
import { OwnerProfileSettingsForm } from "@/components/settings/owner-profile-settings-form";
import { SecuritySettingsView } from "@/components/settings/security-settings-view";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SettingsContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";

  return (
    <div className="w-full max-w-[1200px] animate-in fade-in duration-500 pb-10 pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-inter text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground font-inter">Manage your account preferences</p>
      </div>

      <SettingsTabs />

      {currentTab === "profile" && <OwnerProfileSettingsForm />}

      {currentTab === "security" && <SecuritySettingsView />}

      {currentTab === "notification" && <NotificationSettingsView />}
    </div>
  );
}

export default function OwnerSettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
