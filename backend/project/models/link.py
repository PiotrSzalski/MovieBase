from flask_sqlalchemy import SQLAlchemy
from project import db


class Link(db.Model):
    __tablename__ = "links"
    imdbID = db.Column(db.String(80), primary_key=True, unique=True, nullable=True)
    movie_id = db.Column(db.String(80), db.ForeignKey('movies.id'), nullable=True)

    def __init__(self, movie_id, imdbID):
        self.movie_id = movie_id
        self.imdbID = imdbID

    def __repr__(self):
        return '<Link %r>' % self.id