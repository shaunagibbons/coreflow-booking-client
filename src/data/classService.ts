import api from '@/data/api';
import type {
  ClassFilters,
  PaginatedResponse,
  PilatesClass,
} from '@/data/types';

const classService = {
  async list(
    filters?: ClassFilters,
  ): Promise<PaginatedResponse<PilatesClass>> {
    const params: Record<string, string> = {};

    if (filters) {
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.instructor) params.instructor = String(filters.instructor);
      if (filters.location) params.location = filters.location;
      if (filters.available_only) params.available_only = 'true';
      if (filters.search) params.search = filters.search;
      if (filters.ordering) params.ordering = filters.ordering;
      if (filters.page) params.page = String(filters.page);
    }

    const response = await api.get<PaginatedResponse<PilatesClass>>(
      '/classes/',
      { params },
    );
    return response.data;
  },

  async getById(id: number): Promise<PilatesClass> {
    const response = await api.get<PilatesClass>(`/classes/${id}/`);
    return response.data;
  },

  async create(
    data: Partial<PilatesClass> & { instructor_id: number },
  ): Promise<PilatesClass> {
    const response = await api.post<PilatesClass>('/classes/', data);
    return response.data;
  },

  async update(
    id: number,
    data: Partial<PilatesClass>,
  ): Promise<PilatesClass> {
    const response = await api.patch<PilatesClass>(`/classes/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/classes/${id}/`);
  },
};

export default classService;
