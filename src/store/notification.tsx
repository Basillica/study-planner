import { createStore } from "solid-js/store";

export type NotificationType = "ok" | "warning" | "error";

interface NotificationState {
    message: string;
    type: NotificationType;
    visible: boolean;
}

const [notificationStore, setNotificationStore] =
    createStore<NotificationState>({
        message: "",
        type: "ok",
        visible: false,
    });

let timeoutId: number | undefined;

export const showNotification = (
    message: string,
    type: NotificationType = "ok",
    duration: number = 3000
) => {
    // Clear any existing timeout to prevent multiple notifications from stacking
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    setNotificationStore({
        message,
        type,
        visible: true,
    });

    // Automatically hide the notification after the duration
    timeoutId = setTimeout(() => {
        setNotificationStore("visible", false);
    }, duration);
};

export { notificationStore };
