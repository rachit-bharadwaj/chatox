import { useState, useEffect } from "react";
import { notificationManager } from "../../utils/notifications";

export default function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    // Check if we should show the banner
    const shouldShowBanner = () => {
      const permission = notificationManager.getPermissionStatus();
      const hasShownBefore = localStorage.getItem('notification-banner-shown');
      
      return permission === 'default' && !hasShownBefore;
    };

    if (shouldShowBanner()) {
      setShowBanner(true);
      setPermissionStatus('default');
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationManager.requestPermissions();
    if (granted) {
      setPermissionStatus('granted');
      setShowBanner(false);
      localStorage.setItem('notification-banner-shown', 'true');
    } else {
      setPermissionStatus('denied');
      setShowBanner(false);
      localStorage.setItem('notification-banner-shown', 'true');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('notification-banner-shown', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            🔔
          </div>
          <div>
            <h3 className="font-semibold">Enable Notifications</h3>
            <p className="text-sm text-blue-100">
              Get notified when you receive new messages, even when the app is in the background.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleEnableNotifications}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Enable
          </button>
          <button
            onClick={handleDismiss}
            className="text-blue-100 hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
