from __future__ import annotations

from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import relationship
from sqlalchemy import Table

from sqlalchemy import Column

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

CategoryToWorksheet = Table(
    "category_to_worksheet",
    Base.metadata,
    Column("category_id", ForeignKey("category.id"), primary_key=True),
    Column("worksheet_id", ForeignKey("worksheet.id"), primary_key=True),
)


class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    worksheets: Mapped[set["Worksheet"]] = relationship(back_populates="categories", secondary=CategoryToWorksheet)

    @staticmethod
    def get(category):
        x = category["name"]
        category = Category.query.filter_by(name=x).first()
        if not category:
            category = Category()
            category.name = x
        return category


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
    id: Mapped[int] = mapped_column(primary_key=True)
    english: Mapped[str] = mapped_column()
    slovene: Mapped[str] = mapped_column()

    worksheet_id: Mapped[int] = mapped_column(ForeignKey("worksheet.id"))
    worksheet: Mapped[Worksheet] = relationship(back_populates="translations")

    def __init__(self, en, sl):
        self.english = en
        self.slovene = sl

    def __repr__(self):
        return "<Translation('%s', '%s', '%s')>" % (self.id, self.en, self.sl)



    @staticmethod
    def get(word):
        if "id" in word:
            return Translation.query.get(int(word["id"]))
        else:
            t = Translation.query.filter_by(english=word["english"] , slovene=word["slovene"]).first()
            if not t:
                t = Translation(word["english"], word["slovene"])
            return t



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
    id: Mapped[int] = mapped_column(primary_key=True)
    ime: Mapped[str] = mapped_column(String, nullable=False)

    translations: Mapped[list["Translation"]] = relationship(back_populates="worksheet", cascade="all, delete-orphan")
    categories: Mapped[list["Category"]] = relationship(back_populates="worksheets", secondary=CategoryToWorksheet)

    def dump(self):
        return {
            "id": self.id,
            "ime": self.ime,
            "categories": [x.dump() for x in self.categories],
            "words": [x.dump() for x in self.translations]
        }
