import { type Component, createSignal, For } from "solid-js";
import { Quiz } from "./types";

type ReadingPlan = { id: string; title: string };

type QuizListProps = {
    quizzes: Quiz[];
    readingPlans: ReadingPlan[];
    onNewQuiz: () => void;
    onStartQuiz: (id: string) => void;
    onDelete: (id: string) => void;
};

export const QuizList: Component<QuizListProps> = (props) => {
    const [filterPlanId, setFilterPlanId] = createSignal<string>("all");

    const filteredQuizzes = () => {
        const selectedId = filterPlanId();
        if (selectedId === "all") {
            return props.quizzes;
        }
        return props.quizzes.filter(
            (quiz) => quiz.readingPlanId === selectedId
        );
    };

    return (
        <div>
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                {/* Filter Dropdown */}
                <div class="w-full md:w-auto">
                    <label
                        for="plan-filter"
                        class="block text-gray-700 font-medium mb-1"
                    >
                        Filter by Reading Plan
                    </label>
                    <select
                        id="plan-filter"
                        value={filterPlanId()}
                        onInput={(e) => setFilterPlanId(e.currentTarget.value)}
                        class="w-full md:w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Plans</option>
                        <For each={props.readingPlans}>
                            {(plan) => (
                                <option value={plan.id}>{plan.title}</option>
                            )}
                        </For>
                    </select>
                </div>

                <button
                    onClick={props.onNewQuiz}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto"
                >
                    <i class="fas fa-plus mr-2"></i> Create New Quiz
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <For each={filteredQuizzes()}>
                    {(quiz) => (
                        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out">
                            <h3 class="text-xl font-bold mb-1">{quiz.title}</h3>
                            <p class="text-sm font-medium text-blue-600 mb-2">
                                <i class="fas fa-book-reader mr-2"></i>
                                {quiz.readingPlanTitle}
                            </p>
                            <p class="text-gray-600 mb-4">
                                <i class="fas fa-question-circle mr-2"></i>{" "}
                                {quiz.questionCount} Questions
                            </p>
                            <div class="flex space-x-2">
                                <button
                                    onClick={() => props.onStartQuiz(quiz.id)}
                                    class="flex-grow bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Start Quiz
                                </button>
                                <button
                                    onClick={() => props.onDelete(quiz.id)}
                                    class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors duration-200"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
