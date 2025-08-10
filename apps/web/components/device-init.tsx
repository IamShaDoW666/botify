"use client";
import { useDeviceStore } from '@/hooks/store/device-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const fetchDevicesFromDB = async (): Promise<string[]> => {
  const response = await fetch('/api/devices');
  const devices = await response.json();
  return devices.map((d: any) => d.id); // Assuming each device has an 'id'
};

export default function DeviceInitializer() {
  const { setInitialState } = useDeviceStore();
  const { data: devices, isLoading, isError, error } = useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevicesFromDB,

  })
  useEffect(() => {
    const initializeDevices = async () => {
      const devices = await fetchDevicesFromDB();
      setInitialState(devices);
    };

    initializeDevices();
  }, [setInitialState]);

  return null; // This component doesn't render anything itself
}
