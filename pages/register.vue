<script setup lang="ts">
definePageMeta({ layout: false });

const userStore = useUserStore();
const router = useRouter();

const form = reactive({ name: '', email: '', password: '' });
const error = ref<string | null>(null);
const loading = ref(false);

async function handleRegister() {
  error.value = null;
  loading.value = true;
  try {
    await userStore.register(form);
    await router.push('/trips');
  } catch {
    error.value = 'Impossible de créer le compte. Cet email est peut-être déjà utilisé.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-ice-400 to-ice-600 p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center space-y-1">
          <UIcon name="i-lucide-mountain-snow" class="text-4xl text-ice-500" />
          <h1 class="heading-card">Snow Companion</h1>
          <p class="text-mountain-500 text-sm">Crée ton espace rider</p>
        </div>
      </template>

      <UForm :state="form" class="space-y-4" @submit="handleRegister">
        <UFormField label="Prénom" name="name">
          <UInput v-model="form.name" placeholder="Léa" autocomplete="given-name" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="form.email" type="email" placeholder="ton@email.com" autocomplete="email" class="w-full" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password"
            class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="soft" :description="error" />

        <UButton type="submit" color="primary" block :loading="loading">
          Créer mon compte
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-mountain-500">
          Déjà un compte ?
          <NuxtLink to="/login" class="text-ice-500 font-medium hover:underline">Se connecter</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
