"""Seed the '4. razred' worksheets to production.

Usage:
    DATABASE_URL=postgres://... uv run python scripts/seed_4razred.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.baza import db, Worksheet, Translation, Category
from app.config import app

WORKSHEETS = [
    {
        "ime": "Nasprotja",
        "words": [
            ("round", "okrogel"),
            ("dangerous", "nevaren"),
            ("safe", "varen"),
            ("boring", "dolgočasen"),
            ("interesting", "zanimiv"),
            ("expensive", "drag"),
            ("cheap", "poceni"),
            ("soft", "mehek"),
            ("hard", "trd"),
            ("big", "velik"),
            ("small", "majhen"),
            ("fast", "hiter"),
            ("slow", "počasen"),
            ("new", "nov"),
            ("old", "star"),
            ("long", "dolg"),
            ("short", "kratek"),
            ("clean", "čist"),
            ("dirty", "umazan"),
            ("light", "lahek"),
            ("heavy", "težek"),
        ],
    },
    {
        "ime": "Sports",
        "words": [
            ("baseball", "bejzbol"),
            ("basketball", "košarka"),
            ("cycling", "kolesarstvo"),
            ("dodgeball", "med dvema ognjema"),
            ("football", "nogomet"),
            ("handball", "rokomet"),
            ("hockey", "hokej"),
            ("ice skating", "drsanje"),
            ("rollerblading", "rolanje"),
            ("rugby", "ragbi"),
            ("skateboarding", "skejtanje / rolkanje"),
            ("skiing", "smučanje"),
            ("snowboarding", "deskanje na snegu"),
            ("swimming", "plavanje"),
            ("table tennis", "namizni tenis"),
            ("tennis", "tenis"),
            ("volleyball", "odbojka"),
        ],
    },
    {
        "ime": "Toys",
        "words": [
            ("a ball", "žoga"),
            ("a doll", "lutka"),
            ("a doll house", "hišica za punčke"),
            ("a puzzle", "sestavljanka"),
            ("a teddy bear", "plišasti medvedek"),
            ("a soft toy", "plišasta igrača"),
            ("blocks", "kocke"),
            ("cards", "karte"),
            ("a computer game", "računalniška igra"),
            ("a board game", "družabna igra"),
            ("a toy car", "igrača avto"),
            ("a robot", "robot"),
            ("marbles", "frnikole"),
            ("a spinning top", "vrtavka"),
            ("an action figure", "akcijska figura"),
            ("a balloon", "balon"),
        ],
    },
    {
        "ime": "Sport Toys",
        "words": [
            ("a skateboard", "rolka"),
            ("a scooter", "skiro"),
            ("rollerblades", "rolerji (inline)"),
            ("ice skates", "drsalke"),
            ("rollerskates", "kotalki"),
            ("a racket", "lopar"),
            ("a skipping rope", "kolebnica"),
            ("a bike", "kolo"),
            ("a chess set", "šah"),
            ("a hula hoop", "obroč (hula hoop)"),
            ("a frisbee", "frizbi"),
            ("a boomerang", "bumerang"),
            ("a slingshot", "frača"),
            ("a trampoline", "trampolin"),
            ("a hoverboard", "lebdeča rolka"),
            ("a kite", "zmaj"),
            ("a sword", "meč"),
        ],
    },
    {
        "ime": "Electronic Toys",
        "words": [
            ("keyboards", "klaviature"),
            ("a computer", "računalnik"),
            ("a tablet", "tablica"),
            ("a drone", "dron"),
            ("a robot", "robot"),
            ("a remote control car", "daljinsko voden avto"),
            ("walkie talkies", "voki-toki"),
            ("mobile phone", "mobilni telefon"),
            ("a guitar", "kitara"),
            ("drums", "bobni"),
        ],
    },
]

CATEGORY = "4. razred"


def seed():
    with app.app_context():
        cat = Category.query.filter_by(name=CATEGORY).first()
        if not cat:
            cat = Category(name=CATEGORY)
            db.session.add(cat)
            db.session.flush()

        for ws_data in WORKSHEETS:
            existing = Worksheet.query.filter_by(ime=ws_data["ime"]).first()
            if existing:
                print(f"  Skipping '{ws_data['ime']}' (already exists)")
                continue

            ws = Worksheet(ime=ws_data["ime"])
            for en, sl in ws_data["words"]:
                ws.translations.append(Translation(en, sl))
            ws.categories.append(cat)
            db.session.add(ws)
            print(f"  Created '{ws_data['ime']}' with {len(ws_data['words'])} words")

        db.session.commit()
        print("Done!")


if __name__ == "__main__":
    seed()
