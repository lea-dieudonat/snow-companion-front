<script setup lang="ts">
definePageMeta({ layout: 'default' });
const router = useRouter();
const handleSessionCreated = () => router.push('/tracking');
</script>

<template>
    <div class="p-4 md:p-8">
        <AppPageHeader title="Nouvelle Session" description="Log ton ride du jour !" icon="i-lucide-plus-circle" />

        <div class="max-w-2xl mx-auto">
            <SessionsForm @sessionCreated="handleSessionCreated" />
        </div>
    </div>
</template>