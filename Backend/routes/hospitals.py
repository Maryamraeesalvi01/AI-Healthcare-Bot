from flask import Blueprint, jsonify

hospitals = Blueprint('hospitals', __name__)

@hospitals.route('/gethospitals', methods=['GET'])
def get_hospitals():
    return jsonify({"message": "Get nearby hospitals feature is being developed"})