// utils/timing.js
export function startTimer() {
    return performance.now();
}

export function endTimer(start) {
    return (performance.now() - start) / 1000; // seconds
}
