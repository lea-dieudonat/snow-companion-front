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

  return {
    createSession,
    getAllSessions,
  };
};