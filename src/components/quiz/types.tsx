export type Quiz = {
    id: string;
    title: string;
    questionCount: number;
    status: "ready" | "draft";
    readingPlanId: string;
    readingPlanTitle: string;
};
