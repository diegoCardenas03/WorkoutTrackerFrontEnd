import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { pesoService } from "../services/PesoService";
import type { PesoResponseDTO } from "../types/peso/PesoResponseDTO";

/**
 * Hook personalizado para manejar los registros de peso del usuario
 */
export const useBodyWeight = () => {
  const { isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();
  const [bodyWeights, setBodyWeights] = useState<PesoResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBodyWeights = async () => {
    if (!isAuthenticated || auth0Loading) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      const weights = await pesoService.getAllBodyWeights(token);
      setBodyWeights(weights);
    } catch (err: any) {
      console.error("Error al obtener registros de peso:", err);
      setError(err.message || "Error al cargar los registros de peso");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBodyWeights();
  }, [isAuthenticated, auth0Loading]);

  // Escuchar eventos de actualización de peso
  useEffect(() => {
    const handleWeightUpdate = () => {
      fetchBodyWeights();
    };

    window.addEventListener('bodyWeightUpdated', handleWeightUpdate);

    return () => {
      window.removeEventListener('bodyWeightUpdated', handleWeightUpdate);
    };
  }, [isAuthenticated, auth0Loading]);

  const addBodyWeight = async (bodyWeight: number): Promise<boolean> => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      const newWeight = await pesoService.createBodyWeight(token, { bodyWeight });
      setBodyWeights(prev => [...prev, newWeight]);
      
      // Emitir evento para actualizar todos los componentes
      window.dispatchEvent(new Event('bodyWeightUpdated'));
      
      return true;
    } catch (err: any) {
      console.error("Error al agregar peso:", err);
      setError(err.message || "Error al guardar el peso");
      return false;
    }
  };

  const updateLastBodyWeight = async (bodyWeight: number): Promise<boolean> => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      });

      const updatedWeight = await pesoService.updateLastBodyWeight(token, { bodyWeight });
      // Actualizar el último registro en el array
      setBodyWeights(prev => {
        if (prev.length === 0) return [updatedWeight];
        const newArray = [...prev];
        newArray[newArray.length - 1] = updatedWeight;
        return newArray;
      });
      
      // Emitir evento para actualizar todos los componentes
      window.dispatchEvent(new Event('bodyWeightUpdated'));
      
      return true;
    } catch (err: any) {
      console.error("Error al actualizar peso:", err);
      setError(err.message || "Error al actualizar el peso");
      return false;
    }
  };

  // Calcular estadísticas útiles
  const getCurrentWeight = () => {
    if (bodyWeights.length === 0) return null;
    return bodyWeights[bodyWeights.length - 1];
  };

  const getWeightDifference = () => {
    if (bodyWeights.length < 2) return 0;
    const current = bodyWeights[bodyWeights.length - 1].bodyWeight;
    const previous = bodyWeights[bodyWeights.length - 2].bodyWeight;
    return current - previous;
  };

  const getInitialWeight = () => {
    if (bodyWeights.length === 0) return null;
    return bodyWeights[0];
  };

  const getTotalWeightChange = () => {
    if (bodyWeights.length < 2) return 0;
    const current = bodyWeights[bodyWeights.length - 1].bodyWeight;
    const initial = bodyWeights[0].bodyWeight;
    return current - initial;
  };

  return {
    bodyWeights,
    isLoading,
    error,
    refetch: fetchBodyWeights,
    addBodyWeight,
    updateLastBodyWeight,
    getCurrentWeight,
    getWeightDifference,
    getInitialWeight,
    getTotalWeightChange,
  };
};
