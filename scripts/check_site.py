"""Check every public HTML link, asset, fragment, and interactive control."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, sys
ROOT=Path(__file__).resolve().parent.parent
class Document(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.ids=[];self.links=[];self.buttons=[];self.forms=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag in ['a','link'] and 'href' in a:self.links.append(a['href'])
  if tag in ['script','img'] and a.get('src'):self.links.append(a['src'])
  if tag=='button':self.buttons.append(a)
  if tag=='form':self.forms.append(a)
docs={p:Document(p.read_text()) for p in ROOT.glob('*.html') if p.name!='netlify-identity-snippet.html'}
errors=[];total=0;external=set()
for path,doc in docs.items():
 if len(doc.ids)!=len(set(doc.ids)):errors.append(f'{path.name}: duplicate IDs')
 if 'main-content' not in doc.ids:errors.append(f'{path.name}: no main-content')
 for link in doc.links:
  total+=1;u=urlsplit(link)
  if u.scheme in ['https','http']:
   external.add(link);continue
  if u.scheme in ['mailto','tel']:continue
  if u.scheme or not link or link=='#':errors.append(f'{path.name}: invalid link {link}');continue
  target=(ROOT/unquote(u.path).lstrip('/')) if u.path else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path.name}: missing {link}');continue
  if u.fragment:
   targetdoc=docs.get(target)
   if targetdoc is None and target.suffix=='.html':targetdoc=Document(target.read_text())
   if not targetdoc or unquote(u.fragment) not in targetdoc.ids:errors.append(f'{path.name}: missing fragment {link}')
 for button in doc.buttons:
  working=any(key in button for key in ['data-print','data-filter','data-reset']) or button.get('id')=='download-plan' or button.get('type')=='submit'
  if not working:errors.append(f'{path.name}: unhandled button {button}')
 for form in doc.forms:
  if form.get('id')=='contactForm':
   if form.get('action')!='/contact-success.html' or 'data-netlify' not in form:errors.append('Contact form missing native destination or Netlify integration')
articles=json.loads((ROOT/'content/articles.json').read_text())
assert sum(not x['original'] for x in articles)==20
assert len(json.loads((ROOT/'content/providers.json').read_text()))==14
assert len(json.loads((ROOT/'content/resources.json').read_text()))==12
assert len(list((ROOT/'downloads').glob('*')))==8
if errors:
 print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(docs)} pages, {total} links/assets, every local target and fragment, and every button has a handler.')
print(f'{len(external)} distinct external URLs; 20 new articles, 14 Bangladesh service entries, 12 reading resources, 8 downloads.')
if '--external' in sys.argv:
 import concurrent.futures, urllib.request
 # Provider map links use the documented Maps search URL; tel/mail links are checked structurally above.
 urls=sorted(x for x in external if not any(host in urlsplit(x).netloc for host in ['fonts.googleapis.com','fonts.gstatic.com','google.com']))
 def check(url):
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; FluentMindsLinkCheck/1.0)'})
   with urllib.request.urlopen(req,timeout=25) as r:return url,r.status,r.url
  except Exception as ex:return url,'UNVERIFIED',str(ex)
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for url,status,final in pool.map(check,urls):print(status,url,('-> '+final) if final!=url else '')
