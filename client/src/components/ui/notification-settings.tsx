import { useState, useEffect } from "react";
import { notificationManager } from "../../utils/notifications";

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [titleBadgeEnabled, setTitleBadgeEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setPermissionStatus(notificationManager.getPermissionStatus());
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const granted = await notificationManager.requestPermissions();
    if (granted) {
      setPermissionStatus('granted');
    }
  };

  const handleTestNotification = async () => {
    if (permissionStatus === 'granted') {
      await notificationManager.showNotification(
        'Test Notification',
        {
          body: 'This is a test notification from Chatox!',
          icon: '/icons/chatox-icon.svg'
        }
      );
    }
  };

  const handleTestSound = () => {
    // Use the notification manager's test sound method
    notificationManager.testSound();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notification Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Permission Status */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Browser Permissions</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Status: {permissionStatus === 'granted' ? '✅ Allowed' : 
                         permissionStatus === 'denied' ? '❌ Denied' : '❓ Not Set'}
              </span>
              {permissionStatus !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Request Permission
                </button>
              )}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Sound</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Play notification sound</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sound-toggle"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded"
                />
                <button
                  onClick={handleTestSound}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Title Badge Settings */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Title Badge</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show unread count in browser tab</span>
              <input
                type="checkbox"
                id="title-badge-toggle"
                checked={titleBadgeEnabled}
                onChange={(e) => setTitleBadgeEnabled(e.target.checked)}
                className="rounded"
              />
            </div>
          </div>

          {/* Push Notification Settings */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Push Notifications</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show desktop notifications</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="push-toggle"
                  checked={pushNotificationsEnabled}
                  onChange={(e) => setPushNotificationsEnabled(e.target.checked)}
                  className="rounded"
                />
                <button
                  onClick={handleTestNotification}
                  disabled={permissionStatus !== 'granted'}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test
                </button>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="pt-4">
            <h3 className="font-medium mb-2">Test Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={handleTestSound}
                className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
              >
                Test Sound
              </button>
              <button
                onClick={handleTestNotification}
                disabled={permissionStatus !== 'granted'}
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Push Notification
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
