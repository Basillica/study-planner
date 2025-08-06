// src/pages/FlashcardPage.tsx

import { createSignal, createEffect, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { store } from "../store/store";
import { FlashcardQuestion } from "../questions";
import { showNotification } from "../store/notification";

function FlashcardPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [flashcards, setFlashcards] = createSignal<FlashcardQuestion[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = createSignal(0);
    const [isFlipped, setIsFlipped] = createSignal(false);

    // Fetch flashcards for the selected set
    createEffect(() => {
        const foundSet = store.studySets.find((s) => s.id === params.id);
        if (!foundSet) {
            navigate("/sets");
            return;
        }
        const flashcardQuestions = foundSet.questions.filter(
            (q) => q.type === "flashcard"
        ) as FlashcardQuestion[];

        if (flashcardQuestions.length === 0) {
            showNotification("This study set has no flashcards.", "warning");
            navigate(`/sets/${params.id}`);
            return;
        }
        setFlashcards(flashcardQuestions);
    });

    const currentCard = () => flashcards()[currentCardIndex()];

    const flipCard = () => {
        setIsFlipped(!isFlipped());
    };

    const nextCard = () => {
        if (currentCardIndex() < flashcards().length - 1) {
            setCurrentCardIndex(currentCardIndex() + 1);
            setIsFlipped(false); // Flip back to front
        } else {
            showNotification(
                "You have reached the end of the flashcards.",
                "ok"
            );
        }
    };

    const prevCard = () => {
        if (currentCardIndex() > 0) {
            setCurrentCardIndex(currentCardIndex() - 1);
            setIsFlipped(false); // Flip back to front
        }
    };

    return (
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-3xl font-bold">Flashcard Mode</h2>
                <button
                    onClick={() => navigate(`/sets/${params.id}`)}
                    class="px-4 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600"
                >
                    Back to Set
                </button>
            </div>

            <Show when={flashcards().length > 0}>
                <div class="bg-white p-6 rounded-lg shadow-md min-h-[300px] flex flex-col justify-between">
                    <div>
                        <p class="text-gray-500 text-sm mb-2">
                            Card {currentCardIndex() + 1} of{" "}
                            {flashcards().length}
                        </p>
                        <div
                            class="min-h-[200px] flex items-center justify-center text-center p-4 cursor-pointer"
                            onClick={flipCard}
                        >
                            <p class="text-xl font-semibold">
                                {isFlipped()
                                    ? currentCard()?.back
                                    : currentCard()?.front}
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 flex justify-between">
                        <button
                            onClick={prevCard}
                            disabled={currentCardIndex() === 0}
                            class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                        >
                            Previous
                        </button>
                        <button
                            onClick={nextCard}
                            disabled={
                                currentCardIndex() === flashcards().length - 1
                            }
                            class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
}

export default FlashcardPage;
