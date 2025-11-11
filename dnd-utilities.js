/**
 * D&D and Tabletop Gaming Utilities
 * Dice roller, random generators, and SRD reference
 */

class DiceRoller {
    constructor() {
        this.history = [];
    }

    roll(expression) {
        // Parse expressions like "2d6+3", "d20", "3d8-2"
        const regex = /(\d*)d(\d+)([+-]\d+)?/i;
        const match = expression.trim().match(regex);

        if (!match) {
            return {
                error: 'Invalid dice expression. Use format like "2d6", "d20", or "3d8+2"'
            };
        }

        const count = parseInt(match[1]) || 1;
        const sides = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        if (count < 1 || count > 100) {
            return { error: 'Number of dice must be between 1 and 100' };
        }

        if (![4, 6, 8, 10, 12, 20, 100].includes(sides)) {
            return { error: 'Dice sides must be 4, 6, 8, 10, 12, 20, or 100' };
        }

        const rolls = [];
        let total = modifier;

        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        const result = {
            expression,
            rolls,
            modifier,
            total,
            timestamp: Date.now()
        };

        this.history.push(result);
        if (this.history.length > 50) {
            this.history.shift();
        }

        return result;
    }

    rollAdvantage(sides = 20) {
        const roll1 = Math.floor(Math.random() * sides) + 1;
        const roll2 = Math.floor(Math.random() * sides) + 1;
        return {
            type: 'advantage',
            rolls: [roll1, roll2],
            result: Math.max(roll1, roll2),
            discarded: Math.min(roll1, roll2)
        };
    }

    rollDisadvantage(sides = 20) {
        const roll1 = Math.floor(Math.random() * sides) + 1;
        const roll2 = Math.floor(Math.random() * sides) + 1;
        return {
            type: 'disadvantage',
            rolls: [roll1, roll2],
            result: Math.min(roll1, roll2),
            discarded: Math.max(roll1, roll2)
        };
    }

    getHistory() {
        return this.history.slice(-10);
    }

    clearHistory() {
        this.history = [];
    }
}

class RandomGenerator {
    constructor() {
        this.fantasyNames = {
            prefixes: ['Ara', 'Bron', 'Cal', 'Dor', 'El', 'Finn', 'Gar', 'Hal', 'Ith', 'Jor', 'Kal', 'Lor', 'Mor', 'Nar', 'Ol', 'Pel', 'Quin', 'Ral', 'Syl', 'Thal', 'Um', 'Val', 'Wil', 'Xan', 'Yor', 'Zar'],
            suffixes: ['wen', 'thor', 'ric', 'las', 'wyn', 'mir', 'dor', 'gorn', 'ion', 'ath', 'ris', 'mon', 'del', 'wyn', 'dan', 'ren', 'kar', 'vor', 'ian', 'eth']
        };

        this.treasures = [
            // Common
            { name: 'Potion of Healing', rarity: 'Common', value: '50 gp', description: 'Restores 2d4+2 hit points' },
            { name: 'Torch', rarity: 'Common', value: '1 cp', description: 'Provides light for 1 hour' },
            { name: 'Rations (1 day)', rarity: 'Common', value: '5 sp', description: 'Dried food for one day' },
            { name: 'Rope (50 ft)', rarity: 'Common', value: '1 gp', description: 'Hemp rope' },
            { name: 'Gemstone (small)', rarity: 'Common', value: '10 gp', description: 'A small, semi-precious stone' },
            // Uncommon
            { name: 'Potion of Greater Healing', rarity: 'Uncommon', value: '250 gp', description: 'Restores 4d4+4 hit points' },
            { name: 'Bag of Holding', rarity: 'Uncommon', value: '500 gp', description: 'Holds up to 500 lbs in extradimensional space' },
            { name: '+1 Weapon', rarity: 'Uncommon', value: '500 gp', description: '+1 to attack and damage rolls' },
            { name: 'Cloak of Protection', rarity: 'Uncommon', value: '500 gp', description: '+1 to AC and saving throws' },
            { name: 'Gemstone (precious)', rarity: 'Uncommon', value: '100 gp', description: 'A precious gemstone' },
            // Rare
            { name: 'Ring of Spell Storing', rarity: 'Rare', value: '5,000 gp', description: 'Stores up to 5 levels of spells' },
            { name: 'Flame Tongue Sword', rarity: 'Rare', value: '5,000 gp', description: 'Ignites in flames on command' },
            { name: 'Cloak of Elvenkind', rarity: 'Rare', value: '5,000 gp', description: 'Advantage on Stealth checks' },
            { name: 'Amulet of Health', rarity: 'Rare', value: '8,000 gp', description: 'Sets Constitution to 19' },
            { name: 'Dragon Scale Mail', rarity: 'Rare', value: '8,000 gp', description: 'AC 14 + Dex, resistance to one damage type' }
        ];

        this.encounters = [
            // Easy
            { name: 'Goblin Patrol', difficulty: 'Easy', count: '1d4 goblins', cr: '1/4', description: 'A small group of goblins' },
            { name: 'Giant Rats', difficulty: 'Easy', count: '2d4 giant rats', cr: '1/8', description: 'Diseased vermin' },
            { name: 'Bandits', difficulty: 'Easy', count: '1d3 bandits', cr: '1/8', description: 'Highway robbers' },
            // Medium
            { name: 'Orc War Band', difficulty: 'Medium', count: '2d4 orcs', cr: '1/2', description: 'Savage raiders' },
            { name: 'Owlbear', difficulty: 'Medium', count: '1 owlbear', cr: '3', description: 'Territorial beast' },
            { name: 'Cult Fanatics', difficulty: 'Medium', count: '1d3 cult fanatics', cr: '2', description: 'Zealous cultists' },
            { name: 'Ghoul Pack', difficulty: 'Medium', count: '1d6 ghouls', cr: '1', description: 'Undead scavengers' },
            // Hard
            { name: 'Troll', difficulty: 'Hard', count: '1 troll', cr: '5', description: 'Regenerating monster' },
            { name: 'Young Dragon', difficulty: 'Hard', count: '1 young dragon', cr: '8', description: 'Adolescent dragon' },
            { name: 'Vampire Spawn', difficulty: 'Hard', count: '1d3 vampire spawn', cr: '5', description: 'Undead servants' },
            { name: 'Mind Flayer', difficulty: 'Hard', count: '1 mind flayer', cr: '7', description: 'Psionic aberration' },
            // Deadly
            { name: 'Adult Dragon', difficulty: 'Deadly', count: '1 adult dragon', cr: '13-17', description: 'Fully grown dragon' },
            { name: 'Lich', difficulty: 'Deadly', count: '1 lich', cr: '21', description: 'Undead archmage' },
            { name: 'Demon Lord', difficulty: 'Deadly', count: '1 demon lord', cr: '20+', description: 'Powerful fiend' }
        ];
    }

