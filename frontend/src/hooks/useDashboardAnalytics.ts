import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardAnalyticsApi } from '../services/api';
import type {
  DashboardAnalytics,
  EmprestimosPorSemana,
  EmprestimosStatus,
  LivroMaisEmprestado,
  PercentualLivros,
} from '../services/types';
import { toast } from 'sonner';

interface UseDashboardAnalyticsOptions {
  ultimasSemanas?: number;
  topLivros?: number;
  enabled?: boolean;
  cacheTime?: number; // em milissegundos
}

interface UseDashboardAnalyticsReturn {
  data: DashboardAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isRefetching: boolean;
}

// Cache simples em memória
const cache = new Map<string, { data: DashboardAnalytics; timestamp: number }>();

export function useDashboardAnalytics({
  ultimasSemanas = 12,
  topLivros = 10,
  enabled = true,
  cacheTime = 5 * 60 * 1000, // 5 minutos padrão
}: UseDashboardAnalyticsOptions = {}): UseDashboardAnalyticsReturn {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref para controlar se o componente está montado
  const isMountedRef = useRef(true);

  // Gerar chave de cache baseada nos parâmetros
  const getCacheKey = useCallback(() => {
    return `analytics-${ultimasSemanas}-${topLivros}`;
  }, [ultimasSemanas, topLivros]);

  // Buscar dados (com ou sem cache)
  const fetchData = useCallback(
    async (useCache = true) => {
      if (!enabled) {
        setIsLoading(false);
        return;
      }

      const cacheKey = getCacheKey();

      // Verificar cache
      if (useCache) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          if (isMountedRef.current) {
            setData(cached.data);
            setError(null);
            setIsLoading(false);
          }
          return cached.data;
        }
      }

      try {
        if (isMountedRef.current) {
          if (!useCache) {
            setIsRefetching(true);
          } else {
            setIsLoading(true);
          }
          setError(null);
        }

        const analyticsData = await dashboardAnalyticsApi.getDashboardAnalytics(
          ultimasSemanas,
          topLivros
        );

        // Salvar no cache
        cache.set(cacheKey, {
          data: analyticsData,
          timestamp: Date.now(),
        });

        // Limpar caches antigos
        for (const [key, value] of cache.entries()) {
          if (Date.now() - value.timestamp > cacheTime) {
            cache.delete(key);
          }
        }

        if (isMountedRef.current) {
          setData(analyticsData);
          setError(null);
        }

        return analyticsData;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao carregar dados do dashboard';

        if (isMountedRef.current) {
          setError(errorMessage);
        }

        // Toast de erro apenas na primeira carga (não no refetch)
        if (useCache) {
          toast.error(errorMessage);
        }

        throw err;
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefetching(false);
        }
      }
    },
    [enabled, ultimasSemanas, topLivros, cacheTime, getCacheKey]
  );

  // Refetch manual (sem usar cache)
  const refetch = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Carregar dados ao montar
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  };
}

// Hooks individuais para cada métrica (caso queira carregar separadamente)

export function useEmprestimosPorSemana(ultimasSemanas: number = 12) {
  const [data, setData] = useState<EmprestimosPorSemana[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dashboardAnalyticsApi.getEmprestimosPorSemana(ultimasSemanas);
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao carregar empréstimos por semana';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [ultimasSemanas]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useEmprestimosStatus() {
  const [data, setData] = useState<EmprestimosStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dashboardAnalyticsApi.getEmprestimosStatus();
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao carregar status dos empréstimos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useLivrosMaisEmprestados(top: number = 10) {
  const [data, setData] = useState<LivroMaisEmprestado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dashboardAnalyticsApi.getLivrosMaisEmprestados(top);
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao carregar livros mais emprestados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [top]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function usePercentualLivros() {
  const [data, setData] = useState<PercentualLivros | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await dashboardAnalyticsApi.getPercentualLivros();
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao carregar percentual de livros';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
