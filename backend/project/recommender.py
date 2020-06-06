import pandas as pd
from surprise import Reader, Dataset
from surprise import SVD
from project import db
from project.models.link import Link
from project.models.rate import Rate
from project.config import BaseConfig
import threading
import os.path
import sqlalchemy as sa

class Recommender:
    def __init__(self):
        print("Loading data for recommender...")
        self.data = pd.read_csv('./data/ratings.csv')
        self.movies = set()
        for _, row in self.data.iterrows():
            self.movies.add(int(row[1]))
        print("Data loaded.")
        self.cached_recommendations = dict()
        self.counter = 0
        self.learned = False
        if not os.path.exists('./project/' + BaseConfig.MOVIEBASE_DB):
            print("No database created yet")
        else:
            print(os.path.exists('./project/' + BaseConfig.MOVIEBASE_DB))
            self.learn()

    def learn(self):
        engine = db.engine
        if sa.inspect(engine).get_table_names() == [] or not db.session.query(Rate).first():
            print("Nothing to learn on.")
            return
        print("Neural network is learning...")
        rates = db.session.query(Rate.user_id, Rate.movie_id, Rate.rate).all()
        ratings = self.data
        for rate in rates:
            new_row = {'userId':str(610+int(rate[0])), 'movieId':str(rate[1]), 'rating':rate[2]}
            self.movies.add(int(rate[0]))
            ratings = ratings.append(new_row, ignore_index=True)
        reader = Reader()
        data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)
        trainset = data.build_full_trainset()
        algo = SVD()
        algo.fit(trainset)
        self.algo = algo
        self.cached_recommendations = dict()
        print("Neural network learned.")
        self.learned = True
        
    def getPredictions(self, user_id):
        if not self.learned:
            print("Neural network not learned yet.")
            return []
        if not db.session.query(Rate).filter_by(user_id=user_id).first():
            print("Nothing to make predictions from.")
            return []
        if self.cached_recommendations.get(user_id):
            return self.cached_recommendations.get(user_id)
        user_rates = db.session.query(Rate.movie_id).filter_by(user_id=user_id).all()
        rated_movies = [movie_id for tup in user_rates for movie_id in tup]
        predictions = []
        for movie in self.movies:
            if not movie in rated_movies:
                prediction = self.algo.test([(str(610+user_id), movie, None)]) 
                predictions.append((prediction[0].iid,prediction[0].est))
        predictions = sorted(predictions, key=lambda tup: tup[1], reverse=True)[:20]
        predictions = list(list(zip(*predictions[:20]))[0])
        imdbIds = db.session.query(Link.imdbID).filter(Link.movie_id.in_(predictions)).all()
        resultset = [{"imdbID": id[0]} for id in imdbIds]
        self.cached_recommendations[user_id] = resultset
        return resultset

    def was_rate(self):
        self.counter += 1
        if self.counter == 5:
            thread = threading.Thread(target = self.learn)
            thread.start()
            self.counter = 0
