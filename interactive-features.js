/**
 * Interactive Features Integration
 * Handles CYOA Game, D&D Utilities Panel, and feature toggles
 */

// CYOA Game Controller
class CYOAGameController {
    constructor() {
        this.game = null;
        this.isActive = false;
    }

    initialize() {
        if (!window.CYOAEngine || !window.dragonsDilemmaStory) {
            console.error('CYOA dependencies not loaded');
            return;
        }

        this.createGameUI();
    }

    createGameUI() {
        const modal = document.createElement('div');
        modal.id = 'cyoa-modal';
        modal.className = 'cyoa-modal';
        modal.innerHTML = `
            <div class="cyoa-container">
                <div class="cyoa-header">
                    <div class="cyoa-title">🐉 The Dragon's Dilemma</div>
                    <button class="cyoa-close" onclick="cyoaGameController.close()">×</button>
                </div>
                <div class="cyoa-content" id="cyoa-game-content">
                    <!-- Game content will be inserted here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }

    open() {
        if (!this.game) {
            this.game = new CYOAEngine(dragonsDilemmaStory);
        }

        const modal = document.getElementById('cyoa-modal');
        if (modal) {
            modal.classList.add('active');
            this.isActive = true;
            this.render();
        }
    }

    close() {
        const modal = document.getElementById('cyoa-modal');
        if (modal) {
            modal.classList.remove('active');
            this.isActive = false;
        }
    }

    restart() {
        if (this.game) {
            this.game.restart();
            this.render();
        }
    }

    render() {
        const content = document.getElementById('cyoa-game-content');
        if (!content || !this.game) return;

        const currentNode = this.game.getCurrentNode();
        const filteredChoices = this.game.getFilteredChoices();

        let html = '';

        // Stats display
        html += '<div class="cyoa-stats">';
        html += `<div class="cyoa-stat"><div class="cyoa-stat-label">⚔️ Strength</div><div class="cyoa-stat-value">${this.game.stats.strength}</div></div>`;
        html += `<div class="cyoa-stat"><div class="cyoa-stat-label">🧠 Wisdom</div><div class="cyoa-stat-value">${this.game.stats.wisdom}</div></div>`;
        html += `<div class="cyoa-stat"><div class="cyoa-stat-label">💬 Charisma</div><div class="cyoa-stat-value">${this.game.stats.charisma}</div></div>`;
        html += `<div class="cyoa-stat"><div class="cyoa-stat-label">🍀 Luck</div><div class="cyoa-stat-value">${this.game.stats.luck}</div></div>`;
        html += '</div>';

        // Inventory display
        if (this.game.inventory.length > 0) {
            html += '<div class="cyoa-inventory">';
            html += '<div class="cyoa-inventory-title">🎒 Inventory:</div>';
            html += `<div class="cyoa-inventory-items">${this.game.inventory.map(item => item.replace(/_/g, ' ')).join(', ')}</div>`;
            html += '</div>';
        }

        // Current node title and text
        html += `<div class="cyoa-node-title">${currentNode.title}</div>`;
        html += `<div class="cyoa-node-text">${currentNode.text}</div>`;

        // Choices
        html += '<div class="cyoa-choices">';
        filteredChoices.forEach((choice, index) => {
            html += `<button class="cyoa-choice" onclick="cyoaGameController.makeChoice('${choice.id}')">
                ${choice.text}
            </button>`;
        });
        html += '</div>';

        content.innerHTML = html;
        content.scrollTop = 0;
    }

    makeChoice(choiceId) {
        if (!this.game) return;

        const result = this.game.makeChoice(choiceId);

        // Show dice result if applicable
        if (result.diceResult) {
            this.showDiceResult(result.diceResult, result.success);
        } else if (result.skillResult) {
            this.showSkillResult(result.skillResult, result.success);
        } else {
            // Normal choice, render immediately
            this.render();
        }
    }

    showDiceResult(diceResult, success) {
        const content = document.getElementById('cyoa-game-content');
        if (!content) return;

        // Insert dice result before rendering next node
        const diceHtml = `
            <div class="cyoa-dice-result">
                <div class="cyoa-dice-title">🎲 Dice Roll</div>
                <div class="cyoa-dice-rolls">Rolled: [${diceResult.rolls.join(', ')}]</div>
                ${diceResult.modifier !== 0 ? `<div>Modifier: ${diceResult.modifier >= 0 ? '+' : ''}${diceResult.modifier}</div>` : ''}
                <div class="cyoa-dice-total">Total: ${diceResult.total} - ${success ? '✅ SUCCESS!' : '❌ FAILED'}</div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = diceHtml;
        content.appendChild(tempDiv.firstChild);

        // Render next node after a delay
        setTimeout(() => {
            this.render();
        }, 2000);
    }

