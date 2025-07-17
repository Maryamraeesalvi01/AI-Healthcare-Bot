from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import config
from db import mongo  # Ensure db is initialized before use
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB (Local)
client = MongoClient("mongodb://localhost:27017/")
db = client["ai_healthcare_bot"] 

CORS(app, origins=["http://localhost:3000"])  # Enable CORS for frontend

# Fix: Set JWT_SECRET_KEY properly
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY  

jwt = JWTManager(app)

# Register Blueprints
from routes.auth import auth
from routes.profile import profile
from routes.chat import chat
from routes.hospitals import hospitals

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(profile, url_prefix='/user')
app.register_blueprint(chat, url_prefix='/chat')
app.register_blueprint(hospitals, url_prefix='/hospitals')

if __name__ == "__main__":
    app.run(debug=True)
