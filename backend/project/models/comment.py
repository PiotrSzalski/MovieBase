from flask_sqlalchemy import SQLAlchemy
from project import db
import datetime


class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    body = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=True)

    def __init__(self, user_id, movie_id, body, created_at=None):
        self.user_id = user_id
        self.movie_id = movie_id
        self.body = body
        if created_at:
            self.created_at = created_at

    def __repr__(self):
        return '<Comment %r>' % self.id
