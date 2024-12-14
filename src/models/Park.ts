type ParkDetails = {
    active: Boolean;
    activations: number;
    activatedByOperator: Boolean;
    lastRefresh?: Date;
};

type Park = {
    coordinates: {
        lat: number;
        long: number;
    };
    distance: number;
    reference: string;
    name: string;
    details?: ParkDetails;
};
