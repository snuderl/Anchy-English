from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from baza import db

app = Flask(__name__, static_folder='web', static_url_path='')
db_url = os.environ.get('DATABASE_URL', 'sqlite:///baza.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
db.init_app(app)
