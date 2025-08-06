// import { type Component, Show } from "solid-js";
// import { createStore, produce } from "solid-js/store";
// import { FlashcardDeck } from "./types";

// type FlashcardDeckViewProps = {
//     deck: FlashcardDeck;
//     onBackToList: () => void;
// };

// export interface FlashcardQuestion {
//     id: number;
//     type: "flashcard";
//     front: string;
//     back: string;
//     topic: string;
// }

// interface FlashcardState {
//     index: number;
//     showAnswer: boolean;
//     setId: string | null;
//     flashcardQuestions: FlashcardQuestion[];
// }

// export const FlashcardDeckView: Component<FlashcardDeckViewProps> = (props) => {
//     const [flashcardState, setFlashcardState] = createStore<FlashcardState>({
//         index: 0,
//         showAnswer: false,
//         setId: null,
//         flashcardQuestions: [
//             {
//                 id: 1,
//                 type: "flashcard",
//                 front: "What is the purpose of an Azure Availability Zone?",
//                 back: "To protect applications and data from datacenter failures.",
//                 topic: "High Availability",
//             },
//             {
//                 id: 4,
//                 type: "flashcard",
//                 front: "What is the core function of an Azure Virtual Network (VNet)?",
//                 back: "A logical isolation of the Azure cloud dedicated to your subscription.",
//                 topic: "Networking",
//             },
//         ],
//     });

//     const flipCard = () => {
//         setFlashcardState(
//             produce((s) => {
//                 s.showAnswer = !s.showAnswer;
//             })
//         );
//     };

//     const nextCard = () => {
//         setFlashcardState(
//             produce((s) => {
//                 s.index = (s.index + 1) % s.flashcardQuestions.length;
//                 s.showAnswer = false;
//             })
//         );
//     };

//     const currentFlashcard = () =>
//         flashcardState.flashcardQuestions[flashcardState.index];

//     return (
//         <div>
//             <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
//                 <button
//                     onClick={props.onBackToList}
//                     class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto"
//                 >
//                     <i class="fas fa-arrow-left mr-2"></i> Back to Decks
//                 </button>
//                 <h2 class="text-2xl font-bold text-gray-800">
//                     {props.deck.title}
//                 </h2>
//             </div>

//             <Show when={currentFlashcard()}>
//                 <div
//                     class="flashcard-container mt-20 bg-blue-500 text-white min-h-[200px] flex items-center justify-center p-6 rounded-lg text-xl cursor-pointer transition-transform duration-500 transform-gpu"
//                     classList={{ "is-flipped": flashcardState.showAnswer }}
//                     onClick={flipCard}
//                 >
//                     <div class="flashcard-content">
//                         <div class="flashcard-face flashcard-face--front">
//                             {currentFlashcard()?.front}
//                         </div>
//                         <div class="flashcard-face flashcard-face--back">
//                             {currentFlashcard()?.back}
//                         </div>
//                     </div>
//                 </div>
//                 <div class="flex justify-center mt-10">
//                     <button
//                         class="p-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
//                         onClick={nextCard}
//                     >
//                         Next Flashcard
//                     </button>
//                 </div>
//             </Show>
//         </div>
//     );
// };

import { type Component, createSignal, Show, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FlashcardDeck, Flashcard } from "./types";

type FlashcardDeckViewProps = {
    deck: FlashcardDeck;
    onBackToList: () => void;
    onUpdatePoints: (points: number) => void;
};

interface FlashcardState {
    index: number;
    showAnswer: boolean;
    setId: string | null;
    flashcardQuestions: Flashcard[];
}

