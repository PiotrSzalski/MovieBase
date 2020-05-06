from flask import Flask, Blueprint, request
from flask_jwt_extended import create_access_token, decode_token
from sqlalchemy.sql import text
from project import db
from project.models.link import Link
from project.models.rate import Rate
import json

action = Blueprint('action', __name__)

@action.route('/search', methods=['GET'])
def search():
    title = request.args.get('title')
    query = text("select imdbId from movies inner join links on id=movie_id where title like :x ;")
    result = db.engine.execute(query, x="%" + title + "%")
    resultset = [dict(row) for row in result]
    return json.dumps(resultset)

@action.route('/rate', methods=['POST'])
def rateMovie():
    try:
        json_data = request.json
        user_id = decode_token(request.headers.get('Authorization')).get('identity')
        movie_id = db.session.query(Link).filter_by(imdbID=json_data.get("imdbId")).first().movie_id
        user_rate = db.session.query(Rate).filter_by(user_id=user_id).filter_by(movie_id=movie_id).first()
        if user_rate:
            user_rate.rate = json_data.get('rate')
        else:
            user_rate = Rate(user_id, movie_id, json_data.get('rate'))
        db.session.add(user_rate)
        db.session.commit()
        db.session.close()
        return { "rated": True }
    except Exception as e:
        print(str(e))
        return { "rated": False }

@action.route('/rate', methods=['GET'])
def getRate():
    try:
        user_id = decode_token(request.headers.get('Authorization')).get('identity')
        movie_id = db.session.query(Link).filter_by(imdbID=request.args.get('movieId')).first().movie_id
        user_rate = db.session.query(Rate).filter_by(user_id=user_id).filter_by(movie_id=movie_id).first()
        if user_rate:
            return { "rate": user_rate.rate }
        else:
            return { "rate": 0 }
    except Exception as e:
        print(str(e))
        return { "rate": 0 }
    