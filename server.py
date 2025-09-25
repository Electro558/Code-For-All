#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urlparse, parse_qs
from http import HTTPStatus


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        parsed_path = urlparse(self.path)

        if parsed_path.path == "/send-contact":
            try:
                # Get the content length
                content_length = int(self.headers["Content-Length"])
                # Read the POST data
                post_data = self.rfile.read(content_length)
                # Parse JSON data
                contact_data = json.loads(post_data.decode("utf-8"))

                # Send email
                success = self.send_contact_email(contact_data)

                if success:
                    # Send success response
                    self.send_response(HTTPStatus.OK)
                    self.send_header("Content-type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    response = {
                        "status": "success",
                        "message": "Message sent successfully!",
                    }
                    self.wfile.write(json.dumps(response).encode("utf-8"))
                else:
                    # Send error response
                    self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                    self.send_header("Content-type", "application/json")
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    response = {"status": "error", "message": "Failed to send email"}
                    self.wfile.write(json.dumps(response).encode("utf-8"))

            except Exception as e:
                # Send error response
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"status": "error", "message": str(e)}
                self.wfile.write(json.dumps(response).encode("utf-8"))

        elif parsed_path.path == "/save-user":
            try:
                # Get the content length
                content_length = int(self.headers["Content-Length"])
                # Read the POST data
                post_data = self.rfile.read(content_length)
                # Parse JSON data
                new_user_data = json.loads(post_data.decode("utf-8"))

                # Load existing users.json file
                try:
                    with open("users.json", "r") as f:
                        existing_data = json.load(f)
                        if "users" in existing_data:
                            users_list = existing_data["users"]
                        else:
                            users_list = []
                except (FileNotFoundError, json.JSONDecodeError):
                    users_list = []

                # Add ID if not present
                if "id" not in new_user_data:
                    import time

                    new_user_data["id"] = int(time.time() * 1000)

                # Add the new user to the list
                users_list.append(new_user_data)

                # Save updated data back to users.json file
                updated_data = {"users": users_list, "sessions": []}
                with open("users.json", "w") as f:
                    json.dump(updated_data, f, indent=4)

                # Send success response
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"status": "success", "message": "User saved successfully"}
                self.wfile.write(json.dumps(response).encode("utf-8"))

            except Exception as e:
                # Send error response
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"status": "error", "message": str(e)}
                self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            # Handle other POST requests with 404
            self.send_response(HTTPStatus.NOT_FOUND)
            self.end_headers()

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(HTTPStatus.OK)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_contact_email(self, contact_data):
        try:
            # Gmail SMTP configuration
            smtp_server = "smtp.gmail.com"
            smtp_port = 587
            sender_email = "zhu47578@sas.edu.sg"  # Your Gmail address
            sender_password = "jkxh quhj fjip tvdb"  # Your Gmail app password
            recipient_emails = ["khushani46446@sas.edu.sg", "zhu47578@sas.edu.sg"]

            print(f"[EMAIL DEBUG] Starting email send process...")
            print(f"[EMAIL DEBUG] SMTP Server: {smtp_server}:{smtp_port}")
            print(f"[EMAIL DEBUG] From: {sender_email}")
            print(f"[EMAIL DEBUG] To: {', '.join(recipient_emails)}")

            # Create message
            msg = MIMEMultipart()
            msg["From"] = sender_email
            msg["To"] = ", ".join(recipient_emails)
            msg["Subject"] = (
                f"New Contact Form Submission from {contact_data.get('name', 'Unknown')}"
            )

            print(f"[EMAIL DEBUG] Subject: {msg['Subject']}")

            # Email body
            body = f"""
            New contact form submission:
            
            Name: {contact_data.get('name', 'Not provided')}
            Email: {contact_data.get('email', 'Not provided')}
            Grade: {contact_data.get('grade', 'Not provided')}
            Interests: {', '.join(contact_data.get('interests', []))}
            Message: {contact_data.get('message', 'Not provided')}
            """

            msg.attach(MIMEText(body, "plain"))
            print(f"[EMAIL DEBUG] Message body attached")

            # Send the email
            print(f"[EMAIL DEBUG] Connecting to SMTP server...")
            server = smtplib.SMTP(smtp_server, smtp_port)
            print(f"[EMAIL DEBUG] Connected to SMTP server")

            print(f"[EMAIL DEBUG] Starting TLS encryption...")
            server.starttls()  # Enable encryption
            print(f"[EMAIL DEBUG] TLS encryption enabled")

            print(f"[EMAIL DEBUG] Logging in with credentials...")
            server.login(sender_email, sender_password)
            print(f"[EMAIL DEBUG] Login successful")

            print(f"[EMAIL DEBUG] Sending message...")
            result = server.send_message(msg)
            print(f"[EMAIL DEBUG] Send result: {result}")

            server.quit()
            print(f"[EMAIL DEBUG] SMTP connection closed")

            print(f"Email sent successfully to {', '.join(recipient_emails)}")
            return True

        except Exception as e:
            print(f"[EMAIL ERROR] Error sending email: {e}")
            print(f"[EMAIL ERROR] Error type: {type(e).__name__}")
            import traceback

            print(f"[EMAIL ERROR] Full traceback: {traceback.format_exc()}")
            return False

    def end_headers(self):
        # Add CORS headers to all responses
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()


if __name__ == "__main__":
    PORT = 8000

    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.shutdown()
