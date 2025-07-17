from flask import Flask
from flask_pymongo import PyMongo
import config

app = Flask(__name__)

#  Flask app is configured before initializing PyMongo
app.config["MONGO_URI"] = config.MONGO_URI
app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY  # Ensure JWT key is loaded

mongo = PyMongo(app)
