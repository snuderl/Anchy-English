"""
Pytest fixtures for testing the Anchy-English application.
Uses a real SQLite database for testing.
"""
import os
import tempfile
import pytest
from pathlib import Path

# Add parent directory to path to import our modules
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

# First configure the app BEFORE importing anything else
from flask import Flask
from baza import db, Translation, Worksheet, Category

# Don't import config or server yet - we need to set up test database first


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    
    # Create a fresh Flask app for testing
    # Set the correct paths for templates and static files
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    flask_app = Flask(__name__, 
                      static_folder=os.path.join(base_dir, 'app'),
                      static_url_path='',
                      template_folder=os.path.join(base_dir, 'templates'))
    
    # Configure the app for testing with temporary database
    flask_app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'WTF_CSRF_ENABLED': False,  # Disable CSRF for testing
    })
    
    # Initialize database with the test app
    db.init_app(flask_app)
    
    # Now import server to register routes AFTER database is configured
    with flask_app.app_context():
        # Import here to avoid using the production database
        from server import (
            hello, updateWorksheets, delete_worksheet, categories, 
            save_category, delete_category, worksheet, getAllWords, 
            default, main
        )
        
        # Register the routes manually
        flask_app.route("/home")(hello)
        flask_app.route("/worksheets", methods=["POST"])(updateWorksheets)
        flask_app.route("/worksheets/<id>", methods=["POST"])(updateWorksheets)
        flask_app.route("/worksheets/<id>/delete", methods=["GET"])(delete_worksheet)
        flask_app.route("/categories", methods=["GET"])(categories)
        flask_app.route("/categories/<id>", methods=["GET"])(categories)
        flask_app.route("/categories", methods=["POST"])(save_category)
        flask_app.route("/categories/<id>", methods=["POST"])(save_category)
        flask_app.route("/categories/<id>/delete", methods=["POST"])(delete_category)
        flask_app.route("/worksheets", methods=["GET"])(worksheet)
        flask_app.route("/worksheets/<id>", methods=["GET"])(worksheet)
        flask_app.route("/words")(getAllWords)
        flask_app.route("/")(default)
        flask_app.route("/vaje")(main)
        
        # Create the database and tables
        db.create_all()
    
    yield flask_app
    
    # Clean up
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


@pytest.fixture
def db_session(app):
    """Create a database session for testing."""
    with app.app_context():
        yield db.session
        db.session.remove()


@pytest.fixture
def sample_translation(db_session):
    """Create a sample translation for testing."""
    # Create within a worksheet to ensure it has a valid worksheet_id if required
    worksheet = Worksheet()
    worksheet.ime = "Sample Worksheet"
    translation = Translation(en="hello", sl="zdravo")
    worksheet.translations = [translation]
    db_session.add(worksheet)
    db_session.commit()
    return translation


@pytest.fixture
def sample_category(db_session):
    """Create a sample category for testing."""
    category = Category()
    category.name = "Basic Words"
    db_session.add(category)
    db_session.commit()
    return category


@pytest.fixture
def sample_worksheet(db_session, sample_translation, sample_category):
    """Create a sample worksheet with translations and categories."""
    worksheet = Worksheet()
    worksheet.ime = "Test Worksheet"
    worksheet.translations = [sample_translation]
    worksheet.categories = [sample_category]
    db_session.add(worksheet)
    db_session.commit()
    return worksheet


@pytest.fixture
def sample_data(db_session):
    """Create a comprehensive set of sample data."""
    # Create categories
    cat_basic = Category()
    cat_basic.name = "Basic"
    
    cat_advanced = Category()
    cat_advanced.name = "Advanced"
    
    cat_verbs = Category()
    cat_verbs.name = "Verbs"
    cat_verbs.parent = cat_basic
    
    # Create translations
    trans1 = Translation("dog", "pes")
    trans2 = Translation("cat", "mačka")
    trans3 = Translation("run", "teči")
    trans4 = Translation("walk", "hoditi")
    
    # Create worksheets
    worksheet1 = Worksheet()
    worksheet1.ime = "Animals"
    worksheet1.translations = [trans1, trans2]
    worksheet1.categories = [cat_basic]
    
    worksheet2 = Worksheet()
    worksheet2.ime = "Verbs"
    worksheet2.translations = [trans3, trans4]
    worksheet2.categories = [cat_verbs]
    
    # Add all to session
    db_session.add_all([cat_basic, cat_advanced, cat_verbs])
    db_session.add_all([trans1, trans2, trans3, trans4])
    db_session.add_all([worksheet1, worksheet2])
    db_session.commit()
    
    return {
        'categories': [cat_basic, cat_advanced, cat_verbs],
        'translations': [trans1, trans2, trans3, trans4],
        'worksheets': [worksheet1, worksheet2]
    }