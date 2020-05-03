from flask import Flask, Blueprint, request
from flask_jwt_extended import decode_token
from sqlalchemy import insert
from sqlalchemy.sql import text
from project import db
import json

from project.models.user import User
from project.models.rating import Rating

action = Blueprint('action', __name__)


@action.route('/search', methods=['GET'])
def search():
    title = request.args.get('title')
    query = text("select imdbId from movies inner join links on id=movie_id where title like :x ;")
    result = db.engine.execute(query, x="%" + title + "%")
    resultset = [dict(row) for row in result]
    return json.dumps(resultset)


@action.route('/rate', methods=['POST'])
def rate():
    json_data = request.json
    rating = json_data['rating']
    imdbID = json_data['imdbID'][2:]
    username = decode_token(request.headers.get('Authorization')).get('identity')

    query = "SELECT movie_id FROM links WHERE imdbID = (?) ;"
    result = db.engine.execute(query, imdbID)
    resultset = [dict(row) for row in result]
    movie_id = resultset[0]['movie_id']

    user = User.query.filter(User.username == username).first()
    user_id = user.id

    query2 = "INSERT INTO ratings VALUES (?,?,?) ON CONFLICT(user_id,movie_id) DO UPDATE SET rating=(?);"
    result = db.engine.execute(query2, user_id, movie_id, rating, rating)

    return json.dumps([{'new_rating': rating}])


@action.route('/rate', methods=['GET'])
def get_rate():
    json_data = request.json
    print(json_data)
    return json.dumps([{'rating': 5}])
