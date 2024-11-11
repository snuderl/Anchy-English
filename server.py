import sqlite3
import json
from flask import g
from functools import wraps
import os
from baza import *
from flask import request
from flask import redirect, render_template, url_for

from config import app


basedir = os.path.abspath(os.path.dirname(__file__))


def request_has_connection():
    return hasattr(g, 'dbconn')


def get_request_connection():
    if not request_has_connection():
        g.dbconn = sqlite3.connect(DATABASE)
        # Do something to make this connection transactional. I'm not familiar
        # with SQLite to know what that is.
    return g.dbconn


def returns_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        r = f(*args, **kwargs)
        return Response(r, content_type='application/json; charset=utf-8')
    return decorated_function


@app.teardown_request
def close_db_connection(ex):
    if request_has_connection():
        conn = get_request_connection()
        if None is ex:
            # Commit
            pass
        else:
            # Rollback
            pass
        conn.close()


@returns_json
@app.route("/home")
def hello():
    translations = Translation.query.all()
    return json.dumps({x.english: x.slovene for x in translations})


@returns_json
@app.route("/worksheets", methods=["POST"])
@app.route("/worksheets/<id>", methods=["POST"])
def updateWorksheets(id=None):

    data = request.json
    ime = data["ime"]
    words = data["words"]
    categories = data["categories"]

    if id:
        worksheet: Worksheet = Worksheet.query.get(int(id))
    else:
        worksheet = Worksheet()

    worksheet.ime = ime.replace("<br>", "")
    worksheet.translations = [Translation.get(word) for word in words]
    worksheet.categories = [Category.get(x) for x in categories]

    db.session.add(worksheet)
    db.session.commit()
    return json.dumps({"id": worksheet.id})


@app.route("/worksheets/<id>/delete", methods=["get"])
def delete_worksheet(id):
    worksheet = Worksheet.query.get(int(id))
    worksheet.translations = []
    worksheet.categories = []
    db.session.commit()
    worksheet = Worksheet.query.get(int(id))
    db.session.delete(worksheet)
    db.session.commit()
    return ""


@app.route("/categories", methods=["GET"])
@app.route("/categories/<id>", methods=["GET"])
def categories(id=None):
    if id: return json.dumps(Category.query.get(int(id)).dump())
    else:  data = Category.query.order_by(Category.name).all()

    return json.dumps([x.dump() for x in data])




@app.route("/categories", methods=["POST"])
@app.route("/categories/<id>", methods=["POST"])
def save_category(id=None):
    data = request.json
    name = data["name"]
    parent_name = data.get("parent")

    category = Category.query.filter(Category.name == name).first()
    if not category:
        category = Category(name=name)
        if parent_name:
            parent = Category.query.filter(Category.name == parent_name)
            if not parent:
                parent = Category(name=parent_name)
                db.session.add(parent)
            category.parent = parent
        db.session.add(category)
        db.session.commit()
    return ""

@app.route("/categories/<id>/delete", methods=["POST"])
def delete_category(id):
    category = Category.query.get(int(id))
    db.session.delete(category)
    db.session.commit()
    return ""

@returns_json
@app.route("/worksheets")
@app.route("/worksheets/<id>")
def worksheet(id=None):
    if id:
        worksheets = Worksheet.query.get(int(id))
        if not worksheets:
            return json.dumps({
                "error": "Worksheet not found"
            })
    else:
        worksheets = Worksheet.query.all()



    res = worksheets
    if id:
        return json.dumps(res.dump())
    else:
        return json.dumps([x.dump() for x in res])


@app.route("/words")
def getAllWords():
    translations = Translation.query.all()
    translations = Translation.unique(translations)
    return json.dumps([x.dump() for x in translations])


# @returns_json
# @app.route("/addWord/<word1>/<word2>")
# def addWord(word1, word2):
#     tr = Translation(word1, word2)
#     db.session.add(tr)
#     db.session.commit()
#     return getAllWords()


@app.route("/")
def default():
    return redirect(url_for("main"))


@app.route("/vaje")
def main():
    return render_template("index.html")

@app.errorhandler(404)
def page_not_found(e):
    return e


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
