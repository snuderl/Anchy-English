"""
Tests for API endpoints.
"""
import json
import pytest
from baza import Translation, Worksheet, Category


class TestWorksheetEndpoints:
    """Test worksheet-related API endpoints."""
    
    def test_get_all_worksheets_empty(self, client):
        """Test getting worksheets when none exist."""
        response = client.get('/worksheets')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data == []
    
    def test_get_all_worksheets(self, client, sample_data):
        """Test getting all worksheets."""
        response = client.get('/worksheets')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 2
        
        worksheet_names = [w['ime'] for w in data]
        assert "Animals" in worksheet_names
        assert "Verbs" in worksheet_names
    
    def test_get_single_worksheet(self, client, sample_worksheet):
        """Test getting a single worksheet by ID."""
        response = client.get(f'/worksheets/{sample_worksheet.id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['id'] == sample_worksheet.id
        assert data['ime'] == "Test Worksheet"
        assert len(data['words']) == 1
        assert data['words'][0]['english'] == "hello"
    
    def test_get_nonexistent_worksheet(self, client):
        """Test getting a worksheet that doesn't exist."""
        response = client.get('/worksheets/9999')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'error' in data
        assert data['error'] == "Worksheet not found"
    
    def test_create_worksheet(self, client, db_session):
        """Test creating a new worksheet."""
        worksheet_data = {
            "ime": "New Worksheet",
            "words": [
                {"english": "hello", "slovene": "zdravo"},
                {"english": "goodbye", "slovene": "nasvidenje"}
            ],
            "categories": [{"name": "Greetings"}]
        }
        
        response = client.post('/worksheets',
                              data=json.dumps(worksheet_data),
                              content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'id' in data
        
        # Verify it was created
        worksheet = Worksheet.query.get(data['id'])
        assert worksheet is not None
        assert worksheet.ime == "New Worksheet"
        assert len(worksheet.translations) == 2
        assert len(worksheet.categories) == 1
    
    def test_update_worksheet(self, client, sample_worksheet):
        """Test updating an existing worksheet."""
        update_data = {
            "ime": "Updated Worksheet",
            "words": [
                {"english": "new", "slovene": "novo"},
                {"english": "word", "slovene": "beseda"}
            ],
            "categories": [{"name": "Updated Category"}]
        }
        
        response = client.post(f'/worksheets/{sample_worksheet.id}',
                              data=json.dumps(update_data),
                              content_type='application/json')
        assert response.status_code == 200
        
        # Verify it was updated
        updated = Worksheet.query.get(sample_worksheet.id)
        assert updated.ime == "Updated Worksheet"
        assert len(updated.translations) == 2
        
        words = [(t.english, t.slovene) for t in updated.translations]
        assert ("new", "novo") in words
        assert ("word", "beseda") in words
    
    def test_delete_worksheet(self, client, sample_worksheet):
        """Test deleting a worksheet."""
        worksheet_id = sample_worksheet.id
        response = client.get(f'/worksheets/{worksheet_id}/delete')
        assert response.status_code == 200
        
        # Verify it was deleted
        deleted = Worksheet.query.get(worksheet_id)
        assert deleted is None


class TestCategoryEndpoints:
    """Test category-related API endpoints."""
    
    def test_get_all_categories(self, client, sample_data):
        """Test getting all categories."""
        response = client.get('/categories')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 3
        
        category_names = [c['name'] for c in data]
        assert "Basic" in category_names
        assert "Advanced" in category_names
        assert "Verbs" in category_names
    
    def test_get_single_category(self, client, sample_category):
        """Test getting a single category by ID."""
        response = client.get(f'/categories/{sample_category.id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['id'] == sample_category.id
        assert data['name'] == "Basic Words"
    
    def test_create_category(self, client, db_session):
        """Test creating a new category."""
        category_data = {"name": "New Category"}
        
        response = client.post('/categories',
                              data=json.dumps(category_data),
                              content_type='application/json')
        assert response.status_code == 200
        
        # Verify it was created
        category = Category.query.filter_by(name="New Category").first()
        assert category is not None
    
    def test_create_category_with_parent(self, client, sample_category):
        """Test creating a category with a parent."""
        category_data = {
            "name": "Child Category",
            "parent": sample_category.name
        }
        
        response = client.post('/categories',
                              data=json.dumps(category_data),
                              content_type='application/json')
        assert response.status_code == 200
        
        # Verify it was created with parent
        category = Category.query.filter_by(name="Child Category").first()
        assert category is not None
        assert category.parent_id == sample_category.id
    
    def test_delete_category(self, client, sample_category):
        """Test deleting a category."""
        category_id = sample_category.id
        response = client.post(f'/categories/{category_id}/delete')
        assert response.status_code == 200
        
        # Verify it was deleted
        deleted = Category.query.get(category_id)
        assert deleted is None


class TestWordEndpoints:
    """Test word/translation-related endpoints."""
    
    def test_get_all_words_empty(self, client):
        """Test getting words when none exist."""
        response = client.get('/words')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data == []
    
    def test_get_all_words(self, client, sample_data):
        """Test getting all words."""
        response = client.get('/words')
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # The unique method should filter duplicates
        assert len(data) > 0
        
        english_words = [w['english'] for w in data]
        assert "dog" in english_words
        assert "cat" in english_words
        assert "run" in english_words
        assert "walk" in english_words
    
    def test_words_are_unique(self, client, db_session):
        """Test that getAllWords returns unique words."""
        # Create duplicate translations
        trans1 = Translation("same", "isto")
        trans2 = Translation("same", "isto")
        trans3 = Translation("different", "drugačno")
        
        worksheet = Worksheet()
        worksheet.ime = "Test"
        worksheet.translations = [trans1, trans2, trans3]
        
        db_session.add(worksheet)
        db_session.commit()
        
        response = client.get('/words')
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Check that duplicates are filtered
        same_count = sum(1 for w in data if w['english'] == "same" and w['slovene'] == "isto")
        assert same_count == 1  # Should only appear once


class TestMiscEndpoints:
    """Test miscellaneous endpoints."""
    
    def test_home_endpoint(self, client, sample_data):
        """Test the /home endpoint."""
        response = client.get('/home')
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Should return a dictionary of english: slovene pairs
        assert isinstance(data, dict)
        assert "dog" in data
        assert data["dog"] == "pes"
        assert "cat" in data
        assert data["cat"] == "mačka"
    
    def test_default_redirect(self, client):
        """Test that / redirects to /vaje."""
        response = client.get('/')
        assert response.status_code == 302  # Redirect
        assert '/vaje' in response.location
    
    def test_vaje_endpoint(self, client):
        """Test the main app endpoint."""
        response = client.get('/vaje')
        assert response.status_code == 200
        # Should return HTML template
        assert b'<!doctype html>' in response.data.lower()