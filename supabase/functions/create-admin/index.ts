import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Create admin user
  const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
    email: 'admin@brightpathtechnologies.it.com',
    password: 'Admin123',
    email_confirm: true,
  })

  if (signUpError) {
    return new Response(JSON.stringify({ error: signUpError.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Assign admin role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: userData.user.id, role: 'admin' })

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ success: true, userId: userData.user.id }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
