from app.config import app
from app.baza import db, Exercise


def update_exercise_templates():
    with app.app_context():
        # Get all exercises
        exercises = Exercise.query.all()

        for exercise in exercises:
            # Remove the _____ from sentence templates
            old_template = exercise.sentence_template
            new_template = old_template.replace("_____", "").replace("  ", " ").strip()

            # If the template ends with a period and we removed underscores before it,
            # make sure there's a space before the period
            if new_template.endswith(".") and not new_template.endswith(" ."):
                # Find where the missing word should go and add proper spacing
                parts = old_template.split("_____")
                if len(parts) == 2:
                    new_template = parts[0].rstrip() + " " + parts[1].lstrip()

            exercise.sentence_template = new_template
            print(f"Updated: '{old_template}' -> '{new_template}'")

        db.session.commit()
        print("All exercises updated successfully!")


if __name__ == "__main__":
    update_exercise_templates()
