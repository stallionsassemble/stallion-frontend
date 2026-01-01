"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useMarkAllNotificationsAsRead, useNotifications } from "@/lib/api/notifications/queries";
import { Notification } from "@/lib/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, Check, DollarSign, Loader2, MessageSquare, Trophy, User } from "lucide-react";

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="h-5 w-5 text-primary" />;
      case 'BOUNTY_MATCH':
        return <User className="h-5 w-5 text-primary" />;
      case 'SUBMISSION_REJECTED':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'SUBMISSION_ACCEPTED':
        return <Trophy className="h-5 w-5 text-green-500" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
        return "border-primary/20 bg-primary/10 border-l-2 border-l-primary";
      case 'SUBMISSION_REJECTED':
        return "border-destructive/20 bg-destructive/10 border-l-2 border-l-destructive";
      case 'SUBMISSION_ACCEPTED':
        return "border-green-500/20 bg-green-500/10 border-l-2 border-l-green-500";
      case 'BOUNTY_MATCH':
        return "border-border bg-card hover:bg-muted/50";
      default:
        return "border-border bg-card hover:bg-muted/50";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              {unreadCount} Unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMarkingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((notification: Notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border transition-colors ${getNotificationStyles(notification.type)} ${!notification.isRead ? 'shadow-sm' : 'opacity-80'}`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'SUBMISSION_REJECTED' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20'}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{notification.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 sm:mt-0 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
