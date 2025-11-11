/**
 * CYOA (Choose Your Own Adventure) Engine
 * A modular, fantasy/D&D-inspired story engine with dice mechanics
 */

class CYOAEngine {
    constructor(storyData) {
        this.story = storyData;
        this.currentNodeId = 'start';
        this.inventory = [];
        this.stats = {
            strength: 10,
            wisdom: 10,
            charisma: 10,
            luck: 10
        };
        this.flags = {};
        this.history = [];
    }

    getCurrentNode() {
        return this.story.nodes[this.currentNodeId];
    }

    rollDice(sides, count = 1, modifier = 0) {
        let total = modifier;
        const rolls = [];
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        return { total, rolls, modifier };
    }

    checkSkill(skillName, difficulty = 10) {
        const statValue = this.stats[skillName.toLowerCase()] || 10;
        const roll = this.rollDice(20);
        const total = roll.total + Math.floor((statValue - 10) / 2); // D&D-style modifier
        return {
            success: total >= difficulty,
            roll: roll.total,
            modifier: Math.floor((statValue - 10) / 2),
            total: total,
            difficulty: difficulty
        };
    }

    makeChoice(choiceId) {
        const currentNode = this.getCurrentNode();
        const choice = currentNode.choices.find(c => c.id === choiceId);
        
        if (!choice) {
            console.error('Invalid choice:', choiceId);
            return null;
        }

        // Record history
        this.history.push({
            nodeId: this.currentNodeId,
            choiceId: choiceId,
            timestamp: Date.now()
        });

        // Process choice effects
        if (choice.effects) {
            this.applyEffects(choice.effects);
        }

        // Handle dice roll requirements
        if (choice.diceRoll) {
            const result = this.rollDice(
                choice.diceRoll.sides,
                choice.diceRoll.count || 1,
                choice.diceRoll.modifier || 0
            );
            
            if (result.total >= (choice.diceRoll.target || 10)) {
                this.currentNodeId = choice.successNode || choice.nextNode;
                return { success: true, diceResult: result };
            } else {
                this.currentNodeId = choice.failNode || choice.nextNode;
                return { success: false, diceResult: result };
            }
        }

        // Handle skill checks
        if (choice.skillCheck) {
            const result = this.checkSkill(
                choice.skillCheck.skill,
                choice.skillCheck.difficulty
            );
            
            if (result.success) {
                this.currentNodeId = choice.successNode || choice.nextNode;
                return { success: true, skillResult: result };
            } else {
                this.currentNodeId = choice.failNode || choice.nextNode;
                return { success: false, skillResult: result };
            }
        }

        // Simple navigation
        this.currentNodeId = choice.nextNode;
        return { success: true };
    }

    applyEffects(effects) {
        if (effects.addItem) {
            this.inventory.push(effects.addItem);
        }
        if (effects.removeItem) {
            const index = this.inventory.indexOf(effects.removeItem);
            if (index > -1) this.inventory.splice(index, 1);
        }
        if (effects.setFlag) {
            this.flags[effects.setFlag.key] = effects.setFlag.value;
        }
        if (effects.modifyStat) {
            const stat = effects.modifyStat.stat.toLowerCase();
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += effects.modifyStat.amount;
            }
        }
    }

    hasItem(itemName) {
        return this.inventory.includes(itemName);
    }

    hasFlag(flagName) {
        return this.flags[flagName] === true;
    }

    restart() {
        this.currentNodeId = 'start';
        this.inventory = [];
        this.stats = {
            strength: 10,
            wisdom: 10,
            charisma: 10,
            luck: 10
        };
        this.flags = {};
        this.history = [];
    }

    getFilteredChoices() {
        const currentNode = this.getCurrentNode();
        return currentNode.choices.filter(choice => {
            // Check requirements
            if (choice.requires) {
                if (choice.requires.item && !this.hasItem(choice.requires.item)) {
                    return false;
                }
                if (choice.requires.flag && !this.hasFlag(choice.requires.flag)) {
                    return false;
                }
                if (choice.requires.minStat) {
                    const stat = choice.requires.minStat.stat.toLowerCase();
                    if (this.stats[stat] < choice.requires.minStat.value) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    isEnding() {
        const currentNode = this.getCurrentNode();
        return currentNode.isEnding === true;
    }

    getSaveState() {
        return {
            currentNodeId: this.currentNodeId,
            inventory: [...this.inventory],
            stats: {...this.stats},
            flags: {...this.flags},
            history: [...this.history]
        };
    }

    loadSaveState(saveState) {
        this.currentNodeId = saveState.currentNodeId;
        this.inventory = [...saveState.inventory];
        this.stats = {...saveState.stats};
        this.flags = {...saveState.flags};
        this.history = [...saveState.history];
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CYOAEngine;
}

// Export to window for browser use
if (typeof window !== 'undefined') {
    window.CYOAEngine = CYOAEngine;
}
