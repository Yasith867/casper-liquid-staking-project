import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertUser, type User } from "@shared/schema";

// Get user by wallet address
export function useUser(walletAddress: string | null) {
  return useQuery({
    queryKey: [api.users.get.path, walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      const url = buildUrl(api.users.get.path, { walletAddress });
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      
      return api.users.get.responses[200].parse(await res.json());
    },
    enabled: !!walletAddress,
  });
}

// Create user if not exists
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        // If 400, it might be that user already exists, which is fine for our flow
        if (res.status === 400) return null;
        throw new Error("Failed to create user");
      }
      
      return api.users.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.users.get.path, variables.walletAddress] 
      });
    },
  });
}

// Update demo balance (simulating L-CSPR balance on backend for persistence)
export function useUpdateBalance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ walletAddress, demoBalance }: { walletAddress: string, demoBalance: string }) => {
      const url = buildUrl(api.users.updateBalance.path, { walletAddress });
      const res = await fetch(url, {
        method: api.users.updateBalance.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoBalance }),
      });
      
      if (!res.ok) throw new Error("Failed to update balance");
      return api.users.updateBalance.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.users.get.path, variables.walletAddress] 
      });
    },
  });
}

// Claim badge
export function useClaimBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (walletAddress: string) => {
      const url = buildUrl(api.users.claimBadge.path, { walletAddress });
      const res = await fetch(url, {
        method: api.users.claimBadge.method,
      });
      
      if (!res.ok) throw new Error("Failed to claim badge");
      return api.users.claimBadge.responses[200].parse(await res.json());
    },
    onSuccess: (_, walletAddress) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.users.get.path, walletAddress] 
      });
    },
  });
}
