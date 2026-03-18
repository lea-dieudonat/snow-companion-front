<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getToolLabel } from '@/types/agent.types';

marked.setOptions({ breaks: true });

function renderMarkdown(content: string): string {
  const raw = marked.parse(content) as string;
  return import.meta.client ? DOMPurify.sanitize(raw) : raw;
}

definePageMeta({ layout: 'default', middleware: 'auth' });

const { messages, streamingText, isLoading, activeTool, error, sendMessage, reset } = useAgent();
const api = useApi();

// ── Profil rider (onboarding) ────────────────────────────────────────────────
const hasProfile = ref<boolean | null>(null);

onMounted(async () => {
  try {
    const { profile } = await api<{ profile: unknown }>('/users/profile');
    hasProfile.value = profile !== null;
  } catch {
    hasProfile.value = true; // en cas d'erreur, ne pas bloquer l'UI
  }
});

// ── Suggestions ──────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'Quelle météo à Val Thorens ce weekend ?',
  'Trouve-moi une station avec un bon snowpark adapté à mon niveau',
  'Compare Chamonix et Les 2 Alpes pour un trip freeride',
  'Quelles activités hors-ski à Méribel cette semaine ?',
  'Analyse mes sessions récentes et dis-moi mes points forts',
];

const handleSuggestion = (text: string) => {
  sendMessage({ content: text });
};

// ── Saisie ───────────────────────────────────────────────────────────────────
const inputText = ref('');

const handleSend = () => {
  const content = inputText.value.trim();
  if (!content || isLoading.value) return;
  inputText.value = '';
  sendMessage({ content });
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

// ── Scroll automatique ───────────────────────────────────────────────────────
const messagesEl = ref<HTMLElement | null>(null);

watch([messages, streamingText], () => {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="page-container-sm flex flex-col" style="height: calc(100dvh - 8.5rem);">
    <!-- En-tête ────────────────────────────────────────────────────────────── -->
    <div v-if="messages.length > 0" class="flex justify-end mb-4 shrink-0">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-rotate-ccw"
        size="sm"
        @click="reset"
      >
        Nouvelle conversation
      </UButton>
    </div>

    <!-- Bannière onboarding ─────────────────────────────────────────────────── -->
    <UAlert
      v-if="hasProfile === false"
      color="warning"
      variant="soft"
      icon="i-lucide-user-circle"
      title="Complète ton profil rider"
      description="L'agent peut personnaliser ses recommandations si tu renseignes ton niveau, tes disciplines et tes préférences."
      class="mb-4 shrink-0"
    >
      <template #actions>
        <UButton color="warning" variant="soft" size="xs" to="/profile">
          Configurer mon profil
        </UButton>
      </template>
    </UAlert>

    <!-- Zone messages ───────────────────────────────────────────────────────── -->
    <div
      ref="messagesEl"
      class="flex-1 overflow-y-auto space-y-4 pb-2 pr-1"
    >
      <!-- Suggestions (si aucun message) -->
      <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center min-h-full justify-center gap-6 text-center py-8">
        <div>
          <div class="w-16 h-16 rounded-2xl bg-ice-100 dark:bg-ice-900/40 flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-sparkles" class="text-3xl text-ice-500" />
          </div>
          <p class="text-lg font-semibold text-mountain-900 dark:text-snow-50">Ton assistant montagne</p>
          <p class="text-sm text-muted mt-1">Je consulte la météo, les conditions et ton historique en temps réel.</p>
        </div>
        <div class="grid gap-2 w-full max-w-md">
          <button
            v-for="suggestion in SUGGESTIONS"
            :key="suggestion"
            class="text-left px-4 py-3 rounded-xl border border-mountain-200 dark:border-mountain-700 text-sm text-mountain-700 dark:text-mountain-300 hover:bg-ice-50 dark:hover:bg-mountain-800/50 hover:border-ice-300 dark:hover:border-ice-700 transition-colors"
            @click="handleSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Messages ───────────────────────────────────────────────────────────── -->
      <template v-else>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[85%] rounded-2xl px-4 py-3"
            :class="msg.role === 'user'
              ? 'bg-ice-500 dark:bg-ice-600 text-white rounded-br-sm'
              : 'bg-mountain-100 dark:bg-mountain-800 text-mountain-900 dark:text-snow-50 rounded-bl-sm'"
          >
            <!-- Badges outils ───────────────────────────────────────────────── -->
            <div v-if="msg.toolCalls && msg.toolCalls.length > 0" class="flex flex-wrap gap-1 mb-2">
              <UBadge
                v-for="tc in msg.toolCalls"
                :key="tc.tool"
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-lucide-zap"
              >
                {{ getToolLabel(tc.tool) }}
              </UBadge>
            </div>
            <!-- Texte ────────────────────────────────────────────────────────── -->
            <p v-if="msg.role === 'user'" class="text-sm whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
            <div v-else class="prose-agent" v-html="renderMarkdown(msg.content)" />
          </div>
        </div>

        <!-- Réponse en cours de streaming ────────────────────────────────────── -->
        <div v-if="isLoading || streamingText" class="flex justify-start">
          <div class="max-w-[85%] bg-mountain-100 dark:bg-mountain-800 rounded-2xl rounded-bl-sm px-4 py-3">
            <!-- Outil actif ───────────────────────────────────────────────────── -->
            <div v-if="activeTool && !streamingText" class="flex items-center gap-2 text-xs text-muted">
              <UIcon name="i-lucide-zap" class="text-ice-400 animate-pulse" />
              <span>{{ getToolLabel(activeTool) }}…</span>
            </div>
            <!-- Texte streamé ────────────────────────────────────────────────── -->
            <p v-if="streamingText" class="text-sm text-mountain-900 dark:text-snow-50 whitespace-pre-wrap leading-relaxed">
              {{ streamingText }}<span class="inline-block w-0.5 h-4 bg-ice-400 ml-0.5 animate-pulse align-middle" />
            </p>
            <!-- Indicateur de chargement (avant premier token) ──────────────── -->
            <div v-if="!streamingText && !activeTool" class="flex gap-1 py-1">
              <span class="w-2 h-2 rounded-full bg-mountain-400 dark:bg-mountain-500 animate-bounce [animation-delay:0ms]" />
              <span class="w-2 h-2 rounded-full bg-mountain-400 dark:bg-mountain-500 animate-bounce [animation-delay:150ms]" />
              <span class="w-2 h-2 rounded-full bg-mountain-400 dark:bg-mountain-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Erreur ──────────────────────────────────────────────────────────────── -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      icon="i-lucide-alert-triangle"
      :description="error"
      class="mb-3 shrink-0"
    />

    <!-- Saisie ──────────────────────────────────────────────────────────────── -->
    <div class="shrink-0 mt-2">
      <div class="flex gap-2 items-end">
        <UTextarea
          v-model="inputText"
          placeholder="Pose ta question à l'agent…"
          :rows="2"
          autoresize
          :max-rows="5"
          class="flex-1"
          :disabled="isLoading"
          @keydown="handleKeydown"
        />
        <UButton
          icon="i-lucide-send"
          color="primary"
          :loading="isLoading"
          :disabled="!inputText.trim()"
          class="mb-0.5"
          @click="handleSend"
        />
      </div>
      <p class="text-xs text-muted mt-1.5 text-center">
        Entrée pour envoyer · Maj+Entrée pour sauter une ligne
      </p>
    </div>
  </div>
</template>
