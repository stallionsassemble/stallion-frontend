import { api } from '@/lib/api'

class HackathonService {
  async createHackathon(payload: any) {
    const response = await api.post('/hackathons', payload)
    return response.data
  }

  async getHackathons() {
    const response = await api.get('/hackathons')
    return response.data
  }

  async getHackathon(identifier: string) {
    const response = await api.get(`/hackathons/${identifier}`)
    return response.data
  }

  async updateHackathon(id: string, payload: any) {
    const response = await api.patch(`/hackathons/${id}`, payload)
    return response.data
  }

  async deleteHackathon(id: string) {
    const response = await api.delete(`/hackathons/${id}`)
    return response.data
  }

  async publishHackathon(id: string) {
    const response = await api.post(`/hackathons/${id}/publish`)
    return response.data
  }

  async createSubmission(payload: any) {
    const response = await api.post('/hackathons/submissions', payload)
    return response.data
  }

  async getSubmissions(hackathonId: string) {
    const response = await api.get(`/hackathons/${hackathonId}/submissions`)
    return response.data
  }

  async getMySubmissions() {
    const response = await api.get('/hackathons/submissions/my')
    return response.data
  }

  async updateSubmission(id: string, payload: any) {
    const response = await api.patch(`/hackathons/submissions/${id}`, payload)
    return response.data
  }

  async deleteSubmission(id: string) {
    const response = await api.delete(`/hackathons/submissions/${id}`)
    return response.data
  }

  async judgeSubmission(id: string, payload: any) {
    const response = await api.post(
      `/hackathons/submissions/${id}/judge`,
      payload
    )
    return response.data
  }

  async selectWinners(id: string, payload: any) {
    const response = await api.post(`/hackathons/${id}/winners`, payload)
    return response.data
  }

  async getWinners(hackathonId: string) {
    const response = await api.get(`/hackathons/${hackathonId}/winners`)
    return response.data
  }
}

export const hackathonService = new HackathonService()
