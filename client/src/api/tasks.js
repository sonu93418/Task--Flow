import api from './axios';

export const getTasks = (boardId, params = {}) => api.get(`/boards/${boardId}/tasks`, { params });
export const createTask = (boardId, data) => api.post(`/boards/${boardId}/tasks`, data);
export const getTask = (boardId, taskId) => api.get(`/boards/${boardId}/tasks/${taskId}`);
export const updateTask = (boardId, taskId, data) => api.put(`/boards/${boardId}/tasks/${taskId}`, data);
export const deleteTask = (boardId, taskId) => api.delete(`/boards/${boardId}/tasks/${taskId}`);
export const moveTask = (boardId, taskId, data) => api.patch(`/boards/${boardId}/tasks/${taskId}/move`, data);
