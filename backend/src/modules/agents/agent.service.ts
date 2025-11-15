import { AgentRepository } from './agent.repository';

export const AgentPresenceService = {
  async updateStatus(agentId: string, status: string) {
    return AgentRepository.upsertStatus(agentId, status);
  },

  async listStatuses() {
    return AgentRepository.listStatuses();
  },
};
