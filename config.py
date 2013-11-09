from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='app', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///baza.sqlite'
db = SQLAlchemy(app)