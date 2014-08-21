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
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    parent = db.relation("Category", remote_side=[id])



    worksheets = db.relationship(
        "Worksheet",
        secondary=categories_lnk,
        backref=db.backref("worksheets")
    )

    @staticmethod
    def get(category):
        x = category["name"]
        category = Category.query.filter_by(name=x).first()
        if not category:
            return Category(name=x)


    def dump(self):
        p = None
        if self.parent:
            p = self.parent.name
        return { 
        "name": self.name, 
        "parent": p, 
        "id": self.id,
        "parent_id": self.parent_id }


class Translation(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    english = db.Column(String)
    slovene = db.Column(String)

    def __init__(self, en, sl):
        self.english = en
        self.slovene = sl

    def __repr__(self):
        return "<Translation('%s', '%s', '%s')>" % (self.id, self.en, self.sl)


    @staticmethod
    def get(word):
        if "id" in word:
            return worksheetWords.append(Translation.query.get(int(word["id"])))
        else:
            t = Translation.query.filter_by(english=word["english"] , slovene=word["slovene"]).first()
            if not first:
                return Translation(word["english"], word["slovene"])
            

 
    @staticmethod
    def unique(translations):
        ### TODO: this should not be nedeede, and words should be added by default
        keys = set()
        for t in translations:
            key = (t.english, t.slovene)
            if key not in keys:
                keys.add(key)
                yield t




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
            "categories": [x.dump() for x in self.categories],
            "words": [x.dump() for x in self.translations]
        }


# db.create_all()
