#!/bin/sh
# Ghép src/ thành:
#   app.html   – bản đăng lên claude.ai
#   index.html – bản mở trực tiếp trên máy tính
#   dist/      – bản web app (PWA) để đưa lên Netlify / GitHub Pages, cài lên iPhone
cd "$(dirname "$0")"
python3 - <<'PY'
import hashlib,json,os,shutil
s=open('src/shell.html').read().replace('/*EXTRA_CSS*/',open('src/extra.css').read())
s+='<script>\n'+open('src/game.js').read()+'\n</script>\n'
open('app.html','w').write(s)
head,rest=s.split('</style>',1)
meta='<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#7CCBFF">\n'
open('index.html','w').write('<!doctype html>\n<html lang="vi"><head>'+meta+head+'</style></head><body>'+rest+'</body></html>\n')

# ---- dist/ (PWA) ----
shutil.rmtree('dist',ignore_errors=True);os.makedirs('dist/fonts')
fonts=sorted(os.listdir('src/pwa/fonts'))
for f in fonts:shutil.copy('src/pwa/fonts/'+f,'dist/fonts/'+f)
for f in ['fonts.css','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png']:shutil.copy('src/pwa/'+f,'dist/'+f)
gf=head[head.index('<link rel="preconnect"'):head.index('<style>')]
phead=head.replace(gf,'<link rel="stylesheet" href="fonts.css">\n')
pwa_meta=meta+'''<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Toán 3">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="manifest" href="manifest.webmanifest">
'''
safe='<style>body{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html,body{overscroll-behavior:none}</style>\n'
reg="<script>if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));</script>\n"
page='<!doctype html>\n<html lang="vi"><head>'+pwa_meta+phead+'</style>'+safe+'</head><body>'+rest+reg+'</body></html>\n'
open('dist/index.html','w').write(page)
assets=['./','index.html','fonts.css','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png']+['fonts/'+f for f in fonts]
ver=hashlib.md5((page+open('src/pwa/fonts.css').read()).encode()).hexdigest()[:10]
open('dist/sw.js','w').write(open('src/pwa/sw.js').read().replace('__VER__',ver).replace('__ASSETS__',json.dumps(assets)))
print('dist ok, version',ver)
PY
