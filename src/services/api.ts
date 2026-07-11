import { Trip, TripType, BudgetRange } from '@/types';

// Central client API coordinator for API Route Handlers
export const api = {
  trips: {
    // List all trips with optional filtering
    list: async (filters?: { type?: TripType; budget?: BudgetRange }): Promise<Trip[]> => {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.set('type', filters.type);
      if (filters?.budget) queryParams.set('budget', filters.budget);

      const res = await fetch(`/api/trips?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch trips');
      return res.json();
    },
    
    // Fetch individual trip details
    get: async (id: string): Promise<Trip> => {
      const res = await fetch(`/api/trips/${id}`);
      if (!res.ok) throw new Error('Failed to fetch trip details');
      return res.json();
    },

    // Request to join a specific travel companion group
    join: async (id: string): Promise<{ success: boolean; membershipId: string }> => {
      const res = await fetch(`/api/trips/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to submit join request');
      return res.json();
    },
  },
};
