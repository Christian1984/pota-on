type Park = {
    active: Boolean;
    activatedByOperator: Boolean;
    activations: number;
    coordinates: {
        lat: number;
        long: number;
    };
    distance: number;
    reference: string;
    name: string;
};
