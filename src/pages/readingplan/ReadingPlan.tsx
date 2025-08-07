import { createSignal, type Component } from "solid-js";
import {
    ReadingPlanForm,
    ReadingPlanList,
    ReadingPlanDetail,
} from "../../components/readingplan";

type ReadingPlan = {
    id: string;
    title: string;
    progress: number;
    deadline: string;
    files: { id: string; name: string }[];
};

const initialPlans: ReadingPlan[] = [
    {
        id: "1",
        title: "SolidJS Mastery",
        progress: 75,
        deadline: "2025-09-15",
        files: [
            { id: "f1", name: "Intro.md" },
            { id: "f2", name: "Components.md" },
        ],
    },
    {
        id: "2",
        title: "Data Structures & Algorithms",
        progress: 20,
        deadline: "2025-11-30",
        files: [
            { id: "f3", name: "Sorting.md" },
            { id: "f4", name: "Graphs.md" },
        ],
    },
];

export const ReadingPlanModule: Component = () => {
    const [view, setView] = createSignal<"list" | "form" | "detail">("list");
    const [readingPlans, setReadingPlans] =
        createSignal<ReadingPlan[]>(initialPlans);
    const [selectedPlan, setSelectedPlan] = createSignal<ReadingPlan | null>(
        null
    );

    const handleNewPlan = () => setView("form");
    const handleSavePlan = (planData: any) => {
        const newPlan = { ...planData, id: String(readingPlans().length + 1) };
        setReadingPlans([...readingPlans(), newPlan]);
        setView("list");
    };
    const handleCancel = () => setView("list");

    const deletePlan = (id: string) => {
        if (
            window.confirm("Are you sure you want to delete this reading plan?")
        ) {
            setReadingPlans(readingPlans().filter((plan) => plan.id !== id));
        }
    };

    const viewPlan = (id: string) => {
        const plan = readingPlans().find((p) => p.id === id);
        if (plan) {
            setSelectedPlan(plan);
            setView("detail");
        }
    };

    const backToList = () => {
        setSelectedPlan(null);
        setView("list");
    };

    const updatePlan = (updatedPlan: ReadingPlan) => {
        setReadingPlans(
            readingPlans().map((plan) =>
                plan.id === updatedPlan.id ? updatedPlan : plan
            )
        );
        setSelectedPlan(updatedPlan);
    };

    return (
        <div class="p-4 md:p-8">
            <div class="bg-white p-6 rounded-lg shadow-md transition mb-4">
                <h1 class="text-3xl md:text-4xl font-bold mb-6">
                    Reading Plans
                </h1>
            </div>

            {(() => {
                if (view() === "list") {
                    return (
                        <ReadingPlanList
                            plans={readingPlans()}
                            onNewPlan={handleNewPlan}
                            onDelete={deletePlan}
                            onView={viewPlan}
                        />
                    );
                } else if (view() === "form") {
                    return (
                        <ReadingPlanForm
                            onSave={handleSavePlan}
                            onCancel={handleCancel}
                        />
                    );
                } else if (view() === "detail" && selectedPlan()) {
                    return (
                        <ReadingPlanDetail
                            plan={selectedPlan()!}
                            onBackToList={backToList}
                            onUpdate={updatePlan}
                        />
                    );
                }
            })()}
        </div>
    );
};
