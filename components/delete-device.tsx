"use client";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDevice } from "@/actions/device";
import { useRouter } from "next/navigation";

const DeleteDeviceButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleDeleteDevice = async (deviceId: string) => {
    const res = await deleteDevice(deviceId);
    if (res.status) {
      router.refresh();
    }
  }
  return (
    <Button onClick={() => handleDeleteDevice(id)} variant="destructive" size="icon" className="bg-red-500 hover:bg-red-600 text-white w-10 h-10">
      <Trash2 className="h-5 w-5" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}

export default DeleteDeviceButton;
