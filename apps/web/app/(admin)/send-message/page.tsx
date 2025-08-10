"use client"
import { sendMessage } from "@/actions/message"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDeviceStore } from "@/hooks/store/device-store"
import { sendMessageSchema, SendMessageValues } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const SendMessagePage = () => {
  const { device: currentDevice } = useDeviceStore();
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      number: '',
      message: ''
    }
  })
  const { mutate, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (res) => {
      if (res.status) {
        toast.success(res.message);
        form.resetField("message")
      }
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  })
  const onSubmit = async (data: SendMessageValues) => {
    mutate({
      message: data.message,
      receiver: data.number,
      sender: currentDevice!
    })
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-lg mx-auto rounded-xl shadow-lg">
        <CardHeader>Send Message</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4">
                <FormField name="number" render={({ field }) => (
                  <FormItem>
                    <FormLabel>number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="type your message..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            Send
            <Send />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SendMessagePage
