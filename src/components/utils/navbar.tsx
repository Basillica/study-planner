import {
    createSignal,
    type Component,
    For,
    onMount,
    onCleanup,
} from "solid-js";

export const Navbar: Component = () => {
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen());

    // Signal to track the active submenu (null if none are open)
    const [activeSubmenu, setActiveSubmenu] = createSignal<string | null>(null);
    // Toggle a specific submenu by its ID
    const toggleSubmenu = (id: string) => {
        // Close the current submenu if the same one is clicked again, otherwise open the new one
        setActiveSubmenu(activeSubmenu() === id ? null : id);
    };
    // Ref for the main navigation element
    let navRef: HTMLDivElement | undefined;

    // Handle clicks outside the navigation to close submenus
    onMount(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the navigation element
            if (navRef && !navRef.contains(event.target as Node)) {
                setActiveSubmenu(null); // Close any open submenu
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        // Clean up the event listener when the component is unmounted
        onCleanup(() => {
            document.removeEventListener("mousedown", handleClickOutside);
        });
    });

    const menuItems = [
        { id: "home", title: "Home", link: "/", icon: "fa-home" },
        {
            id: "my-content",
            title: "My Content",
            icon: "fa-folder-open",
            submenus: [
                {
                    id: "reading-plans",
                    title: "Reading Plans",
                    link: "/reading/plans",
                    icon: "fa-book-reader",
                },
                {
                    id: "qa-sets",
                    title: "Q&A Sets",
                    link: "/qa-sets",
                    icon: "fa-question-circle",
                },
            ],
        },
        {
            id: "study-tools",
            title: "Study Tools",
            icon: "fa-brain",
            submenus: [
                {
                    id: "quizzes",
                    title: "Quizzes",
                    link: "/quizes",
                    icon: "fa-list-ol",
                },
                {
                    id: "flashcards",
                    title: "Flashcards",
                    link: "/flashcards",
                    icon: "fa-th",
                },
            ],
        },
        {
            id: "analytics",
            title: "Analytics",
            link: "#analytics",
            icon: "fa-chart-bar",
        },
        {
            id: "account",
            title: "Account",
            icon: "fa-user-circle",
            submenus: [
                {
                    id: "profile",
                    title: "Profile",
                    link: "#profile",
                    icon: "fa-user",
                },
                {
                    id: "settings",
                    title: "Settings",
                    link: "#settings",
                    icon: "fa-cog",
                },
                {
                    id: "about",
                    title: "About",
                    link: "#about",
                    icon: "fa-info-circle",
                },
                {
                    id: "contact",
                    title: "Contact",
                    link: "#contact",
                    icon: "fa-envelope",
                },
            ],
        },
    ];

    return (
        <nav class="bg-gray-500 p-4 relative" ref={navRef}>
            <div class="mx-auto flex justify-between items-center">
                <a
                    href="/"
                    class="text-white font-bold flex items-center space-x-2"
                >
                    <i class="fas fa-book text-3xl text-blue-400"></i>
                    <span class="text-2xl">Pastor</span>
                </a>

                {/* Hamburger Button - visible on small screens */}
                <div class="md:hidden">
                    <button
                        onClick={toggleMenu}
                        class="text-white focus:outline-none"
                        aria-expanded={isMenuOpen()}
                        aria-controls="mobile-menu"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Main Navigation Links (Desktop) */}
                <div class="hidden md:flex space-x-6">
                    <For each={menuItems}>
                        {(item) => (
                            <div>
                                {item.submenus ? (
                                    <div class="relative">
                                        <button
                                            onClick={() =>
                                                toggleSubmenu(item.id)
                                            }
                                            class="text-gray-300 hover:text-white transition duration-300 flex items-center space-x-2"
                                        >
                                            <i
                                                class={`fas ${item.icon} mr-2`}
                                            ></i>
                                            <span>{item.title}</span>
                                            <i
                                                class={`fas fa-chevron-down ml-1 transition-transform duration-300 transform ${
                                                    activeSubmenu() === item.id
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            ></i>
                                        </button>
                                        <div
                                            class={`${
                                                activeSubmenu() === item.id
                                                    ? "block"
                                                    : "hidden"
                                            } absolute left-0 mt-2 w-48 bg-gray-600 rounded-md shadow-lg py-1 z-20`}
                                        >
                                            <For each={item.submenus}>
                                                {(sub) => (
                                                    <a
                                                        href={sub.link}
                                                        class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                                                    >
                                                        {sub.title}
                                                    </a>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href={item.link}
                                        class="text-gray-300 hover:text-white transition duration-300 flex items-center"
                                    >
                                        <i class={`fas ${item.icon} mr-2`}></i>
                                        {item.title}
                                    </a>
                                )}
                            </div>
                        )}
                    </For>
                </div>
            </div>

            {/* Mobile Menu - overlays the page */}
            <div
                class={`fixed top-0 left-0 w-64 h-full bg-gray-700 transform transition-transform duration-300 ease-in-out z-50 md:hidden
                    ${isMenuOpen() ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div class="p-4 flex justify-end">
                    <button onClick={toggleMenu} class="text-white">
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div class="p-4 space-y-4">
                    <For each={menuItems}>
                        {(item) => (
                            <div>
                                {item.submenus ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                toggleSubmenu(item.id)
                                            }
                                            class="block text-white hover:text-gray-300 w-full text-left flex items-center justify-between"
                                        >
                                            <span class="flex items-center">
                                                <i
                                                    class={`fas ${item.icon} mr-2`}
                                                ></i>
                                                {item.title}
                                            </span>
                                            <i
                                                class={`fas fa-chevron-down transition-transform duration-300 transform ${
                                                    activeSubmenu() === item.id
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            ></i>
                                        </button>
                                        <div
                                            class={`${
                                                activeSubmenu() === item.id
                                                    ? "block"
                                                    : "hidden"
                                            } ml-6 mt-2 space-y-2`}
                                        >
                                            <For each={item.submenus}>
                                                {(sub) => (
                                                    <a
                                                        href={sub.link}
                                                        onClick={toggleMenu}
                                                        class="block text-gray-300 hover:text-white text-sm"
                                                    >
                                                        {sub.title}
                                                    </a>
                                                )}
                                            </For>
                                        </div>
                                    </>
                                ) : (
                                    <a
                                        href={item.link}
                                        onClick={toggleMenu}
                                        class="block text-white hover:text-gray-300 flex items-center"
                                    >
                                        <i class={`fas ${item.icon} mr-2`}></i>
                                        {item.title}
                                    </a>
                                )}
                            </div>
                        )}
                    </For>
                </div>
            </div>

            <div
                onClick={toggleMenu}
                class={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden
                    ${isMenuOpen() ? "block" : "hidden"}`}
            ></div>
        </nav>
    );
};
