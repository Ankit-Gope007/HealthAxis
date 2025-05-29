import { create } from "zustand";
import { persist } from "zustand/middleware";


interface UserState {
  user: string | null;
  setUser: (user: string | null) => void;
}