export const FlashcardDeckView: Component<FlashcardDeckViewProps> = (props) => {
    const [reviewCards, setReviewCards] = createSignal<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = createSignal(0);
    const [isFlipped, setIsFlipped] = createSignal(false);
    const [isSessionComplete, setIsSessionComplete] = createSignal(false);
    const [flashcardState, setFlashcardState] = createStore<FlashcardState>({
        index: 0,
        showAnswer: false,
        setId: null,
        flashcardQuestions: props.deck.flashcards,
    });
    const [sessionPoints, setSessionPoints] = createSignal(0);

    const currentCard = () => reviewCards()[currentCardIndex()];

    const calculatePoints = (rating: "again" | "hard" | "good" | "easy") => {
        switch (rating) {
            case "easy":
                return 5;
            case "good":
                return 3;
            case "hard":
                return 1;
            case "again":
                return 0;
            default:
                return 0;
        }
    };

    onMount(() => {
        // Filter for cards that are due for review
        const now = new Date();
        const dueCards = props.deck.flashcards.filter(
            (card) => new Date(card.nextReview) <= now
        );
        setReviewCards(dueCards);
    });

    const flipCard = () => {
        setFlashcardState(
            produce((s) => {
                s.showAnswer = !s.showAnswer;
            })
        );
    };

    const nextCard = () => {
        setFlashcardState(
            produce((s) => {
                s.index = (s.index + 1) % s.flashcardQuestions.length;
                s.showAnswer = false;
            })
        );
    };

    const currentFlashcard = () =>
        flashcardState.flashcardQuestions[flashcardState.index];

    // --- Spaced Repetition Logic (SuperMemo-2-like algorithm) ---
    const updateCardForReview = (
        card: Flashcard,
        rating: "again" | "hard" | "good" | "easy"
    ) => {
        const now = new Date();
        let newInterval = card.interval;
        let newDifficulty = card.difficultyLevel;

        if (rating === "again") {
            newInterval = 0;
            newDifficulty = 0;
        } else if (rating === "hard") {
            newInterval = newInterval > 0 ? newInterval : 1;
            newDifficulty = Math.max(0, newDifficulty - 1);
        } else if (rating === "good") {
            if (newDifficulty === 0) newInterval = 1;
            else if (newDifficulty === 1) newInterval = 6;
            else newInterval = Math.round(newInterval * newDifficulty);
            newDifficulty = newDifficulty + 0.1; // Simple increment
        } else if (rating === "easy") {
            if (newDifficulty === 0) newInterval = 1;
            else if (newDifficulty === 1) newInterval = 6;
            else newInterval = Math.round(newInterval * newDifficulty * 1.3); // Increased interval
            newDifficulty = newDifficulty + 0.3; // More significant increment
        }

        const nextReviewDate = new Date();
        nextReviewDate.setDate(now.getDate() + newInterval);

        return {
            ...card,
            lastReviewed: now,
            nextReview: nextReviewDate,
            interval: newInterval,
            difficultyLevel: newDifficulty,
        };
    };

    const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
        const updatedCard = updateCardForReview(currentCard(), rating);
        setReviewCards([
            ...reviewCards().filter((el) => el.id !== updatedCard.id),
            updatedCard,
        ]);

        // Award points for the rating
        setSessionPoints((prev) => prev + calculatePoints(rating));

        if (currentCardIndex() < reviewCards().length - 1) {
            setCurrentCardIndex(currentCardIndex() + 1);
            setIsFlipped(false);
        } else {
            setIsSessionComplete(true);
            // Award a bonus for completing the deck
            const bonusPoints = reviewCards().length * 2;
            setSessionPoints((prev) => prev + bonusPoints);
            // Send the total points earned to the parent component
            props.onUpdatePoints(sessionPoints() + bonusPoints);
        }
    };
    // -----------------------------------------------------------

    return (
        <div class="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <Show
                when={!isSessionComplete()}
                fallback={
                    <div class="text-center p-8">
                        <h2 class="text-3xl font-bold text-green-600 mb-4">
                            Session Complete! 🎉
                        </h2>
                        <p class="text-gray-600 mb-6">
                            You've reviewed all the cards that were due.
                        </p>
                        <button
                            onClick={props.onBackToList}
                            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <i class="fas fa-arrow-left mr-2"></i> Back to Decks
                        </button>
                    </div>
                }
            >
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                    <button
                        onClick={props.onBackToList}
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto"
                    >
                        <i class="fas fa-arrow-left mr-2"></i> Exit Session
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800">
                        {props.deck.title}
                    </h2>
                </div>

                <Show when={currentFlashcard()}>
                    <div
                        class="flashcard-container mt-20 bg-blue-500 text-white min-h-[200px] flex items-center justify-center p-6 rounded-lg text-xl cursor-pointer transition-transform duration-500 transform-gpu"
                        classList={{ "is-flipped": flashcardState.showAnswer }}
                        onClick={flipCard}
                    >
                        <div class="flashcard-content">
                            <div class="flashcard-face flashcard-face--front">
                                {currentFlashcard()?.question}
                            </div>
                            <div class="flashcard-face flashcard-face--back">
                                {currentFlashcard()?.answer}
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center mt-10">
                        <button
                            class="p-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
                            onClick={nextCard}
                        >
                            Next Flashcard
                        </button>
                    </div>

                    <Show when={flashcardState.showAnswer}>
                        <div class="flex justify-center space-x-2 mt-6">
                            <button
                                onClick={() => handleRating("again")}
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Again
                            </button>
                            <button
                                onClick={() => handleRating("hard")}
                                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Hard
                            </button>
                            <button
                                onClick={() => handleRating("good")}
                                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Good
                            </button>
                            <button
                                onClick={() => handleRating("easy")}
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Easy
                            </button>
                        </div>
                    </Show>
                </Show>
            </Show>
        </div>
    );
};
