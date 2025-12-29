import { api } from '@/lib/api'

class TransactionsService {
  async getMyTransactions() {
    const response = await api.get('/transactions')
    return response.data
  }

  async getTransaction(id: string) {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  }
}

export const transactionsService = new TransactionsService()
