import { onUnmounted } from 'vue';

export function useAbortController() {
    let abortController = null;

    const getSignal = () => {
        cancelPendingRequests();
        abortController = new AbortController();

        return abortController.signal;
    }

    const cancelPendingRequests = () => {
        if (abortController) {
            abortController.abort();
        }
    }

    onUnmounted(() => {
        cancelPendingRequests();
    })

    return { getSignal }
}
