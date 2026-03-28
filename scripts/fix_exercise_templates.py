from app.config import app
from app.baza import db, Exercise


def fix_exercise_templates():
    with app.app_context():
        # Get all exercises and fix their templates
        exercises = Exercise.query.all()

        # Define correct templates with blanks in right places
        correct_templates = {
            "wake": "I _____ up at 7 AM every morning.",
            "brushes": "She _____ her teeth before breakfast.",
            "eat": "We _____ lunch at noon.",
            "go": "They _____ to bed late on weekends.",
            "drinks": "He _____ coffee in the morning.",
            "mother": "My _____ cooks dinner every evening.",
            "children": "The _____ are playing in the garden.",
            "father": "Our _____ reads stories before bedtime.",
            "family": "The whole _____ watches movies together.",
            "sister": "My _____ helps me with homework.",
            "grandmother": "Their _____ gives good advice.",
            "book": "We need to _____ our tickets online.",
            "train": "The _____ departs at 3 PM.",
            "suitcase": "She packed her _____ the night before.",
            "hotel": "The _____ offers great views of the city.",
            "photos": "They took many _____ during their vacation.",
            "guide": "The _____ showed us the best restaurants.",
            "flight": "Our _____ was delayed by two hours.",
        }

        for exercise in exercises:
            missing_word = exercise.missing_word
            if missing_word in correct_templates:
                old_template = exercise.sentence_template
                exercise.sentence_template = correct_templates[missing_word]
                print(
                    f"Fixed '{missing_word}': '{old_template}' -> '{exercise.sentence_template}'"
                )
            else:
                print(f"No template found for word: {missing_word}")

        db.session.commit()
        print(f"\nFixed {len(exercises)} exercise templates")


if __name__ == "__main__":
    fix_exercise_templates()
