import { useLocalStorage } from '@vueuse/core';
import type { AgentChatMessage, AgentToolCall } from '@/types/agent.types';

interface SendOptions {
  content: string;
}

export const useAgent = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase as string;
  const token = useCookie<string | null>('auth_token');

  const messages = ref<AgentChatMessage[]>([]);
  const streamingText = ref('');
  const isLoading = ref(false);
  const activeTool = ref<string | null>(null);
  const conversationId = useLocalStorage<string | null>('snow_companion_conversation_id', null);
  const error = ref<string | null>(null);

  async function sendMessage({ content }: SendOptions): Promise<void> {
    if (isLoading.value) return;

    messages.value.push({ role: 'user', content });
    streamingText.value = '';
    isLoading.value = true;
    activeTool.value = null;
    error.value = null;

    const pendingToolCalls: AgentToolCall[] = [];

    try {
      const response = await fetch(`${base}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          ...(conversationId.value ? { conversationId: conversationId.value } : {}),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            try {
              const data = JSON.parse(raw) as Record<string, unknown>;
              handleEvent(currentEvent, data, pendingToolCalls);
            } catch {
              // malformed JSON — ignore
            }
          }
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Une erreur est survenue.';
      error.value = msg;
      if (streamingText.value) {
        messages.value.push({ role: 'assistant', content: streamingText.value, toolCalls: pendingToolCalls });
        streamingText.value = '';
      }
    } finally {
      isLoading.value = false;
      activeTool.value = null;
    }
  }

  function handleEvent(
    event: string,
    data: Record<string, unknown>,
    pendingToolCalls: AgentToolCall[],
  ): void {
    if (event === 'token') {
      streamingText.value += (data['token'] as string) ?? '';
    } else if (event === 'tool_call') {
      const tool = data['tool'] as string;
      activeTool.value = tool;
      pendingToolCalls.push({ tool, input: (data['input'] as Record<string, unknown>) ?? {} });
    } else if (event === 'done') {
      if (data['conversationId']) {
        conversationId.value = data['conversationId'] as string;
      }
      messages.value.push({
        role: 'assistant',
        content: streamingText.value,
        toolCalls: pendingToolCalls.length > 0 ? [...pendingToolCalls] : undefined,
      });
      streamingText.value = '';
    } else if (event === 'error') {
      error.value = (data['message'] as string) ?? 'Une erreur est survenue.';
      if (streamingText.value) {
        messages.value.push({ role: 'assistant', content: streamingText.value });
        streamingText.value = '';
      }
    }
  }

  function reset(): void {
    messages.value = [];
    streamingText.value = '';
    isLoading.value = false;
    activeTool.value = null;
    conversationId.value = null;
    error.value = null;
  }

  return {
    messages,
    streamingText,
    isLoading,
    activeTool,
    conversationId,
    error,
    sendMessage,
    reset,
  };
};
