import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { product_name, customer_name, phone, quantity, order_id } = await req.json()

    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #FDF0F3; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #7a1a3a; font-size: 24px; margin: 0 0 4px;">جوهرة الخياطة</h1>
          <p style="color: #b05070; margin: 0; font-size: 14px;">طلب جديد وصلك ✨</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(122,26,58,0.08);">
          <tr style="background: #7a1a3a;">
            <th colspan="2" style="color: #f5d78e; padding: 14px 16px; text-align: right; font-size: 15px; font-weight: 700;">
              تفاصيل الطلب
            </th>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #b05070; border-bottom: 1px solid #f0ccd5; width: 35%;">المنتج</td>
            <td style="padding: 12px 16px; color: #7a1a3a; font-weight: bold; border-bottom: 1px solid #f0ccd5;">${product_name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #b05070; border-bottom: 1px solid #f0ccd5;">اسم العميلة</td>
            <td style="padding: 12px 16px; color: #7a1a3a; font-weight: bold; border-bottom: 1px solid #f0ccd5;">${customer_name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #b05070; border-bottom: 1px solid #f0ccd5;">رقم الهاتف</td>
            <td style="padding: 12px 16px; color: #7a1a3a; font-weight: bold; border-bottom: 1px solid #f0ccd5; direction: ltr; text-align: right;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #b05070; border-bottom: 1px solid #f0ccd5;">عدد القطع</td>
            <td style="padding: 12px 16px; color: #7a1a3a; font-weight: bold; border-bottom: 1px solid #f0ccd5;">${quantity}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #b05070;">رقم الطلب</td>
            <td style="padding: 12px 16px; color: #999; font-size: 11px; direction: ltr; text-align: right;">${order_id}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 20px; padding: 12px; background: #fff5f7; border-radius: 10px; border: 1px solid #f0ccd5;">
          <span style="color: #b05070; font-size: 13px;">💳 الدفع نقداً عند الاستلام</span>
        </div>
        <p style="color: #c9a84c; text-align: center; font-size: 11px; margin-top: 16px;">جوهرة الخياطة — معسكر</p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'جوهرة الخياطة <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        subject: `🧵 طلب جديد — ${product_name}`,
        html,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
