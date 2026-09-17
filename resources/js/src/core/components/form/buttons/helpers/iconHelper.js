function getButtonIcon(type) {
    switch (type) {
        case 'edit':
            return {
                variant: 'primary',
                iconClass: 'fa-regular fa-pen-to-square'
            }

        case 'detail':
            return {
                variant: 'primary',
                iconClass: 'fa-solid fa-magnifying-glass'
            }

        case 'delete':
            return {
                variant: 'danger',
                iconClass: 'fa-regular fa-trash-can'
            }

        default:
            return {
                variant: 'primary',
                iconClass: null
            }
    }
}

export {getButtonIcon}
