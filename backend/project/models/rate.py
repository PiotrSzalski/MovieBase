from flask_sqlalchemy import SQLAlchemy
from project import db

class Rate(db.Model):
    __tablename__ = "rates"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    rate = db.Column(db.Integer, unique=False, nullable=False)
    
    def __init__(self, user_id, movie_id, rate):
        self.user_id = user_id
        self.movie_id = movie_id
        self.rate = rate

    def __repr__(self):
        return '<Rate %r>' % self.id