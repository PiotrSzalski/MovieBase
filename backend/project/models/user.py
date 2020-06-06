from flask_sqlalchemy import SQLAlchemy
from project import db
import datetime

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    last_rate = db.Column(db.DateTime(), nullable=True)
    comments = db.relationship('Comment', backref='user', lazy='dynamic')

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
        self.last_rate = datetime.datetime.now()

    def __repr__(self):
        return '<User %r>' % self.username
