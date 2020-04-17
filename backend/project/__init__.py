from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from project.config import BaseConfig

flask_app = Flask(__name__)
flask_app.config.from_object(BaseConfig)
db = SQLAlchemy(flask_app)

    
