import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DashboardService } from '../services/dashboardService';
import { ConnectedRepository } from '../types/repository';

export interface RepositoryOption {
  id: string;
  name: string;
  displayName: string;
  isRealGitHub?: boolean;
  stars?: number;
  healthScore?: number;
}

export const DEFAULT_DEMO_REPOSITORIES: RepositoryOption[] = [
  { id: 'all', name: 'all', displayName: 'All Repositories' },
  { id: 'nexus-api-gateway', name: 'nexus-api-gateway', displayName: 'nexus-api-gateway' },
  { id: 'nexus-web-client', name: 'nexus-web-client', displayName: 'nexus-web-client' },
  { id: 'nexus-auth-core', name: 'nexus-auth-core', displayName: 'nexus-auth-core' },
  { id: 'nexus-billing-engine', name: 'nexus-billing-engine', displayName: 'nexus-billing-engine' },
];

interface RepositoryContextType {
  selectedRepo: string;
  setSelectedRepo: (repoId: string) => void;
  repositories: RepositoryOption[];
  connectedRepositories: ConnectedRepository[];
  activeConnectedRepo: ConnectedRepository | null;
  connectRepository: (url: string) => Promise<ConnectedRepository>;
  disconnectRepository: (repoId: string) => Promise<void>;
  isConnecting: boolean;
  connectError: string | null;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

const LOCAL_STORAGE_CONNECTED_KEY = 'nexus_connected_repositories_cache';

export const RepositoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRepo, setSelectedRepo] = useState<string>('all');
  const [connectedRepositories, setConnectedRepositories] = useState<ConnectedRepository[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONNECTED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  // Sync connected repositories from backend on load
  const refreshBackendRepos = useCallback(async () => {
    try {
      const repos = await DashboardService.getConnectedRepositories();
      if (repos && repos.length > 0) {
        setConnectedRepositories(repos);
        localStorage.setItem(LOCAL_STORAGE_CONNECTED_KEY, JSON.stringify(repos));
      }
    } catch {
      // offline fallback to cached state
    }
  }, []);

  useEffect(() => {
    refreshBackendRepos();
  }, [refreshBackendRepos]);

  // Connect new repository
  const connectRepository = async (url: string): Promise<ConnectedRepository> => {
    setIsConnecting(true);
    setConnectError(null);
    try {
      const result = await DashboardService.connectRepository(url);
      const updated = [result, ...connectedRepositories.filter((r) => r.id !== result.id && r.name !== result.name)];
      setConnectedRepositories(updated);
      localStorage.setItem(LOCAL_STORAGE_CONNECTED_KEY, JSON.stringify(updated));
      setSelectedRepo(result.name);
      return result;
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { detail?: string } }; message?: string })?.response?.data?.detail
        || (err as Error)?.message
        || 'Failed to connect repository. Please check the URL.';
      setConnectError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect repository
  const disconnectRepository = async (repoId: string): Promise<void> => {
    try {
      await DashboardService.disconnectRepository(repoId);
    } catch {
      // ignore
    }
    const updated = connectedRepositories.filter((r) => r.id !== repoId && r.name !== repoId);
    setConnectedRepositories(updated);
    localStorage.setItem(LOCAL_STORAGE_CONNECTED_KEY, JSON.stringify(updated));
    if (selectedRepo === repoId) {
      setSelectedRepo('all');
    }
  };

  // Build combined repositories list
  const totalCount = DEFAULT_DEMO_REPOSITORIES.length - 1 + connectedRepositories.length;
  const repositories: RepositoryOption[] = [
    {
      id: 'all',
      name: 'all',
      displayName: `All Repositories (${totalCount})`,
    },
    ...DEFAULT_DEMO_REPOSITORIES.slice(1),
    ...connectedRepositories.map((cr) => ({
      id: cr.name,
      name: cr.name,
      displayName: `${cr.full_name} ★${cr.stars}`,
      isRealGitHub: true,
      stars: cr.stars,
      healthScore: cr.health.health_score,
    })),
  ];

  // Active connected repo if selected
  const activeConnectedRepo =
    connectedRepositories.find(
      (cr) => cr.name === selectedRepo || cr.full_name === selectedRepo || cr.id === selectedRepo
    ) || null;

  return (
    <RepositoryContext.Provider
      value={{
        selectedRepo,
        setSelectedRepo,
        repositories,
        connectedRepositories,
        activeConnectedRepo,
        connectRepository,
        disconnectRepository,
        isConnecting,
        connectError,
        isConnectModalOpen,
        setIsConnectModalOpen,
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = (): RepositoryContextType => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
};
