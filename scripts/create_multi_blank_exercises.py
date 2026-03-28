from app.config import app
from app.baza import db, Exercise, ExerciseSet, Category


def create_multi_blank_exercises():
    with app.app_context():
        # Clear existing exercises
        Exercise.query.delete()
        ExerciseSet.query.delete()
        db.session.commit()

        # Create categories
        daily_life_cat = Category.get({"name": "Daily Life"})
        family_cat = Category.get({"name": "Family"})
        travel_cat = Category.get({"name": "Travel"})

        db.session.add_all([daily_life_cat, family_cat, travel_cat])
        db.session.commit()

        # Exercise sets with multiple blanks per set
        exercise_sets_data = [
            {
                "name": "Daily Routine",
                "description": "Common daily activities and routines",
                "categories": [daily_life_cat],
                "exercises": [
                    {
                        "sentence_template": "I _____ up at 7 AM every morning.",
                        "missing_word": "wake",
                        "slovene_hint": "zbuditi se",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "She _____ her teeth before breakfast.",
                        "missing_word": "brushes",
                        "slovene_hint": "umije",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "We _____ lunch at noon.",
                        "missing_word": "eat",
                        "slovene_hint": "jemo",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "They _____ to bed late on weekends.",
                        "missing_word": "go",
                        "slovene_hint": "iti",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "He _____ coffee in the morning.",
                        "missing_word": "drinks",
                        "slovene_hint": "pije",
                        "difficulty_level": "beginner",
                    },
                ],
            },
            {
                "name": "Family Time",
                "description": "Activities with family members",
                "categories": [family_cat, daily_life_cat],
                "exercises": [
                    {
                        "sentence_template": "My _____ cooks dinner every evening.",
                        "missing_word": "mother",
                        "slovene_hint": "mama",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "The _____ are playing in the garden.",
                        "missing_word": "children",
                        "slovene_hint": "otroci",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "Our _____ reads stories before bedtime.",
                        "missing_word": "father",
                        "slovene_hint": "oče",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "The whole _____ watches movies together.",
                        "missing_word": "family",
                        "slovene_hint": "družina",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "My _____ helps me with homework.",
                        "missing_word": "sister",
                        "slovene_hint": "sestra",
                        "difficulty_level": "beginner",
                    },
                    {
                        "sentence_template": "Their _____ gives good advice.",
                        "missing_word": "grandmother",
                        "slovene_hint": "babica",
                        "difficulty_level": "intermediate",
                    },
                ],
            },
            {
                "name": "Travel Adventures",
                "description": "Vocabulary for traveling and exploring",
                "categories": [travel_cat],
                "exercises": [
                    {
                        "sentence_template": "We need to _____ our tickets online.",
                        "missing_word": "book",
                        "slovene_hint": "rezervirati",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "The _____ departs at 3 PM.",
                        "missing_word": "train",
                        "slovene_hint": "vlak",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "She packed her _____ the night before.",
                        "missing_word": "suitcase",
                        "slovene_hint": "kovček",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "The _____ offers great views of the city.",
                        "missing_word": "hotel",
                        "slovene_hint": "hotel",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "They took many _____ during their vacation.",
                        "missing_word": "photos",
                        "slovene_hint": "fotografije",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "The _____ showed us the best restaurants.",
                        "missing_word": "guide",
                        "slovene_hint": "vodič",
                        "difficulty_level": "intermediate",
                    },
                    {
                        "sentence_template": "Our _____ was delayed by two hours.",
                        "missing_word": "flight",
                        "slovene_hint": "let",
                        "difficulty_level": "intermediate",
                    },
                ],
            },
        ]

        # Create exercise sets and exercises
        for set_data in exercise_sets_data:
            exercise_set = ExerciseSet()
            exercise_set.name = set_data["name"]
            exercise_set.description = set_data["description"]
            exercise_set.categories = set_data["categories"]

            # Add exercises to the set
            for ex_data in set_data["exercises"]:
                exercise = Exercise()
                exercise.sentence_template = ex_data["sentence_template"]
                exercise.missing_word = ex_data["missing_word"]
                exercise.slovene_hint = ex_data["slovene_hint"]
                exercise.difficulty_level = ex_data["difficulty_level"]
                exercise.exercise_set = exercise_set

            db.session.add(exercise_set)

        db.session.commit()

        total_exercises = sum(
            len(set_data["exercises"]) for set_data in exercise_sets_data
        )
        print(
            f"Created {len(exercise_sets_data)} exercise sets with {total_exercises} total exercises"
        )

        # Display summary
        for set_data in exercise_sets_data:
            print(f"- {set_data['name']}: {len(set_data['exercises'])} exercises")


if __name__ == "__main__":
    create_multi_blank_exercises()
