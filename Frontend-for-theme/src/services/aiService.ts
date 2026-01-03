import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/ai';

export interface DiscoverResponse {
  sender: 'ai';
  text: string;
}

class AIService {
  async discover(message: string, token: string): Promise<DiscoverResponse> {
    const response = await axios.post(
      `${API_URL}/discover`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const aiService = new AIService();
