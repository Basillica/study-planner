import { type Component, createSignal, For } from "solid-js";
import { ReadingPlan } from "./types";

type ReadingPlanDetailProps = {
    plan: ReadingPlan;
    onBackToList: () => void;
    onUpdate: (updatedPlan: ReadingPlan) => void;
};

export const ReadingPlanDetail: Component<ReadingPlanDetailProps> = (props) => {
    const [isEditing, setIsEditing] = createSignal(false);
    const [title, setTitle] = createSignal(props.plan.title);
    const [deadline, setDeadline] = createSignal(props.plan.deadline);
    const [files, setFiles] = createSignal(props.plan.files);

    const saveChanges = () => {
        const updatedPlan: ReadingPlan = {
            ...props.plan,
            title: title(),
            deadline: deadline(),
            files: files(),
        };
        props.onUpdate(updatedPlan);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setTitle(props.plan.title);
        setDeadline(props.plan.deadline);
        setFiles(props.plan.files);
        setIsEditing(false);
    };

    const removeFile = (fileId: string) => {
        setFiles(files().filter((file) => file.id !== fileId));
    };

    return (
        <>
            <div class="flex flex-row flex-nowrap items-center justify-end space-x-2 mb-12">
                <button
                    onClick={props.onBackToList}
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap"
                >
                    <i class="fas fa-arrow-left mr-2"></i> Back
                </button>
                {isEditing() ? (
                    <div class="flex flex-row flex-nowrap items-center justify-end space-x-2">
                        <button
                            onClick={cancelEdit}
                            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveChanges}
                            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap"
                    >
                        <i class="fas fa-edit mr-2"></i> Edit Plan
                    </button>
                )}
            </div>

            {isEditing() ? (
                // Edit View
                <div class="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">
                        Edit Reading Plan
                    </h2>
                    <div class="mb-4">
                        <label
                            for="plan-title"
                            class="block text-gray-700 font-medium mb-2"
                        >
                            Plan Title
                        </label>
                        <input
                            type="text"
                            id="plan-title"
                            value={title()}
                            onInput={(e) => setTitle(e.currentTarget.value)}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div class="mb-4">
                        <label
                            for="deadline"
                            class="block text-gray-700 font-medium mb-2"
                        >
                            Deadline
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline()}
                            onInput={(e) => setDeadline(e.currentTarget.value)}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div class="mb-4">
                        <h3 class="text-lg font-medium text-gray-700 mb-2">
                            Source Files
                        </h3>
                        <ul class="space-y-2">
                            <For each={files()}>
                                {(file) => (
                                    <li class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                        <span class="text-gray-800 font-medium truncate">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            class="text-red-500 hover:text-red-700 transition duration-200"
                                        >
                                            <i class="fas fa-times-circle"></i>
                                        </button>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </div>
                </div>
            ) : (
                // Read-Only View
                <div class="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">
                        {props.plan.title}
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-700">
                                Progress
                            </h3>
                            <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
                                <div
                                    class="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${props.plan.progress}%` }}
                                ></div>
                            </div>
                            <p class="text-sm font-medium text-gray-700 mt-1">
                                {props.plan.progress}% Complete
                            </p>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold text-gray-700">
                                Deadline
                            </h3>
                            <p class="text-gray-600 mt-1">
                                {props.plan.deadline}
                            </p>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold text-gray-700 mb-2">
                                Source Files
                            </h3>
                            <ul class="space-y-2">
                                <For each={props.plan.files}>
                                    {(file) => (
                                        <li class="flex items-center p-3 bg-gray-100 rounded-lg">
                                            <i class="fas fa-file-alt text-gray-500 mr-3"></i>
                                            <span class="text-gray-800 font-medium truncate">
                                                {file.name}
                                            </span>
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
