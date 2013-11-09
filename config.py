from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder='app', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL'] #'sqlite:///baza.sqlite'
db = SQLAlchemy(app)