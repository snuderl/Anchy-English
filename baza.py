from sqlalchemy import String
from config import db


linker = db.Table(
    'linker',
    db.Column(
        'translation_id', db.Integer, db.ForeignKey('translation.id')),
    db.Column(
        'worksheet_id', db.Integer, db.ForeignKey('worksheet.id'))
)

categories_lnk = db.Table(
    'categories_lnk',
    db.Column(
        'category_id', db.Integer, db.ForeignKey('category.id')),
    db.Column(
        'worksheet_id', db.Integer, db.ForeignKey('worksheet.id'))
)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(String)

    worksheets = db.relationship(
        "Worksheet",
        secondary=categories_lnk,
        backref=db.backref("worksheets")
    )

    def dump(self):
    	return self.name


class Translation(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    english = db.Column(String)
    slovene = db.Column(String)

    def __init__(self, en, sl):
        self.english = en
        self.slovene = sl

    def __repr__(self):
        return "<Translation('%s', '%s', '%s')>" % (self.id, self.en, self.sl)

    def dump(self):
        return {
            "id": self.id,
            "english": self.english,
            "slovene": self.slovene
        }


class Worksheet(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    ime = db.Column(String)

    translations = db.relationship("Translation",
                                   secondary=linker,
                                   backref=db.backref("translations"))

    categories = db.relationship("Category",
                                 secondary=categories_lnk,
                                 backref=db.backref("categories"))

    def dump(self):
        return {
            "id": self.id,
            "ime": self.ime,
            "categories": [x.dump() for x in self.categories]
        }


# db.create_all()
