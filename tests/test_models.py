"""
Tests for database models.
"""
import pytest
from baza import Translation, Worksheet, Category


class TestTranslationModel:
    """Test the Translation model."""

    def test_create_translation(self, db_session):
        """Test creating a new translation."""
        # Create translation within a worksheet
        worksheet = Worksheet()
        worksheet.ime = "Test"
        translation = Translation("book", "knjiga")
        worksheet.translations = [translation]
        db_session.add(worksheet)
        db_session.commit()
        
        assert translation.id is not None
        assert translation.english == "book"
        assert translation.slovene == "knjiga"
        assert translation.worksheet_id == worksheet.id

    def test_translation_get_by_id(self, db_session, sample_translation):
        """Test getting translation by ID."""
        word_dict = {"id": str(sample_translation.id)}
        result = Translation.get(word_dict)

        assert result.id == sample_translation.id
        assert result.english == "hello"
        assert result.slovene == "zdravo"

    def test_translation_get_by_words(self, db_session):
        """Test getting translation by English and Slovene words."""
        # First create a translation within a worksheet
        worksheet = Worksheet()
        worksheet.ime = "Water Test"
        trans = Translation("water", "voda")
        worksheet.translations = [trans]
        db_session.add(worksheet)
        db_session.commit()

        # Try to get it
        word_dict = {"english": "water", "slovene": "voda"}
        result = Translation.get(word_dict)

        assert result.english == "water"
        assert result.slovene == "voda"

    def test_translation_get_creates_new(self, db_session):
        """Test that get() creates new translation if not found."""
        word_dict = {"english": "new", "slovene": "novo"}
        result = Translation.get(word_dict)

        assert result.english == "new"
        assert result.slovene == "novo"
        # Note: it's not committed yet
        assert result.id is None

    def test_translation_dump(self, db_session, sample_translation):
        """Test the dump method."""
        result = sample_translation.dump()

        assert result["id"] == sample_translation.id
        assert result["english"] == "hello"
        assert result["slovene"] == "zdravo"

    def test_translation_unique(self, db_session):
        """Test the unique static method."""
        # Create translations within a worksheet
        worksheet = Worksheet()
        worksheet.ime = "Unique Test"
        trans1 = Translation("same", "isto")
        trans2 = Translation("same", "isto")
        trans3 = Translation("different", "drugačno")
        worksheet.translations = [trans1, trans2, trans3]
        
        db_session.add(worksheet)
        db_session.commit()

        all_trans = [trans1, trans2, trans3]
        unique_trans = list(Translation.unique(all_trans))

        assert len(unique_trans) == 2
        unique_words = [(t.english, t.slovene) for t in unique_trans]
        assert ("same", "isto") in unique_words
        assert ("different", "drugačno") in unique_words


class TestCategoryModel:
    """Test the Category model."""

    def test_create_category(self, db_session):
        """Test creating a new category."""
        category = Category()
        category.name = "Food"
        db_session.add(category)
        db_session.commit()

        assert category.id is not None
        assert category.name == "Food"
        assert category.parent is None

    def test_category_with_parent(self, db_session):
        """Test creating category with parent."""
        parent = Category()
        parent.name = "Grammar"

        child = Category()
        child.name = "Nouns"
        child.parent = parent

        db_session.add_all([parent, child])
        db_session.commit()

        assert child.parent_id == parent.id
        assert child.parent.name == "Grammar"

    def test_category_get(self, db_session):
        """Test the get static method."""
        import uuid
        unique_name = f"Animals_{uuid.uuid4().hex[:8]}"
        
        # Create a category first
        cat = Category()
        cat.name = unique_name
        db_session.add(cat)
        db_session.commit()

        # Try to get it
        result = Category.get({"name": unique_name})
        assert result.name == unique_name
        assert result.id == cat.id

        # Try to get non-existent
        nonexistent_name = f"NonExistent_{uuid.uuid4().hex[:8]}"
        result2 = Category.get({"name": nonexistent_name})
        assert result2.name == nonexistent_name
        assert result2.id is None  # Not committed yet

    def test_category_dump(self, db_session):
        """Test the dump method."""
        parent = Category()
        parent.name = "Main"

        child = Category()
        child.name = "Sub"
        child.parent = parent

        db_session.add_all([parent, child])
        db_session.commit()

        parent_dump = parent.dump()
        assert parent_dump["name"] == "Main"
        assert parent_dump["parent"] is None
        assert parent_dump["id"] == parent.id

        child_dump = child.dump()
        assert child_dump["name"] == "Sub"
        assert child_dump["parent"] == "Main"
        assert child_dump["parent_id"] == parent.id


class TestWorksheetModel:
    """Test the Worksheet model."""

    def test_create_worksheet(self, db_session):
        """Test creating a new worksheet."""
        worksheet = Worksheet()
        worksheet.ime = "My Worksheet"
        db_session.add(worksheet)
        db_session.commit()

        assert worksheet.id is not None
        assert worksheet.ime == "My Worksheet"
        assert len(worksheet.translations) == 0
        assert len(worksheet.categories) == 0

    def test_worksheet_with_translations(self, db_session):
        """Test worksheet with translations."""
        trans1 = Translation("yes", "da")
        trans2 = Translation("no", "ne")

        worksheet = Worksheet()
        worksheet.ime = "Basic Responses"
        worksheet.translations = [trans1, trans2]

        db_session.add(worksheet)
        db_session.commit()

        assert len(worksheet.translations) == 2
        assert trans1.worksheet_id == worksheet.id
        assert trans2.worksheet_id == worksheet.id

    def test_worksheet_with_categories(self, db_session):
        """Test worksheet with categories."""
        cat1 = Category()
        cat1.name = "Beginner"
        cat2 = Category()
        cat2.name = "Essential"

        worksheet = Worksheet()
        worksheet.ime = "Start Here"
        worksheet.categories = [cat1, cat2]

        db_session.add(worksheet)
        db_session.commit()

        assert len(worksheet.categories) == 2
        assert cat1 in worksheet.categories
        assert cat2 in worksheet.categories

    def test_worksheet_dump(self, db_session, sample_worksheet):
        """Test the dump method."""
        result = sample_worksheet.dump()

        assert result["id"] == sample_worksheet.id
        assert result["ime"] == "Test Worksheet"
        assert len(result["words"]) == 1
        assert result["words"][0]["english"] == "hello"
        assert len(result["categories"]) == 1
        assert result["categories"][0]["name"] == "Basic Words"

    def test_worksheet_cascade_delete(self, db_session):
        """Test that deleting worksheet deletes its translations."""
        trans = Translation("delete", "izbrisati")
        worksheet = Worksheet()
        worksheet.ime = "To Delete"
        worksheet.translations = [trans]

        db_session.add(worksheet)
        db_session.commit()

        worksheet_id = worksheet.id
        trans_id = trans.id

        # Delete worksheet
        db_session.delete(worksheet)
        db_session.commit()

        # Check worksheet is deleted
        assert Worksheet.query.get(worksheet_id) is None

        # Check translation is also deleted (cascade)
        assert Translation.query.get(trans_id) is None
