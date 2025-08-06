// src/components/FlashcardDeckList.tsx
import { type Component, For } from "solid-js";
import { FlashcardDeck } from "./types";

type FlashcardDeckListProps = {
    decks: FlashcardDeck[];
    onNewDeck: () => void;
    onViewDeck: (deckId: string) => void;
    onDeleteDeck: (deckId: string) => void;
};

export const FlashcardDeckList: Component<FlashcardDeckListProps> = (props) => (
    <div>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <button
                onClick={props.onNewDeck}
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto"
            >
                <i class="fas fa-plus mr-2"></i> Create New Deck
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={props.decks}>
                {(deck) => (
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold mb-1">{deck.title}</h3>
                        <p class="text-sm font-medium text-blue-600 mb-2">
                            <i class="fas fa-book-reader mr-2"></i>
                            {deck.readingPlanTitle}
                        </p>
                        <p class="text-gray-600 mb-4">
                            <i class="fas fa-layer-group mr-2"></i>{" "}
                            {deck.flashcards.length} Cards
                        </p>
                        <div class="flex space-x-2">
                            <button
                                onClick={() => props.onViewDeck(deck.id)}
                                class="flex-grow bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                View Cards
                            </button>
                            <button
                                onClick={() => props.onDeleteDeck(deck.id)}
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
