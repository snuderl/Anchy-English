from app.config import app
from app.baza import db, Exercise, ExerciseSet


def fix_family_exercises():
    with app.app_context():
        # Find the Family Time exercise set
        family_set = ExerciseSet.query.filter_by(name="Family Time").first()

        if not family_set:
            print("Family Time exercise set not found")
            return

        # Clear existing family exercises
        for exercise in family_set.exercises:
            db.session.delete(exercise)

        # Create new, unambiguous family exercises
        new_exercises = [
            {
                "sentence_template": "My _____ gave birth to me.",
                "missing_word": "mother",
                "slovene_hint": "mama",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "My _____ taught me to ride a bike.",
                "missing_word": "father",
                "slovene_hint": "oče",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "The _____ are too young to drive cars.",
                "missing_word": "children",
                "slovene_hint": "otroci",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "My older _____ got married last year.",
                "missing_word": "brother",
                "slovene_hint": "brat",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "My little _____ is only five years old.",
                "missing_word": "sister",
                "slovene_hint": "sestra",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "My _____ remembers the old country.",
                "missing_word": "grandmother",
                "slovene_hint": "babica",
                "difficulty_level": "intermediate",
            },
            {
                "sentence_template": "My _____ fought in World War II.",
                "missing_word": "grandfather",
                "slovene_hint": "dedek",
                "difficulty_level": "intermediate",
            },
        ]

        # Add new exercises to the set
        for ex_data in new_exercises:
            exercise = Exercise()
            exercise.sentence_template = ex_data["sentence_template"]
            exercise.missing_word = ex_data["missing_word"]
            exercise.slovene_hint = ex_data["slovene_hint"]
            exercise.difficulty_level = ex_data["difficulty_level"]
            exercise.exercise_set = family_set

        db.session.commit()

        print(
            f"Updated Family Time exercise set with {len(new_exercises)} new exercises:"
        )
        for ex in new_exercises:
            print(f"- '{ex['sentence_template']}' → {ex['missing_word']}")


if __name__ == "__main__":
    fix_family_exercises()
