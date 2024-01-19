const TASK_TYPE_COLLECT_TROOPS = 1;
const TASK_TYPE_COLLECT_TROOPS_OF_RARITY = 2;
const TASK_TYPE_TRAIT_TROOPS = 3;
const TASK_TYPE_LEVEL_TROOPS = 4;
const TASK_TYPE_MEDAL_TROOPS = 12;

const TASK_TYPE_UNLOCK_CLASS = 0;
const TASK_TYPE_TRAIT_CLASS = 5;
const TASK_TYPE_LEVEL_CLASS = 6;
const TASK_TYPE_CHAMPION_LEVEL = 7;

const TASK_TYPE_COLLECT_WEAPONS = 8;
const TASK_TYPE_UPGRADE_WEAPONS = 9;

const TASK_TYPE_COLLECT_PETS = 10;
const TASK_TYPE_LEVEL_PETS = 11;

const TASK_TYPE_RENOWN = 13;
const TASK_TYPE_LEVEL_KINGDOM = 14;
const TASK_TYPE_QUESTS = 15;
const TASK_TYPE_CHALLENGES = 16;

const TASK_KIND_TROOPS = "Troops";
const TASK_KIND_WEAPONS = "Weapons";
const TASK_KIND_PETS = "Pets";
const TASK_KIND_CLASS = "Class";
const TASK_KIND_OTHER = "Other";

const PETS_PCMOB = [13114, 13115];
const PETS_PS4 = [13132];
const PETS_SWITCH = [];
const PETS_XB1 = [13113, 13131, 13157];

