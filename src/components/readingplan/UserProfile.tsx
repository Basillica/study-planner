import { type Component, For, Show } from "solid-js";

export type Achievement = {
    id: string;
    title: string;
    description: string;
};

type UserProfileProps = {
    points: number;
    achievements: Achievement[];
};

export const UserProfile: Component<UserProfileProps> = (props) => {
    return (
        <div class="p-6 bg-white rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-4">Your Profile</h2>
            <div class="flex items-center space-x-4 mb-6">
                <i class="fas fa-coins text-4xl text-yellow-500"></i>
                <div>
                    <p class="text-gray-500 font-medium">Total Points</p>
                    <h3 class="text-4xl font-bold text-gray-800">
                        {props.points}
                    </h3>
                </div>
            </div>

            <hr class="my-6" />

            <h3 class="text-xl font-bold mb-4">Achievements</h3>
            <Show
                when={props.achievements.length > 0}
                fallback={
                    <p class="text-gray-600 italic">
                        No achievements unlocked yet. Keep studying!
                    </p>
                }
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <For each={props.achievements}>
                        {(achievement) => (
                            <div class="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                                <i class="fas fa-star text-2xl text-blue-500 mr-4"></i>
                                <div>
                                    <h4 class="font-semibold text-lg">
                                        {achievement.title}
                                    </h4>
                                    <p class="text-sm text-gray-600">
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
};
