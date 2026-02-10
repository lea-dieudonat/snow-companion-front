import type { Session, CreateSessionInput } from '../types/session.types';
import { $fetch } from 'ofetch';
import { useRuntimeConfig } from 'nuxt/app';

export const useSessions = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const createSession = async (data: CreateSessionInput): Promise<Session> => {
    const response = await $fetch<{ session: Session }>(`${apiBase}/sessions`, {
      method: 'POST',
      body: data,
    });
    return response.session;
  };

  const getAllSessions = async (): Promise<Session[]> => {
    const response = await $fetch<Session[]>(`${apiBase}/sessions`);
    return response || [];
  };

  const updateSession = async (id: string, data: Partial<CreateSessionInput>): Promise<Session> => {
    const response = await $fetch<{ session: Session }>(`${apiBase}/sessions/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.session;
  };

  const deleteSession = async (id: string): Promise<void> => {
    await $fetch(`${apiBase}/sessions/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    createSession,
    getAllSessions,
    updateSession,
    deleteSession,
  };
};