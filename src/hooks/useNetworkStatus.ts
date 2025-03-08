import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  // Estado para almacenar si hay conexión a Internet
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Función para actualizar el estado cuando hay conexión
    const handleOnline = () => setIsOnline(true);

    // Función para actualizar el estado cuando no hay conexión
    const handleOffline = () => setIsOnline(false);

    // Agregar listeners para los eventos online y offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Limpiar los listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // El efecto solo se ejecuta una vez al montar el componente

  return isOnline; // Devuelve true si hay conexión, false si no hay
};

export default useNetworkStatus;