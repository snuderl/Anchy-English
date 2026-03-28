from flask import Flask
import os
from app.baza import db

# Resolve paths relative to the project root (one level up from this file)
_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Set static folder to Vue app dist directory
app = Flask(
    __name__,
    static_folder=os.path.join(_project_root, "anchy-english-vue", "dist"),
    static_url_path="",
    instance_path=os.path.join(_project_root, "instance"),
)

db_url = os.environ.get("DATABASE_URL", "sqlite:///baza.sqlite")
app.config["SQLALCHEMY_DATABASE_URI"] = db_url

db.init_app(app)
