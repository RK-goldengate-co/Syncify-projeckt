from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

FAQ = {
    "syncify là gì": "Syncify là nền tảng quản lý mạng xã hội giúp kết nối, lập lịch và phân tích hiệu quả từ một nơi.",
    "cách kết nối facebook": "Vào Mạng xã hội -> Thêm tài khoản -> Chọn Facebook và làm theo hướng dẫn OAuth (demo: chưa tích hợp thực).",
    "cách lên lịch": "Trong Mạng xã hội, chọn tài khoản và sử dụng trường datetime để thêm lịch đăng bài.",
    "đăng nhập mặc định": "Tài khoản admin mặc định: admin@syncify.dev / Admin@123.",
    "liên hệ hỗ trợ": "Gửi email tới support@syncify.dev (demo)."
}

@app.post('/chat')
def chat():
    data = request.get_json(force=True, silent=True) or {}
    message = (data.get('message') or '').strip().lower()
    answer = None
    # match simple keys
    for k, v in FAQ.items():
        if k in message:
            answer = v
            break
    if not answer:
        answer = "Xin lỗi, mình chỉ trả lời các câu hỏi cố định (FAQ). Hãy thử: 'syncify là gì', 'cách kết nối facebook', 'cách lên lịch', 'đăng nhập mặc định', 'liên hệ hỗ trợ'."
    return jsonify({
        'reply': answer
    })

@app.get('/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
