import http.server
import socketserver
import os

class UTF8Handler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        base = super().guess_type(path)
        if isinstance(base, tuple):
            return base
        if path.endswith('.html') or path.endswith('.htm'):
            return 'text/html; charset=utf-8'
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        return base

class ThreadedServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

os.chdir(r'D:\Felix\vibecoding\official-site')
with ThreadedServer(("", 8000), UTF8Handler) as httpd:
    print("Serving on port 8000 with UTF-8 charset (threaded)")
    httpd.serve_forever()
