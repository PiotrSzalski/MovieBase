from flask_script import Manager
from project import flask_app, db

manager = Manager(flask_app)

@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()
    print("Tables created")

@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()
    print("Tables dropped")

if __name__ == '__main__':
    manager.run()