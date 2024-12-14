export const throttle = async (ms: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};
