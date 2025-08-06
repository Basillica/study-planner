import { type Component, For } from "solid-js";
import { ReadingPlanListProps } from "./types";

export const ReadingPlanList: Component<ReadingPlanListProps> = (props) => (
    <div>
        <div class="flex justify-end mb-4">
            <button
                onClick={props.onNewPlan}
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                <i class="fas fa-plus mr-2"></i> Create New Plan
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={props.plans}>
                {(plan) => (
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ease-in-out">
                        <h3 class="text-xl font-bold mb-2">{plan.title}</h3>
                        <p class="text-gray-600 mb-2">
                            <i class="fas fa-calendar-alt mr-2"></i> Deadline:{" "}
                            {plan.deadline}
                        </p>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div
                                class="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${plan.progress}%` }}
                            ></div>
                        </div>
                        <p class="text-sm font-medium text-gray-700">
                            Progress: {plan.progress}%
                        </p>
                        <div class="flex space-x-2 mt-4">
                            <button
                                onClick={() => props.onView(plan.id)}
                                class="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200"
                            >
                                View
                            </button>
                            <button
                                onClick={() => props.onDelete(plan.id)}
                                class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </For>
        </div>
    </div>
);
