import { createStore, produce } from "solid-js/store";
import { createEffect, For } from "solid-js";
import { initialQuestions } from "../questions";

type ProgressStatus = "completed" | "not-started";

interface ProgressStore {
    [topic: string]: ProgressStatus;
}

function PlannerPage() {
    const [progress, setProgress] = createStore<ProgressStore>(
        JSON.parse(localStorage.getItem("progress") || "{}")
    );

    createEffect(() => {
        localStorage.setItem("progress", JSON.stringify(progress));
    });

    const updateProgress = (topic: string, status: ProgressStatus) => {
        setProgress(
            produce((p) => {
                p[topic] = status;
            })
        );
    };

    const topics = [...new Set(initialQuestions.map((q) => q.topic))];

    return (
        <div>
            <h2 class="text-2xl font-bold mb-4">Study Planner</h2>
            <p class="text-gray-600 mb-4">Track your progress on key topics.</p>
            <div class="space-y-2">
                <For each={topics}>
                    {(topic) => (
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm">
                            <label for={`topic-${topic}`} class="text-lg">
                                {topic}
                            </label>
                            <input
                                type="checkbox"
                                id={`topic-${topic}`}
                                class="form-checkbox h-5 w-5 text-blue-600"
                                checked={progress[topic] === "completed"}
                                onChange={(e) =>
                                    updateProgress(
                                        topic,
                                        e.currentTarget.checked
                                            ? "completed"
                                            : "not-started"
                                    )
                                }
                            />
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}

export default PlannerPage;
