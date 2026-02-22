<script setup lang="ts">
defineProps<{
    nextTrip: unknown | null;
}>();
</script>

<template>
    <section>
        <h3 class="heading-section mb-4">
            <UIcon name="i-lucide-calendar-check" class="text-ice-500" />
            Mon prochain voyage
        </h3>

        <AppEmptyState v-if="!nextTrip" label="Aucun voyage planifié"
            description="Crée ton premier trip et visualise-le ici" icon="i-lucide-map-pinned" dashed>
            <UButton icon="i-lucide-plus" color="primary" variant="soft" disabled>
                Créer un voyage (bientôt)
            </UButton>
        </AppEmptyState>
    </section>
</template>