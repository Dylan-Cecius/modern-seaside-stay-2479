import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
Deno.test('anonymous clients cannot read appointment or customer data',async()=>{
 const url=Deno.env.get('SUPABASE_URL');const key=Deno.env.get('SUPABASE_ANON_KEY');
 if(!url||!key)throw new Error('Test requires hosted public credentials');
 for(const table of ['booking_events','booking_customers']){
  const r=await fetch(`${url}/rest/v1/${table}?select=*`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
  assertEquals(r.ok,false,`Public access to ${table} must be denied`);await r.text();
 }
});