export default {
  LAST_UPDATE: 1631744230850, // 2021-09-16
  APP_NAME: "Gemologica",
  CREDITS: "&copy;&nbsp;<a href=\"mailto:hnsdmpfff@gmail.com\">El Duderino</a>&nbsp;(Discord:&nbsp;<a href=\"https://discord.gg/ZTcERYppW4\">El Duderino#1966</a>)",

  MAX_KINGDOM_LEVEL: 20,
  MAX_VALID_RELEASE_DATE: 1893400000000,
  PSEUDO_KINGDOM_IDS: [3034, 3033, 3032, 3038],

  "COLOR_NUMBERS": {
    "ColorBlue": 1,
    "ColorGreen": 2,
    "ColorRed": 3,
    "ColorYellow": 4,
    "ColorPurple": 5,
    "ColorBrown": 6
  },
  "TRAITSTONE_GROUPS": [
    ["Minor", "00", "05"],
    ["Major", "06", "11"],
    ["Runic", "12", "17"],
    ["Arcane", "18", "38"],
    ["Celestial", "39", "39"]
  ],
  "MAX_TROOP_LVLS": [20, 15, 16, 17, 18, 19, 20],
  "MAX_PET_LVLS": [0, 0, 0, 5, 10, 15, 20],
  "PET_TYPES": ["", "Faction", "Starry", "Regular", "Event", "Special"],
  "RELEASED_PETS": [13069, 13118, 13222, 13223, 13234],
  PETS_PCMOB,
  PETS_PS4,
  PETS_SWITCH,
  PETS_XB1,
  "UNATTAINABLE_PETS": {
    "PCMOB": PETS_PS4.concat(PETS_SWITCH).concat(PETS_XB1),
    "PS4": PETS_PCMOB.concat(PETS_SWITCH).concat(PETS_XB1),
    "SWITCH": PETS_PCMOB.concat(PETS_PS4).concat(PETS_XB1),
    "XB1": PETS_PCMOB.concat(PETS_PS4).concat(PETS_SWITCH)
  },
  "LVL_COST": [
    [0, 0, 150, 150, 150, 150, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 250, 250, 250, 250, 500],
    [0, 0, 10, 15, 25, 50, 75, 100, 150, 200, 250, 260, 270, 280, 290, 300, 330, 360, 400, 400, 600],
    [0, 0, 10, 15, 25, 55, 80, 110, 165, 220, 275, 285, 295, 305, 315, 330, 350, 400, 450, 500, 700],
    [0, 0, 10, 15, 30, 60, 90, 120, 180, 240, 300, 310, 320, 330, 345, 360, 400, 450, 500, 600, 800],
    [0, 0, 10, 20, 30, 65, 100, 135, 200, 270, 335, 350, 360, 375, 390, 405, 450, 500, 550, 700, 900],
    [0, 0, 15, 20, 35, 75, 110, 150, 225, 300, 375, 390, 405, 420, 435, 450, 500, 550, 600, 800, 1000],
    [0, 0, 20, 30, 45, 65, 125, 165, 240, 320, 395, 410, 430, 445, 460, 480, 600, 700, 800, 1000, 1200]
  ],
  "ASCENSION_COST": [5, 10, 25, 50, 100],
  "PET_ASCENSION_COST": [5, 10, 15],
  "INGOT_COST": [1, 3, 6, 10, 15, 21, 28, 36, 45, 55],
  "FACTION_PORTAL_DROP_CHANCES": [0, 0, .2349, .13, .0599, .0252],
  // PET_FOOD_COST: [100, 150, 200, 250, 300, 350, 400, 450, 500],
  "ELITE_LEVEL_LABELS": ["", "Bronze", "Silver", "Gold"],

  TASK_TYPE_COLLECT_TROOPS,
  TASK_TYPE_COLLECT_TROOPS_OF_RARITY,
  TASK_TYPE_TRAIT_TROOPS,
  TASK_TYPE_LEVEL_TROOPS,
  TASK_TYPE_MEDAL_TROOPS,

  TASK_TYPE_UNLOCK_CLASS,
  TASK_TYPE_TRAIT_CLASS,
  TASK_TYPE_LEVEL_CLASS,
  TASK_TYPE_CHAMPION_LEVEL,

  TASK_TYPE_COLLECT_WEAPONS,
  TASK_TYPE_UPGRADE_WEAPONS,

  TASK_TYPE_COLLECT_PETS,
  TASK_TYPE_LEVEL_PETS,

  TASK_TYPE_RENOWN,
  TASK_TYPE_LEVEL_KINGDOM,
  TASK_TYPE_QUESTS,
  TASK_TYPE_CHALLENGES,

  TASK_KIND_TROOPS,
  TASK_KIND_WEAPONS,
  TASK_KIND_PETS,
  TASK_KIND_CLASS,
  TASK_KIND_OTHER,

  // TODO use constants
  "TASK_TYPE_KIND_MAP": {
    1: TASK_KIND_TROOPS,
    2: TASK_KIND_TROOPS,
    3: TASK_KIND_TROOPS,
    4: TASK_KIND_TROOPS,
    12: TASK_KIND_TROOPS,

    5: TASK_KIND_CLASS,
    6: TASK_KIND_CLASS,
    7: TASK_KIND_CLASS,

    8: TASK_KIND_WEAPONS,
    9: TASK_KIND_WEAPONS,

    10: TASK_KIND_PETS,
    11: TASK_KIND_PETS,

    0: TASK_KIND_OTHER,
    13: TASK_KIND_OTHER,
    14: TASK_KIND_OTHER,
    15: TASK_KIND_OTHER,
    16: TASK_KIND_OTHER
  },

  "TASKS": [ // TODO reduce maintenance? Read from game data
    [ // for level 1
      [TASK_TYPE_COLLECT_TROOPS, 2],
      [TASK_TYPE_LEVEL_TROOPS, 1, 5],
      [TASK_TYPE_QUESTS]
    ],
    [ // for level 2
      [TASK_TYPE_COLLECT_TROOPS, 4],
      [TASK_TYPE_LEVEL_TROOPS, 3, 10],
      [TASK_TYPE_LEVEL_KINGDOM, 5]
    ],
    [ // for level 3
      [TASK_TYPE_COLLECT_WEAPONS, 1],
      [TASK_TYPE_TRAIT_TROOPS, 4],
      [TASK_TYPE_COLLECT_TROOPS_OF_RARITY, 2, 4]
    ],
    [ // for level 4
      [TASK_TYPE_COLLECT_TROOPS, 8],
      [TASK_TYPE_LEVEL_TROOPS, 5, 15],
      [TASK_TYPE_LEVEL_KINGDOM, 10]
    ],
    [ // for level 5
      [TASK_TYPE_UPGRADE_WEAPONS, 1],
      [TASK_TYPE_TRAIT_TROOPS, 7],
      [TASK_TYPE_COLLECT_TROOPS_OF_RARITY, 1, 5]
    ],
    [ // for level 6
      [TASK_TYPE_COLLECT_TROOPS, 12],
      [TASK_TYPE_LEVEL_TROOPS, 9, 18],
      [TASK_TYPE_CHALLENGES, 1, 2]
    ],
    [ // for level 7
      [TASK_TYPE_COLLECT_WEAPONS, 3],
      [TASK_TYPE_TRAIT_TROOPS, 11],
      [TASK_TYPE_COLLECT_TROOPS_OF_RARITY, 2, 5]
    ],
    [ // for level 8
      [TASK_TYPE_COLLECT_TROOPS, 16],
      [TASK_TYPE_LEVEL_TROOPS, 14, 19],
      [TASK_TYPE_UPGRADE_WEAPONS, 2]
    ],
    [ // for level 9
      [TASK_TYPE_UNLOCK_CLASS],
      [TASK_TYPE_TRAIT_TROOPS, 16],
      [TASK_TYPE_COLLECT_PETS, 1]
    ],
    [ // for level 10
      [TASK_TYPE_COLLECT_TROOPS, 20],
      [TASK_TYPE_LEVEL_TROOPS, 18, 20],
      [TASK_TYPE_COLLECT_TROOPS_OF_RARITY, 1, 6]
    ],
    [ // for level 11
      [TASK_TYPE_LEVEL_TROOPS, 20, 20],
      [TASK_TYPE_LEVEL_CLASS, 20],
      [TASK_TYPE_LEVEL_PETS, 1, 10]
    ],
    [ // for level 12
      [TASK_TYPE_TRAIT_TROOPS, 21],
      [TASK_TYPE_CHAMPION_LEVEL, 20],
      [TASK_TYPE_COLLECT_WEAPONS, 4]
    ],
    [ // for level 13
      [TASK_TYPE_LEVEL_TROOPS, 22, 20],
      [TASK_TYPE_TRAIT_CLASS],
      [TASK_TYPE_LEVEL_PETS, 1, 20]
    ],
    [ // for level 14
      [TASK_TYPE_TRAIT_TROOPS, 23],
      [TASK_TYPE_CHAMPION_LEVEL, 30],
      [TASK_TYPE_UPGRADE_WEAPONS, 3]
    ],
    [ // for level 15
      [TASK_TYPE_LEVEL_TROOPS, 24, 20],
      [TASK_TYPE_CHAMPION_LEVEL, 40],
      [TASK_TYPE_COLLECT_PETS, 2]
    ],
    [ // for level 16
      [TASK_TYPE_TRAIT_TROOPS, 25],
      [TASK_TYPE_CHAMPION_LEVEL, 50],
      [TASK_TYPE_UPGRADE_WEAPONS, 4]
    ],
    [ // for level 17
      [TASK_TYPE_LEVEL_TROOPS, 26, 20],
      [TASK_TYPE_CHAMPION_LEVEL, 60],
      [TASK_TYPE_LEVEL_PETS, 2, 20]
    ],
    [ // for level 18
      [TASK_TYPE_TRAIT_TROOPS, 27],
      [TASK_TYPE_CHAMPION_LEVEL, 70],
      [TASK_TYPE_UPGRADE_WEAPONS, 6]
    ],
    [ // for level 19
      [TASK_TYPE_LEVEL_TROOPS, 28, 20],
      [TASK_TYPE_CHAMPION_LEVEL, 80],
      [TASK_TYPE_COLLECT_PETS, 3]
    ],
    [ // for level 20
      [TASK_TYPE_TRAIT_TROOPS, 29],
      [TASK_TYPE_CHAMPION_LEVEL, 100],
      [TASK_TYPE_UPGRADE_WEAPONS, 8]
    ],
    [ // for level 21
      [TASK_TYPE_LEVEL_TROOPS, 30, 20],
      [TASK_TYPE_CHALLENGES, 1, 6],
      [TASK_TYPE_LEVEL_KINGDOM, 13]
    ],
    [ // for level 22
      [TASK_TYPE_TRAIT_TROOPS, 31],
      [TASK_TYPE_COLLECT_TROOPS_OF_RARITY, 2, 6],
      [TASK_TYPE_MEDAL_TROOPS, 5, 1]
    ],
    [ // for level 23
      [TASK_TYPE_LEVEL_TROOPS, 32, 20],
      [TASK_TYPE_LEVEL_PETS, 3, 20],
      [TASK_TYPE_RENOWN, 500]
    ],
    [ // for level 24
      [TASK_TYPE_TRAIT_TROOPS, 33],
      [TASK_TYPE_LEVEL_KINGDOM, 16],
      [TASK_TYPE_UPGRADE_WEAPONS, 10]
    ],
    [ // for level 25
      [TASK_TYPE_LEVEL_TROOPS, 34, 20],
      [TASK_TYPE_COLLECT_PETS, 4],
      [TASK_TYPE_MEDAL_TROOPS, 10, 2]
    ],
    [ // for level 26
      [TASK_TYPE_TRAIT_TROOPS, 35],
      [TASK_TYPE_RENOWN, 1500],
      [TASK_TYPE_UPGRADE_WEAPONS, 12]
    ],
    [ // for level 27
      [TASK_TYPE_LEVEL_TROOPS, 36, 20],
      [TASK_TYPE_LEVEL_PETS, 4, 20],
      [TASK_TYPE_LEVEL_KINGDOM, 18]
    ],
    [ // for level 28
      [TASK_TYPE_TRAIT_TROOPS, 37],
      [TASK_TYPE_MEDAL_TROOPS, 15, 3],
      [TASK_TYPE_UPGRADE_WEAPONS, 14]
    ],
    [ // for level 29
      [TASK_TYPE_LEVEL_TROOPS, 38, 20],
      [TASK_TYPE_RENOWN, 2500],
      [TASK_TYPE_COLLECT_PETS, 5]
    ],
    [ // for level 30
      [TASK_TYPE_TRAIT_TROOPS, 39],
      [TASK_TYPE_MEDAL_TROOPS, 20, 3],
      [TASK_TYPE_LEVEL_KINGDOM, 20]
    ]
  ],
  // Faction weapon, delve rush length, map location
  "KINGDOM_INFO": {
    "3000": [1451, 3, "*"], // Broken Spire
    "3001": [1370, 4, "*"], // Adana
    "3002": [1272, 4, "SSE"], // Bright Forest
    "3003": [1239, 5, "N"], // Pan's Vale
    "3004": [1274, 5, "NW"], // Zaejin
    "3005": [1391, 4, "W"], // Pridelands
    "3006": [1224, 3, "W"], // Sword's Edge
    "3007": [1362, 4, "NW"], // Ghulvania
    "3008": [1366, 4, "NW"], // Maugrim Woods
    "3009": [1252, 3, "NW"], // Silverglade
    "3010": [1295, 5, "NNW"], // Urskaya
    "3011": [1287, 3, "N"], // Glacial Peaks
    "3012": [1394, 4, "N"], // Khaziel
    "3013": [1294, 4, "NE"], // Stormheim
    "3014": [1223, 3, "NE"], // Whitehelm
    "3015": [1238, 4, "E"], // Forest of Thorns
    "3016": [1251, 3, "ESE"], // Mist of Scales
    "3017": [1365, 3, "*"], // Karakoth
    "3018": [1414, 4, "ESE"], // Grosh-Nak
    "3019": [1421, 5, "E"], // Dragon's Claw
    "3020": [1250, 5, "NE"], // Khetar
    "3021": [1317, 4, "SE"], // Blighted Lands
    "3022": [1222, 3, "SE"], // Darkstone
    "3023": [1273, 3, "S"], // Suncrest
    "3024": [1310, 4, "S"], // Drifting Sands
    "3025": [1275, 3, "SW"], // Leonis Empire
    "3026": [1435, 5, "W"], // Blackhawk
    "3027": [1385, 4, "WSW"], // Wild Plains
    "3028": [1286, 4, "WSW"], // Divinion Fields
    "3029": [1371, 3, "S"], // Zhul'Kari
    "3030": [1296, 4, "SW"], // Shentang
    "3035": [1352, 3, "NE"], // Dhrak-Zum
    "3036": [1225, 4, "W"], // Merlantis
    "3037": [1313, 3, "SW"], // Sin of Maraj
    "3080": [1439, 4, "*"], // Nexus
    "3082": [1484, 5, "E"],  // Hellcrag
    "3084": [1504, 3, "NE"] // Vulpacea
  },
  "CLASS_INFO": {
    "11138": {"name": "Archer", "traits": "Nature Heart, Fast, Bullseye", "talents": "Forest, Wind, Cunning"},
    "11263": {"name": "Archmagus", "traits": "Mystic Bond, Arcane, Mana Flare", "talents": "Arcane, Storms, Chaos"},
    "11143": {"name": "Assassin", "traits": "Sturdy, Venomous, Assassinate", "talents": "Death, Shadow, Cunning"},
    "11279": {"name": "Barbarian", "traits": "Orc Fury, Agile, Barbaric Fury", "talents": "War, Forest, Storms"},
    "11149": {"name": "Bard", "traits": "Wildfolk Bond, Alert, Bardic Inspiration", "talents": "Morale, Arcane, Knowledge"},
    "11253": {"name": "Corsair", "traits": "Water Heart, Greedy, High Seas", "talents": "Cunning, Water, Wind"},
    "11147": {"name": "Deathknight", "traits": "Undead Bond, Warded, Death Curse", "talents": "Death, Guardian, Storms"},
    "11254": {"name": "Dervish", "traits": "Monster Bond, Agile, Monstrous Kin", "talents": "Wind, Cunning, Storms"},
    "11247": {"name": "Diabolist", "traits": "Accursed, Jinx, Hellsteed", "talents": "Death, Chaos, Fire"},
    "11280": {"name": "Doomsayer", "traits": "Accursed, Omen of Dark, Doomsight", "talents": "Chaos, Life, Death"},
    "11157": {"name": "Dragonguard", "traits": "Dragon Shield, Holy Armor, Dragon's Grace", "talents": "Fire, Guardian, Morale"},
    "11218": {"name": "Frostmage", "traits": "Water Heart, Arcane, Frostbite", "talents": "Water, Arcane, Storms"},
    "11255": {"name": "Hierophant", "traits": "Revered, Spell Armor, Ancient Mysteries", "talents": "Fire, Light, Life"},
    "11137": {"name": "Knight", "traits": "Knight Bond, Avenger, Full Plate", "talents": "Guardian, Light, Morale"},
    "11142": {"name": "Mechanist", "traits": "Mech Bond, Insulated, Clockwork", "talents": "Guardian, Wind, Knowledge"},
    "11278": {"name": "Monk", "traits": "Sky Ancestry, Agile, Good Karma", "talents": "Life, Stone, Water"},
    "11140": {"name": "Necromancer", "traits": "Undead Bond, Magic Spirit, Ensoul", "talents": "Death, Shadow, Arcane"},
    "11146": {"name": "Oracle", "traits": "Centaur Bond, Invigorated, Portent", "talents": "Light, Knowledge, Wind"},
    "11144": {"name": "Orbweaver", "traits": "Nature Heart, Mana Shield, Familiar", "talents": "Forest, Shadow, Morale"},
    "11220": {"name": "Plaguelord", "traits": "Accursed, Immune, Contagion", "talents": "Arcane, Chaos, Stone"},
    "11141": {"name": "Priest", "traits": "Divine Bond, Air Link, Divine Aura", "talents": "Light, Life, Knowledge"},
    "11158": {"name": "Runepriest", "traits": "Dwarf Bond, Rocky Death, Dwarven Mettle", "talents": "Stone, Knowledge, Guardian"},
    "11221": {"name": "Sentinel", "traits": "Leader, Holy Armor, Get Behind Me!", "talents": "Morale, Stone, Guardian"},
    "11217": {"name": "Shaman", "traits": "Tauros Bond, Nature Spirit, Bullish Vigor", "talents": "Forest, War, Light"},
    "11262": {"name": "Slayer", "traits": "Grudge, Bloodlust, Brutal Strike", "talents": "War, Death, Fire"},
    "11139": {"name": "Sorcerer", "traits": "Magic Link, Inscribed, Dark Channel", "talents": "Knowledge, Shadow, Chaos"},
    "11277": {"name": "Stormcaller", "traits": "Stryx Bond, Shock, Storm Soul", "talents": "Storms, Life, Wind"},
    "11215": {"name": "Sunspear", "traits": "Fire Brand, Fireproof, Heatwave", "talents": "Forest, Water, Fire"},
    "11214": {"name": "Thief", "traits": "Greedy, Fast, Sneak Attack", "talents": "Cunning, Shadow, Wind"},
    "11256": {"name": "Tidecaller", "traits": "Merfolk Bond, Aquatic, Crashing Wave", "talents": "Water, Life, Arcane"},
    "11148": {"name": "Titan", "traits": "Giant Bond, Big, Giant Lord", "talents": "War, Stone, Storms"},
    "11117": {"name": "Warden", "traits": "Avenger, Beast Bond, Ward", "talents": "Forest, Guardian, Cunning"},
    "11135": {"name": "Warlord", "traits": "Fire Heart, Frenzy, Hack n Slash", "talents": "War, Fire, Morale"},
    "11219": {"name": "Warpriest", "traits": "Revered, Holy Armor, Wrath of Anu", "talents": "War, Light, Morale"},
    "11427": {"name": "Elementalist", "traits": "Elemental Bond, Elemental Shield, Elemental Force", "talents": "Stone, Water, Storms"},
    "11477": {"name": "Geomancer", "traits": "Stone Heart, Stoneskin, Infuse Stone", "talents": "Stone, Arcane, Knowledge"},
    "11508": {"name": "Spiritwalker", "traits": "Wargare Bond, Spell Armor, Spirit Drain", "talents": "Arcane, Life, Forest"},
  },

  POWER_LEVEL_BONUSES: {
    1: "+100 gold per day",
    2: "×2 tribute amount",
    3: "+200 gold per day",
    4: "×2 tribute chance",
    5: "+1 kingdom skill bonus",
    6: "+400 gold per day",
    7: "×3 tribute amount",
    8: "+600 gold per day",
    9: "×3 tribute chance",
    10: "+2 kingdom skill bonus",
    11: "×3.25 tribute amount",
    12: "×3.25 tribute chance",
    13: "×3.5 tribute amount",
    14: "×3.5 tribute chance",
    15: "+1000 gold per day",
    16: "×3.75 tribute amount",
    17: "×3.75 tribute chance",
    18: "×4 tribute amount",
    19: "×4 tribute chance",
    20: "+3 kingdom skill bonus",
    21: "×4.25 tribute amount",
    22: "×4.25 tribute chance",
    23: "×4.5 tribute amount",
    24: "×4.5 tribute chance",
    25: "+2000 gold per day",
    26: "×4.75 tribute amount",
    27: "×4.75 tribute chance",
    28: "×5 tribute amount",
    29: "×5 tribute chance",
    30: "+4 kingdom skill bonus"
  },

  "RELATIVE_TRAITSTONE_VALUES": [1, 2, 12, 10, 100],
  "PET_COUNT_UNKNOWN": 99,
  "EXPECTED_PETS_PER_RESCUE": 2,

  "BETA_FEATURES": 1, // Triggered by adding the URL param "beta"
  "DEV_FEATURES": 1, // Triggered by adding the URL param "dev"

  LOCALSTORAGE_SEEN_INITIAL_HINT: "seenInitialHint",
  LOCALSTORAGE_HIDE_PREVIEWS: "hidePreviews",
  LOCALSTORAGE_HIDE_UNREACHABLE_TASKS: "hideUnreachableTasks",
  LOCALSTORAGE_SHOW_PSEUDO_KINGDOMS: "showPseudoKingdoms",
  LOCALSTORAGE_SHOW_MAX_POWER_KINGDOMS: "showMaxPowerKingdoms",
  LOCALSTORAGE_LAST_SEEN_UPDATE: "lastSeenUpdate"
}
