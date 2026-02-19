<template>
    <section>
        <h3 class="text-xl font-bold text-mountain-900 dark:text-snow-50 flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-calendar-check" class="text-ice-500" />
            Mon prochain voyage
        </h3>
        <div class="border-2 border-dashed border-mountain-200 dark:border-mountain-700 rounded-2xl p-12 text-center">
            <UIcon name="i-lucide-map-pinned" class="text-5xl text-mountain-300 dark:text-mountain-600 mx-auto mb-3" />
            <p class="text-mountain-500 dark:text-mountain-400 font-medium">Aucun voyage planifié</p>
            <p class="text-mountain-400 dark:text-mountain-500 text-sm mt-1 mb-4">Crée ton premier trip et visualise-le
                ici</p>
            <UButton icon="i-lucide-plus" color="primary" variant="soft" disabled>
                Créer un voyage (bientôt)
            </UButton>
        </div>
    </section>
</template>