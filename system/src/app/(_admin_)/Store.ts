import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface DashboardState {
    isOpenSidebar: boolean;
    setIsOpenSidebar: (open: boolean) => void;
    toggleSidebar: () => void;
}

const useDashboardStore = create<DashboardState>()(
    devtools(
        persist(
            (set) => ({
                isOpenSidebar: false,
                setIsOpenSidebar: (open) => set({ isOpenSidebar: open }),
                toggleSidebar: () => {
                    set((state) => ({ isOpenSidebar: !state.isOpenSidebar }));
                },
            }),
            {
                name: "dashboardStore",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export default useDashboardStore;
