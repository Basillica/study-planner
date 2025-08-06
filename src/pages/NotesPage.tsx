import { createSignal, Switch, Match } from "solid-js";
import SolidMarkdown from "solid-markdown";

function NotesPage() {
    const [fileContent, setFileContent] = createSignal<string>("");
    const [fileType, setFileType] = createSignal<
        "text" | "markdown" | "pdf" | null
    >(null);
    const [fileName, setFileName] = createSignal<string>("");

    const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const extension = file.name.split(".").pop()?.toLowerCase();

        if (extension === "pdf") {
            setFileType("pdf");
            // Create a URL for the PDF so the browser can display it
            const pdfUrl = URL.createObjectURL(file);
            setFileContent(pdfUrl);
        } else if (extension === "md" || extension === "markdown") {
            setFileType("markdown");
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setFileContent(text);
            };
            reader.readAsText(file);
        } else if (extension === "txt") {
            setFileType("text");
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setFileContent(text);
            };
            reader.readAsText(file);
        } else {
            setFileType(null);
            setFileContent(
                "Unsupported file type. Please upload a .txt, .md, or .pdf file."
            );
        }
    };

    return (
        <div class="flex flex-col h-full w-full">
            <h2 class="text-2xl font-bold mb-4">My Notes</h2>
            <p class="text-gray-600 mb-4">
                Upload a file to view your study materials. Supports .txt, .md,
                and .pdf.
            </p>

            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <label
                    class="flex-grow p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 cursor-pointer transition-colors"
                    for="file-upload"
                >
                    <span class="block text-center font-medium">
                        {fileName() || "Click here to upload a file"}
                    </span>
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".txt, .md, .markdown, .pdf"
                    onChange={handleFileUpload}
                    class="sr-only" // This makes the input element visually hidden
                />
            </div>

            <div class="flex-grow bg-gray-50 p-4 rounded-md border border-gray-300 overflow-auto min-h-[400px]">
                <Switch
                    fallback={
                        <p class="text-gray-500">
                            No file loaded. Please upload a document.
                        </p>
                    }
                >
                    <Match when={fileType() === "text"}>
                        <pre class="whitespace-pre-wrap">{fileContent()}</pre>
                    </Match>
                    <Match when={fileType() === "markdown"}>
                        <SolidMarkdown
                            children={fileContent()}
                            class="prose max-w-none"
                        />
                    </Match>
                    <Match when={fileType() === "pdf"}>
                        <a
                            href={fileContent()}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-500 hover:underline"
                        >
                            Click here to open the PDF in a new tab:{" "}
                            {fileName()}
                        </a>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}

export default NotesPage;
