import { Router, Route } from "@solidjs/router";
import { Home } from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import PlannerPage from "./pages/PlannerPage";
import NotesPage from "./pages/NotesPage";
import ManageSetsPage from "./pages/ManageSetsPage";
import { ParentComponent } from "solid-js";
import EditSetPage from "./pages/EditSetPage";
import NotificationPortal from "./components/NotificationPortal";
import { Navbar } from "./components/utils";
import { ReadingPlanModule } from "./pages/readingplan";
import { QuizModule } from "./pages/quiz";
import { FlashcardModule } from "./pages/flash";

const Layout: ParentComponent = (props) => (
    <>
        <Navbar />
        <NotificationPortal />
        <div class="font-sans mx-auto min-h-[100vh] bg-white shadow-lg rounded-lg">
            {/* <header class="border-b-2 border-gray-200 pb-4 mb-6 flex justify-between items-center">
                <h1 class="text-3xl font-bold text-blue-600">Study App</h1>
                <nav class="flex space-x-2">
                    <a
                        href="/"
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Home
                    </a>
                    <a
                        href="/sets"
                        class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    >
                        Manage Sets
                    </a>
                </nav>
            </header> */}
            <main>{props.children}</main>
        </div>
        <footer class="bg-gray-900 text-gray-400 py-8 px-4 md:px-8">
            <div class="mx-auto text-center">
                <p>&copy; 2025 Your Study Platform. All rights reserved.</p>
            </div>
        </footer>
    </>
);

function App() {
    return (
        <Router root={Layout}>
            <Route path="/" component={Home} />
            {/* <Route path="/" component={SetListPage} /> */}
            <Route path="/quiz" component={QuizPage} />
            {/* <Route path="/flashcards" component={FlashcardsPage} /> */}
            <Route path="/planner" component={PlannerPage} />
            <Route path="/notes" component={NotesPage} />
            <Route path="/sets" component={ManageSetsPage} />
            <Route path="/sets/:id/edit" component={EditSetPage} />
            <Route path="/sets/:id/flashcards" component={FlashcardsPage} />
            <Route path={"/reading"}>
                <Route path={"/plans"} component={ReadingPlanModule}></Route>
            </Route>
            <Route path="/quizes" component={QuizModule}></Route>
            <Route path="/flashcards" component={FlashcardModule}></Route>
        </Router>
    );
}

export default App;
