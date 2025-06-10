import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarStore = {
    activeItem: String;
    setActiveItem: (item: String) => void;
}

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set) => ({
            activeItem: "dashboard",
            setActiveItem: (item: String) => set({ activeItem: item })

        }),
        {
            name: 'sidebar-storage', // key in localStorage
        }
    )
)