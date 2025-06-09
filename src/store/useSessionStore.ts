// // store/useSessionStore.ts
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';


// type SessionType = {
//   id: string;
//   email: string;
// } | null;

// type SessionStore = {
//   sessionStore: SessionType;
//   setSessionStore: (sessionStore: SessionType) => void;
//   clearSessionStore: () => void;
// };

// export const useSessionStore = create<SessionStore>()(
//   persist(
//     (set) => ({
//       sessionStore: null,
//       setSessionStore: (sessionStore) => set({ sessionStore }),
//       clearSessionStore: () => set({ sessionStore: null }),
//     }),
//     {
//       name: 'session-storage', // Key in localStorage
//       storage: createJSONStorage(() => localStorage), // Use createJSONStorage
//     }
//   )
// );