from flask_sqlalchemy import SQLAlchemy
from project import db


class Movie(db.Model):
    __tablename__ = "movies"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(80), unique=False, nullable=True)
    genres = db.Column(db.String(80), unique=False, nullable=True)
    link = db.relationship('Link', backref='movie', lazy=True)
    comments = db.relationship('Comment', backref='movie', lazy='dynamic')
    
    def __init__(self, id, title, genres):
        self.id = id
        self.title = title
        self.genres = genres

    def __repr__(self):
        return '<Movie %r>' % self.id