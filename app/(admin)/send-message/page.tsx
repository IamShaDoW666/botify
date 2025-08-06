"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendMessageSchema, SendMessageValues } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const SendMessagePage = () => {
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      number: '',
      message: ''
    }
  })
  const onSubmit = (data: SendMessageValues) => {
    console.log(data)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4 sm:p-6 md:p-8">
      {/* <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"> */}
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
                      <Input placeholder="number" {...field} />
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
        <CardFooter>
          <Button onClick={form.handleSubmit(onSubmit)}>Send</Button>
        </CardFooter>
      </Card>
      {/* </div> */}
    </div>
  )
}

export default SendMessagePage
