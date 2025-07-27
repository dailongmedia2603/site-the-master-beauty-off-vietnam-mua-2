// Version 1.2 - Forcing redeployment to load new secrets
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from 'https://esm.sh/resend@3.4.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Function invoked. Checking for RESEND_API_KEY...");
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      const errorMessage = "Server configuration error: RESEND_API_KEY is not set.";
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    console.log("RESEND_API_KEY found. Proceeding to send email.");

    const resend = new Resend(resendApiKey);
    const { name, phone, role } = await req.json();

    if (!name || !phone || !role) {
      return new Response(JSON.stringify({ error: 'Dữ liệu không hợp lệ: Vui lòng điền đầy đủ thông tin.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const fromEmail = 'onboarding@resend.dev';
    const toEmails = ['huulinh11@gmail.com', 'huulong111@gmail.com'];

    const { data, error } = await resend.emails.send({
      from: `Đăng ký mới <${fromEmail}>`,
      to: toEmails,
      subject: 'Đăng ký mới: Speaker/Mentor',
      html: `
        <h1>Đã nhận được đăng ký mới</h1>
        <p>Một người dùng mới đã đăng ký qua trang web của bạn.</p>
        <ul>
          <li><strong>Họ tên:</strong> ${name}</li>
          <li><strong>Số điện thoại:</strong> ${phone}</li>
          <li><strong>Vai trò đăng ký:</strong> ${role}</li>
        </ul>
      `,
    });

    if (error) {
      console.error("Resend API Error:", JSON.stringify(error, null, 2));
      return new Response(JSON.stringify({ error: `Lỗi từ dịch vụ gửi email: ${error.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log("Email sent successfully:", JSON.stringify(data, null, 2));
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Caught an unexpected error in function execution:", error);
    return new Response(JSON.stringify({ error: `Lỗi máy chủ không xác định: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})