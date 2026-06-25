import api from './axios';

export const suggestEstimate = (data) => api.post('/ai/suggest', data);
