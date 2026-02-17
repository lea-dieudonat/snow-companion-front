<script setup lang="ts">
definePageMeta({ layout: 'default' });
const router = useRouter();
const handleSessionCreated = () => router.push('/tracking');
</script>

<template>
    <div class="p-4 md:p-8">
        <div class="mb-8 text-center">
            <UIcon name="i-lucide-plus-circle" class="text-5xl text-snow-50 mx-auto mb-4" />
            <h2 class="text-snow-50 text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">Nouvelle Session</h2>
            <p class="text-snow-100 text-base m-0">Log ton ride du jour !</p>
        </div>

        <div class="max-w-2xl mx-auto">
            <SessionsSessionForm @sessionCreated="handleSessionCreated" />
        </div>
    </div>
</template>