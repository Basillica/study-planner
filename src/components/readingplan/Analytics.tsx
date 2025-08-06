import { type Component } from "solid-js";
// import { ReadingPlan } from "./types";
import { FlashcardDeck } from "../flash/types";
import { Quiz } from "../quiz/types";

type AnalyticsDashboardProps = {
    readingPlans: ReadingPlan[];
    flashcardDecks: FlashcardDeck[];
    quizzes: Quiz[];
};

type ReadingPlan = { id: string; title: string };

export const AnalyticsDashboard: Component<AnalyticsDashboardProps> = (
    props
) => {
    // A utility function to calculate all the metrics from the provided data.
    const getAnalytics = () => {
        const now = new Date();

        // Flashcard calculations
        let totalFlashcards = 0;
        let cardsDueForReview = 0;
        let cardsMastered = 0;

        props.flashcardDecks.forEach((deck) => {
            totalFlashcards += deck.flashcards.length;
            deck.flashcards.forEach((card) => {
                if (new Date(card.nextReview) <= now) {
                    cardsDueForReview++;
                }
                if (card.difficultyLevel >= 3) {
                    cardsMastered++;
                }
            });
        });

        // Quiz calculations
        const totalQuizzes = props.quizzes.length;
        const totalReadingPlans = props.readingPlans.length;

        return {
            totalReadingPlans,
            totalQuizzes,
            totalFlashcards,
            cardsDueForReview,
            cardsMastered,
        };
    };

    const analytics = getAnalytics();

    return (
        <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">
                Your Learning Progress
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Reading Plans */}
                <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-book-reader text-3xl text-blue-500"></i>
                        <div>
                            <p class="text-gray-500 font-medium">
                                Active Reading Plans
                            </p>
                            <h3 class="text-3xl font-bold text-gray-800">
                                {analytics.totalReadingPlans}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 2: Quizzes */}
                <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-question-circle text-3xl text-purple-500"></i>
                        <div>
                            <p class="text-gray-500 font-medium">
                                Quizzes Created
                            </p>
                            <h3 class="text-3xl font-bold text-gray-800">
                                {analytics.totalQuizzes}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 3: Flashcards */}
                <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-layer-group text-3xl text-green-500"></i>
                        <div>
                            <p class="text-gray-500 font-medium">
                                Total Flashcards
                            </p>
                            <h3 class="text-3xl font-bold text-gray-800">
                                {analytics.totalFlashcards}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 4: Cards Due for Review */}
                <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-clock text-3xl text-yellow-500"></i>
                        <div>
                            <p class="text-gray-500 font-medium">
                                Cards Due for Review
                            </p>
                            <h3 class="text-3xl font-bold text-gray-800">
                                {analytics.cardsDueForReview}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card 5: Cards Mastered */}
                <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-graduation-cap text-3xl text-indigo-500"></i>
                        <div>
                            <p class="text-gray-500 font-medium">
                                Cards Mastered
                            </p>
                            <h3 class="text-3xl font-bold text-gray-800">
                                {analytics.cardsMastered}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
