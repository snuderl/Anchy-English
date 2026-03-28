from app.config import app
from app.baza import db, Exercise, ExerciseSet, Category


def create_sample_data():
    with app.app_context():
        # Create sample exercises
        exercises_data = [
            {
                "sentence_template": "The cat is _____ on the chair.",
                "missing_word": "sitting",
                "slovene_hint": "sede",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "I like to _____ books in the evening.",
                "missing_word": "read",
                "slovene_hint": "brati",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "She is _____ to the store.",
                "missing_word": "going",
                "slovene_hint": "gre",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "The weather is very _____ today.",
                "missing_word": "nice",
                "slovene_hint": "lepo",
                "difficulty_level": "beginner",
            },
            {
                "sentence_template": "Can you _____ me your phone?",
                "missing_word": "lend",
                "slovene_hint": "posoditi",
                "difficulty_level": "intermediate",
            },
            {
                "sentence_template": "The movie was extremely _____.",
                "missing_word": "entertaining",
                "slovene_hint": "zabavno",
                "difficulty_level": "intermediate",
            },
            {
                "sentence_template": "He demonstrated remarkable _____ during the crisis.",
                "missing_word": "resilience",
                "slovene_hint": "odpornost",
                "difficulty_level": "advanced",
            },
        ]

        # Create categories
        daily_life_cat = Category.get({"name": "Daily Life"})
        entertainment_cat = Category.get({"name": "Entertainment"})

        db.session.add(daily_life_cat)
        db.session.add(entertainment_cat)
        db.session.commit()

        # Create exercise sets
        beginner_set = ExerciseSet()
        beginner_set.name = "Basic English Practice"
        beginner_set.description = "Simple sentences for beginners"
        beginner_set.categories = [daily_life_cat]

        intermediate_set = ExerciseSet()
        intermediate_set.name = "Everyday Conversations"
        intermediate_set.description = "Practice common phrases and vocabulary"
        intermediate_set.categories = [daily_life_cat, entertainment_cat]

        advanced_set = ExerciseSet()
        advanced_set.name = "Advanced Vocabulary"
        advanced_set.description = "Challenge yourself with complex words"
        advanced_set.categories = [daily_life_cat]

        # Add exercises to sets
        for i, ex_data in enumerate(exercises_data):
            exercise = Exercise()
            exercise.sentence_template = ex_data["sentence_template"]
            exercise.missing_word = ex_data["missing_word"]
            exercise.slovene_hint = ex_data["slovene_hint"]
            exercise.difficulty_level = ex_data["difficulty_level"]

            # Assign to appropriate set
            if ex_data["difficulty_level"] == "beginner":
                exercise.exercise_set = beginner_set
            elif ex_data["difficulty_level"] == "intermediate":
                exercise.exercise_set = intermediate_set
            else:
                exercise.exercise_set = advanced_set

        # Add all to database
        db.session.add(beginner_set)
        db.session.add(intermediate_set)
        db.session.add(advanced_set)
        db.session.commit()

        print("Sample exercises created successfully!")
        print(f"Created {len(exercises_data)} exercises across 3 exercise sets")


if __name__ == "__main__":
    create_sample_data()
