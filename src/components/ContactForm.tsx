"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import h8_bg from "@/image/h8_bg.webp";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { showLoading, showSuccess, showError, dismissToast } from "@/utils/toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự.",
  }),
  role: z.enum(["Speaker", "Mentor"], {
    required_error: "Vui lòng chọn vai trò.",
  }),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "Speaker",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = showLoading("Đang gửi đăng ký...");

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: values,
      });

      dismissToast(toastId);

      if (error) {
        console.error("Supabase function error:", error);
        const errorMessage = error.context?.error || error.message || "Đã có lỗi không xác định xảy ra.";
        showError(errorMessage);
        return;
      }

      showSuccess("Đăng ký thành công! Cảm ơn bạn.");
      form.reset();
    } catch (error) {
      dismissToast(toastId);
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "Đã có lỗi xảy ra. Vui lòng thử lại.";
      showError(errorMessage);
    }
  }

  return (
    <div
      className="p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${h8_bg})` }}
    >
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-[#6c451a]">ĐĂNG KÝ</h2>
        <p className="text-xl text-[#8c5a2b] tracking-wider mt-2">
          SPEAKER HOẶC MENTOR KIẾN TẠO
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#6c451a] font-semibold">Họ tên</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white/90 border-2 border-[#a87b4f] rounded-xl h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#6c451a] font-semibold">Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    className="bg-white/90 border-2 border-[#a87b4f] rounded-xl h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#6c451a] font-semibold">Vai trò đăng ký</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/90 border-2 border-[#a87b4f] rounded-xl h-12 text-base">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Speaker">Speaker</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-b from-[#c89b6a] to-[#a06d3a] text-white font-bold py-3 rounded-full text-lg h-14 hover:opacity-90"
          >
            Đăng ký
          </Button>
        </form>
      </Form>
      <p className="text-[#6c451a] text-center mt-6">
        Hoặc nhấn tin vào zalo của chương trình để ban tổ chức liên hệ bạn
      </p>
    </div>
  );
}