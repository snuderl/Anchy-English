"""Seed the database with vocabulary worksheets for the match game."""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.baza import db, Worksheet, Translation, Category
from app.config import app

WORKSHEETS = [
    {
        "ime": "Farm Animals",
        "category": "Animals",
        "words": [
            ("dog", "pes"),
            ("cat", "mačka"),
            ("cow", "krava"),
            ("horse", "konj"),
            ("pig", "prašič"),
            ("chicken", "kokoš"),
            ("sheep", "ovca"),
            ("goat", "koza"),
            ("duck", "raca"),
            ("rabbit", "zajec"),
            ("donkey", "osel"),
            ("rooster", "petelin"),
        ],
    },
    {
        "ime": "Wild Animals",
        "category": "Animals",
        "words": [
            ("bear", "medved"),
            ("wolf", "volk"),
            ("fox", "lisica"),
            ("deer", "jelen"),
            ("eagle", "orel"),
            ("snake", "kača"),
            ("frog", "žaba"),
            ("owl", "sova"),
            ("squirrel", "veverica"),
            ("hedgehog", "jež"),
            ("butterfly", "metulj"),
            ("bee", "čebela"),
        ],
    },
    {
        "ime": "Colours",
        "category": "Basics",
        "words": [
            ("red", "rdeča"),
            ("blue", "modra"),
            ("green", "zelena"),
            ("yellow", "rumena"),
            ("orange", "oranžna"),
            ("purple", "vijolična"),
            ("pink", "roza"),
            ("black", "črna"),
            ("white", "bela"),
            ("brown", "rjava"),
            ("grey", "siva"),
            ("gold", "zlata"),
        ],
    },
    {
        "ime": "Numbers 1-12",
        "category": "Basics",
        "words": [
            ("one", "ena"),
            ("two", "dva"),
            ("three", "tri"),
            ("four", "štiri"),
            ("five", "pet"),
            ("six", "šest"),
            ("seven", "sedem"),
            ("eight", "osem"),
            ("nine", "devet"),
            ("ten", "deset"),
            ("eleven", "enajst"),
            ("twelve", "dvanajst"),
        ],
    },
    {
        "ime": "Family",
        "category": "People",
        "words": [
            ("mother", "mama"),
            ("father", "oče"),
            ("sister", "sestra"),
            ("brother", "brat"),
            ("grandmother", "babica"),
            ("grandfather", "dedek"),
            ("aunt", "teta"),
            ("uncle", "stric"),
            ("cousin", "bratranec"),
            ("daughter", "hči"),
            ("son", "sin"),
            ("baby", "dojenček"),
        ],
    },
    {
        "ime": "Body Parts",
        "category": "People",
        "words": [
            ("head", "glava"),
            ("hand", "roka"),
            ("foot", "noga"),
            ("eye", "oko"),
            ("ear", "uho"),
            ("nose", "nos"),
            ("mouth", "usta"),
            ("hair", "lasje"),
            ("finger", "prst"),
            ("knee", "koleno"),
            ("shoulder", "rama"),
            ("tooth", "zob"),
        ],
    },
    {
        "ime": "Food & Drinks",
        "category": "Everyday Life",
        "words": [
            ("bread", "kruh"),
            ("water", "voda"),
            ("milk", "mleko"),
            ("apple", "jabolko"),
            ("cheese", "sir"),
            ("egg", "jajce"),
            ("rice", "riž"),
            ("soup", "juha"),
            ("cake", "torta"),
            ("juice", "sok"),
            ("meat", "meso"),
            ("salad", "solata"),
        ],
    },
    {
        "ime": "Clothes",
        "category": "Everyday Life",
        "words": [
            ("shirt", "srajca"),
            ("trousers", "hlače"),
            ("shoes", "čevlji"),
            ("hat", "klobuk"),
            ("jacket", "jakna"),
            ("dress", "obleka"),
            ("socks", "nogavice"),
            ("scarf", "šal"),
            ("gloves", "rokavice"),
            ("skirt", "krilo"),
            ("boots", "škornji"),
            ("coat", "plašč"),
        ],
    },
    {
        "ime": "House & Rooms",
        "category": "Places",
        "words": [
            ("house", "hiša"),
            ("kitchen", "kuhinja"),
            ("bedroom", "spalnica"),
            ("bathroom", "kopalnica"),
            ("garden", "vrt"),
            ("door", "vrata"),
            ("window", "okno"),
            ("roof", "streha"),
            ("floor", "tla"),
            ("wall", "stena"),
            ("stairs", "stopnice"),
            ("garage", "garaža"),
        ],
    },
    {
        "ime": "School",
        "category": "Places",
        "words": [
            ("school", "šola"),
            ("teacher", "učitelj"),
            ("student", "učenec"),
            ("book", "knjiga"),
            ("pen", "pisalo"),
            ("desk", "miza"),
            ("chair", "stol"),
            ("homework", "domača naloga"),
            ("lesson", "ura"),
            ("exam", "izpit"),
            ("classroom", "učilnica"),
            ("blackboard", "tabla"),
        ],
    },
    {
        "ime": "Weather",
        "category": "Nature",
        "words": [
            ("sun", "sonce"),
            ("rain", "dež"),
            ("snow", "sneg"),
            ("wind", "veter"),
            ("cloud", "oblak"),
            ("storm", "nevihta"),
            ("fog", "megla"),
            ("ice", "led"),
            ("hot", "vroče"),
            ("cold", "hladno"),
            ("warm", "toplo"),
            ("rainbow", "mavrica"),
        ],
    },
    {
        "ime": "Days & Months",
        "category": "Time",
        "words": [
            ("Monday", "ponedeljek"),
            ("Tuesday", "torek"),
            ("Wednesday", "sreda"),
            ("Thursday", "četrtek"),
            ("Friday", "petek"),
            ("Saturday", "sobota"),
            ("Sunday", "nedelja"),
            ("January", "januar"),
            ("March", "marec"),
            ("June", "junij"),
            ("September", "september"),
            ("December", "december"),
        ],
    },
    {
        "ime": "Nasprotja",
        "category": "4. razred",
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
        "category": "4. razred",
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
        "category": "4. razred",
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
        "category": "4. razred",
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
        "category": "4. razred",
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


def seed():
    with app.app_context():
        # Build category cache
        categories = {}
        for ws_data in WORKSHEETS:
            cat_name = ws_data["category"]
            if cat_name not in categories:
                cat = Category.query.filter_by(name=cat_name).first()
                if not cat:
                    cat = Category(name=cat_name)
                    db.session.add(cat)
                categories[cat_name] = cat

        db.session.flush()

        for ws_data in WORKSHEETS:
            # Check if worksheet already exists
            existing = Worksheet.query.filter_by(ime=ws_data["ime"]).first()
            if existing:
                print(
                    f"  Skipping '{ws_data['ime']}' (already exists with {len(existing.translations)} words)"
                )
                continue

            ws = Worksheet(ime=ws_data["ime"])
            for en, sl in ws_data["words"]:
                ws.translations.append(Translation(en, sl))

            cat = categories[ws_data["category"]]
            ws.categories.append(cat)
            db.session.add(ws)
            print(
                f"  Created '{ws_data['ime']}' with {len(ws_data['words'])} words in '{ws_data['category']}'"
            )

        db.session.commit()
        print(f"\nDone! Total worksheets: {Worksheet.query.count()}")


if __name__ == "__main__":
    seed()
