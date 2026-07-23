import { useEffect } from 'react';
import {
  Bell, CheckCircle, XCircle, Calendar, Tag, Check,
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import EmptyState from '../components/ui/EmptyState';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useBookings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const config = {
    booking_confirmed: { icon: CheckCircle, color: 'bg-success-50 text-success-600' },
    booking_cancelled: { icon: XCircle, color: 'bg-error-50 text-error-600' },
    reminder: { icon: Calendar, color: 'bg-primary-50 text-primary-600' },
    offer: { icon: Tag, color: 'bg-secondary-50 text-secondary-600' },
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="container-app py-4">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]} />
      </div>

      <div className="container-app pb-12 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="badge bg-primary-50 text-primary-700">{unreadCount} new</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No notifications"
            description="You'll see booking confirmations, reminders, and offers here."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const cfg = config[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`card p-4 flex items-start gap-3 cursor-pointer transition-all hover:shadow-card-hover ${
                    !notif.read ? 'border-l-4 border-l-primary-500' : ''
                  }`}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className={`w-11 h-11 rounded-xl ${cfg.color} flex items-center justify-center shrink-0`}>
                    <cfg.icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm ${notif.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0">{formatTime(notif.date)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
