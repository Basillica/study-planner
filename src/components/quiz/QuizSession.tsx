import { createSignal, type Component, For, Show } from "solid-js";

// Mock data for a quiz session with multiple-choice questions
const quizData = {
    title: "SolidJS Basics Quiz",
    questions: [
        {
            id: "q1",
            question: "What is a core concept in SolidJS for reactive state?",
            options: [
                { id: "o1", text: "Virtual DOM" },
                { id: "o2", text: "Signals" },
                { id: "o3", text: "Hooks" },
                { id: "o4", text: "Direct DOM manipulation" },
            ],
            correctAnswers: ["o2"],
            explanation:
                "SolidJS uses **Signals** to track reactive state changes, which are a lightweight and efficient way to update the DOM without a Virtual DOM.",
        },
        {
            id: "q2",
            question: "Which of the following are benefits of using SolidJS?",
            options: [
                { id: "o5", text: "Small bundle size" },
                { id: "o6", text: "High performance" },
                { id: "o7", text: "Supports JSX" },
                { id: "o8", text: "Uses a Virtual DOM" },
            ],
            correctAnswers: ["o5", "o6", "o7"],
            explanation:
                "SolidJS boasts a **small bundle size**, **high performance** (often outperforming other frameworks), and **supports JSX** for a familiar developer experience. It achieves this without a Virtual DOM.",
        },
    ],
};

type QuizSessionProps = {
    onBackToList: () => void;
};

export const QuizSession: Component<QuizSessionProps> = (props) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
    const [selectedOptions, setSelectedOptions] = createSignal<string[]>([]);
    const [isSubmitted, setIsSubmitted] = createSignal(false);
    const [isCorrect, setIsCorrect] = createSignal(false);

    const currentQuestion = () => quizData.questions[currentQuestionIndex()];
    const isLastQuestion = () =>
        currentQuestionIndex() === quizData.questions.length - 1;

    // Toggles the selection of an option
    const toggleOption = (optionId: string) => {
        if (!isSubmitted()) {
            setSelectedOptions((prev) => {
                if (prev.includes(optionId)) {
                    return prev.filter((id) => id !== optionId);
                }
                return [...prev, optionId];
            });
        }
    };

    // Submits the user's answers and checks for correctness
    const handleSubmit = () => {
        setIsSubmitted(true);
        const correctAnswers = currentQuestion().correctAnswers;
        const userAnswers = selectedOptions();

        // Check if user's selection matches the correct answers exactly
        const isCorrect =
            userAnswers.length === correctAnswers.length &&
            userAnswers.every((id) => correctAnswers.includes(id));
        setIsCorrect(isCorrect);
    };

    // Advances to the next question
    const handleNextQuestion = () => {
        if (!isLastQuestion()) {
            setCurrentQuestionIndex(currentQuestionIndex() + 1);
            setSelectedOptions([]);
            setIsSubmitted(false);
            setIsCorrect(false);
        }
    };

    // Returns a class based on correctness for styling
    const getOptionClass = (optionId: string) => {
        if (!isSubmitted()) {
            return selectedOptions().includes(optionId)
                ? "bg-blue-200 border-blue-500"
                : "bg-white hover:bg-gray-50";
        }

        const isCorrectOption =
            currentQuestion().correctAnswers.includes(optionId);
        const isUserSelected = selectedOptions().includes(optionId);

        if (isCorrectOption) {
            return "bg-green-100 border-green-500";
        }
        if (isUserSelected && !isCorrectOption) {
            return "bg-red-100 border-red-500";
        }
        return "bg-white";
    };

    return (
        <div class="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold mb-4 text-center">
                {quizData.title}
            </h2>

            <div class="mb-6">
                <p class="text-gray-500 text-sm">
                    Question {currentQuestionIndex() + 1} of{" "}
                    {quizData.questions.length}
                </p>
                <h3 class="text-xl font-semibold mt-2">
                    {currentQuestion().question}
                </h3>
            </div>

            <ul class="space-y-3 mb-6">
                <For each={currentQuestion().options}>
                    {(option) => (
                        <li
                            onClick={() => toggleOption(option.id)}
                            class={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${getOptionClass(
                                option.id
                            )}`}
                        >
                            <span class="font-medium">{option.text}</span>
                        </li>
                    )}
                </For>
            </ul>

            <Show when={isSubmitted()}>
                <div
                    class={`p-4 rounded-lg mb-6 ${
                        isCorrect()
                            ? "bg-green-50 border-green-400"
                            : "bg-red-50 border-red-400"
                    }`}
                >
                    <h4
                        class={`font-bold ${
                            isCorrect() ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {isCorrect() ? "Correct! 🎉" : "Incorrect. 😕"}
                    </h4>
                    <p class="mt-2 text-gray-800">
                        {currentQuestion().explanation}
                    </p>
                </div>
            </Show>

            <div class="flex justify-between items-center">
                <button
                    onClick={props.onBackToList}
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <i class="fas fa-arrow-left mr-2"></i> Exit
                </button>

                <Show
                    when={isSubmitted()}
                    fallback={
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOptions().length === 0}
                            class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300"
                        >
                            Submit Answer
                        </button>
                    }
                >
                    <button
                        onClick={handleNextQuestion}
                        disabled={isLastQuestion()}
                        class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition duration-300"
                    >
                        {isLastQuestion() ? "Finish Quiz" : "Next Question"}
                    </button>
                </Show>
            </div>
        </div>
    );
};
