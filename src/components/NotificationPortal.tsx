import { Show } from "solid-js";
import { notificationStore } from "../store/notification"; // Make sure the path is correct
import { Portal } from "solid-js/web";

const getStyles = (type: "ok" | "warning" | "error") => {
    switch (type) {
        case "ok":
            return "bg-green-500";
        case "warning":
            return "bg-yellow-500";
        case "error":
            return "bg-red-500";
    }
};

const NotificationPortal = () => {
    const portalStyles = `
    fixed top-24 left-1/2 w-80 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl
    text-white font-semibold transition-transform duration-300 transform
    z-[100]
    ${notificationStore.visible ? "translate-y-0" : "-translate-y-20"}
  `;

    return (
        <Portal>
            <Show when={notificationStore.visible}>
                <div
                    class={`${portalStyles} ${getStyles(
                        notificationStore.type
                    )}`}
                    role="alert"
                >
                    {notificationStore.message}
                </div>
            </Show>
        </Portal>
    );
};

export default NotificationPortal;
