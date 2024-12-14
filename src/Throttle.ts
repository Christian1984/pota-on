const THROTTLE_MS = 500;
export const throttle = async () => {
    const ms = Math.random() * THROTTLE_MS + THROTTLE_MS;
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};
