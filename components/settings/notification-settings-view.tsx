"use client";

import { Switch } from "@/components/ui/switch";
import { useNotificationSettings, useUpdateNotificationSettings } from "@/lib/api/notifications/queries";
import { UpdateNotificationSettings } from "@/lib/types/notifications";
import { Bell, Loader2, Mail, MessageSquare, Smartphone, Trophy, Users, Wallet } from "lucide-react";

export function NotificationSettingsView() {
  const { data: settings, isLoading } = useNotificationSettings();
  const { mutate: updateSettings } = useUpdateNotificationSettings();

  const handleUpdate = (key: keyof UpdateNotificationSettings, value: boolean) => {
    updateSettings({ [key]: value } as any);
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Cast settings to any to access new fields if type definition is lagging
  const s = (settings || {}) as any;

  const categories = [
    {
      id: 'chat',
      title: 'Chat Messages',
      description: 'Direct messages and group chats',
      icon: MessageSquare,
      inAppKey: 'chatInApp',
      emailKey: 'chatEmail',
    },
    {
      id: 'wallet',
      title: 'Wallet Activity',
      description: 'Deposits, withdrawals, and payouts',
      icon: Wallet,
      inAppKey: 'walletInApp',
      emailKey: 'walletEmail',
    },
    {
      id: 'bounty',
      title: 'Bounty Updates',
      description: 'Applications, submissions, and approvals',
      icon: Trophy,
      inAppKey: 'bountyInApp',
      emailKey: 'bountyEmail',
    },
    {
      id: 'forum',
      title: 'Forum Community',
      description: 'Replies, mentions, and new topics',
      icon: Users,
      inAppKey: 'forumInApp',
      emailKey: 'forumEmail',
    },
    {
      id: 'system',
      title: 'System & Marketing',
      description: 'Platform updates, news, and promotions',
      icon: Bell,
      inAppKey: 'systemInApp',
      emailKey: 'systemEmail',
    },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold font-inter text-foreground/90">Notification Preferences</h2>
        <p className="text-foreground/90 font-inter">Manage your notification channels per category.</p>
      </div>

      <div className="border border-primary rounded-xl overflow-hidden bg-primary/5">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 md:p-6 border-b border-primary/20 bg-primary/10 items-center">
          <div className="col-span-8 md:col-span-6">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-inter">Category</span>
          </div>
          <div className="col-span-2 md:col-span-3 flex justify-center items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-inter hidden md:inline">Push</span>
          </div>
          <div className="col-span-2 md:col-span-3 flex justify-center items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-inter hidden md:inline">Email</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-primary/10">
          {categories.map((category) => (
            <div key={category.id} className="grid grid-cols-12 gap-4 p-4 md:p-6 hover:bg-primary/5 transition-colors items-center">
              <div className="col-span-8 md:col-span-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-semibold font-inter text-foreground">{category.title}</h4>
                  <p className="text-sm text-muted-foreground font-inter hidden md:block">{category.description}</p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-3 flex justify-center">
                <Switch
                  id={`${category.id}-inapp`}
                  checked={s[category.inAppKey] ?? false}
                  onCheckedChange={(checked) => handleUpdate(category.inAppKey, checked)}
                />
              </div>

              <div className="col-span-2 md:col-span-3 flex justify-center">
                <Switch
                  id={`${category.id}-email`}
                  checked={s[category.emailKey] ?? false}
                  onCheckedChange={(checked) => handleUpdate(category.emailKey, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
