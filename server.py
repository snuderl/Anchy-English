import sqlite3
import flask
import json
from flask import g
from functools import wraps
import os
from baza import *
from flask import request

from config import app


basedir = os.path.abspath(os.path.dirname(__file__))





def request_has_connection():
    return hasattr(g, 'dbconn')

def get_request_connection():
    if not request_has_connection():
        g.dbconn = sqlite3.connect(DATABASE)
        # Do something to make this connection transactional. I'm not familiar with SQLite to know what that is.
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
@app.route("/worksheet/save/", methods=["POST"])
@app.route("/worksheet/save/<id>", methods=["POST"])
def updateWorksheet(id=None):

    data = request.json
    ime = data["ime"]
    words = data["words"]

    if id:
        worksheet = Worksheet.query.filter_by(id=int(id))[0]
    else:
        worksheet = Worksheet()
        db.session.add(worksheet)
        db.session.commit()

    worksheet.ime = ime

    worksheetWords = []
    for x in words:
        key = next(iter(x.keys()))
        value = x[key]
        worksheetWords.append(Translation(key,value))

    worksheet.translations = worksheetWords
    db.session.commit()
    return json.dumps({"id": worksheet.id})

@returns_json
@app.route("/worksheet/")
@app.route("/worksheet/<id>")
def worksheet(id=None):
    if id:
        worksheets = Worksheet.query.filter_by(id=int(id))
    else:
        worksheets = Worksheet.query.all()


    res =  worksheets
    if id:
        res = res[0]
        return json.dumps({
            "worksheet": res.dump(),
            "words": {x.english: x.slovene for x in res.translations}
        })
    else:
        return json.dumps([x.dump() for x in res])







@app.route("/words/all")
def getAllWords():
    translations = Translation.query.all()
    return json.dumps({x.english: x.slovene for x in translations})

@returns_json
@app.route("/addWord/<word1>/<word2>")
def addWord(word1, word2):
    tr = Translation(word1, word2)
    db.session.add(tr)
    db.session.commit()
    return getAllWords()

if __name__ == "__main__":
    app.run(debug=True)