    showSkillResult(skillResult, success) {
        const content = document.getElementById('cyoa-game-content');
        if (!content) return;

        const skillHtml = `
            <div class="cyoa-dice-result">
                <div class="cyoa-dice-title">🎯 Skill Check</div>
                <div class="cyoa-dice-rolls">Roll: ${skillResult.roll} + Modifier: ${skillResult.modifier}</div>
                <div class="cyoa-dice-total">Total: ${skillResult.total} vs DC ${skillResult.difficulty} - ${success ? '✅ SUCCESS!' : '❌ FAILED'}</div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = skillHtml;
        content.appendChild(tempDiv.firstChild);

        setTimeout(() => {
            this.render();
        }, 2000);
    }
}

// D&D Utilities Panel Controller
class DNDUtilitiesController {
    constructor() {
        this.isActive = false;
        this.diceRoller = null;
        this.randomGenerator = null;
    }

    initialize() {
        if (!window.DiceRoller || !window.RandomGenerator) {
            console.error('D&D Utilities dependencies not loaded');
            return;
        }

        this.diceRoller = new DiceRoller();
        this.randomGenerator = new RandomGenerator();
        this.createPanelUI();
    }

    createPanelUI() {
        const panel = document.createElement('div');
        panel.id = 'dnd-utilities-panel';
        panel.className = 'dnd-utilities-panel';
        panel.innerHTML = `
            <button class="dnd-toggle-btn" onclick="dndUtilitiesController.toggle()">🎲</button>
            <div class="dnd-panel-header">🐉 D&D Utilities</div>
            <div class="dnd-panel-content">
                <!-- Dice Roller Section -->
                <div class="dnd-section">
                    <div class="dnd-section-title">🎲 Dice Roller</div>
                    <input type="text" id="dice-input" class="dice-input" placeholder="e.g., 2d6+3, d20" value="d20">
                    <button class="dice-btn" onclick="dndUtilitiesController.rollDice()">Roll!</button>
                    <button class="dice-btn" onclick="dndUtilitiesController.rollAdvantage()">Advantage</button>
                    <button class="dice-btn" onclick="dndUtilitiesController.rollDisadvantage()">Disadvantage</button>
                    <div id="dice-result" class="dice-result" style="display: none;"></div>
                    <div style="margin-top: 10px;">
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d4'">d4</button>
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d6'">d6</button>
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d8'">d8</button>
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d10'">d10</button>
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d12'">d12</button>
                        <button class="dice-btn" onclick="document.getElementById('dice-input').value='d20'">d20</button>
                    </div>
                </div>

                <!-- Random Generator Section -->
                <div class="dnd-section">
                    <div class="dnd-section-title">✨ Random Generator</div>
                    <select id="generator-type" class="generator-select">
                        <option value="name">Character Name</option>
                        <option value="loot">Treasure Loot</option>
                        <option value="encounter">Random Encounter</option>
                        <option value="quest">Quest Hook</option>
                    </select>
                    <button class="dice-btn" onclick="dndUtilitiesController.generate()">Generate</button>
                    <div id="generator-output" class="generator-output" style="display: none;"></div>
                </div>

                <!-- SRD Quick Reference -->
                <div class="dnd-section">
                    <div class="dnd-section-title">📖 D&D 5e SRD</div>
                    <button class="dice-btn" onclick="dndUtilitiesController.showSRD('classes')">Classes</button>
                    <button class="dice-btn" onclick="dndUtilitiesController.showSRD('conditions')">Conditions</button>
                    <button class="dice-btn" onclick="dndUtilitiesController.showSRD('rules')">Common Rules</button>
                    <div id="srd-output" class="generator-output" style="display: none;"></div>
                    <div style="margin-top: 10px; font-size: 11px; color: #ff69b4; text-align: center;">
                        <a href="https://www.5esrd.com/" target="_blank" style="color: #ff69b4;">Full SRD Reference →</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Enter key support for dice input
        const diceInput = document.getElementById('dice-input');
        diceInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.rollDice();
            }
        });
    }

    toggle() {
        this.isActive = !this.isActive;
        const panel = document.getElementById('dnd-utilities-panel');
        if (panel) {
            panel.classList.toggle('active', this.isActive);
        }
    }

    rollDice() {
        const input = document.getElementById('dice-input');
        const resultDiv = document.getElementById('dice-result');
        
        if (!input || !resultDiv || !this.diceRoller) return;

        const result = this.diceRoller.roll(input.value);

        if (result.error) {
            resultDiv.textContent = result.error;
            resultDiv.style.background = 'rgba(255, 0, 0, 0.2)';
            resultDiv.style.borderColor = '#ff0000';
        } else {
            resultDiv.innerHTML = `
                <div>Rolls: [${result.rolls.join(', ')}]</div>
                ${result.modifier !== 0 ? `<div>Modifier: ${result.modifier >= 0 ? '+' : ''}${result.modifier}</div>` : ''}
                <div style="font-size: 24px; margin-top: 5px;">Total: ${result.total}</div>
            `;
            resultDiv.style.background = 'rgba(255, 215, 0, 0.2)';
            resultDiv.style.borderColor = '#ffd700';
        }

        resultDiv.style.display = 'block';
    }

    rollAdvantage() {
        if (!this.diceRoller) return;

        const result = this.diceRoller.rollAdvantage();
        const resultDiv = document.getElementById('dice-result');
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div>🎲 Advantage Roll</div>
                <div>Rolls: [${result.rolls.join(', ')}]</div>
                <div style="font-size: 24px; margin-top: 5px;">Result: ${result.result}</div>
                <div style="font-size: 12px; opacity: 0.7;">(Discarded: ${result.discarded})</div>
            `;
            resultDiv.style.background = 'rgba(0, 255, 0, 0.2)';
            resultDiv.style.borderColor = '#00ff00';
            resultDiv.style.display = 'block';
        }
    }

    rollDisadvantage() {
        if (!this.diceRoller) return;

        const result = this.diceRoller.rollDisadvantage();
        const resultDiv = document.getElementById('dice-result');
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div>🎲 Disadvantage Roll</div>
                <div>Rolls: [${result.rolls.join(', ')}]</div>
                <div style="font-size: 24px; margin-top: 5px;">Result: ${result.result}</div>
                <div style="font-size: 12px; opacity: 0.7;">(Discarded: ${result.discarded})</div>
            `;
            resultDiv.style.background = 'rgba(255, 0, 0, 0.2)';
            resultDiv.style.borderColor = '#ff0000';
            resultDiv.style.display = 'block';
        }
    }

    generate() {
        const typeSelect = document.getElementById('generator-type');
        const outputDiv = document.getElementById('generator-output');
        
        if (!typeSelect || !outputDiv || !this.randomGenerator) return;

        const type = typeSelect.value;
        let html = '';

        switch (type) {
            case 'name':
                const name = this.randomGenerator.generateCharacterName();
                html = `<strong>Generated Name:</strong><br>${name}`;
                break;

            case 'loot':
                const loot = this.randomGenerator.generateLoot();
                html = `<strong>💰 Treasure Loot:</strong><br>`;
                html += `Gold: ${loot.gold} gp<br><br>`;
                html += `<strong>Items:</strong><br>`;
                loot.items.forEach(item => {
                    html += `• ${item.name} (${item.rarity}) x${item.quantity}<br>`;
                    html += `  <em>${item.description}</em><br>`;
                });
                break;

            case 'encounter':
                const encounter = this.randomGenerator.generateEncounter();
                html = `<strong>⚔️ Random Encounter:</strong><br>`;
                html += `<strong>${encounter.name}</strong><br>`;
                html += `Difficulty: ${encounter.difficulty}<br>`;
                html += `Count: ${encounter.count}<br>`;
                html += `CR: ${encounter.cr}<br>`;
                html += `<em>${encounter.description}</em>`;
                break;

            case 'quest':
                const quest = this.randomGenerator.generateQuest();
                html = `<strong>📜 Quest Hook:</strong><br>`;
                html += quest.description;
                break;
        }

        outputDiv.innerHTML = html;
        outputDiv.style.display = 'block';
    }

    showSRD(topic) {
        const outputDiv = document.getElementById('srd-output');
        if (!outputDiv || !window.srdReference) return;

        const srd = window.srdReference;
        let html = `<strong>📖 ${topic.charAt(0).toUpperCase() + topic.slice(1)}:</strong><br><br>`;

        switch (topic) {
            case 'classes':
                srd.classes.slice(0, 6).forEach(cls => {
                    html += `<div class="srd-item">`;
                    html += `<strong>${cls.name}</strong><br>`;
                    html += `Hit Die: ${cls.hitDie}<br>`;
                    html += `Primary: ${cls.primaryAbility}`;
                    html += `</div>`;
                });
                break;

            case 'conditions':
                srd.conditions.slice(0, 4).forEach(cond => {
                    html += `<div class="srd-item">`;
                    html += `<strong>${cond.name}</strong><br>`;
                    html += `${cond.effect}`;
                    html += `</div>`;
                });
                break;

            case 'rules':
                srd.commonRules.forEach(rule => {
                    html += `<div class="srd-item">`;
                    html += `<strong>${rule.name}</strong><br>`;
                    html += `${rule.rule}`;
                    html += `</div>`;
                });
                break;
        }

        outputDiv.innerHTML = html;
        outputDiv.style.display = 'block';
    }
}