    generateName(gender = 'neutral') {
        const prefix = this.fantasyNames.prefixes[Math.floor(Math.random() * this.fantasyNames.prefixes.length)];
        const suffix = this.fantasyNames.suffixes[Math.floor(Math.random() * this.fantasyNames.suffixes.length)];
        return prefix + suffix;
    }

    generateCharacterName() {
        const name = this.generateName();
        const titles = ['the Brave', 'the Wise', 'the Swift', 'the Strong', 'the Cunning', 'Dragonslayer', 'Shadowblade', 'Lightbringer', 'Stormbringer', 'the Silent'];
        const useTitle = Math.random() > 0.5;
        return useTitle ? `${name} ${titles[Math.floor(Math.random() * titles.length)]}` : name;
    }

    generateTreasure(rarity = null) {
        let treasurePool = this.treasures;
        
        if (rarity) {
            treasurePool = this.treasures.filter(t => t.rarity.toLowerCase() === rarity.toLowerCase());
        }

        if (treasurePool.length === 0) {
            treasurePool = this.treasures;
        }

        const treasure = treasurePool[Math.floor(Math.random() * treasurePool.length)];
        const quantity = treasure.rarity === 'Common' ? Math.floor(Math.random() * 3) + 1 : 1;

        return {
            ...treasure,
            quantity
        };
    }

    generateLoot() {
        const numItems = Math.floor(Math.random() * 4) + 1;
        const loot = {
            gold: Math.floor(Math.random() * 100) + 10,
            items: []
        };

        for (let i = 0; i < numItems; i++) {
            const rarityRoll = Math.random();
            let rarity;
            if (rarityRoll < 0.6) rarity = 'Common';
            else if (rarityRoll < 0.9) rarity = 'Uncommon';
            else rarity = 'Rare';

            loot.items.push(this.generateTreasure(rarity));
        }

        return loot;
    }

    generateEncounter(difficulty = null) {
        let encounterPool = this.encounters;

        if (difficulty) {
            encounterPool = this.encounters.filter(e => e.difficulty.toLowerCase() === difficulty.toLowerCase());
        }

        if (encounterPool.length === 0) {
            encounterPool = this.encounters;
        }

        return encounterPool[Math.floor(Math.random() * encounterPool.length)];
    }

