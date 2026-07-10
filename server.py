import http.server
import json
import os

PORT = 3000
DB_FILE = os.path.join(os.path.dirname(__file__), 'db.json')

class GamedevDBRequestHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for frontend cross-origin AJAX requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/progress':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            data = {}
            if os.path.exists(DB_FILE):
                try:
                    with open(DB_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except Exception as e:
                    print("Error reading db.json:", e)
            
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/progress':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(payload, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            except Exception as e:
                print("Error writing to db.json:", e)
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    print("=== AIM Gamedev Database Server ===")
    print(f"Server URL: http://localhost:{PORT}/api/progress")
    print(f"Database File: {DB_FILE}")
    print("====================================")
    server = http.server.HTTPServer(('localhost', PORT), GamedevDBRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping database server...")
