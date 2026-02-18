import type {
  Service,
  Addon,
  Appointment,
  Staff,
  User,
  AppointmentAddon,
} from "@prisma/client";

export type ServiceWithAddons = Service & {
  recommendedAddons: {
    addon: Addon;
    priority: number;
    urgencyText: string | null;
  }[];
};

export type AppointmentFull = Appointment & {
  user: Pick<User, "id" | "name" | "phone" | "email">;
  service: Service;
  staff: Pick<Staff, "id" | "name"> | null;
  addons: (AppointmentAddon & { addon: Addon })[];
};

export type TimeSlot = {
  time: string;
  available: boolean;
  label: string;
};

export type BookingState = {
  step: number;
  serviceId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  selectedAddonIds: string[];
};

export type BookingAction =
  | { type: "SET_SERVICE"; payload: string }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | {
      type: "SET_CLIENT_DATA";
      payload: { name: string; phone: string; email: string; notes: string };
    }
  | { type: "TOGGLE_ADDON"; payload: string }
  | { type: "SET_STEP"; payload: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };

export type DashboardMetrics = {
  weeklyAppointments: number;
  monthlyRevenue: number;
  topService: { name: string; count: number } | null;
  topAddon: { name: string; count: number } | null;
};
