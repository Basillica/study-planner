import { For } from "solid-js";
import { store } from "../store/store";
import { useNavigate } from "@solidjs/router";

function SetListPage() {
    const navigate = useNavigate();

    const handleCreateNewSet = () => {
        const newSetId = Date.now().toString();
        navigate(`/sets/${newSetId}`);
    };

    return (
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Your Study Sets</h2>
                <button
                    onClick={handleCreateNewSet}
                    class="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
                >
                    Create New Set
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={store.studySets}>
                    {(set) => (
                        <div class="p-6 bg-gray-100 rounded-lg shadow-md flex flex-col justify-between">
                            <div>
                                <h3 class="text-xl font-semibold">
                                    {set.name}
                                </h3>
                                <p class="text-gray-600 mt-1">
                                    {set.questions.length} Questions
                                </p>
                            </div>
                            <div class="mt-4 flex gap-2">
                                <a
                                    href={`/sets/${set.id}`}
                                    class="flex-1 text-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Edit
                                </a>
                                <a
                                    href={`/sets/${set.id}/quiz`}
                                    class="flex-1 text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Quiz
                                </a>
                                <a
                                    href={`/sets/${set.id}/flashcards`}
                                    class="flex-1 text-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                                >
                                    Flashcards
                                </a>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}

export default SetListPage;
