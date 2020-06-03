from flask import Flask, Blueprint, request
from flask_jwt_extended import create_access_token, decode_token
from sqlalchemy.sql import text, func
from project import db
from project.models.user import User
from project.models.link import Link
from project.models.rate import Rate
from project.recommender import Recommender
import json
import datetime

action = Blueprint('action', __name__)

recommender = Recommender()

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
        user = db.session.query(User).filter_by(id=user_id).first()
        seconds_since_last_rate = (datetime.datetime.now() - user.last_rate).total_seconds()
        if seconds_since_last_rate < 5:
            return { "rated": False, "secs": 5 - int(seconds_since_last_rate)}
        if user_rate:
            user_rate.rate = json_data.get('rate')
        else:
            user_rate = Rate(user_id, movie_id, json_data.get('rate'))
        user.last_rate = datetime.datetime.now()
        db.session.add(user)
        db.session.add(user_rate)
        db.session.commit()
        db.session.close()
        recommender.was_rate()
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


@action.route('/rates', methods=['GET'])
def getMyRates():
    try:
        user_id = decode_token(request.headers.get('Authorization')).get('identity')
        user_rates = db.session.query(Rate.rate, Link.imdbID).filter_by(user_id=user_id).filter(Rate.movie_id == Link.movie_id).all()
        resultset = [{'imdbID': imdbIDnumber, 'rate': rate} for rate, imdbIDnumber in user_rates]
        resultset = json.dumps(resultset)
        if resultset:
            return { "rates": resultset }
        else:
            return { "rates": []}
    except Exception as e:
        print(str(e))
        return { "rate": [] }

@action.route('/tops', methods=['GET'])
def getTops():
    try:
        limit = int(request.args.get('limit'))
        top_rates = db.session.query(Link.imdbID, func.avg(Rate.rate).label('average')).\
            filter(Rate.movie_id == Link.movie_id).group_by(Link.imdbID).order_by(func.avg(Rate.rate).desc()).limit(limit).all()[limit-10:limit]
        resultset = [{'imdbID': imdbID, 'rate': rate} for imdbID, rate in top_rates]
        resultset = json.dumps(resultset)
        if resultset:
            return { "tops": resultset }
        else:
            return { "tops": []}
    except Exception as e:
        print(str(e))
        return { "tops": [] }

def get_count(q):
    count_q = q.statement.with_only_columns([func.count()]).order_by(None)
    count = q.session.execute(count_q).scalar()
    return count

@action.route('/recomendations', methods=['GET'])
def recomendation():
    try:
        user_id = decode_token(request.headers.get('Authorization')).get('identity')
        user_rates_count = get_count(db.session.query(Rate).filter_by(user_id=user_id))
        print(user_rates_count)
        if user_rates_count < 5:
            return {"recomendations": [], "count": user_rates_count}
        resultset = json.dumps(recommender.getPredictions(int(user_id)))
        if resultset:
            return { "recomendations": resultset, "count": user_rates_count}
    except Exception as e:
        print(str(e))
        return { "recomendations": [], "count": -1}
    
