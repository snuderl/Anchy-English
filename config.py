from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder='app', static_url_path='')
db_url = os.environ.get('DATABASE_URL')
if not db_url:
	db_url = 'sqlite:///baza.sqlite'
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
db = SQLAlchemy(app)