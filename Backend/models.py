from db import mongo  # Import mongo from db.py

class User:
    @staticmethod
    def create_user(name, username, email, phone, password):
        try:
            user_data = {
                "name": name,
                "username": username,
                "email": email,
                "phone": phone,
                "password": password,  # This should be hashed
                "medical_history": [],
            }
            result = mongo.db.users.insert_one(user_data)
            return result.inserted_id  # Return the ID of the inserted document
        except Exception as e:
            print(f"Error inserting user into MongoDB: {e}")
            return None

    @staticmethod
    def get_user(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def get_user_by_username(username):
        return mongo.db.users.find_one({"username": username})  # Used only for login

    @staticmethod
    def update_profile(email, updates):
        return mongo.db.users.update_one({"email": email}, {"$set": updates})

class Chat:
    @staticmethod
    def save_chat(chat_data):
        return mongo.db.chats.insert_one(chat_data)

    @staticmethod
    def get_chat_history(email):
        return list(mongo.db.chats.find({"email": email}).sort("timestamp", -1))