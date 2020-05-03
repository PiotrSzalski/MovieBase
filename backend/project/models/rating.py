from flask_sqlalchemy import SQLAlchemy
from project import db


class Rating(db.Model):
    __tablename__ = "ratings"
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    rating = db.Column(db.Integer, nullable=False)

    def __init__(self, user_id, movie_id, rating):
        self.user_id = user_id
        self.movie_id = movie_id
        self.rating = rating

    def __repr__(self):
        return '<Rating %r %r>' % self.id
