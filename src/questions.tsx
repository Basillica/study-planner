export interface FlashcardQuestion {
    id: number;
    type: "flashcard";
    front: string;
    back: string;
    topic: string;
}

// A type for a multiple-choice quiz question
export interface QuizQuestion {
    id: number;
    type: "quiz";
    question: string;
    options: string[];
    answers: string[]; // This is the updated field
    topic: string;
    explanation: string;
}

// A type for a study set
export interface StudySet {
    id: string;
    name: string;
    questions: Question[];
}

export type Question = QuizQuestion | FlashcardQuestion;

export const initialQuestions: Question[] = [
    {
        id: 1,
        type: "quiz",
        question:
            "What is the primary benefit of an Azure Resource Manager (ARM) template?",
        options: [
            "It allows you to deploy resources using a graphical interface.",
            "It enables declarative deployment of Azure resources.",
            "It provides a way to manage costs automatically.",
            "It is a database for storing resource data.",
        ],
        answers: ["It enables declarative deployment of Azure resources."],
        topic: "ARM Templates",
        explanation:
            "ARM templates allow you to define the infrastructure you want to deploy in a declarative way, meaning you describe the desired state of your resources, and Azure takes care of creating and configuring them to match that state.",
    },
    {
        id: 2,
        type: "flashcard",
        front: "What is the purpose of an Azure Availability Zone?",
        back: "To protect applications and data from datacenter failures.",
        topic: "High Availability",
    },
    {
        id: 3,
        type: "quiz",
        question:
            "Which Azure service is best for running containers without managing the underlying servers?",
        options: [
            "Azure Virtual Machines",
            "Azure App Service",
            "Azure Kubernetes Service (AKS)",
            "Azure Functions",
        ],
        answers: ["Azure Kubernetes Service (AKS)"],
        topic: "Containers",
        explanation:
            "Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It abstracts away the complexity of managing the underlying virtual machines.",
    },
    {
        id: 4,
        type: "flashcard",
        front: "What is the core function of an Azure Virtual Network (VNet)?",
        back: "A logical isolation of the Azure cloud dedicated to your subscription.",
        topic: "Networking",
    },
    {
        id: 5,
        type: "quiz",
        question: "Test question",
        options: ["oner", "twower", "three", "four"],
        answers: ["three", "four"],
        topic: "ARM Templates",
        explanation:
            "ARM templates allow you to define the infrastructure you want to deploy in a declarative way, meaning you describe the desired state of your resources, and Azure takes care of creating and configuring them to match that state.",
    },
];
