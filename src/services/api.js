const API_BASE_URL = 'https://vgh0i1c18owj.manus.space/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken')
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async login(credentials) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async getCurrentUser() {
    return await this.request('/me')
  }

  async createProfile(profileData) {
    return await this.request('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    })
  }

  async getProfile() {
    return await this.request('/profile')
  }

  // Matching endpoints
  async discoverMatches() {
    return await this.request('/matching/discover')
  }

  async likeUser(userId) {
    return await this.request(`/matching/like/${userId}`, {
      method: 'POST'
    })
  }

  async dislikeUser(userId) {
    return await this.request(`/matching/dislike/${userId}`, {
      method: 'POST'
    })
  }

  async getUserMatches() {
    return await this.request('/matching/matches')
  }

  // Groups endpoints
  async discoverGroups(searchQuery = '') {
    const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''
    return await this.request(`/groups/discover${params}`)
  }

  async getUserGroups() {
    return await this.request('/groups/my')
  }

  async createGroup(groupData) {
    return await this.request('/groups/create', {
      method: 'POST',
      body: JSON.stringify(groupData)
    })
  }

  async joinGroup(groupId) {
    return await this.request(`/groups/${groupId}/join`, {
      method: 'POST'
    })
  }

  async leaveGroup(groupId) {
    return await this.request(`/groups/${groupId}/leave`, {
      method: 'POST'
    })
  }

  async getGroupDetails(groupId) {
    return await this.request(`/groups/${groupId}`)
  }

  logout() {
    this.setToken(null)
  }
}

export default new ApiService()

