"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Vui lòng nhập một địa chỉ email hợp lệ.",
  }),
  message: z.string().min(10, {
    message: "Tin nhắn phải có ít nhất 10 ký tự.",
  }),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Hiện tại, chúng ta chỉ ghi lại các giá trị và hiển thị một thông báo.
    // Trong một ứng dụng thực tế, bạn sẽ gửi dữ liệu này đến một máy chủ.
    console.log(values);
    toast({
      title: "Đã gửi biểu mẫu!",
      description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ sớm trả lời bạn.",
    });
    form.reset();
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Liên hệ với chúng tôi</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên của bạn</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Nhập email của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tin nhắn</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nội dung tin nhắn của bạn"
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Gửi</Button>
        </form>
      </Form>
    </div>
  );
}