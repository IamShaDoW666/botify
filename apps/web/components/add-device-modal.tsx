"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, Form, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { deviceCreateSchema, DeviceCreateValues } from "@/types";
import { addDevice } from "@/actions/device";
import { useRouter } from "next/navigation";

const AddDeviceModal = () => {
  const router = useRouter();
  const form = useForm<DeviceCreateValues>({
    resolver: zodResolver(deviceCreateSchema),
    defaultValues: {
      number: "",
    }
  })
  const onSubmit = async (data: DeviceCreateValues) => {
    console.log(data)
    const res = await addDevice(data);
    if (res.status) {
      router.refresh();
    }
    setIsOpen(false);
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus />
        Add Device
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add new device</DialogTitle>
            <DialogDescription>
              Add a new device to your account. You can manage your devices here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Number" />
                      <FormMessage />
                    </FormControl>
                  </FormItem>
                )} />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Save changes
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </>
  )
}

export default AddDeviceModal
