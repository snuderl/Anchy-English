import json
from functools import wraps
import os
from app.baza import *
from flask import request
from flask import Response, send_from_directory

from app.config import app


def get_json() -> dict:
    """Get JSON body from request, raising 400 if missing."""
    data = request.json
    assert data is not None
    return data


basedir = os.path.abspath(os.path.dirname(__file__))


def send_vue_app():
    """Serve the Vue app from built assets"""
    vue_dist_path = os.path.join(basedir, "anchy-english-vue", "dist")
    return send_from_directory(vue_dist_path, "index.html")


def returns_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        r = f(*args, **kwargs)
        return Response(r, content_type="application/json; charset=utf-8")

    return decorated_function


@returns_json
@app.route("/home")
def hello():
    translations = Translation.query.all()
    return json.dumps({x.english: x.slovene for x in translations})


@returns_json
@app.route("/api/worksheets", methods=["POST"])
@app.route("/api/worksheets/<id>", methods=["POST", "PUT"])
def updateWorksheets(id=None):
    data = get_json()
    ime = data["ime"]
    words = data["words"]
    categories = data["categories"]

    if id:
        worksheet: Worksheet = db.session.get(Worksheet, int(id))
    else:
        worksheet = Worksheet()

    worksheet.ime = ime.replace("<br>", "")
    worksheet.translations = [Translation.get(word) for word in words]
    worksheet.categories = [Category.get(x) for x in categories]

    db.session.add(worksheet)
    db.session.commit()
    return json.dumps({"id": worksheet.id})


@app.route("/api/worksheets/<id>/delete", methods=["get"])
def delete_worksheet(id):
    worksheet = db.session.get(Worksheet, int(id))
    worksheet.translations = []
    worksheet.categories = []
    db.session.commit()
    worksheet = db.session.get(Worksheet, int(id))
    db.session.delete(worksheet)
    db.session.commit()
    return ""


@app.route("/api/categories", methods=["GET"])
@app.route("/api/categories/<id>", methods=["GET"])
def categories(id=None):
    if id:
        category = db.session.get(Category, int(id))
        assert category is not None
        return json.dumps(category.dump())
    else:
        data = Category.query.order_by(Category.name).all()

    return json.dumps([x.dump() for x in data])


@returns_json
@app.route("/api/categories", methods=["POST"])
@app.route("/api/categories/<id>", methods=["POST"])
def save_category(id=None):
    data = get_json()
    name = data["name"]
    parent_name = data.get("parent")

    category = Category.query.filter(Category.name == name).first()
    if not category:
        category = Category(name=name)
        if parent_name:
            parent = Category.query.filter(Category.name == parent_name).first()
            if not parent:
                parent = Category(name=parent_name)
                db.session.add(parent)
            category.parent = parent
        db.session.add(category)
        db.session.commit()
    return json.dumps(category.dump())


@app.route("/api/categories/<id>/delete", methods=["POST"])
def delete_category(id):
    category = db.session.get(Category, int(id))
    db.session.delete(category)
    db.session.commit()
    return ""


@returns_json
@app.route("/api/worksheets")
@app.route("/api/worksheets/<id>")
def worksheet(id=None):
    if id:
        worksheets = db.session.get(Worksheet, int(id))
        if not worksheets:
            return json.dumps({"error": "Worksheet not found"})
    else:
        worksheets = Worksheet.query.all()

    res = worksheets
    if id:
        return json.dumps(res.dump())
    else:
        return json.dumps([x.dump() for x in res])


@app.route("/api/words")
def getAllWords():
    translations = Translation.query.all()
    translations = Translation.unique(translations)
    return json.dumps([x.dump() for x in translations])


@returns_json
@app.route("/api/exercises", methods=["GET"])
@app.route("/api/exercises/<id>", methods=["GET"])
def get_exercises(id=None):
    if id:
        exercise = db.session.get(Exercise, int(id))
        if not exercise:
            return json.dumps({"error": "Exercise not found"})
        return json.dumps(exercise.dump())
    else:
        exercises = Exercise.query.all()
        return json.dumps([x.dump() for x in exercises])


