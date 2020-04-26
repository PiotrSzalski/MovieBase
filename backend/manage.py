from flask_script import Manager
from project import flask_app, db
from project.models.movie import Movie
from project.models.link import Link
import csv

manager = Manager(flask_app)

@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()
    load_movies()
    load_links()
    

@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()


def load_links():
    with open('data/links.csv','rt', encoding="utf8") as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        next(readCSV)
        try:
            for row in readCSV:
                id = int(row[0])
                imdbId = row[1]
                link = Link(id,imdbId)
                db.session.add(link)
                
        except exc.IntegrityError:
            print(f'Integrity Error on: {row}')
        finally:
            db.session.commit()
            db.session.close()


def load_movies():
    with open('data/movies.csv','rt', encoding="utf8") as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        next(readCSV)
        try:
            for row in readCSV:
                id = int(row[0])
                title = row[1]
                genres = row[2]
                movie = Movie(id,title,genres)
                db.session.add(movie)
                
        except exc.IntegrityError:
            print(f'Integrity Error on: {row}')
        finally:
            db.session.commit()
            db.session.close()


if __name__ == '__main__':
    manager.run()