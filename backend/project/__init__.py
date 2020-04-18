from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from project.config import BaseConfig
from flask_cors import CORS
from flask_jwt_extended import JWTManager

flask_app = Flask(__name__)
flask_app.config.from_object(BaseConfig)
cors = CORS(flask_app)
db = SQLAlchemy(flask_app)
jwt = JWTManager(flask_app)

from project.routes.auth import auth
flask_app.register_blueprint(auth)