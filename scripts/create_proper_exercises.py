from app.config import app
from app.baza import db, Exercise, ExerciseSet, Category


def create_proper_exercises():
    with app.app_context():
        # Clear existing data
        Exercise.query.delete()
        ExerciseSet.query.delete()
        db.session.commit()

        # Get or create categories
        daily_life_cat = Category.query.filter_by(name="Daily Life").first()
        family_cat = Category.query.filter_by(name="Family").first()
        travel_cat = Category.query.filter_by(name="Travel").first()

        # Create first exercise set - Daily Routine
        daily_set = ExerciseSet(
            name="Daily Routine", description="Common daily activities and routines"
        )
        daily_set.categories = [daily_life_cat]

        exercises1 = [
            Exercise(
                sentence_template="I _____ up at 7 AM every morning.",
                missing_word="wake",
                slovene_hint="zbuditi se",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="She _____ her teeth before breakfast.",
                missing_word="brushes",
                slovene_hint="umije",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="We _____ lunch at noon.",
                missing_word="eat",
                slovene_hint="jemo",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="They _____ to bed late on weekends.",
                missing_word="go",
                slovene_hint="iti",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="He _____ coffee in the morning.",
                missing_word="drinks",
                slovene_hint="pije",
                difficulty_level="beginner",
            ),
        ]

        for exercise in exercises1:
            exercise.exercise_set = daily_set

        db.session.add(daily_set)

        # Create second exercise set - Family Time
        family_set = ExerciseSet(
            name="Family Time", description="Activities with family members"
        )
        family_set.categories = [family_cat]

        exercises2 = [
            Exercise(
                sentence_template="My _____ cooks dinner every evening.",
                missing_word="mother",
                slovene_hint="mama",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="The _____ are playing in the garden.",
                missing_word="children",
                slovene_hint="otroci",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="Our _____ reads stories before bedtime.",
                missing_word="father",
                slovene_hint="oče",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="The whole _____ watches movies together.",
                missing_word="family",
                slovene_hint="družina",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="My _____ helps me with homework.",
                missing_word="sister",
                slovene_hint="sestra",
                difficulty_level="beginner",
            ),
            Exercise(
                sentence_template="Their _____ gives good advice.",
                missing_word="grandmother",
                slovene_hint="babica",
                difficulty_level="intermediate",
            ),
        ]

        for exercise in exercises2:
            exercise.exercise_set = family_set

        db.session.add(family_set)

        # Create third exercise set - Travel Adventures
        travel_set = ExerciseSet(
            name="Travel Adventures",
            description="Vocabulary for traveling and exploring",
        )
        travel_set.categories = [travel_cat]

        exercises3 = [
            Exercise(
                sentence_template="We need to _____ our tickets online.",
                missing_word="book",
                slovene_hint="rezervirati",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="The _____ departs at 3 PM.",
                missing_word="train",
                slovene_hint="vlak",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="She packed her _____ the night before.",
                missing_word="suitcase",
                slovene_hint="kovček",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="The _____ offers great views of the city.",
                missing_word="hotel",
                slovene_hint="hotel",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="They took many _____ during their vacation.",
                missing_word="photos",
                slovene_hint="fotografije",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="The _____ showed us the best restaurants.",
                missing_word="guide",
                slovene_hint="vodič",
                difficulty_level="intermediate",
            ),
            Exercise(
                sentence_template="Our _____ was delayed by two hours.",
                missing_word="flight",
                slovene_hint="let",
                difficulty_level="intermediate",
            ),
        ]

        for exercise in exercises3:
            exercise.exercise_set = travel_set

        db.session.add(travel_set)

        db.session.commit()

        total_exercises = len(exercises1) + len(exercises2) + len(exercises3)
        print(f"Created 3 exercise sets with {total_exercises} exercises:")
        print(f"- Daily Routine: {len(exercises1)} exercises")
        print(f"- Family Time: {len(exercises2)} exercises")
        print(f"- Travel Adventures: {len(exercises3)} exercises")
        print("\nAll sentences now have proper _____ placeholders!")


if __name__ == "__main__":
    create_proper_exercises()
