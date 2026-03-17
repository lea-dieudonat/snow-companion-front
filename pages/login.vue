<script setup lang="ts">
definePageMeta({ layout: false });

const userStore = useUserStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const error = ref<string | null>(null);
const loading = ref(false);

async function handleLogin() {
  error.value = null;
  loading.value = true;
  try {
    await userStore.login(form);
    await router.push('/trips');
  } catch {
    error.value = 'Email ou mot de passe incorrect.';
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
          <h1 class="heading-card justify-center">Snow Companion</h1>
          <p class="text-mountain-500 text-sm">Connecte-toi à ton espace</p>
        </div>
      </template>

      <UForm :state="form" class="space-y-4" @submit="handleLogin">
        <UFormField label="Email" name="email">
          <UInput v-model="form.email" type="email" placeholder="ton@email.com" autocomplete="email" class="w-full" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password" class="w-full" />
        </UFormField>

        <UAlert v-if="error" color="error" variant="soft" :description="error" />

        <UButton type="submit" color="primary" block :loading="loading">
          Connexion
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-mountain-500">
          Pas encore de compte ?
          <NuxtLink to="/register" class="text-ice-500 font-medium hover:underline">Créer un compte</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
