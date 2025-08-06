// src/stores.ts

import { createStore, produce } from "solid-js/store";
import { initialQuestions, Question } from "../questions";

export interface StudySet {
    id: string;
    name: string;
    questions: Question[];
}

interface AppStore {
    studySets: StudySet[];
    // Other potential stores like progress, quiz results etc.
}

// Key for local storage
const APP_STORE_KEY = "az305-study-app-store";

// Load initial state from local storage or set a default
const savedStore = JSON.parse(localStorage.getItem(APP_STORE_KEY) || "null");

const [store, setStore] = createStore<AppStore>(
    savedStore || {
        studySets: [
            {
                id: "az-305-initial",
                name: "AZ-305 Exam Prep (Default)",
                questions: initialQuestions,
            },
        ],
    }
);

// Effect to save the store to local storage whenever it changes
export const saveStore = () => {
    localStorage.setItem(APP_STORE_KEY, JSON.stringify(store));
};

// Expose the store and a setter
export { store, setStore };
