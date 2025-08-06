import { createSignal, type Component, Show } from "solid-js";
import {
    FlashcardDeckList,
    FlashcardDeckView,
    FlashcardForm,
} from "../../components/flash";
import { AnalyticsDashboard } from "../../components/readingplan";
import { Quiz } from "../quiz/main";
import { showNotification } from "../../store/notification";
import { CommunityDeckList } from "../../components/flash/CommunityDeckList";
import { UserProfile } from "../../components/readingplan/UserProfile";

type ReadingPlan = { id: string; title: string };
type User = { id: string; name: string };
const currentUser: User = { id: "user1", name: "John Doe" };
const communityUsers: User[] = [
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Alex Johnson" },
    { id: "user1", name: "John Doe" },
];

export type Flashcard = {
    id: string;
    question: string;
    answer: string;
    //
    lastReviewed: Date | null;
    nextReview: Date;
    interval: number;
    difficultyLevel: number;
};

export type FlashcardDeck = {
    id: string;
    title: string;
    readingPlanId: string;
    readingPlanTitle: string;
    flashcards: Flashcard[];
    //
    userId: string;
    author: string;
};

export const generateFlashcardDecks2 = (
    count: number,
    readingPlan: ReadingPlan
): FlashcardDeck[] => {
    const generatedDecks: FlashcardDeck[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        // Generate mock flashcards for each deck
        const flashcards: Flashcard[] = Array.from({ length: 3 }, (_, j) => ({
            id: `fc-${Math.random().toString(36).substring(2, 9)}`,
            question: `Question ${j + 1} for Deck ${i + 1}`,
            answer: `Answer ${j + 1} for Deck ${i + 1}`,
            lastReviewed: null,
            nextReview: now,
            interval: 0,
            difficultyLevel: 0,
        }));

        // Create a new deck object
        const newDeck: FlashcardDeck = {
            id: `deck-${Math.random().toString(36).substring(2, 9)}`,
            userId: currentUser.id,
            author: currentUser.name,
            title: `SolidJS Deck ${i + 1}`,
            readingPlanId: readingPlan.id,
            readingPlanTitle: readingPlan.title,
            flashcards: flashcards,
        };

        generatedDecks.push(newDeck);
    }

    return generatedDecks;
};

export const generateFlashcardDecks = (
    count: number,
    readingPlan: ReadingPlan,
    users: User[]
): FlashcardDeck[] => {
    const generatedDecks: FlashcardDeck[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        // Randomly select a user from the provided array
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Generate mock flashcards for each deck
        const flashcards: Flashcard[] = Array.from({ length: 3 }, (_, j) => ({
            id: `fc-${Math.random().toString(36).substring(2, 9)}`,
            question: `Question ${j + 1} for Deck ${i + 1}`,
            answer: `Answer ${j + 1} for Deck ${i + 1}`,
            lastReviewed: null,
            nextReview: now,
            interval: 0,
            difficultyLevel: 0,
        }));

        // Create a new deck object with the randomly selected user's details
        const newDeck: FlashcardDeck = {
            id: `deck-${Math.random().toString(36).substring(2, 9)}`,
            userId: randomUser.id,
            author: randomUser.name,
            title: `SolidJS Deck ${i + 1}`,
            readingPlanId: readingPlan.id,
            readingPlanTitle: readingPlan.title,
            flashcards: flashcards,
        };

        generatedDecks.push(newDeck);
    }

    return generatedDecks;
};

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);

const initialQuizzes: Quiz[] = [
    {
        id: "q1",
        title: "SolidJS Basics",
        questionCount: 5,
        status: "ready",
        readingPlanId: "1",
        readingPlanTitle: "SolidJS Mastery",
    },
];

interface Achievement {
    title: string;
    description: string;
    id: string;
}

const allAchievements: Achievement[] = [
    {
        id: "beginner_studier",
        title: "Rookie Learner",
        description: "Earn your first 100 points.",
    },
    {
        id: "dedicated_studier",
        title: "Dedicated Learner",
        description: "Reach 500 total points.",
    },
    {
        id: "expert_studier",
        title: "Expert Learner",
        description: "Reach 1000 total points.",
    },
];

