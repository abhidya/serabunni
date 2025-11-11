/**
 * MS-DOS/Terminal-style Interface
 * Classic command-line overlay for the entire site
 */

class TerminalInterface {
    constructor() {
        this.isActive = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '/home';
        this.output = [];
        
        this.commands = {
            help: {
                description: 'Show available commands',
                execute: () => this.showHelp()
            },
            clear: {
                description: 'Clear the terminal screen',
                execute: () => this.clearScreen()
            },
            ls: {
                description: 'List available sections',
                execute: () => this.listSections()
            },
            cd: {
                description: 'Navigate to a section (cd games, cd profile, cd cyoa)',
                execute: (args) => this.changeDirectory(args)
            },
            play: {
                description: 'Play a game or start CYOA adventure',
                execute: (args) => this.playContent(args)
            },
            roll: {
                description: 'Roll dice (e.g., "roll 2d6+3", "roll d20")',
                execute: (args) => this.rollDice(args)
            },
            generate: {
                description: 'Generate random content (name, loot, encounter, quest)',
                execute: (args) => this.generateRandom(args)
            },
            srd: {
                description: 'Show D&D 5e SRD reference (classes, conditions, rules)',
                execute: (args) => this.showSRD(args)
            },
            about: {
                description: 'Show information about this site',
                execute: () => this.showAbout()
            },
            theme: {
                description: 'Change theme (pink, dark, holiday, halloween, digimon)',
                execute: (args) => this.changeTheme(args)
            },
            exit: {
                description: 'Exit terminal mode',
                execute: () => this.deactivate()
            },
            matrix: {
                description: 'Enter the Matrix...',
                execute: () => this.matrixMode()
            }
        };

        this.diceRoller = window.DiceRoller ? new window.DiceRoller() : null;
        this.randomGenerator = window.RandomGenerator ? new window.RandomGenerator() : null;
    }

    activate() {
        if (this.isActive) return;

        this.createTerminalUI();
        this.isActive = true;
        this.addOutput('SeraBunni Terminal v2.0 - MS-DOS Style Interface');
        this.addOutput('Type "help" for available commands');
        this.addOutput('');
        this.focusInput();
    }

    deactivate() {
        if (!this.isActive) return;

        const terminal = document.getElementById('terminal-interface');
        if (terminal) {
            terminal.remove();
        }
        this.isActive = false;
    }

