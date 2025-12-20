"use client";

import { Switch } from "@/components/ui/switch";
import { Mail, Smartphone } from "lucide-react";
import { useState } from "react";

export function NotificationSettingsView() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const [bountyUpdates, setBountyUpdates] = useState(true);
  const [messages, setMessages] = useState(true);
  const [marketing, setMarketing] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold font-inter text-foreground/90">Notification Preferences</h2>
        <p className="text-foreground/90 font-inter">Choose how you want to be notified about activity.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold font-inter text-foreground/90">Notification Channels</h3>

        {/* Email Notifications */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/48 flex items-center justify-center">
              <Mail className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h4 className="text-[20px] font-bold font-inter text-foreground">Email Notifications</h4>
              <p className="text-sm font-normal font-inter text-muted-foreground">Receive updates via email</p>
            </div>
          </div>
          <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
        </div>

        {/* Push Notifications */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/48 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h4 className="text-[20px] font-bold font-inter text-foreground">Push Notifications</h4>
              <p className="text-sm font-normal font-inter text-muted-foreground">Browser push notifications</p>
            </div>
          </div>
          <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold font-inter text-foreground/90">Notification Categories</h3>

        {/* Bounty Updates */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between">
          <div>
            <h4 className="text-[20px] font-bold font-inter text-foreground">Bounty Updates</h4>
            <p className="text-sm font-normal font-inter text-muted-foreground">Status changes, submissions, approvals</p>
          </div>
          <Switch checked={bountyUpdates} onCheckedChange={setBountyUpdates} />
        </div>

        {/* Messages */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between">
          <div>
            <h4 className="text-[20px] font-bold font-inter text-foreground">Messages</h4>
            <p className="text-sm font-normal font-inter text-muted-foreground">Direct messages and chat</p>
          </div>
          <Switch checked={messages} onCheckedChange={setMessages} />
        </div>

        {/* Marketing & Updates */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between">
          <div>
            <h4 className="text-[20px] font-bold font-inter text-foreground">Marketing & Updates</h4>
            <p className="text-sm font-normal font-inter text-muted-foreground">News, features, and promotions</p>
          </div>
          <Switch checked={marketing} onCheckedChange={setMarketing} />
        </div>
      </div>
    </div>
  );
}
