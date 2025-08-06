import { createEffect, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { For } from "solid-js";
import { QuizQuestion } from "../questions";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { store } from "../store/store";
import { showNotification } from "../store/notification";

interface QuizState {
    index: number;
    score: number;
    showAnswer: boolean;
    selectedOptions: string[]; // Now an array for multi-select
    isCorrect: boolean | null;
    setId: string | null;
    quizQuestions: QuizQuestion[];
}

const QUIZ_STATE_KEY = "az305-quiz-state";

function QuizPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [quizState, setQuizState] = createStore<QuizState>({
        index: 0,
        score: 0,
        showAnswer: false,
        selectedOptions: [], // Initialize as an empty array
        isCorrect: null,
        setId: null,
        quizQuestions: [],
    });

    createEffect(() => {
        const savedState = JSON.parse(
            localStorage.getItem(QUIZ_STATE_KEY) || "{}"
        );
        if (!savedState.setId || savedState.setId !== searchParams.setId) {
            const selectedSet = store.studySets.find(
                (s) => s.id === searchParams.setId
            );
            if (!selectedSet) {
                navigate("/");
                return;
            }
            const questions = selectedSet.questions.filter(
                (q) => q.type === "quiz"
            ) as QuizQuestion[];
            if (questions.length === 0) {
                showNotification(
                    "This study has no quiz questions.",
                    "warning"
                );
                navigate("/");
                return;
            }
            setQuizState({
                index: 0,
                score: 0,
                showAnswer: false,
                selectedOptions: [],
                isCorrect: null,
                setId: selectedSet.id,
                quizQuestions: questions,
            });
        } else {
            setQuizState(savedState);
        }
    });

    createEffect(() => {
        if (quizState.setId && quizState.quizQuestions.length > 0) {
            localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(quizState));
        }
    });

    const toggleOption = (option: string) => {
        setQuizState(
            produce((s) => {
                // Toggle the option in the selectedOptions array
                if (s.selectedOptions.includes(option)) {
                    s.selectedOptions = s.selectedOptions.filter(
                        (o) => o !== option
                    );
                } else {
                    s.selectedOptions.push(option);
                }
            })
        );
    };

    const handleSubmit = () => {
        setQuizState(
            produce((s) => {
                const currentQuestion = s.quizQuestions[s.index];
                const selectedSet = new Set(s.selectedOptions.sort());
                const correctSet = new Set(currentQuestion.answers.sort());

                // Check if the sets of selected and correct answers are identical
                const isCorrect =
                    selectedSet.size === correctSet.size &&
                    [...selectedSet].every((option) => correctSet.has(option));

                s.isCorrect = isCorrect;
                if (isCorrect) {
                    s.score += 1;
                }
                s.showAnswer = true;
            })
        );
    };

    const nextQuestion = () => {
        setQuizState(
            produce((s) => {
                s.showAnswer = false;
                s.selectedOptions = [];
                s.isCorrect = null;
                s.index += 1;
            })
        );
    };

    const finishQuiz = () => {
        localStorage.removeItem(QUIZ_STATE_KEY);
        navigate("/");
    };

    const pauseQuiz = () => {
        navigate("/");
    };

    const currentQuizQuestion = () => quizState.quizQuestions[quizState.index];

    return (
        <div>
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Quiz</h2>
                <Show
                    when={
                        quizState.quizQuestions.length > 0 &&
                        quizState.index < quizState.quizQuestions.length
                    }
                >
                    <button
                        class="px-4 py-2 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600"
                        onClick={pauseQuiz}
                    >
                        Pause Quiz
                    </button>
                </Show>
            </div>

            <Show
                when={
                    quizState.quizQuestions.length > 0 &&
                    quizState.index < quizState.quizQuestions.length
                }
                fallback={
                    <div class="text-center p-6 bg-gray-100 rounded-md">
                        <h3 class="text-xl font-bold mb-2">Quiz Finished!</h3>
                        <p class="text-2xl font-semibold">
                            Your score: {quizState.score} out of{" "}
                            {quizState.quizQuestions.length}
                        </p>
                        <button
                            class="mt-4 p-2 bg-blue-500 text-white rounded-md"
                            onClick={finishQuiz}
                        >
                            Go back to Home
                        </button>
                    </div>
                }
            >
                <p class="mb-4">
                    Question {quizState.index + 1} of{" "}
                    {quizState.quizQuestions.length}:{" "}
                    {currentQuizQuestion()?.question}
                </p>
                <div class="flex flex-col space-y-2 mb-4">
                    <For each={currentQuizQuestion()?.options}>
                        {(option) => (
                            <button
                                class={`p-3 rounded-md font-semibold transition-colors text-left border-2
                  ${
                      quizState.showAnswer
                          ? currentQuizQuestion()?.answers?.includes(option)
                              ? "bg-green-500 border-green-600 text-white"
                              : quizState.selectedOptions.includes(option)
                              ? "bg-red-500 border-red-600 text-white"
                              : "bg-gray-200 border-gray-300 text-gray-800"
                          : quizState.selectedOptions.includes(option)
                          ? "bg-blue-200 border-blue-500 text-blue-800"
                          : "bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300"
                  }
                `}
                                onClick={() =>
                                    !quizState.showAnswer &&
                                    toggleOption(option)
                                }
                                disabled={!!quizState.showAnswer}
                            >
                                {option}
                            </button>
                        )}
                    </For>
                </div>

                <Show when={!quizState.showAnswer}>
                    <button
                        class="mt-4 w-full p-2 bg-blue-500 text-white rounded-md"
                        onClick={handleSubmit}
                        disabled={quizState.selectedOptions.length === 0}
                    >
                        Submit Answer
                    </button>
                </Show>

                <Show when={!!quizState.showAnswer}>
                    <div class="mt-4">
                        <div
                            class={`p-4 rounded-md ${
                                quizState.isCorrect
                                    ? "bg-green-100"
                                    : "bg-red-100"
                            }`}
                        >
                            <p
                                class={`font-bold ${
                                    quizState.isCorrect
                                        ? "text-green-800"
                                        : "text-red-800"
                                }`}
                            >
                                {quizState.isCorrect
                                    ? "Correct!"
                                    : `Incorrect. The correct answer(s) are: ${currentQuizQuestion()?.answers.join(
                                          ", "
                                      )}`}
                            </p>
                            <p class="mt-2 text-gray-700">
                                <span class="font-bold">Explanation:</span>{" "}
                                {currentQuizQuestion()?.explanation}
                            </p>
                        </div>

                        <button
                            class="mt-4 p-2 bg-blue-500 text-white rounded-md"
                            onClick={nextQuestion}
                        >
                            Next Question
                        </button>
                    </div>
                </Show>
            </Show>
        </div>
    );
}

export default QuizPage;
