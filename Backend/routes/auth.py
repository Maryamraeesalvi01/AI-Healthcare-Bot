from flask import Blueprint, request, jsonify
from models import User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from db import app  # Import app to initialize Bcrypt properly

bcrypt = Bcrypt(app)  # Fix: Ensure bcrypt is initialized with Flask app
auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.json
    required_fields = ["name", "username", "email", "phone", "password"]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    if User.get_user(data["email"]) or User.get_user_by_username(data["username"]):
        return jsonify({"error": "User already exists"}), 400

    try:
        hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        user_id = User.create_user(data["name"], data["username"], data["email"], data["phone"], hashed_password)

        if user_id:
            return jsonify({"message": "User registered successfully"}), 201
        return jsonify({"error": "Failed to create user"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True)
        print("Received data:", data)

        if not data or not data.get("username") or not data.get("password"):
            return jsonify({"error": "Username and password are required"}), 400

        user = User.get_user_by_username(data["username"])
        print("User found:", user)

        if user and "password" in user and bcrypt.check_password_hash(user["password"], data["password"]):
            access_token = create_access_token(identity=user["email"])

            # Convert ObjectId to string before returning
            user["_id"] = str(user["_id"])  # Convert ObjectId to string

            return jsonify({"token": access_token, "user": user}), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500