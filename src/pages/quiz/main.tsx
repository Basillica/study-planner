// import { createSignal, type Component, Show } from "solid-js";
// import { QuizSession, QuizForm, QuizList } from "../../components/quiz";

// // Mock data for existing quizzes
// const initialQuizzes = [
//     { id: "q1", title: "SolidJS Basics", questionCount: 5, status: "ready" },
//     {
//         id: "q2",
//         title: "Tailwind CSS Fundamentals",
//         questionCount: 10,
//         status: "ready",
//     },
// ];

// export type Quiz = {
//     id: string;
//     title: string;
//     questionCount: number;
//     status: string;
// };

// export const QuizModule: Component = () => {
//     // State to manage the current view
//     const [view, setView] = createSignal<"list" | "form" | "session">("list");
//     const [quizzes, setQuizzes] = createSignal<Quiz[]>(initialQuizzes);
//     const [selectedQuizId, setSelectedQuizId] = createSignal<string | null>(
//         null
//     );

//     const handleNewQuiz = () => setView("form");
//     const handleCancel = () => setView("list");

//     // Placeholder function for saving a new quiz
//     const handleSaveQuiz = (quizData: any) => {
//         const newQuiz = {
//             ...quizData,
//             id: `q${quizzes().length + 1}`,
//             status: "draft",
//         };
//         setQuizzes([...quizzes(), newQuiz]);
//         setView("list");
//     };

//     // Function to start a quiz session
//     const startQuiz = (id: string) => {
//         setSelectedQuizId(id);
//         setView("session");
//     };

//     // Function to delete a quiz
//     const deleteQuiz = (id: string) => {
//         if (window.confirm("Are you sure you want to delete this quiz?")) {
//             setQuizzes(quizzes().filter((q) => q.id !== id));
//         }
//     };

//     // Function to go back from the quiz session or form
//     const backToList = () => {
//         setSelectedQuizId(null);
//         setView("list");
//     };

//     return (
//         <div class="container mx-auto md:p-8">
//             <h1 class="text-3xl md:text-4xl font-bold mb-6">Quizzes</h1>
//             <Show
//                 when={view() === "list"}
//                 fallback={
//                     <Show
//                         when={view() === "form"}
//                         fallback={<QuizSession onBackToList={backToList} />}
//                     >
//                         <QuizForm
//                             onSave={handleSaveQuiz}
//                             onCancel={handleCancel}
//                         />
//                     </Show>
//                 }
//             >
//                 <QuizList
//                     quizzes={quizzes()}
//                     onNewQuiz={handleNewQuiz}
//                     onStartQuiz={startQuiz}
//                     onDelete={deleteQuiz}
//                 />
//             </Show>
//         </div>
//     );
// };

// src/components/QuizModule.tsx
import { createSignal, type Component, Show } from "solid-js";
import { QuizSession, QuizForm, QuizList } from "../../components/quiz";

// You would typically fetch this data from a global store or a backend API.
// For this example, we'll import mock data from the ReadingPlanModule.
// Assuming your ReadingPlanModule.tsx exports initialPlans and the ReadingPlan type.
// import { initialPlans, ReadingPlan } from './ReadingPlanModule';

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

export type Quiz = {
    id: string;
    title: string;
    questionCount: number;
    status: "ready" | "draft";
    readingPlanId: string;
    readingPlanTitle: string;
};

// Updated mock data with reading plan association
const initialQuizzes: Quiz[] = [
    {
        id: "q1",
        title: "SolidJS Basics",
        questionCount: 5,
        status: "ready",
        readingPlanId: "1",
        readingPlanTitle: "SolidJS Mastery",
    },
    {
        id: "q2",
        title: "Tailwind CSS Fundamentals",
        questionCount: 10,
        status: "ready",
        readingPlanId: "1",
        readingPlanTitle: "SolidJS Mastery",
    },
    {
        id: "q3",
        title: "Graph Theory",
        questionCount: 8,
        status: "draft",
        readingPlanId: "2",
        readingPlanTitle: "Data Structures & Algorithms",
    },
];

export const QuizModule: Component = () => {
    const [view, setView] = createSignal<"list" | "form" | "session">("list");
    const [quizzes, setQuizzes] = createSignal<Quiz[]>(initialQuizzes);
    const [selectedQuizId, setSelectedQuizId] = createSignal<string | null>(
        null
    );

    const handleNewQuiz = () => setView("form");
    const handleCancel = () => setView("list");

    const handleSaveQuiz = (quizData: any) => {
        const newQuiz = {
            ...quizData,
            id: `q${quizzes().length + 1}`,
            status: "draft",
        };
        setQuizzes([...quizzes(), newQuiz]);
        setView("list");
    };

    const startQuiz = (id: string) => {
        setSelectedQuizId(id);
        setView("session");
    };

    const deleteQuiz = (id: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            setQuizzes(quizzes().filter((q) => q.id !== id));
        }
    };

    const backToList = () => {
        setSelectedQuizId(null);
        setView("list");
    };

    return (
        <div class="container mx-auto p-4 md:p-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-6">Quizzes</h1>
            <Show
                when={view() === "list"}
                fallback={
                    <Show
                        when={view() === "form"}
                        fallback={<QuizSession onBackToList={backToList} />}
                    >
                        <QuizForm
                            onSave={handleSaveQuiz}
                            onCancel={handleCancel}
                            readingPlans={initialPlans}
                        />
                    </Show>
                }
            >
                <QuizList
                    quizzes={quizzes()}
                    readingPlans={initialPlans}
                    onNewQuiz={handleNewQuiz}
                    onStartQuiz={startQuiz}
                    onDelete={deleteQuiz}
                />
            </Show>
        </div>
    );
};
