import { create } from "zustand";

const initalLat = 50.819649;
const initalLong = 6.97578;

type AppStoreState = {
    call: string;
    setCall: (call: string) => void;
    lat: number;
    setLat: (lat: number) => void;
    long: number;
    setLong: (long: number) => void;
    radius: number;
    setRadius: (radius: number) => void;
    qth: { lat: number; long: number };
    setQth: (qth: { lat: number; long: number }) => void;
    parks: Park[];
    setParks: (parks: Park[]) => void;
    activationDetails: ActivationDetails;
    setActivationDetails: (activationDetails: ActivationDetails) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
    call: "DN9CVR",
    setCall: (call: string) => set(() => ({ call: call })),
    lat: initalLat,
    setLat: (lat: number) => set(() => ({ lat: lat })),
    long: initalLong,
    setLong: (long: number) => set(() => ({ long: long })),
    radius: 0.1,
    setRadius: (radius: number) => set(() => ({ radius: radius })),
    qth: { lat: initalLat, long: initalLong },
    setQth: (qth: { lat: number; long: number }) => set(() => ({ qth: qth })),
    parks: [] as Park[],
    setParks: (parks: Park[]) => set(() => ({ parks: parks })),
    activationDetails: {} as ActivationDetails,
    setActivationDetails: (activationDetails: ActivationDetails) =>
        set(() => ({ activationDetails: activationDetails })),
}));
