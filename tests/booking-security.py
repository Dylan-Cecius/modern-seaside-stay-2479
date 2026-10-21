"""Read-only hosted checks: no accounts or appointments are created."""
import os,re,json,urllib.request,urllib.error
from pathlib import Path
values={}
path=Path('.env')
if path.exists():
 for line in path.read_text().splitlines():
  match=re.match(r'([A-Z_]+)=[\"\']?(.*?)[\"\']?$',line)
  if match: values[match[1]]=match[2]
url=os.environ.get('SUPABASE_URL') or values.get('VITE_SUPABASE_URL')
key=os.environ.get('SUPABASE_PUBLISHABLE_KEY') or os.environ.get('SUPABASE_ANON_KEY') or values.get('VITE_SUPABASE_PUBLISHABLE_KEY')
assert url and key,'Hosted public configuration required'
def request(path,body=None):
 headers={'apikey':key,'Content-Type':'application/json'}
 if not key.startswith('sb_publishable_'):headers['Authorization']='Bearer '+key
 req=urllib.request.Request(url+'/rest/v1/'+path,data=json.dumps(body).encode() if body is not None else None,headers=headers)
 try:
  with urllib.request.urlopen(req) as r:return r.status,json.load(r)
 except urllib.error.HTTPError as e:return e.code,json.load(e)
for table in ['booking_events','booking_customers','user_roles']:
 status,data=request(table+'?select=*')
 assert status in (401,403),f'Public data must be denied: {table}'
 print('PASS anonymous reads denied:',table)
for fn,args in [('admin_cancel',{'p_id':'00000000-0000-0000-0000-000000000000'}),('admin_block',{'p_start':'2026-12-01T09:00:00Z','p_end':'2026-12-01T10:00:00Z','p_note':''}),('create_booking',{'p_services':[],'p_start':'2026-12-01T09:00:00Z','p_first':'','p_last':'','p_phone':'','p_email':'','p_consent':False,'p_manual':True})]:
 status,data=request('rpc/'+fn,args)
 assert status in (401,403,404),f'Anonymous action must be denied: {fn}'
 print('PASS anonymous privileged action denied:',fn)
status,services=request('booking_services?select=name,price_cents,id&order=sort_order')
assert status==200
expected={'Coupe homme':1800,'Coupe + barbe':2300,'Taille de barbe classique':1000,'Taille de barbe à l’ancienne':1500,'Coupe + barbe à l’ancienne':2800,'Double ancienne':3200,'Coupe enfant':1600}
assert {s['name']:s['price_cents'] for s in services}==expected
print('PASS seven unchanged homepage prices')
status,hours=request('booking_hours?select=*&order=weekday')
assert status==200
assert [h['weekday'] for h in hours if h['enabled']]==[2,3,4,5,6]
assert all(h['opens']=='10:00:00' and h['closes']=='19:00:00' for h in hours)
print('PASS Tuesday–Saturday 10:00–19:00 defaults')
for day in ['2026-11-30','2027-01-01']:
 status,data=request('rpc/booking_slots',{'p_date':day,'p_services':[services[0]['id']]})
 assert status==400 and 'DECEMBER_ONLY' in data.get('message','')
 print('PASS server rejects outside December:',day)
status,data=request('rpc/booking_slots',{'p_date':'2026-12-01','p_services':[services[0]['id']]})
assert status==200 and data==[]
print('PASS disabled public bookings expose no slots')
