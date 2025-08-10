// Notification sound management
class NotificationSound {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      // Create audio context for better browser compatibility
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple notification sound using Web Audio API
      this.createNotificationSound();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 Audio');
      this.createFallbackAudio();
    }
  }

  private createNotificationSound() {
    try {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(800, this.audioContext!.currentTime);
      oscillator.frequency.setValueAtTime(600, this.audioContext!.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);
      
      oscillator.start(this.audioContext!.currentTime);
      oscillator.stop(this.audioContext!.currentTime + 0.3);
    } catch (error) {
      console.warn('Failed to create Web Audio sound, using fallback');
      this.createFallbackAudio();
    }
  }

  private createFallbackAudio() {
    // Create a simple beep sound using HTML5 Audio
    this.audio = new Audio();
    this.audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
    this.audio.volume = 0.3;
  }

  play() {
    try {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(console.warn);
      } else {
        this.createNotificationSound();
      }
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }
}

// Title bar badge management
class TitleBadge {
  private originalTitle: string = '';
  private badgeCount: number = 0;

  constructor() {
    this.originalTitle = document.title;
  }

  setBadge(count: number) {
    this.badgeCount = count;
    if (count > 0) {
      document.title = `(${count}) ${this.originalTitle}`;
    } else {
      document.title = this.originalTitle;
    }
  }

  increment() {
    this.setBadge(this.badgeCount + 1);
  }

  decrement() {
    this.setBadge(Math.max(0, this.badgeCount - 1));
  }

  reset() {
    this.setBadge(0);
  }

  getCount() {
    return this.badgeCount;
  }
}

// Push notification management
class PushNotifications {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title: string, options: NotificationOptions = {}) {
    if (this.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/chatox-icon.svg', // Updated to use SVG icon
        badge: '/icons/chatox-icon.svg',
        tag: 'chatox-message',
        requireInteraction: false,
        silent: false,
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  getPermissionStatus() {
    return this.permission;
  }
}

// Main notification manager
class NotificationManager {
  private sound: NotificationSound;
  private titleBadge: TitleBadge;
  private pushNotifications: PushNotifications;
  private unreadCounts: Map<string, number> = new Map();
  private isPageVisible: boolean = true;

  constructor() {
    this.sound = new NotificationSound();
    this.titleBadge = new TitleBadge();
    this.pushNotifications = new PushNotifications();
    this.setupVisibilityListener();
  }

  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (this.isPageVisible) {
        this.resetTitleBadge();
      }
    });
  }

  // Handle new message notification
  async notifyNewMessage(senderName: string, message: string, chatId: string) {
    // Play sound
    this.sound.play();

    // Update unread count for this chat
    const currentCount = this.unreadCounts.get(chatId) || 0;
    this.unreadCounts.set(chatId, currentCount + 1);

    // Update title badge
    this.titleBadge.increment();

    // Show push notification if page is not visible
    if (!this.isPageVisible) {
      await this.pushNotifications.showNotification(
        `New message from ${senderName}`,
        {
          body: message,
          data: { chatId, senderName }
        }
      );
    }
  }

  // Mark chat as read
  markChatAsRead(chatId: string) {
    const count = this.unreadCounts.get(chatId) || 0;
    if (count > 0) {
      this.titleBadge.decrement();
      this.unreadCounts.set(chatId, 0);
    }
  }

  // Get unread count for a specific chat
  getUnreadCount(chatId: string): number {
    return this.unreadCounts.get(chatId) || 0;
  }

  // Get total unread count
  getTotalUnreadCount(): number {
    return Array.from(this.unreadCounts.values()).reduce((sum, count) => sum + count, 0);
  }

  // Reset title badge (when user focuses the page)
  resetTitleBadge() {
    this.titleBadge.reset();
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    return await this.pushNotifications.requestPermission();
  }

  // Get permission status
  getPermissionStatus() {
    return this.pushNotifications.getPermissionStatus();
  }
}

// Create and export singleton instance
export const notificationManager = new NotificationManager();

// Export individual classes for testing/advanced usage
export { NotificationSound, TitleBadge, PushNotifications, NotificationManager };