    createTerminalUI() {
        const terminal = document.createElement('div');
        terminal.id = 'terminal-interface';
        terminal.className = 'terminal-interface';
        terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">C:\\SERABUNNI></span>
                <button class="terminal-close" onclick="terminalInterface.deactivate()">×</button>
            </div>
            <div class="terminal-output" id="terminal-output"></div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">${this.currentPath}$</span>
                <input type="text" id="terminal-input" class="terminal-input" autocomplete="off" spellcheck="false">
            </div>
        `;

        document.body.appendChild(terminal);

        // Setup input handlers
        const input = document.getElementById('terminal-input');
        input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        input.addEventListener('input', (e) => this.handleInput(e));

        // Click anywhere in terminal to focus input
        terminal.addEventListener('click', (e) => {
            if (e.target !== input && !e.target.classList.contains('terminal-close')) {
                this.focusInput();
            }
        });
    }

    focusInput() {
        const input = document.getElementById('terminal-input');
        if (input) input.focus();
    }

    handleKeyDown(e) {
        const input = e.target;

        if (e.key === 'Enter') {
            e.preventDefault();
            const command = input.value.trim();
            if (command) {
                this.executeCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
            }
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete(input);
        }
    }

    handleInput(e) {
        // Could add real-time suggestions here
    }

    autoComplete(input) {
        const partial = input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Possible commands: ${matches.join(', ')}`);
        }
    }

    executeCommand(commandLine) {
        this.addOutput(`${this.currentPath}$ ${commandLine}`, 'command');

        const parts = commandLine.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command].execute(args);
        } else {
            this.addOutput(`Command not found: ${command}. Type "help" for available commands.`, 'error');
        }

        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        const outputDiv = document.getElementById('terminal-output');
        if (!outputDiv) return;

        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        outputDiv.appendChild(line);

        this.output.push(text);
    }

    scrollToBottom() {
        const outputDiv = document.getElementById('terminal-output');
        if (outputDiv) {
            outputDiv.scrollTop = outputDiv.scrollHeight;
        }
    }

    clearScreen() {
        const outputDiv = document.getElementById('terminal-output');
        if (outputDiv) {
            outputDiv.innerHTML = '';
        }
        this.output = [];
        return '';
    }

    showHelp() {
        this.addOutput('=== Available Commands ===');
        Object.keys(this.commands).forEach(cmd => {
            const command = this.commands[cmd];
            this.addOutput(`  ${cmd.padEnd(12)} - ${command.description}`);
        });
        this.addOutput('');
    }

    listSections() {
        this.addOutput('Available sections:');
        this.addOutput('  profile/     - View profile information');
        this.addOutput('  games/       - Browse arcade games');
        this.addOutput('  cyoa/        - Choose Your Own Adventure');
        this.addOutput('  utilities/   - D&D utilities and tools');
        this.addOutput('  social/      - Social media links');
        this.addOutput('');
        this.addOutput('Use "cd <section>" to navigate');
    }

    changeDirectory(args) {
        if (args.length === 0) {
            this.addOutput('Usage: cd <section>');
            return;
        }

        const section = args[0].toLowerCase().replace('/', '');
        const validSections = ['profile', 'games', 'cyoa', 'utilities', 'social', 'home'];

        if (section === '..' || section === 'home') {
            this.currentPath = '/home';
            this.addOutput('Changed to /home');
        } else if (validSections.includes(section)) {
            this.currentPath = `/home/${section}`;
            this.addOutput(`Changed to ${this.currentPath}`);
            
            // Show content for the section
            if (section === 'games') {
                this.addOutput('Available games: snake, breakout, tetris, spaceinvaders, platformrunner');
                this.addOutput('Use "play <game>" to launch a game');
            } else if (section === 'cyoa') {
                this.addOutput('Choose Your Own Adventure: The Dragon\'s Dilemma');
                this.addOutput('Use "play cyoa" to start the adventure');
            } else if (section === 'utilities') {
                this.addOutput('D&D Utilities:');
                this.addOutput('  roll <dice>     - Roll dice (e.g., roll 2d6+3)');
                this.addOutput('  generate <type> - Generate random content');
                this.addOutput('  srd <topic>     - View D&D 5e SRD reference');
            }
        } else {
            this.addOutput(`Section not found: ${section}`, 'error');
        }

        this.updatePrompt();
    }

    updatePrompt() {
        const prompt = document.querySelector('.terminal-prompt');
        if (prompt) {
            prompt.textContent = `${this.currentPath}$`;
        }
    }

    playContent(args) {
        if (args.length === 0) {
            this.addOutput('Usage: play <game|cyoa>');
            return;
        }

        const content = args[0].toLowerCase();

        if (content === 'cyoa') {
            this.addOutput('Launching Choose Your Own Adventure...');
            this.deactivate();
            // Trigger CYOA modal
            setTimeout(() => {
                if (window.openCYOAGame) {
                    window.openCYOAGame();
                }
            }, 100);
        } else {
            const gameMap = {
                snake: 'games/snake.html',
                breakout: 'games/breakout.html',
                tetris: 'games/tetris.html',
                spaceinvaders: 'games/space-invaders.html',
                platformrunner: 'games/platform-runner.html'
            };

            if (gameMap[content]) {
                this.addOutput(`Launching ${content}...`);
                this.addOutput('Opening game in new view...');
                // Scroll to games section
                setTimeout(() => {
                    this.deactivate();
                    const gamesSection = document.querySelector('.games-section');
                    if (gamesSection) {
                        gamesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            } else {
                this.addOutput(`Game not found: ${content}`, 'error');
            }
        }
    }

    rollDice(args) {
        if (!this.diceRoller) {
            this.addOutput('Dice roller not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutput('Usage: roll <dice> (e.g., roll 2d6+3, roll d20)');
            return;
        }

        const expression = args.join('');
        const result = this.diceRoller.roll(expression);

        if (result.error) {
            this.addOutput(result.error, 'error');
            return;
        }

        this.addOutput(`Rolling ${result.expression}...`);
        this.addOutput(`  Rolls: [${result.rolls.join(', ')}]`);
        if (result.modifier !== 0) {
            this.addOutput(`  Modifier: ${result.modifier >= 0 ? '+' : ''}${result.modifier}`);
        }
        this.addOutput(`  TOTAL: ${result.total}`, 'success');
        this.addOutput('');
    }

    generateRandom(args) {
        if (!this.randomGenerator) {
            this.addOutput('Random generator not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutput('Usage: generate <type>');
            this.addOutput('Types: name, loot, encounter, quest');
            return;
        }

        const type = args[0].toLowerCase();

        switch (type) {
            case 'name':
                const name = this.randomGenerator.generateCharacterName();
                this.addOutput(`Generated name: ${name}`, 'success');
                break;

            case 'loot':
                const loot = this.randomGenerator.generateLoot();
                this.addOutput('=== Generated Loot ===');
                this.addOutput(`Gold: ${loot.gold} gp`);
                this.addOutput('Items:');
                loot.items.forEach(item => {
                    this.addOutput(`  - ${item.name} (${item.rarity}) x${item.quantity}`);
                    this.addOutput(`    ${item.description}`);
                });
                break;

            case 'encounter':
                const difficulty = args[1] || null;
                const encounter = this.randomGenerator.generateEncounter(difficulty);
                this.addOutput('=== Generated Encounter ===');
                this.addOutput(`Name: ${encounter.name}`);
                this.addOutput(`Difficulty: ${encounter.difficulty}`);
                this.addOutput(`Count: ${encounter.count}`);
                this.addOutput(`CR: ${encounter.cr}`);
                this.addOutput(`Description: ${encounter.description}`);
                break;

            case 'quest':
                const quest = this.randomGenerator.generateQuest();
                this.addOutput('=== Generated Quest ===');
                this.addOutput(quest.description);
                break;

            default:
                this.addOutput(`Unknown type: ${type}`, 'error');
                this.addOutput('Available types: name, loot, encounter, quest');
        }
        this.addOutput('');
    }

    showSRD(args) {
        if (!window.srdReference) {
            this.addOutput('SRD reference not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutput('Usage: srd <topic>');
            this.addOutput('Topics: classes, conditions, rules');
            return;
        }

        const topic = args[0].toLowerCase();
        const srd = window.srdReference;

        switch (topic) {
            case 'classes':
                this.addOutput('=== D&D 5e Classes ===');
                srd.classes.forEach(cls => {
                    this.addOutput(`${cls.name}:`);
                    this.addOutput(`  Hit Die: ${cls.hitDie}`);
                    this.addOutput(`  Primary Ability: ${cls.primaryAbility}`);
                    this.addOutput(`  Saving Throws: ${cls.saves}`);
                    this.addOutput('');
                });
                break;

            case 'conditions':
                this.addOutput('=== D&D 5e Conditions ===');
                srd.conditions.forEach(cond => {
                    this.addOutput(`${cond.name}:`);
                    this.addOutput(`  ${cond.effect}`);
                    this.addOutput('');
                });
                break;

            case 'rules':
                this.addOutput('=== D&D 5e Common Rules ===');
                srd.commonRules.forEach(rule => {
                    this.addOutput(`${rule.name}:`);
                    this.addOutput(`  ${rule.rule}`);
                    this.addOutput('');
                });
                break;

            default:
                this.addOutput(`Unknown topic: ${topic}`, 'error');
                this.addOutput('Available topics: classes, conditions, rules');
        }
    }

    showAbout() {
        this.addOutput('=== SeraBunni - Digimon Arcade ===');
        this.addOutput('A retro MySpace-style landing page with:');
        this.addOutput('  - Choose Your Own Adventure game');
        this.addOutput('  - Classic arcade games');
        this.addOutput('  - D&D utilities and dice roller');
        this.addOutput('  - MS-DOS terminal interface');
        this.addOutput('  - Multiple themes');
        this.addOutput('');
        this.addOutput('Made with 💖 in the spirit of MySpace');
        this.addOutput('');
    }

    changeTheme(args) {
        if (args.length === 0) {
            this.addOutput('Usage: theme <name>');
            this.addOutput('Available themes: pink, dark, holiday, halloween, digimon');
            return;
        }

        const theme = args[0].toLowerCase();
        const validThemes = ['pink', 'dark', 'holiday', 'halloween', 'digimon'];

        if (theme === 'pink') {
            if (window.setTheme) window.setTheme('default');
            this.addOutput('Theme changed to Pink');
        } else if (validThemes.includes(theme)) {
            if (window.setTheme) window.setTheme(theme);
            this.addOutput(`Theme changed to ${theme}`);
        } else {
            this.addOutput(`Unknown theme: ${theme}`, 'error');
        }
    }

    matrixMode() {
        this.addOutput('Entering the Matrix...');
        this.addOutput('Wake up, Neo...');
        this.addOutput('The Matrix has you...');
        this.addOutput('Follow the white rabbit...');
        this.addOutput('');
        
        // Add matrix effect to terminal
        const terminal = document.getElementById('terminal-interface');
        if (terminal) {
            terminal.classList.add('matrix-mode');
            setTimeout(() => {
                terminal.classList.remove('matrix-mode');
            }, 10000);
        }
    }
}

// Initialize terminal interface
if (typeof window !== 'undefined') {
    window.TerminalInterface = TerminalInterface;
    window.terminalInterface = new TerminalInterface();
}
