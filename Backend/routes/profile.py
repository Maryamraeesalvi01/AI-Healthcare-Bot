from flask import Blueprint, request, jsonify
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

profile = Blueprint('profile', __name__)

@profile.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    email = get_jwt_identity()
    user = User.get_user(email)
    if user:
        user.pop('password')  # Remove password before sending
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@profile.route('/editprofile', methods=['POST'])
@jwt_required()
def edit_profile():
    email = get_jwt_identity()
    data = request.json
    # Ensure '_id' is not included in the update
    if "_id" in data:
        data.pop("_id")
    User.update_profile(email, data)
    return jsonify({"message": "Profile updated successfully"})