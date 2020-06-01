import os
basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig(object):
    SECRET_KEY = 'e5ac358c-f0bf-11e5-9e39-d3b532c10a28'
    JWT_SECRET_KEY = 'e5ac358c-f0bf-11e5-9e39-d3b532c10a28'
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 13
    MOVIEBASE_DB = 'moviebase.db'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, MOVIEBASE_DB)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