    generateQuest() {
        const questTypes = [
            'Retrieve a stolen artifact',
            'Rescue a kidnapped noble',
            'Clear out a monster den',
            'Investigate mysterious disappearances',
            'Escort a caravan through dangerous territory',
            'Stop a cult ritual',
            'Find a lost treasure',
            'Defeat a local tyrant',
            'Explore ancient ruins',
            'Negotiate peace between warring factions'
        ];

        const locations = [
            'the Darkwood Forest',
            'the Cursed Mines',
            'the Tower of Shadows',
            'the Sunken Temple',
            'the Dragon\'s Lair',
            'the Haunted Castle',
            'the Forbidden City',
            'the Crystal Caverns',
            'the Floating Islands',
            'the Elemental Plane'
        ];

        const rewards = [
            'a legendary weapon',
            'a vast treasure hoard',
            'powerful magical knowledge',
            'the gratitude of royalty',
            'a title and lands',
            'a rare spell scroll',
            'a magical companion',
            'ancient artifacts',
            'political influence',
            'divine favor'
        ];

        const questType = questTypes[Math.floor(Math.random() * questTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        return {
            quest: questType,
            location: location,
            reward: reward,
            description: `${questType} in ${location}. The reward is ${reward}.`
        };
    }
}

// SRD Reference Data (abbreviated)
const srdReference = {
    classes: [
        { name: 'Barbarian', hitDie: 'd12', primaryAbility: 'Strength', saves: 'Strength & Constitution' },
        { name: 'Bard', hitDie: 'd8', primaryAbility: 'Charisma', saves: 'Dexterity & Charisma' },
        { name: 'Cleric', hitDie: 'd8', primaryAbility: 'Wisdom', saves: 'Wisdom & Charisma' },
        { name: 'Druid', hitDie: 'd8', primaryAbility: 'Wisdom', saves: 'Intelligence & Wisdom' },
        { name: 'Fighter', hitDie: 'd10', primaryAbility: 'Strength or Dexterity', saves: 'Strength & Constitution' },
        { name: 'Monk', hitDie: 'd8', primaryAbility: 'Dexterity & Wisdom', saves: 'Strength & Dexterity' },
        { name: 'Paladin', hitDie: 'd10', primaryAbility: 'Strength & Charisma', saves: 'Wisdom & Charisma' },
        { name: 'Ranger', hitDie: 'd10', primaryAbility: 'Dexterity & Wisdom', saves: 'Strength & Dexterity' },
        { name: 'Rogue', hitDie: 'd8', primaryAbility: 'Dexterity', saves: 'Dexterity & Intelligence' },
        { name: 'Sorcerer', hitDie: 'd6', primaryAbility: 'Charisma', saves: 'Constitution & Charisma' },
        { name: 'Warlock', hitDie: 'd8', primaryAbility: 'Charisma', saves: 'Wisdom & Charisma' },
        { name: 'Wizard', hitDie: 'd6', primaryAbility: 'Intelligence', saves: 'Intelligence & Wisdom' }
    ],
    conditions: [
        { name: 'Blinded', effect: 'Cannot see, auto-fail sight checks, attack rolls have disadvantage, attacks against have advantage' },
        { name: 'Charmed', effect: 'Cannot attack charmer, charmer has advantage on social checks' },
        { name: 'Frightened', effect: 'Disadvantage on checks while source is in sight, cannot move closer to source' },
        { name: 'Paralyzed', effect: 'Incapacitated, auto-fail Str/Dex saves, attacks have advantage, hits are critical hits' },
        { name: 'Poisoned', effect: 'Disadvantage on attack rolls and ability checks' },
        { name: 'Prone', effect: 'Disadvantage on attacks, melee attacks have advantage, ranged have disadvantage' },
        { name: 'Stunned', effect: 'Incapacitated, auto-fail Str/Dex saves, attacks against have advantage' },
        { name: 'Unconscious', effect: 'Incapacitated, drop items, auto-fail Str/Dex saves, attacks have advantage, hits are critical hits' }
    ],
    commonRules: [
        { name: 'Advantage', rule: 'Roll 2d20, take the higher result' },
        { name: 'Disadvantage', rule: 'Roll 2d20, take the lower result' },
        { name: 'Critical Hit', rule: 'Roll all damage dice twice on a natural 20' },
        { name: 'Death Saves', rule: 'Roll d20: 10+ = success, 1-9 = failure. 3 successes = stabilized, 3 failures = death. Natural 20 = wake with 1 HP, Natural 1 = 2 failures' },
        { name: 'Long Rest', rule: 'At least 8 hours of rest, regain all HP and spent hit dice (up to half your maximum)' },
        { name: 'Short Rest', rule: 'At least 1 hour of rest, can spend hit dice to regain HP' }
    ]
};

// Export for use
if (typeof window !== 'undefined') {
    window.DiceRoller = DiceRoller;
    window.RandomGenerator = RandomGenerator;
    window.srdReference = srdReference;
}