@returns_json
@app.route("/api/exercises", methods=["POST"])
@app.route("/api/exercises/<id>", methods=["POST", "PUT"])
def save_exercise(id=None):
    data = get_json()
    sentence_template = data["sentence_template"]
    missing_word = data["missing_word"]
    slovene_hint = data.get("slovene_hint")
    difficulty_level = data.get("difficulty_level", "beginner")
    exercise_set_id = data.get("exercise_set_id")

    if id:
        exercise = db.session.get(Exercise, int(id))
        assert exercise is not None
    else:
        exercise = Exercise()

    exercise.sentence_template = sentence_template
    exercise.missing_word = missing_word
    exercise.slovene_hint = slovene_hint
    exercise.difficulty_level = difficulty_level
    if exercise_set_id:
        exercise.exercise_set_id = exercise_set_id

    db.session.add(exercise)
    db.session.commit()
    return json.dumps({"id": exercise.id})


@app.route("/api/exercises/<id>/delete", methods=["POST"])
def delete_exercise(id):
    exercise = db.session.get(Exercise, int(id))
    db.session.delete(exercise)
    db.session.commit()
    return ""


@returns_json
@app.route("/api/exercise-sets", methods=["GET"])
@app.route("/api/exercise-sets/<id>", methods=["GET"])
def get_exercise_sets(id=None):
    if id:
        exercise_set = db.session.get(ExerciseSet, int(id))
        if not exercise_set:
            return json.dumps({"error": "Exercise set not found"})
        return json.dumps(exercise_set.dump())
    else:
        exercise_sets = ExerciseSet.query.all()
        return json.dumps([x.dump() for x in exercise_sets])


@returns_json
@app.route("/api/exercise-sets", methods=["POST"])
@app.route("/api/exercise-sets/<id>", methods=["POST", "PUT"])
def save_exercise_set(id=None):
    data = get_json()
    name = data["name"]
    description = data.get("description")
    categories = data.get("categories", [])

    if id:
        exercise_set = db.session.get(ExerciseSet, int(id))
        assert exercise_set is not None
    else:
        exercise_set = ExerciseSet()

    exercise_set.name = name
    exercise_set.description = description
    exercise_set.categories = [Category.get(x) for x in categories]

    db.session.add(exercise_set)
    db.session.commit()
    return json.dumps({"id": exercise_set.id})


@app.route("/api/exercise-sets/<id>/delete", methods=["POST"])
def delete_exercise_set(id):
    exercise_set = db.session.get(ExerciseSet, int(id))
    exercise_set.exercises = []
    exercise_set.categories = []
    db.session.commit()
    exercise_set = db.session.get(ExerciseSet, int(id))
    db.session.delete(exercise_set)
    db.session.commit()
    return ""


@returns_json
@app.route("/api/exercises/validate", methods=["POST"])
def validate_exercise():
    data = get_json()
    exercise_id = data["exercise_id"]
    user_answer = data["user_answer"].strip().lower()

    exercise = db.session.get(Exercise, int(exercise_id))
    if not exercise:
        return json.dumps({"error": "Exercise not found"})

    correct_answer = exercise.missing_word.lower()
    is_correct = user_answer == correct_answer

    return json.dumps(
        {
            "correct": is_correct,
            "correct_answer": exercise.missing_word,
            "slovene_hint": exercise.slovene_hint,
        }
    )


@app.route("/")
def default():
    """Serve the Vue app as the main application"""
    return send_vue_app()


@app.errorhandler(404)
def page_not_found(e):
    """Serve Vue app for 404s (SPA routing), unless it's an API call"""
    if not request.path.startswith("/api/"):
        # Serve Vue app for SPA routing
        return send_vue_app()
    return e


with app.app_context():
    db.create_all()


def main():
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=True, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
