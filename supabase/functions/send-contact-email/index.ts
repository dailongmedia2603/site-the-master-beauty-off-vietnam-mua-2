import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// NOTE: We are using esm.sh to import Resend as it's not available on Deno Deploy.
// See: https://github.com/resend/resend-deno/issues/7
import { Resend } from 'https://esm.sh/resend@3.4.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// You need to set the RESEND_API_KEY in your Supabase project secrets
const resendApiKey = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not set in environment variables.");
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const resend = new Resend(resendApiKey);

  try {
    const { name, phone, role } = await req.json()

    if (!name || !phone || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Resend requires a verified domain for the 'from' address.
    // 'onboarding@resend.dev' is a special address that works for testing.
    const fromEmail = 'onboarding@resend.dev';
    const toEmails = ['huulinh11@gmail.com', 'huulong111@gmail.com'];

    const { data, error } = await resend.emails.send({
      from: `New Registration <${fromEmail}>`,
      to: toEmails,
      subject: 'New Speaker/Mentor Registration',
      html: `
        <h1>New Registration Received</h1>
        <p>A new user has registered through your website form.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Registered Role:</strong> ${role}</li>
        </ul>
      `,
    });

    if (error) {
      console.error({ error });
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})