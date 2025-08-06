import { type Component, For } from "solid-js";
import { FlashcardDeck } from "./types";

type CommunityDeckListProps = {
    decks: FlashcardDeck[];
    onForkDeck: (deckId: string) => void;
};

export const CommunityDeckList: Component<CommunityDeckListProps> = (props) => {
    return (
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Community Decks</h2>
            <div class="space-y-4">
                <For each={props.decks}>
                    {(deck) => (
                        <div class="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold">
                                    {deck.title}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    by {deck.author}
                                </p>
                                <p class="text-sm text-gray-500">
                                    {deck.flashcards.length} flashcards
                                </p>
                            </div>
                            <button
                                onClick={() => props.onForkDeck(deck.id)}
                                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-2 md:mt-0"
                            >
                                <i class="fas fa-code-branch mr-2"></i> Fork
                                Deck
                            </button>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
