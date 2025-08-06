import { type Component, createSignal, For } from "solid-js";
import { FlashcardDeck, Flashcard } from "./types";
import { showNotification } from "../../store/notification";

type FlashcardFormProps = {
    onSave: (deckData: Omit<FlashcardDeck, "id">) => void;
    onCancel: () => void;
    readingPlans: { id: string; title: string }[];
};

export const FlashcardForm: Component<FlashcardFormProps> = (props) => {
    const [deckTitle, setDeckTitle] = createSignal("");
    const [selectedPlanId, setSelectedPlanId] = createSignal(
        props.readingPlans[0]?.id || ""
    );
    const [flashcards, setFlashcards] = createSignal<Flashcard[]>([]);

    const [currentQuestion, setCurrentQuestion] = createSignal("");
    const [currentAnswer, setCurrentAnswer] = createSignal("");
    const [editingCardId, setEditingCardId] = createSignal<string | null>(null);

    const handleAddFlashcard = () => {
        if (currentQuestion() && currentAnswer()) {
            const newCard: Flashcard = {
                id: Math.random().toString(36).substring(2, 9),
                question: currentQuestion(),
                answer: currentAnswer(),
                lastReviewed: null,
                nextReview: new Date(),
                interval: 0,
                difficultyLevel: 0,
            };
            setFlashcards([...flashcards(), newCard]);
            setCurrentQuestion("");
            setCurrentAnswer("");
            showNotification("flashcard has been successfully addedd", "ok");
        }
    };

    const handleEditFlashcard = (card: Flashcard) => {
        setEditingCardId(card.id);
        setCurrentQuestion(card.question);
        setCurrentAnswer(card.answer);
    };

    const handleUpdateFlashcard = () => {
        if (editingCardId()) {
            setFlashcards(
                flashcards().map((card) =>
                    card.id === editingCardId()
                        ? {
                              ...card,
                              question: currentQuestion(),
                              answer: currentAnswer(),
                          }
                        : card
                )
            );
            setEditingCardId(null);
            setCurrentQuestion("");
            setCurrentAnswer("");
            showNotification("flashcard has been successfully updated", "ok");
        }
    };

    const handleDeleteFlashcard = (cardId: string) => {
        setFlashcards(flashcards().filter((card) => card.id !== cardId));
        showNotification("flashcard has been successfully deleted", "ok");
    };

    const handleFileUpload = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            let parsedCards: Flashcard[] = [];

            if (file.name.endsWith(".json")) {
                try {
                    const data: Flashcard[] = JSON.parse(content);
                    if (Array.isArray(data)) {
                        parsedCards = data.map((item) => ({
                            id: Math.random().toString(36).substring(2, 9),
                            question: item.question || "",
                            answer: item.answer || "",
                            lastReviewed: item.lastReviewed || null,
                            nextReview: item.nextReview || new Date(),
                            interval: item.interval || 0,
                            difficultyLevel: item.difficultyLevel || 0,
                        }));
                    }
                } catch (error) {
                    showNotification("Error parsing JSON file.", "error");
                }
            } else if (file.name.endsWith(".md")) {
                // Split by horizontal rule (---) to separate cards
                const cardStrings = content.split("---");
                parsedCards = cardStrings
                    .map((cardString) => {
                        const lines = cardString.trim().split("\n");
                        // Find the first line that is a heading (##)
                        const questionLineIndex = lines.findIndex((line) =>
                            line.startsWith("##")
                        );

                        if (questionLineIndex !== -1) {
                            const question = lines[questionLineIndex]
                                .substring(2)
                                .trim();
                            // The rest of the content is the answer
                            const answer = lines
                                .slice(questionLineIndex + 1)
                                .join("\n")
                                .trim();
                            return {
                                id: Math.random().toString(36).substring(2, 9),
                                question: question,
                                answer: answer,
                                lastReviewed: null,
                                nextReview: new Date(),
                                interval: 0,
                                difficultyLevel: 0,
                            };
                        }
                        return null;
                    })
                    .filter((card) => card !== null) as Flashcard[];
            }

            setFlashcards([...flashcards(), ...parsedCards]);
            showNotification(
                `successfully inserted ${parsedCards.length} flashcards`,
                "ok"
            );
            (e.target as HTMLInputElement).value = ""; // Reset file input
        };
        reader.readAsText(file);
    };

    const handleSaveDeck = (e: Event) => {
        e.preventDefault();
        const readingPlan = props.readingPlans.find(
            (p) => p.id === selectedPlanId()
        );
        if (deckTitle() && readingPlan && flashcards().length > 0) {
            props.onSave({
                title: deckTitle(),
                readingPlanId: readingPlan.id,
                readingPlanTitle: readingPlan.title,
                flashcards: flashcards(),
            });
            showNotification("successfully saved flashcard", "ok");
        }
    };

    const downloadTemplate = (
        content: string,
        filename: string,
        mimeType: string
    ) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadJsonTemplate = () => {
        const jsonContent = JSON.stringify(
            [
                { question: "Example Question 1", answer: "Example Answer 1" },
                { question: "Example Question 2", answer: "Example Answer 2" },
            ],
            null,
            2
        );
        downloadTemplate(
            jsonContent,
            "flashcard_template.json",
            "application/json"
        );
        showNotification(
            "json template has been successfully downloaded",
            "ok"
        );
    };

    const downloadMarkdownTemplate = () => {
        const markdownContent = `## Example Question 1\nExample Answer 1\n\n---\n\n## Example Question 2\nExample Answer 2`;
        downloadTemplate(
            markdownContent,
            "flashcard_template.md",
            "text/markdown"
        );
        showNotification(
            "markdown template has been successfully downloaded",
            "ok"
        );
    };

    return (
        <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Create New Flashcard Deck</h2>
            <form onSubmit={handleSaveDeck}>
                <div class="mb-4">
                    <label
                        for="deck-title"
                        class="block text-gray-700 font-medium mb-2"
                    >
                        Deck Title
                    </label>
                    <input
                        type="text"
                        id="deck-title"
                        value={deckTitle()}
                        onInput={(e) => setDeckTitle(e.currentTarget.value)}
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., SolidJS Key Concepts"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label
                        for="plan-select"
                        class="block text-gray-700 font-medium mb-2"
                    >
                        Attach to Reading Plan
                    </label>
                    <select
                        id="plan-select"
                        value={selectedPlanId()}
                        onInput={(e) =>
                            setSelectedPlanId(e.currentTarget.value)
                        }
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <For each={props.readingPlans}>
                            {(plan) => (
                                <option value={plan.id}>{plan.title}</option>
                            )}
                        </For>
                    </select>
                </div>

                <hr class="my-6" />

                <h3 class="text-xl font-bold mb-2">Import from File</h3>
                <div class="mb-6">
                    {/* This label acts as the clickable dropzone */}
                    <label
                        for="source-material-input"
                        class="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition duration-200 cursor-pointer"
                    >
                        <div class="pointer-events-none">
                            {" "}
                            {/* Prevent clicks on children from interfering */}
                            <i class="fas fa-file-upload text-blue-500 text-3xl mb-2"></i>
                            <p class="text-gray-600">
                                Upload a `.json` or `.md` file to automatically
                                populate your deck. You can still edit them
                                manually afterward.
                            </p>
                        </div>
                    </label>

                    {/* The actual input is now hidden */}
                    <input
                        type="file"
                        multiple
                        accept=".json, .md"
                        id="source-material-input"
                        class="hidden"
                        onInput={handleFileUpload}
                    />
                </div>

                <div class="flex items-center space-x-2 mb-4">
                    <a href="#" class="text-sm text-blue-600 whitespace-nowrap">
                        Download Templates
                    </a>
                </div>
                <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                    <div class="flex space-x-2">
                        <button
                            type="button"
                            onClick={downloadJsonTemplate}
                            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors duration-200"
                        >
                            Download JSON
                        </button>
                        <button
                            type="button"
                            onClick={downloadMarkdownTemplate}
                            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors duration-200"
                        >
                            Download Markdown
                        </button>
                    </div>
                </div>

                <hr class="my-6" />

                <h3 class="text-xl font-bold mb-4">Add Flashcards Manually</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            for="question"
                            class="block text-gray-700 font-medium mb-2"
                        >
                            Question
                        </label>
                        <textarea
                            id="question"
                            value={currentQuestion()}
                            onInput={(e) =>
                                setCurrentQuestion(e.currentTarget.value)
                            }
                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., What is a signal?"
                            rows="4"
                        ></textarea>
                    </div>
                    <div>
                        <label
                            for="answer"
                            class="block text-gray-700 font-medium mb-2"
                        >
                            Answer
                        </label>
                        <textarea
                            id="answer"
                            value={currentAnswer()}
                            onInput={(e) =>
                                setCurrentAnswer(e.currentTarget.value)
                            }
                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., A reactive primitive in SolidJS."
                            rows="4"
                        ></textarea>
                    </div>
                </div>

                <div class="flex justify-end mt-4">
                    {editingCardId() ? (
                        <button
                            type="button"
                            onClick={handleUpdateFlashcard}
                            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <i class="fas fa-edit mr-2"></i> Update Card
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAddFlashcard}
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            <i class="fas fa-plus mr-2"></i> Add Flashcard
                        </button>
                    )}
                </div>
            </form>

            <hr class="my-6" />

            <h3 class="text-xl font-bold mb-4">
                Flashcards in this Deck ({flashcards().length})
            </h3>
            <ul class="space-y-2">
                <For each={flashcards()}>
                    {(card) => (
                        <li class="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                            <span class="font-medium text-gray-800 truncate">
                                {card.question}
                            </span>
                            <div class="flex space-x-2">
                                <button
                                    onClick={() => handleEditFlashcard(card)}
                                    class="text-gray-500 hover:text-yellow-600 transition duration-200"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteFlashcard(card.id)
                                    }
                                    class="text-gray-500 hover:text-red-600 transition duration-200"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </li>
                    )}
                </For>
            </ul>

            <div class="flex justify-end space-x-2 mt-6">
                <button
                    type="button"
                    onClick={props.onCancel}
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    onClick={handleSaveDeck}
                    disabled={!deckTitle() || flashcards().length === 0}
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                    Save Deck
                </button>
            </div>
        </div>
    );
};
