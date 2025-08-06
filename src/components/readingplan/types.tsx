export type ReadingPlan = {
    id: string;
    title: string;
    progress: number;
    deadline: string;
    files: { id: string; name: string }[];
};

export type ReadingPlanListProps = {
    plans: ReadingPlan[];
    onNewPlan: () => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
};
