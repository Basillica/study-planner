import { type Component, createSignal, For } from "solid-js";

type ReadingPlan = { id: string; title: string };
type QuizFormProps = {
    onSave: (quizData: any) => void;
    onCancel: () => void;
    readingPlans: ReadingPlan[];
};

export const QuizForm: Component<QuizFormProps> = (props) => {
    const [quizTitle, setQuizTitle] = createSignal("");
    const [filterPlanId, setFilterPlanId] = createSignal<string>("all");
    const [uploadedFiles, setUploadedFiles] = createSignal<File[]>([]);

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        props.onSave({
            title: quizTitle(),
            questionCount: props.readingPlans.length + 1,
        });
    };

    const handleFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            setUploadedFiles(Array.from(input.files));
        }
    };

    const removeFile = (fileToRemove: File) => {
        setUploadedFiles(
            uploadedFiles().filter((file) => file !== fileToRemove)
        );
    };

    return (
        <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Create New Quiz</h2>
            <form onSubmit={handleSubmit}>
                <div class="mb-4">
                    <label
                        for="quiz-title"
                        class="block text-gray-700 font-bold mb-2"
                    >
                        Quiz Title
                    </label>
                    <input
                        type="text"
                        id="quiz-title"
                        value={quizTitle()}
                        onInput={(e) => setQuizTitle(e.currentTarget.value)}
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., SolidJS Foundations"
                        required
                    />
                </div>
                <div class="mb-4">
                    <label
                        for="quiz-title"
                        class="block text-gray-700 font-bold mb-2"
                    >
                        Select study plan for quiz
                    </label>
                    <select
                        id="plan-filter"
                        value={filterPlanId()}
                        onInput={(e) => setFilterPlanId(e.currentTarget.value)}
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Plans</option>
                        <For each={props.readingPlans}>
                            {(plan) => (
                                <option value={plan.id}>{plan.title}</option>
                            )}
                        </For>
                    </select>
                </div>

                {/* Corrected Markdown File Upload */}
                <div class="mb-6">
                    <label
                        for="source-material"
                        class="block text-gray-700 font-medium mb-2"
                    >
                        Source Materials (.md files)
                    </label>

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
                                Drag & drop files here or click to browse
                            </p>
                        </div>
                    </label>

                    {/* The actual input is now hidden */}
                    <input
                        type="file"
                        multiple
                        accept=".md"
                        id="source-material-input" // The id now links to the label's 'for' attribute
                        class="hidden" // Hiding the default file input
                        onChange={handleFileChange}
                    />
                </div>

                {/* Uploaded File List */}
                <div class="mb-6">
                    <h3 class="text-lg font-medium text-gray-700 mb-2">
                        Uploaded Files
                    </h3>
                    <ul class="space-y-2">
                        <For each={uploadedFiles()}>
                            {(file) => (
                                <li class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                    <span class="text-gray-800 font-medium truncate">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(file)}
                                        class="text-red-500 hover:text-red-700 transition duration-200"
                                    >
                                        <i class="fas fa-times-circle"></i>
                                    </button>
                                </li>
                            )}
                        </For>
                    </ul>
                </div>

                <div class="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={props.onCancel}
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Save Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};
