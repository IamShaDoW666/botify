import { create } from 'zustand'// stores/deviceStore.ts
import { persist, createJSONStorage } from 'zustand/middleware';

interface DeviceState {
  device: string | null;
  devices: string[];
  setDevice: (newDevice: string) => void;
  setInitialState: (devicesFromDB: string[]) => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      device: null,
      devices: [],
      setDevice: (newDevice: string) => set({ device: newDevice }),
      setInitialState: (devicesFromDB: string[]) => {
        const { device } = get();
        // If no device is selected (e.g., first load), set the first device from DB as default
        if (!device && devicesFromDB.length > 0) {
          set({ devices: devicesFromDB, device: devicesFromDB[0] });
        } else {
          set({ devices: devicesFromDB });
        }
      },
    }),
    {
      name: 'device-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

