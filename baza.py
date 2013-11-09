from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, backref

from sqlalchemy.ext.declarative import declarative_base

from config import db


linker = db.Table('linker',
    db.Column('translation_id', db.Integer, db.ForeignKey('translation.id')),
    db.Column('worksheet_id', db.Integer, db.ForeignKey('worksheet.id'))
)


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

	def dump(self):
		return {
			"id": self.id,
			"ime": self.ime
		}


db.create_all()