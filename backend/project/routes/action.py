from flask import Flask, Blueprint, request
from sqlalchemy.sql import text
from project import db
import json

action = Blueprint('action', __name__)

@action.route('/search', methods=['GET'])
def search():
    title = request.args.get('title')
    query = text("select imdbId from movies inner join links on id=movie_id where title like :x ;")
    result = db.engine.execute(query, x="%" + title + "%")
    resultset = [dict(row) for row in result]
    return json.dumps(resultset)
