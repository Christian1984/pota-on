type ParkActivationDetails = {
    active?: Boolean;
    activations?: number;
    activatedByOperator?: Boolean;
    lastRefresh?: Date;
};

type ActivationDetails = { [key: string]: ParkActivationDetails };

type Park = {
    coordinates: {
        lat: number;
        long: number;
    };
    distance: number;
    reference: string;
    name: string;
};

type ParkActivationResponse = { activeCallsign: string; qsoDate: string; totalQSOs: 45 }[];
type ParkDetailsResponse = { active: number };

type ParksResponse = {
    features: {
        type: "Feature";
        properties: { name: string; reference: string };
        geometry: { type: "Point"; coordinates: number[] };
    }[];
};
