import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarStore = {
    activeItem: string;
    setActiveItem: (item: string) => void;
}

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set) => ({
            activeItem: "dashboard",
            setActiveItem: (item: string) => set({ activeItem: item })

        }),
        {
            name: 'sidebar-storage', // key in localStorage
        }
    )
)