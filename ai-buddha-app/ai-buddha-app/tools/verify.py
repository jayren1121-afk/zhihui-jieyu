import re,json,urllib.request,urllib.parse,time
exec(open('sutras_src.py').read())
res=[]
for i,(w,s,c,t,p,tg) in enumerate(S):
    bad=[]
    for cl in [x for x in re.split('[，。；：、？！「」]',t) if len(x)>=3]:
        u="https://cbdata.dila.edu.tw/stable/search?"+urllib.parse.urlencode({"q":cl,"fields":"work,juan,title","rows":200})
        try: r=json.load(urllib.request.urlopen(u,timeout=30))
        except Exception as e: bad.append(cl+"!ERR");continue
        works={x['work'] for x in r.get('results',[])}
        ok = w in works or (w.startswith('T027') and works & {'T0278','T0279'})
        if not ok: bad.append(cl)
    res.append((i,s,bad)); print(i,s,c,"OK" if not bad else bad,flush=True)
json.dump(res,open('verify.json','w'),ensure_ascii=False)
