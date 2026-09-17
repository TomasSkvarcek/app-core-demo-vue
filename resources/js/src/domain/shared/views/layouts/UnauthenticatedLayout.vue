<template>
    <div>
        <Menu />
        <ContentContainer>
            <router-view />
        </ContentContainer>
    </div>
</template>

<script setup>
import Menu from '@/src/domain/shared/views/Menu.vue'
import ContentContainer from '@/src/domain/shared/views/ContentContainer.vue'
</script>
