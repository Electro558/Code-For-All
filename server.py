#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import smtplib
import time
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urlparse, parse_qs
from http import HTTPStatus

def load_env_from_file(file_path: str = ".env"):
    """Load environment variables from a .env file if present.
    Only sets variables that are not already present in os.environ.
    """
    try:
        if not os.path.exists(file_path):
            return
        with open(file_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' not in line:
                    continue
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                # Strip surrounding quotes if present
                if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                    value = value[1:-1]
                if key and (key not in os.environ):
                    os.environ[key] = value
    except Exception as e:
        print(f"[ENV WARN] Failed to load {file_path}: {e}")

# Load env before using any configuration
load_env_from_file()

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def track_visitor(self, path, user_agent=None, ip_address=None):
        """Track visitor analytics"""
        try:
            # Allow analytics file path override via env
            analytics_file = os.getenv('ANALYTICS_FILE', 'analytics.json')
            
            # Load existing analytics data
            try:
                with open(analytics_file, 'r') as f:
                    analytics = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                analytics = {
                    'total_visits': 0,
                    'daily_visits': {},
                    'page_views': {},
                    'monthly_visits': {},
                    'recent_visits': []
                }
            
            # Parse and sanitize path (strip query params)
            parsed = urlparse(path)
            path_only = parsed.path or '/'

            # Exclude localhost traffic and internal/API endpoints from analytics
            # - Ignore localhost/dev IPs
            if ip_address in ('127.0.0.1', '::1'):
                return
            # - Ignore API calls
            if path_only.startswith('/api/'):
                return
            # - Consider only HTML pages and root for visit counts
            ext = os.path.splitext(path_only)[1]
            is_page = (ext == '.html') or (path_only == '/')
            if not is_page:
                # Skip non-page assets from analytics tracking
                return

            # Get current date
            current_date = datetime.now().strftime('%Y-%m-%d')
            current_month = datetime.now().strftime('%Y-%m')
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Update total visits
            analytics['total_visits'] += 1
            
            # Update daily visits
            if current_date not in analytics['daily_visits']:
                analytics['daily_visits'][current_date] = 0
            analytics['daily_visits'][current_date] += 1
            
            # Update monthly visits
            if current_month not in analytics['monthly_visits']:
                analytics['monthly_visits'][current_month] = 0
            analytics['monthly_visits'][current_month] += 1
            
            # Update page views
            if path_only not in analytics['page_views']:
                analytics['page_views'][path_only] = 0
            analytics['page_views'][path_only] += 1
            
            # Add recent visit (keep last 100)
            recent_visit = {
                'timestamp': current_time,
                'path': path_only,
                'user_agent': user_agent,
                'ip_address': ip_address
            }
            analytics['recent_visits'].insert(0, recent_visit)
            analytics['recent_visits'] = analytics['recent_visits'][:100]  # Keep only last 100
            
            # Save analytics data
            with open(analytics_file, 'w') as f:
                json.dump(analytics, f, indent=2)
                
        except Exception as e:
            print(f"Error tracking visitor: {e}")
    
    def get_analytics_data(self):
        """Get analytics data for dashboard"""
        try:
            # Allow analytics file path override via env
            analytics_file = os.getenv('ANALYTICS_FILE', 'analytics.json')
            try:
                with open(analytics_file, 'r') as f:
                    analytics = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                return {
                    'total_visits': 0,
                    'daily_visits': {},
                    'page_views': {},
                    'monthly_visits': {},
                    'recent_visits': []
                }
            
            # Ensure required keys exist
            analytics.setdefault('daily_visits', {})
            analytics.setdefault('monthly_visits', {})
            analytics.setdefault('page_views', {})
            analytics.setdefault('recent_visits', [])

            # Calculate additional stats
            today = datetime.now().strftime('%Y-%m-%d')
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            
            today_visits = analytics['daily_visits'].get(today, 0)
            yesterday_visits = analytics['daily_visits'].get(yesterday, 0)
            
            # Calculate percentage change
            change_percent = 0
            if yesterday_visits > 0:
                change_percent = ((today_visits - yesterday_visits) / yesterday_visits) * 100
            
            analytics['today_visits'] = today_visits
            analytics['yesterday_visits'] = yesterday_visits
            analytics['daily_change'] = round(change_percent, 1)
            
            # Get top pages
            # Filter to .html pages and root only for top pages display
            top_pages = [item for item in analytics['page_views'].items() if item[0].endswith('.html') or item[0] == '/']
            top_pages = sorted(top_pages, key=lambda x: x[1], reverse=True)[:5]
            analytics['top_pages'] = top_pages
            
            return analytics
            
        except Exception as e:
            print(f"Error getting analytics data: {e}")
            return {'error': str(e)}
    
    def do_GET(self):
        # Track visitor for all GET requests
        user_agent = self.headers.get('User-Agent', '')
        ip_address = self.client_address[0]
        self.track_visitor(self.path, user_agent, ip_address)
        
        # Handle analytics API endpoint
        if self.path == '/api/analytics':
            analytics_data = self.get_analytics_data()
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(analytics_data).encode('utf-8'))
            return

        # Public contact info endpoint
        if self.path == '/api/public-contact':
            contact_info = {
                'email': os.getenv('PUBLIC_CONTACT_EMAIL', ''),
                'phone': os.getenv('PUBLIC_CONTACT_PHONE', ''),
                'address': os.getenv('PUBLIC_CONTACT_ADDRESS', ''),
                'instagram_url': os.getenv('PUBLIC_INSTAGRAM_URL', ''),
                'twitter_url': os.getenv('PUBLIC_TWITTER_URL', ''),
                'facebook_url': os.getenv('PUBLIC_FACEBOOK_URL', '')
            }
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(contact_info).encode('utf-8'))
            return
        
        # Continue with normal file serving
        super().do_GET()
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/send-contact':
            try:
                # Get the content length
                content_length = int(self.headers['Content-Length'])
                # Read the POST data
                post_data = self.rfile.read(content_length)
                # Parse JSON data
                contact_data = json.loads(post_data.decode('utf-8'))
                
                # Send email
                success = self.send_contact_email(contact_data)
                
                if success:
                    # Send success response
                    self.send_response(HTTPStatus.OK)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {'status': 'success', 'message': 'Message sent successfully!'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    # Send error response
                    self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = {'status': 'error', 'message': 'Failed to send email'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    
            except Exception as e:
                # Send error response
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
        elif parsed_path.path == '/save-user':
            try:
                # Get the content length
                content_length = int(self.headers['Content-Length'])
                # Read the POST data
                post_data = self.rfile.read(content_length)
                # Parse JSON data
                new_user_data = json.loads(post_data.decode('utf-8'))
                
                # Load existing users.json file
                try:
                    users_file = os.getenv('USERS_FILE', 'users.json')
                    with open(users_file, 'r') as f:
                        existing_data = json.load(f)
                        if 'users' in existing_data:
                            users_list = existing_data['users']
                        else:
                            users_list = []
                except (FileNotFoundError, json.JSONDecodeError):
                    users_list = []
                
                # Add ID if not present
                if 'id' not in new_user_data:
                    import time
                    new_user_data['id'] = int(time.time() * 1000)
                
                # Add the new user to the list
                users_list.append(new_user_data)
                
                # Save updated data back to users.json file
                updated_data = {
                    'users': users_list,
                    'sessions': []
                }
                users_file = os.getenv('USERS_FILE', 'users.json')
                with open(users_file, 'w') as f:
                    json.dump(updated_data, f, indent=4)
                
                # Send success response
                self.send_response(HTTPStatus.OK)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'success', 'message': 'User saved successfully'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                # Send error response
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # Handle other POST requests with 404
            self.send_response(HTTPStatus.NOT_FOUND)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(HTTPStatus.OK)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def send_contact_email(self, contact_data):
        try:
            print(f"[EMAIL DEBUG] Processing contact form submission...")
            print(f"[EMAIL DEBUG] Name: {contact_data.get('name', 'Not provided')}")
            print(f"[EMAIL DEBUG] Email: {contact_data.get('email', 'Not provided')}")
            print(f"[EMAIL DEBUG] Grade: {contact_data.get('grade', 'Not provided')}")
            print(f"[EMAIL DEBUG] Interests: {', '.join(contact_data.get('interests', []))}")
            print(f"[EMAIL DEBUG] Message: {contact_data.get('message', 'Not provided')}")
            
            # Email configuration from environment
            smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
            smtp_port = int(os.getenv('SMTP_PORT', '587'))
            sender_email = os.getenv('SENDER_EMAIL', '')
            sender_password = os.getenv('SENDER_PASSWORD', '')
            # Comma-separated recipients in env
            recipient_env = os.getenv('RECIPIENT_EMAILS', '')
            recipient_emails = [e.strip() for e in recipient_env.split(',') if e.strip()] or []

            if not sender_email or not sender_password or not recipient_emails:
                print('[EMAIL ERROR] Missing email configuration in environment variables.')
                return False
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = ", ".join(recipient_emails)
            msg['Subject'] = f"New Club Application from {contact_data.get('name', 'Unknown')}"
            
            # Email body
            body = f"""
            New club application received:
            
            Name: {contact_data.get('name', 'Not provided')}
            Email: {contact_data.get('email', 'Not provided')}
            Grade: {contact_data.get('grade', 'Not provided')}
            Interests: {', '.join(contact_data.get('interests', []))}
            
            Message:
            {contact_data.get('message', 'Not provided')}
            
            ---
            This email was sent from the Code For All website contact form.
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            print(f"[EMAIL DEBUG] Connecting to SMTP server...")
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            print(f"[EMAIL DEBUG] Logging in...")
            server.login(sender_email, sender_password)
            print(f"[EMAIL DEBUG] Sending email...")
            text = msg.as_string()
            server.sendmail(sender_email, recipient_emails, text)
            server.quit()
            
            print(f"[EMAIL DEBUG] Email sent successfully!")
            return True
            
        except Exception as e:
            print(f"[EMAIL ERROR] Error sending email: {e}")
            print(f"[EMAIL ERROR] Error type: {type(e).__name__}")
            import traceback
            print(f"[EMAIL ERROR] Full traceback: {traceback.format_exc()}")
            return False
    
    def end_headers(self):
        # Add CORS headers to all responses
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    # Allow port override via environment
    PORT = int(os.getenv('PORT', '8001'))
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()