// Initialize controllers
let cyoaGameController;
let dndUtilitiesController;

// Initialize when DOM is ready and all scripts are loaded
function initializeInteractiveFeatures() {
    // Check if dependencies are loaded
    if (!window.CYOAEngine || !window.dragonsDilemmaStory) {
        console.warn('CYOA dependencies not fully loaded yet, retrying...');
        setTimeout(initializeInteractiveFeatures, 100);
        return;
    }

    // Initialize CYOA Game
    cyoaGameController = new CYOAGameController();
    cyoaGameController.initialize();

    // Initialize D&D Utilities
    dndUtilitiesController = new DNDUtilitiesController();
    dndUtilitiesController.initialize();

    // Create toggle buttons
    createFeatureToggles();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveFeatures);
} else {
    // DOM is already ready
    initializeInteractiveFeatures();
}

function createFeatureToggles() {
    // Terminal toggle button
    const terminalToggle = document.createElement('button');
    terminalToggle.id = 'terminal-toggle';
    terminalToggle.className = 'feature-toggle-btn';
    terminalToggle.innerHTML = '⌨️';
    terminalToggle.title = 'Open Terminal (MS-DOS Mode)';
    terminalToggle.onclick = () => {
        if (window.terminalInterface) {
            window.terminalInterface.activate();
        }
    };
    document.body.appendChild(terminalToggle);

    // CYOA toggle button
    const cyoaToggle = document.createElement('button');
    cyoaToggle.id = 'cyoa-toggle';
    cyoaToggle.className = 'feature-toggle-btn';
    cyoaToggle.innerHTML = '🐉';
    cyoaToggle.title = 'Play Choose Your Own Adventure';
    cyoaToggle.onclick = () => {
        if (cyoaGameController) {
            cyoaGameController.open();
        }
    };
    document.body.appendChild(cyoaToggle);

    // Note: D&D panel has its own toggle built into the panel
}

// Make functions globally accessible
window.openCYOAGame = () => {
    if (cyoaGameController) {
        cyoaGameController.open();
    }
};

window.openTerminal = () => {
    if (window.terminalInterface) {
        window.terminalInterface.activate();
    }
};

window.openDNDUtilities = () => {
    if (dndUtilitiesController) {
        dndUtilitiesController.toggle();
    }
};
