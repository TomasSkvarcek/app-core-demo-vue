import { ref } from 'vue'

export function useSearch() {
    const getDefaultSearchData = () => ({
        page: 1,
        search: {},
        sort: {}
    })

    const searchData = ref(getDefaultSearchData())

    const clearSearch = () => {
        searchData.value = getDefaultSearchData();
    }

    const pageChanged = (page) => {
        searchData.value.page = page;
    }

    const handleSort = (field) => {
        let order = 'asc';

        const currentSort = searchData.value.sort;
        if (currentSort.column === field && currentSort.order === 'asc') {
            order = 'desc';
        }

        searchData.value.sort = {
            column: field,
            order
        }
    }

    return {
        searchData,
        clearSearch,
        pageChanged,
        handleSort
    }
}
