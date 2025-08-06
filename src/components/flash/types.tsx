export type Flashcard = {
    id: string;
    question: string;
    answer: string;
    //
    lastReviewed: Date | null;
    nextReview: Date; // A card is always due, even if it's "now"
    interval: number; // Interval in days
    difficultyLevel: number; // 0-4, to track how well a card is known
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
