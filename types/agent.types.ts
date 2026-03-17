export interface AgentChatMessage {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: AgentToolCall[];
}

export interface AgentToolCall {
  tool: string;
  input: Record<string, unknown>;
}

const TOOL_LABELS: Record<string, string> = {
  get_weather: 'Météo',
  get_stations: 'Stations',
  get_station_activities: 'Activités',
  get_user_sessions: 'Tes sessions',
  get_user_favorites: 'Tes favoris',
  compare_stations: 'Comparaison',
};

export const getToolLabel = (tool: string): string => TOOL_LABELS[tool] ?? tool;
