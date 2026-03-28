"""
Pytest fixtures for testing the Anchy-English application.
Uses a real SQLite database for testing.
"""

import os
import sys
import tempfile
from pathlib import Path

import pytest

# Ensure project root is on sys.path so `import baza` etc. work
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Set test DB before anything imports config
_db_fd, _db_path = tempfile.mkstemp(suffix=".db")
os.environ["DATABASE_URL"] = f"sqlite:///{_db_path}"

from app.baza import Category, Translation, Worksheet, db
from app.config import app as _app

import server  # noqa: F401 — registers routes


@pytest.fixture(autouse=True)
def _reset_db():
    """Create fresh tables for each test, drop after."""
    with _app.app_context():
        db.create_all()
    yield
    with _app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def app():
    _app.config["TESTING"] = True
    return _app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def db_session(app):
    """Create a database session for testing."""
    with app.app_context():
        yield db.session


@pytest.fixture
def sample_translation(db_session):
    """Create a sample translation for testing."""
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
    cat_basic = Category()
    cat_basic.name = "Basic"

    cat_advanced = Category()
    cat_advanced.name = "Advanced"

    cat_verbs = Category()
    cat_verbs.name = "Verbs"
    cat_verbs.parent = cat_basic

    trans1 = Translation("dog", "pes")
    trans2 = Translation("cat", "mačka")
    trans3 = Translation("run", "teči")
    trans4 = Translation("walk", "hoditi")

    worksheet1 = Worksheet()
    worksheet1.ime = "Animals"
    worksheet1.translations = [trans1, trans2]
    worksheet1.categories = [cat_basic]

    worksheet2 = Worksheet()
    worksheet2.ime = "Verbs"
    worksheet2.translations = [trans3, trans4]
    worksheet2.categories = [cat_verbs]

    db_session.add_all([cat_basic, cat_advanced, cat_verbs])
    db_session.add_all([trans1, trans2, trans3, trans4])
    db_session.add_all([worksheet1, worksheet2])
    db_session.commit()

    return {
        "categories": [cat_basic, cat_advanced, cat_verbs],
        "translations": [trans1, trans2, trans3, trans4],
        "worksheets": [worksheet1, worksheet2],
    }
