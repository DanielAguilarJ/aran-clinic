"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { BookingState, BookingAction } from "@/lib/types";

const initialState: BookingState = {
  step: 1,
  serviceId: null,
  selectedDate: null,
  selectedTime: null,
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  notes: "",
  selectedAddonIds: [],
};

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_SERVICE":
      return {
        ...state,
        serviceId: action.payload,
        selectedDate: null,
        selectedTime: null,
      };
    case "SET_DATE":
      return { ...state, selectedDate: action.payload, selectedTime: null };
    case "SET_TIME":
      return { ...state, selectedTime: action.payload };
    case "SET_CLIENT_DATA":
      return {
        ...state,
        clientName: action.payload.name,
        clientPhone: action.payload.phone,
        clientEmail: action.payload.email,
        notes: action.payload.notes,
      };
    case "TOGGLE_ADDON": {
      const id = action.payload;
      const ids = state.selectedAddonIds.includes(id)
        ? state.selectedAddonIds.filter((a) => a !== id)
        : [...state.selectedAddonIds, id];
      return { ...state, selectedAddonIds: ids };
    }
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

type BookingContextType = {
  state: BookingState;
  dispatch: Dispatch<BookingAction>;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