export const FlashcardModule: Component = () => {
    const [view, setView] = createSignal<
        "list" | "community" | "form" | "deck" | "analytics" | "profile"
    >("list");

    const initialPlans: ReadingPlan[] = [
        { id: "1", title: "SolidJS Mastery" },
        { id: "2", title: "Data Structures & Algorithms" },
        { id: "3", title: "React Mastery" },
        { id: "4", title: "Rust" },
    ];

    let Decks: FlashcardDeck[] = [];
    initialPlans.forEach((plan) => {
        const decks = generateFlashcardDecks(3, plan, communityUsers);
        Decks = [...Decks, ...decks];
    });

    const [flashcardDecks, setFlashcardDecks] =
        createSignal<FlashcardDeck[]>(Decks);
    const [selectedDeck, setSelectedDeck] = createSignal<FlashcardDeck | null>(
        null
    );
    const [readingPlans] = createSignal<ReadingPlan[]>(initialPlans);
    const [quizzes] = createSignal<Quiz[]>(initialQuizzes);
    const [userPoints, setUserPoints] = createSignal(150);
    const [unlockedAchievements, setUnlockedAchievements] = createSignal<
        Achievement[]
    >([]);

    const handleCreateDeck = () => setView("form");
    const handleSaveDeck = (deckData: Omit<FlashcardDeck, "id">) => {
        const newDeck = {
            ...deckData,
            id: `deck${flashcardDecks().length + 1}`,
        };
        setFlashcardDecks([...flashcardDecks(), newDeck]);
        setView("list");
    };
    const handleCancel = () => setView("list");

    const viewDeck = (deckId: string) => {
        const deck = flashcardDecks().find((d) => d.id === deckId);
        if (deck) {
            setSelectedDeck(deck);
            setView("deck");
        }
    };

    const deleteDeck = (deckId: string) => {
        if (
            window.confirm(
                "Are you sure you want to delete this flashcard deck?"
            )
        ) {
            setFlashcardDecks(flashcardDecks().filter((d) => d.id !== deckId));
        }
    };

    const backToList = () => {
        setView("list");
        setSelectedDeck(null);
    };

    const showAnalytics = () => setView("analytics");
    const showProfile = () => setView("profile");
    const showCommunity = () => setView("community");
    const showMyDecks = () => setView("list");

    const handleForkDeck = (deckId: string) => {
        const deckToFork = flashcardDecks().find((d) => d.id === deckId);
        if (deckToFork) {
            const newDeck = {
                ...deckToFork,
                id: `deck${Math.random().toString(36).substring(2, 9)}`,
                userId: currentUser.id,
                author: currentUser.name,
                title: `${deckToFork.title} (Forked)`,
                // Reset SRS stats for the new user
                flashcards: deckToFork.flashcards.map((card) => ({
                    ...card,
                    lastReviewed: null,
                    nextReview: new Date(),
                    interval: 0,
                    difficultyLevel: 0,
                })),
            };
            setFlashcardDecks((prev) => [...prev, newDeck]);
            setView("list");
            alert(`"${newDeck.title}" has been added to your decks!`);
        }
    };

    const myDecks = () =>
        flashcardDecks().filter((deck) => deck.userId === currentUser.id);
    const communityDecks = () =>
        flashcardDecks().filter((deck) => deck.userId !== currentUser.id);

    ///////////////
    const checkAchievements = (
        totalPoints: number,
        currentAchievements: Achievement[]
    ) => {
        const newAchievements = [];
        const currentAchievementIds = new Set(
            currentAchievements.map((a) => a.id)
        );

        for (const achievement of allAchievements) {
            // Check if the achievement is not already unlocked
            if (!currentAchievementIds.has(achievement.id)) {
                // Example criteria: check against a point threshold
                if (
                    achievement.id === "beginner_studier" &&
                    totalPoints >= 100
                ) {
                    newAchievements.push(achievement);
                } else if (
                    achievement.id === "dedicated_studier" &&
                    totalPoints >= 500
                ) {
                    newAchievements.push(achievement);
                } else if (
                    achievement.id === "expert_studier" &&
                    totalPoints >= 1000
                ) {
                    newAchievements.push(achievement);
                }
            }
        }
        return newAchievements;
    };

    const handleUpdatePoints = (points: number) => {
        const newTotalPoints = userPoints() + points;
        setUserPoints(newTotalPoints);

        // Check for new achievements
        const newAchievements = checkAchievements(
            newTotalPoints,
            unlockedAchievements()
        );

        if (newAchievements.length > 0) {
            setUnlockedAchievements((prev) => [...prev, ...newAchievements]);
            newAchievements.forEach((a) =>
                showNotification(`Achievement Unlocked: ${a.title}! 🎉`, "ok")
            );
        }
    };

    return (
        // <div class="container mx-auto p-4 md:p-8">
        //     <h1 class="text-3xl md:text-4xl font-bold mb-6">Flashcards</h1>

        //     <div class="mb-4">
        //         {view() !== "analytics" && (
        //             <button
        //                 onClick={showAnalytics}
        //                 class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        //                 style={"margin-right: 4px"}
        //             >
        //                 <i class="fas fa-chart-line mr-2"></i> View Analytics
        //             </button>
        //         )}

        //         <button
        //             onClick={() => setView("list")}
        //             class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        //         >
        //             <i class="fas fa-chart-line mr-2"></i> Go Back
        //         </button>
        //     </div>
        //     <Show
        //         when={view() === "list"}
        //         fallback={
        //             <Show
        //                 when={view() === "form"}
        //                 fallback={
        //                     <Show
        //                         when={view() === "deck"}
        //                         fallback={
        //                             <AnalyticsDashboard
        //                                 readingPlans={readingPlans()}
        //                                 flashcardDecks={flashcardDecks()}
        //                                 quizzes={quizzes()}
        //                             />
        //                         }
        //                     >
        //                         <FlashcardDeckView
        //                             deck={selectedDeck()!}
        //                             onBackToList={backToList}
        //                             onUpdatePoints={handleUpdatePoints}
        //                         />
        //                     </Show>
        //                 }
        //             >
        //                 <FlashcardForm
        //                     onSave={handleSaveDeck}
        //                     onCancel={handleCancel}
        //                     readingPlans={initialPlans}
        //                 />
        //             </Show>
        //         }
        //     >
        //         <FlashcardDeckList
        //             decks={flashcardDecks()}
        //             onNewDeck={handleCreateDeck}
        //             onViewDeck={viewDeck}
        //             onDeleteDeck={deleteDeck}
        //         />
        //     </Show>
        // </div>
        <div class="container mx-auto p-4 md:p-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-6">Flashcards</h1>
            <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <button
                    onClick={showMyDecks}
                    class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-list mr-2"></i> My Decks
                </button>
                <button
                    onClick={showCommunity}
                    class="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-users mr-2"></i> Community Decks
                </button>
                <button
                    onClick={showAnalytics}
                    class="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-chart-line mr-2"></i> Analytics
                </button>
                <button
                    onClick={showProfile}
                    class="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-user-circle mr-2"></i> Profile
                </button>
            </div>
            {/* <div class="flex space-x-2 mb-4">
                <button
                    onClick={showMyDecks}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-list mr-2"></i> My Decks
                </button>
                <button
                    onClick={showCommunity}
                    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-users mr-2"></i> Community Decks
                </button>
                <button
                    onClick={showAnalytics}
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-chart-line mr-2"></i> Analytics
                </button>
                <button
                    onClick={showProfile}
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-user-circle mr-2"></i> Profile
                </button>
            </div> */}

            <Show when={view() === "list"}>
                <FlashcardDeckList
                    decks={myDecks()}
                    onNewDeck={handleCreateDeck}
                    onViewDeck={viewDeck}
                    onDeleteDeck={deleteDeck}
                />
            </Show>
            <Show when={view() === "community"}>
                <CommunityDeckList
                    decks={communityDecks()}
                    onForkDeck={handleForkDeck}
                />
            </Show>
            <Show when={view() === "form"}>
                <FlashcardForm
                    onSave={handleSaveDeck}
                    onCancel={handleCancel}
                    readingPlans={initialPlans}
                />
            </Show>
            <Show when={view() === "deck"}>
                <FlashcardDeckView
                    deck={selectedDeck()!}
                    onBackToList={backToList}
                    onUpdatePoints={handleUpdatePoints}
                />
            </Show>
            <Show when={view() === "analytics"}>
                <AnalyticsDashboard
                    readingPlans={readingPlans()}
                    flashcardDecks={myDecks()} // Pass only user's decks to analytics
                    quizzes={quizzes()}
                />
            </Show>
            <Show when={view() === "profile"}>
                <UserProfile
                    points={userPoints()}
                    achievements={unlockedAchievements()}
                />
            </Show>
        </div>
    );
};
