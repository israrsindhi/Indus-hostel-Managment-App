
import { useEffect, useRef } from 'react';

const schedule = [
  // Breakfast
  { hour: 8, minute: 0, title: "Breakfast Starts!", body: "Breakfast is now being served until 9:30 AM." },
  { hour: 9, minute: 30, title: "Breakfast Ends", body: "Breakfast service is now over." },
  // Lunch
  { hour: 13, minute: 0, title: "Lunch Starts!", body: "Lunch is now being served until 3:00 PM." },
  { hour: 15, minute: 0, title: "Lunch Ends", body: "Lunch service is now over." },
  // Dinner
  { hour: 20, minute: 0, title: "Dinner Starts!", body: "Dinner is now being served until 9:30 PM." },
  { hour: 21, minute: 30, title: "Dinner Ends", body: "Dinner service is now over." },
  // Gate Closing
  { hour: 23, minute: 50, title: "Gate Closing Soon", body: "The main gate will close in 10 minutes." },
  { hour: 0, minute: 0, title: "Gate Closed", body: "The main gate is now closed until 6:00 AM." },
  // Gate Opening
  { hour: 5, minute: 50, title: "Gate Opening Soon", body: "The main gate will open in 10 minutes." },
  { hour: 6, minute: 0, title: "Gate Open", body: "The main gate is now open." },
  // Cleaning
  { hour: 17, minute: 0, title: "Cleaning Time", body: "Cleaning services will be active from 5:00 PM to 7:00 PM." },
];

export const useNotifications = () => {
  const notificationsSent = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 1. Request permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // 2. Set up interval to check time
    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));


      schedule.forEach(({ hour, minute, title, body }) => {
        const notificationKey = `${dayOfYear}-${hour}-${minute}`;
        
        if (currentHour === hour && currentMinute === minute && !notificationsSent.current.has(notificationKey)) {
          new Notification(title, { body });
          notificationsSent.current.add(notificationKey);
        }
      });

      // Clear old notifications at the start of a new day
      if (currentHour === 0 && currentMinute === 1) {
          notificationsSent.current.clear();
      }

    }, 60000); // Check every minute

    // 3. Cleanup
    return () => clearInterval(interval);
  }, []);
};