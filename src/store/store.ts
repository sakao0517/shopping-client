import { create } from "zustand";

interface NavType {
  navOn: boolean;
  setNavOn: (newState: boolean) => void;
}

interface SearchType {
  searchOn: boolean;
  setSearchOn: (newState: boolean) => void;
}

interface cartIsChangeType {
  cartIsChange: boolean;
  setCartIsChange: (newState: boolean) => void;
}

export const useNavStore = create<NavType>((set) => ({
  navOn: false,
  setNavOn: (newState: boolean) => {
    set(() => ({ navOn: newState }));
  },
}));

export const useSearchStore = create<SearchType>((set) => ({
  searchOn: false,
  setSearchOn: (newState: boolean) => {
    set(() => ({ searchOn: newState }));
  },
}));

export const useCartIsChangeStore = create<cartIsChangeType>((set) => ({
  cartIsChange: false,
  setCartIsChange: (newState: boolean) => {
    set(() => ({ cartIsChange: newState }));
  },
}));
