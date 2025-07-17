from flask import Blueprint, request, jsonify
from models import Chat
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

chat = Blueprint('chat', __name__)

@chat.route('/savechat', methods=['POST'])
@jwt_required()
def save_chat():
    try:
        email = get_jwt_identity()
        data = request.json
        
        if not data or 'messages' not in data:
            return jsonify({"error": "Invalid chat data"}), 400
            
        # Save the chat with email and timestamp
        chat_data = {
            "email": email,
            "messages": data["messages"],
            "timestamp": datetime.utcnow()
        }
        
        result = Chat.save_chat(chat_data)
        
        if result:
            return jsonify({"message": "Chat saved successfully"})
        return jsonify({"error": "Failed to save chat"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat.route('/getchathistory', methods=['GET'])
@jwt_required()
def get_chat_history():
    try:
        email = get_jwt_identity()
        
        # Get all chats for this user, sorted by timestamp (newest first)
        history = Chat.get_chat_history(email)
        
        # Convert ObjectId and format the response
        formatted_history = []
        for chat in history:
            formatted_chat = {
                "_id": str(chat["_id"]),
                "email": chat["email"],
                "messages": chat["messages"],
                "timestamp": chat["timestamp"].isoformat() if "timestamp" in chat else None
            }
            formatted_history.append(formatted_chat)
        
        return jsonify({
            "chat_history": formatted_history
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500