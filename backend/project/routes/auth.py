from flask import Flask, Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from sqlalchemy import exc
from project import db
from project.models.user import User

auth = Blueprint('auth', __name__)

@auth.route("/register", methods=['POST'])
def register():
    json_data = request.json
    if json_data.get('username') and json_data.get('password') and json_data.get('email'):
        user = User(json_data.get('username'), json_data.get('email'), generate_password_hash(json_data.get('password')))
        try:
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=user.username)
            result = { 'registered': True, 'token': access_token}
        except exc.IntegrityError:
            result = { 'registered': False, 'reason': 'Użytkonik istnieje.'}
        finally:
            db.session.close()
    else:
        result = { 'registered': False, 'reason': 'Nie podano wszystkich danych do rejestracji.'}
    return result

@auth.route("/login", methods=['POST'])
def login():
    json_data = request.json
    user = User.query.filter_by(username=json_data['username']).first()
    if user and check_password_hash(user.password, json_data.get('password')):
        access_token = create_access_token(identity=user.username)
        return { 'logged': True, 'token': access_token, 'user': user.username }
    else:
        return { 'logged': False }

@auth.route("/logout", methods=['GET'])
def logout():
    # To-do blacklist
    return { 'logged_out': True }

@auth.route("/status", methods=['GET'])
def status():
    try:
        user = decode_token(request.headers.get('Authorization')).get('identity')
        return { 'logged': True, 'user': user }
    except:
        return { 'logged': False }
    
    
