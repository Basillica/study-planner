import { createEffect, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FlashcardQuestion } from "../questions";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { store } from "../store/store";
import { showNotification } from "../store/notification";

interface FlashcardState {
    index: number;
    showAnswer: boolean;
    setId: string | null;
    flashcardQuestions: FlashcardQuestion[];
}

function FlashcardsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [flashcardState, setFlashcardState] = createStore<FlashcardState>({
        index: 0,
        showAnswer: false,
        setId: null,
        flashcardQuestions: [],
    });

    createEffect(() => {
        const selectedSet = store.studySets.find(
            (s) => s.id === searchParams.setId
        );
        if (!selectedSet) {
            navigate("/");
            return;
        }
        const questions = selectedSet.questions.filter(
            (q) => q.type === "flashcard"
        ) as FlashcardQuestion[];
        if (questions.length === 0) {
            showNotification("This study set has no flashcards.", "warning");
            navigate("/");
            return;
        }
        setFlashcardState({
            index: 0,
            showAnswer: false,
            setId: selectedSet.id,
            flashcardQuestions: questions,
        });
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

    return (
        <div>
            <h2 class="text-2xl font-bold mb-4">Flashcards</h2>
            <Show when={currentFlashcard()}>
                <div
                    class="flashcard-container bg-blue-500 text-white min-h-[200px] flex items-center justify-center p-6 rounded-lg text-xl cursor-pointer transition-transform duration-500 transform-gpu"
                    classList={{ "is-flipped": flashcardState.showAnswer }}
                    onClick={flipCard}
                >
                    <div class="flashcard-content">
                        <div class="flashcard-face flashcard-face--front">
                            {currentFlashcard()?.front}
                        </div>
                        <div class="flashcard-face flashcard-face--back">
                            {currentFlashcard()?.back}
                        </div>
                    </div>
                </div>
                <div class="flex justify-center mt-4">
                    <button
                        class="p-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
                        onClick={nextCard}
                    >
                        Next Flashcard
                    </button>
                </div>
            </Show>
            <Show when={!currentFlashcard()}>
                <div class="text-center p-6 bg-gray-100 rounded-md">
                    <p class="text-xl font-bold">No flashcards in this set.</p>
                    <button
                        class="mt-4 p-2 bg-blue-500 text-white rounded-md"
                        onClick={() => navigate("/")}
                    >
                        Go back to Home
                    </button>
                </div>
            </Show>
        </div>
    );
}

export default FlashcardsPage;
