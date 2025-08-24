from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from baza import db

# Set static folder to Vue dist directory
app = Flask(__name__, 
            static_folder='anchy-english-vue/dist',
            static_url_path='/static')
            
db_url = os.environ.get('DATABASE_URL', 'sqlite:///baza.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url

db.init_app(app)
