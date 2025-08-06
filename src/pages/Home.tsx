import { A, useNavigate } from "@solidjs/router";
import { createSignal, onMount, For, Show } from "solid-js";
import { store } from "../store/store";
import { showNotification } from "../store/notification";

const QUIZ_STATE_KEY = "az305-quiz-state";

export const Homer = () => {
    const [hasSavedQuiz, setHasSavedQuiz] = createSignal(false);
    const [selectedSetId, setSelectedSetId] = createSignal<string>("");
    const navigate = useNavigate();

    onMount(() => {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState && savedState !== "{}") {
            setHasSavedQuiz(true);
        }
    });

    const startQuiz = () => {
        if (selectedSetId()) {
            // Navigate to the quiz page with the selected set ID
            // We will implement loading from this ID in the next step
            navigate(`/quiz?setId=${selectedSetId()}`);
        } else {
            showNotification("Please select a study first.", "warning");
        }
    };

    const startFlashcards = () => {
        if (selectedSetId()) {
            // Navigate to the flashcard page with the selected set ID
            navigate(`/flashcards?setId=${selectedSetId()}`);
        } else {
            showNotification("Please select a study first", "warning");
        }
    };

    return (
        <div>
            <h2 class="text-2xl font-bold mb-4">
                Welcome to your AZ-305 Study Assistant
            </h2>
            <p class="mb-6">Choose an activity to get started:</p>

            {/* Study Set Selector */}
            <div class="mb-6 p-4 border rounded-md">
                <h3 class="text-xl font-semibold mb-2">Select a Study Set</h3>
                <select
                    value={selectedSetId()}
                    onChange={(e) => setSelectedSetId(e.currentTarget.value)}
                    class="block w-full p-2 border rounded-md"
                >
                    <option value="" disabled>
                        -- Select a study set --
                    </option>
                    <For each={store.studySets}>
                        {(set) => <option value={set.id}>{set.name}</option>}
                    </For>
                </select>
            </div>

            <div class="space-y-4">
                <Show when={hasSavedQuiz()}>
                    <A
                        href="/quiz"
                        class="block w-full p-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 text-center"
                    >
                        Resume Quiz
                    </A>
                </Show>
                <button
                    onClick={startQuiz}
                    class="block w-full p-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 text-center"
                >
                    Start New Quiz
                </button>
                <button
                    onClick={startFlashcards}
                    class="block w-full p-3 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 text-center"
                >
                    Start Flashcards
                </button>
                <A
                    href="/planner"
                    class="block w-full p-3 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-600 text-center"
                >
                    Study Planner
                </A>
                <A
                    href="/notes"
                    class="block w-full p-3 bg-indigo-500 text-white rounded-md font-semibold hover:bg-indigo-600 text-center"
                >
                    My Notes
                </A>
            </div>
        </div>
    );
};

export const Home = () => {
    return (
        <div class="bg-gray-100 font-sans">
            <section class="bg-gray-800 text-white py-20 px-4 md:px-8">
                <div class="container mx-auto text-center">
                    <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4">
                        Master Your Studies, One Plan at a Time
                    </h1>
                    <p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Our platform helps you structure your learning with
                        smart reading plans, quizzes, and flashcards powered by
                        spaced repetition.
                    </p>
                    <a
                        href="#"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                    >
                        Start Your Free Plan Today
                    </a>
                </div>
            </section>

            <section class="py-16 px-4 md:px-8">
                <div class="container mx-auto">
                    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
                        Features Designed for Better Learning
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <div class="text-blue-600 text-4xl mb-4 text-center">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-center">
                                Structured Reading Plans
                            </h3>
                            <p class="text-gray-600 text-center">
                                Upload your materials and create a custom plan
                                with deadlines to stay on track.
                            </p>
                        </div>

                        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <div class="text-blue-600 text-4xl mb-4 text-center">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-center">
                                Interactive Quizzes
                            </h3>
                            <p class="text-gray-600 text-center">
                                Auto-generate quizzes from your Q&A pairs to
                                test your knowledge instantly.
                            </p>
                        </div>

                        <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <div class="text-blue-600 text-4xl mb-4 text-center">
                                <i class="fas fa-th"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-2 text-center">
                                Spaced Repetition Flashcards
                            </h3>
                            <p class="text-gray-600 text-center">
                                Optimize your memory with an Anki-like flashcard
                                system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-gray-800 text-white py-16 px-4 md:px-8">
                <div class="container mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Boost Your Learning?
                    </h2>
                    <p class="text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of students who are taking control of
                        their studies.
                    </p>
                    <a
                        href="#"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                    >
                        Get Started Now
                    </a>
                </div>
            </section>
        </div>
    );
};
