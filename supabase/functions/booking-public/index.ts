import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
const schema=z.object({services:z.array(z.string().uuid()).min(1).max(8),start:z.string().datetime({offset:true}),first:z.string().trim().min(1).max(80),last:z.string().trim().min(1).max(80),phone:z.string().trim().regex(/^\+?[0-9 () .-]{7,30}$/),email:z.union([z.literal(''),z.string().trim().email().max(255)]),consent:z.literal(true)}).strict();
Deno.serve(async(req)=>{
 const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 if(req.method!=='POST')return reply({error:'Méthode non autorisée.'},405);
 try{
  const raw=await req.text();if(raw.length>5000)return reply({error:'Demande trop longue.'},413);
  const parsed=schema.safeParse(JSON.parse(raw));if(!parsed.success)return reply({error:'Vérifiez les coordonnées, la prestation et votre accord de confidentialité.'},400);
  const url=Deno.env.get('SUPABASE_URL');const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!url||!secret)return reply({error:'Service temporairement indisponible.'},503);
  const client=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});const b=parsed.data;
  const {data,error}=await client.rpc('create_booking',{p_services:b.services,p_start:b.start,p_first:b.first,p_last:b.last,p_phone:b.phone,p_email:b.email||null,p_consent:b.consent,p_manual:false});
  if(error){const collision=error.code==='23P01';return reply({error:collision?'Ce créneau vient d’être pris. Choisissez une autre heure.':error.message.includes('BOOKING_DISABLED')?'Les réservations ne sont pas encore ouvertes.':'Cette réservation n’est pas autorisée. Vérifiez la date et les horaires.'},collision?409:400);}
  return reply({id:data},201);
 }catch{return reply({error:'Demande invalide.'},400);}
});
