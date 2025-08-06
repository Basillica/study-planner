import { createSignal, createEffect, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { setStore, store, saveStore } from "../store/store";
import { QuizQuestion, FlashcardQuestion } from "../questions";
import { createStore } from "solid-js/store";
import { load as parseYaml } from "js-yaml";
import { showNotification } from "../store/notification";

function EditSetPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [currentSet, setCurrentSet] = createSignal(
        store.studySets.find((s) => s.id === params.id)
    );
    const [questionType, setQuestionType] = createSignal<"quiz" | "flashcard">(
        "quiz"
    );

    const [quizForm, setQuizForm] = createStore<QuizQuestion>({
        id: 0,
        type: "quiz",
        question: "",
        options: ["", "", "", ""],
        answers: ["", ""], // Now an array
        topic: "",
        explanation: "",
    });
    const [flashcardForm, setFlashcardForm] = createStore<FlashcardQuestion>({
        id: 0,
        type: "flashcard",
        front: "",
        back: "",
        topic: "",
    });

    createEffect(() => {
        const foundSet = store.studySets.find((s) => s.id === params.id);
        if (foundSet) {
            setCurrentSet(foundSet);
        } else {
            navigate("/sets");
        }
    });

    const handleAddQuizQuestion = (e: Event) => {
        e.preventDefault();
        const newQuestion = { ...quizForm, id: Date.now() };
        setStore(
            "studySets",
            (s) => s.id === currentSet()?.id,
            "questions",
            (q) => [...q, newQuestion]
        );
        saveStore();
        // Reset form
        setQuizForm({
            id: 0,
            type: "quiz",
            question: "",
            options: ["", "", "", ""],
            answers: ["", ""],
            topic: "",
            explanation: "",
        });
    };

    const handleAddFlashcardQuestion = (e: Event) => {
        e.preventDefault();
        const newQuestion = { ...flashcardForm, id: Date.now() };
        setStore(
            "studySets",
            (s) => s.id === currentSet()?.id,
            "questions",
            (q) => [...q, newQuestion]
        );
        saveStore();
        // Reset form
        setFlashcardForm({
            id: 0,
            type: "flashcard",
            front: "",
            back: "",
            topic: "",
        });
    };

    const handleDeleteQuestion = (questionId: number) => {
        setStore(
            "studySets",
            (s) => s.id === currentSet()?.id,
            "questions",
            (questions) => questions.filter((q) => q.id !== questionId)
        );
        saveStore();
    };

    const handleDeleteSet = () => {
        if (
            window.confirm(
                `Are you sure you want to delete the study set "${
                    currentSet()?.name
                }"?`
            )
        ) {
            setStore("studySets", (sets) =>
                sets.filter((s) => s.id !== currentSet()?.id)
            );
            saveStore();
            navigate("/sets");
        }
    };

    const handleFileImport = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsedData = parseYaml(content) as {
                    questions: (QuizQuestion | FlashcardQuestion)[];
                };
                const newQuestions = parsedData.questions.map((q) => ({
                    ...q,
                    id: Date.now() + Math.random(),
                }));

                if (!newQuestions || newQuestions.length === 0) {
                    showNotification(
                        "No valid questions found in the file. Please check the file format.",
                        "error"
                    );
                    return;
                }

                setStore(
                    "studySets",
                    (s) => s.id === currentSet()?.id,
                    "questions",
                    (q) => [...q, ...newQuestions]
                );
                saveStore();
                showNotification(
                    `Successfully imported ${newQuestions.length} questions!`,
                    "ok"
                );
                target.value = "";
            } catch (error) {
                showNotification(
                    "Failed to parse the file. Please ensure it is a valid YAML file.",
                    "error"
                );
                console.error("YAML parsing error:", error);
            }
        };
        reader.readAsText(file);
    };

    const handleQuizOptionChange = (index: number, value: string) => {
        setQuizForm("options", index, value);
    };

    const handleQuizAnswerChange = (index: number, value: string) => {
        setQuizForm("answers", index, value);
    };

    const handleQuizInputChange = (key: keyof QuizQuestion, value: string) => {
        setQuizForm(key, value);
    };

    const handleFlashcardInputChange = (
        key: keyof FlashcardQuestion,
        value: string
    ) => {
        setFlashcardForm(key, value);
    };

    const downloadTemplate = () => {
        const templateContent = `questions:
  - type: quiz
    topic: "Example Topic 1"
    question: "What is the capital of France?"
    options:
      - "Berlin"
      - "Madrid"
      - "Paris"
      - "Rome"
    answers:
      - "Paris"
    explanation: "Paris is the capital and most populous city of France."

  - type: quiz
    topic: "Example Topic 2"
    question: "Which of these are programming languages?"
    options:
      - "JavaScript"
      - "HTML"
      - "CSS"
      - "Python"
    answers:
      - "JavaScript"
      - "Python"
    explanation: "HTML and CSS are markup and styling languages, not programming languages."

  - type: flashcard
    topic: "Example Topic 3"
    front: "What is an IP address?"
    back: "An IP address (Internet Protocol address) is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication."
`;
        const blob = new Blob([templateContent], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "study-set-template.yaml";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Show when={currentSet()}>
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">
                        Editing: {currentSet()?.name}
                    </h2>
                    <div class="flex gap-2">
                        <button
                            onClick={handleDeleteSet}
                            class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete Set
                        </button>
                        <button
                            onClick={downloadTemplate}
                            class="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Download Template
                        </button>
                        <label class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
                            Import from File
                            <input
                                type="file"
                                onChange={handleFileImport}
                                class="hidden"
                                accept=".yaml, .yml"
                            />
                        </label>
                    </div>
                </div>

                {/* Form to add a new question */}
                <div class="mb-6 p-4 border rounded-md">
                    <h3 class="text-xl font-semibold mb-2">
                        Add a New Question
                    </h3>
                    <div class="mb-4">
                        <label class="block text-gray-700 mb-1">
                            Question Type
                        </label>
                        <select
                            value={questionType()}
                            onChange={(e) =>
                                setQuestionType(
                                    e.currentTarget.value as
                                        | "quiz"
                                        | "flashcard"
                                )
                            }
                            class="w-full p-2 border rounded-md"
                        >
                            <option value="quiz">Quiz</option>
                            <option value="flashcard">Flashcard</option>
                        </select>
                    </div>

                    <Show when={questionType() === "quiz"}>
                        <form
                            onSubmit={handleAddQuizQuestion}
                            class="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Question"
                                value={quizForm.question}
                                onInput={(e) =>
                                    setQuizForm(
                                        "question",
                                        e.currentTarget.value
                                    )
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <For each={quizForm.options}>
                                {(option, i) => (
                                    <input
                                        type="text"
                                        placeholder={`Option ${i() + 1}`}
                                        value={option}
                                        onInput={(e) =>
                                            setQuizForm(
                                                "options",
                                                i(),
                                                e.currentTarget.value
                                            )
                                        }
                                        required
                                        class="w-full p-2 border rounded-md"
                                    />
                                )}
                            </For>
                            <p class="text-gray-700">
                                Correct Answers (must match an option)
                            </p>
                            <For each={quizForm.answers}>
                                {(answer, i) => (
                                    <input
                                        type="text"
                                        placeholder={`Correct Answer ${
                                            i() + 1
                                        }`}
                                        value={answer}
                                        onInput={(e) =>
                                            setQuizForm(
                                                "answers",
                                                i(),
                                                e.currentTarget.value
                                            )
                                        }
                                        required
                                        class="w-full p-2 border rounded-md"
                                    />
                                )}
                            </For>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuizForm("answers", (answers) => [
                                        ...answers,
                                        "",
                                    ])
                                }
                                class="p-2 bg-gray-200 rounded-md"
                            >
                                Add Answer Field
                            </button>
                            <input
                                type="text"
                                placeholder="Explanation for the answer"
                                value={quizForm.explanation}
                                onInput={(e) =>
                                    setQuizForm(
                                        "explanation",
                                        e.currentTarget.value
                                    )
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Topic (e.g., ARM Templates)"
                                value={quizForm.topic}
                                onInput={(e) =>
                                    setQuizForm("topic", e.currentTarget.value)
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <button
                                type="submit"
                                class="w-full px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600"
                            >
                                Add Quiz Question
                            </button>
                        </form>
                    </Show>

                    <Show when={questionType() === "flashcard"}>
                        <form
                            onSubmit={handleAddFlashcardQuestion}
                            class="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Front of the card (Question)"
                                value={flashcardForm.front}
                                onInput={(e) =>
                                    setFlashcardForm(
                                        "front",
                                        e.currentTarget.value
                                    )
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Back of the card (Answer)"
                                value={flashcardForm.back}
                                onInput={(e) =>
                                    setFlashcardForm(
                                        "back",
                                        e.currentTarget.value
                                    )
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Topic (e.g., Networking)"
                                value={flashcardForm.topic}
                                onInput={(e) =>
                                    setFlashcardForm(
                                        "topic",
                                        e.currentTarget.value
                                    )
                                }
                                required
                                class="w-full p-2 border rounded-md"
                            />
                            <button
                                type="submit"
                                class="w-full px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600"
                            >
                                Add Flashcard Question
                            </button>
                        </form>
                    </Show>
                </div>

                <div class="mt-6">
                    <h3 class="text-xl font-semibold mb-2">
                        Questions ({currentSet()?.questions.length})
                    </h3>
                    <ul class="space-y-2">
                        <For each={currentSet()?.questions}>
                            {(question) => (
                                <li class="flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-sm">
                                    <span class="truncate">
                                        <span class="font-bold mr-2">
                                            [
                                            {question.type === "quiz"
                                                ? "Q"
                                                : "F"}
                                            ]
                                        </span>
                                        {question.type === "quiz"
                                            ? question.question
                                            : question.front}
                                    </span>
                                    <button
                                        class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        onClick={() =>
                                            handleDeleteQuestion(question.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </li>
                            )}
                        </For>
                    </ul>
                </div>
            </div>
        </Show>
    );
}

export default EditSetPage;
