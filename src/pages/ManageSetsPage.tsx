import { createSignal, For, Show } from "solid-js";
import { setStore, store, saveStore, StudySet } from "../store/store";
import { useNavigate } from "@solidjs/router";

function ManageSetsPage() {
    const [newSetName, setNewSetName] = createSignal("");
    const navigate = useNavigate();

    const handleCreateSet = (e: Event) => {
        e.preventDefault();
        if (!newSetName().trim()) return;

        const newSet: StudySet = {
            id: Date.now().toString(), // Unique ID
            name: newSetName().trim(),
            questions: [],
        };

        setStore("studySets", (sets) => [...sets, newSet]);
        saveStore(); // Save to local storage
        setNewSetName("");
    };

    const selectSet = (id: string) => {
        navigate(`/sets/${id}/edit`); // <-- Updated to the new route
    };

    return (
        <div>
            <h2 class="text-2xl font-bold mb-4">Manage Study Sets</h2>

            <form onSubmit={handleCreateSet} class="mb-6 p-4 border rounded-md">
                <h3 class="text-xl font-semibold mb-2">Create New Study Set</h3>
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                        type="text"
                        value={newSetName()}
                        onInput={(e) => setNewSetName(e.currentTarget.value)}
                        placeholder="Enter study set name"
                        required
                        class="flex-grow p-2 border rounded-md"
                    />
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
                    >
                        Create Set
                    </button>
                </div>
            </form>

            <div>
                <h3 class="text-xl font-semibold mb-2">My Study Sets</h3>
                <Show
                    when={store.studySets.length > 0}
                    fallback={<p>No study sets created yet.</p>}
                >
                    <ul class="space-y-2">
                        <For each={store.studySets}>
                            {(studySet) => (
                                <li class="flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-sm">
                                    <span class="font-medium">
                                        {studySet.name}
                                    </span>
                                    <button
                                        class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        onClick={() => selectSet(studySet.id)}
                                    >
                                        Edit
                                    </button>
                                </li>
                            )}
                        </For>
                    </ul>
                </Show>
            </div>
        </div>
    );
}

export default ManageSetsPage;
