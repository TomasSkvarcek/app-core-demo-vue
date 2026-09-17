import { ref } from 'vue';

export function useModal() {
    const modalStates = ref({});

    const setModalState = (modal_id, isOpen) => {
        modalStates.value = {
            ...modalStates.value,
            [modal_id]: isOpen
        }
    }

    const openModal = (modal_id) => {
        setModalState(modal_id, true);
    }

    const closeModal = (modal_id) => {
        setModalState(modal_id, false);
    }

    const getModalState = (modal_id) => {
        return modalStates.value[modal_id] ?? false;
    }

    return {
        openModal,
        closeModal,
        getModalState
    }
}
