(function() {
    'use strict';

    // Check if game container exists before initializing
    if (!document.getElementById('ant-queen-game')) {
        return;
    }

    // ===== BIG NUMBER CLASS =====
    // Simplified version inspired by break_infinity.js concepts
    // Reference: https://github.com/Patashu/break_infinity.js
    class BigNum {
        constructor(mantissa, exponent) {
            if (typeof mantissa === 'string') {
                const num = parseFloat(mantissa);
                if (isNaN(num)) {
                    this.mantissa = 0;
                    this.exponent = 0;
                } else {
                    this.normalize(num, 0);
                }
            } else if (typeof mantissa === 'object' && mantissa.mantissa !== undefined) {
                this.mantissa = mantissa.mantissa;
                this.exponent = mantissa.exponent;
            } else {
                this.normalize(mantissa || 0, exponent || 0);
            }
        }

        normalize(m, e) {
            if (m === 0) {
                this.mantissa = 0;
                this.exponent = 0;
                return;
            }
            while (Math.abs(m) >= 10) {
                m /= 10;
                e++;
            }
            while (Math.abs(m) < 1 && m !== 0) {
                m *= 10;
                e--;
            }
            this.mantissa = m;
            this.exponent = e;
        }

        add(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            if (this.exponent === other.exponent) {
                return new BigNum(this.mantissa + other.mantissa, this.exponent);
            }
            if (this.exponent > other.exponent) {
                const diff = this.exponent - other.exponent;
                if (diff > 15) return new BigNum(this.mantissa, this.exponent);
                return new BigNum(this.mantissa + other.mantissa / Math.pow(10, diff), this.exponent);
            } else {
                const diff = other.exponent - this.exponent;
                if (diff > 15) return new BigNum(other.mantissa, other.exponent);
                return new BigNum(this.mantissa / Math.pow(10, diff) + other.mantissa, other.exponent);
            }
        }

        sub(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            const negOther = new BigNum(-other.mantissa, other.exponent);
            return this.add(negOther);
        }

        mul(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            return new BigNum(this.mantissa * other.mantissa, this.exponent + other.exponent);
        }

        div(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            return new BigNum(this.mantissa / other.mantissa, this.exponent - other.exponent);
        }

        pow(exp) {
            if (typeof exp !== 'number') exp = exp.toNumber();
            return new BigNum(Math.pow(this.mantissa, exp), this.exponent * exp);
        }

        gte(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            if (this.exponent !== other.exponent) return this.exponent > other.exponent;
            return this.mantissa >= other.mantissa;
        }

        gt(other) {
            if (!(other instanceof BigNum)) other = new BigNum(other);
            if (this.exponent !== other.exponent) return this.exponent > other.exponent;
            return this.mantissa > other.mantissa;
        }

        toNumber() {
            return this.mantissa * Math.pow(10, this.exponent);
        }

        toString() {
            return this.format();
        }

        format() {
            const num = this.toNumber();
            if (isNaN(num) || !isFinite(num)) return '0';
            if (num < 1000) return Math.floor(num).toString();
            if (num < 1e6) return (num / 1000).toFixed(2) + 'K';
            if (num < 1e9) return (num / 1e6).toFixed(2) + 'M';
            if (num < 1e12) return (num / 1e9).toFixed(2) + 'B';
            if (num < 1e15) return (num / 1e12).toFixed(2) + 'T';
            return this.mantissa.toFixed(2) + 'e' + this.exponent;
        }

        toJSON() {
            return { mantissa: this.mantissa, exponent: this.exponent };
        }
    }

    // ===== GAME DATA =====
    const UNIT_DATA = {
        nurses: {
            id: 'nurses',
            name: 'Nurses',
            baseCost: 15,
            growth: 1.18,
            baseProd: 0.02,
            prodType: 'brood',
            description: 'Care for larvae (+Brood)',
            icon: '🐜',
            synergies: [25, 50, 100]
        },
        foragers: {
            id: 'foragers',
            name: 'Foragers',
            baseCost: 10,
            growth: 1.15,
            baseProd: 0.10,
            prodType: 'food',
            description: 'Gather food (+Food)',
            icon: '🐜',
            synergies: [25, 50, 100]
        },
        builders: {
            id: 'builders',
            name: 'Builders',
            baseCost: 50,
            growth: 1.20,
            baseProd: 0.05,
            prodType: 'food',
            description: 'Build structures (+Food)',
            icon: '🐜',
            synergies: [25, 50, 100]
        },
        soldiers: {
            id: 'soldiers',
            name: 'Soldiers',
            baseCost: 100,
            growth: 1.22,
            baseProd: 0.08,
            prodType: 'food',
            description: 'Defend colony (+Work rate)',
            icon: '🐜',
            synergies: [25, 50, 100]
        },
        explorers: {
            id: 'explorers',
            name: 'Explorers',
            baseCost: 250,
            growth: 1.22,
            baseProd: 0.12,
            prodType: 'food',
            description: 'Find resources (+Food)',
            icon: '🐜',
            synergies: [25, 50, 100]
        },
        alates: {
            id: 'alates',
            name: 'Alates',
            baseCost: 5000,
            growth: 1.35,
            baseProd: 0.50,
            prodType: 'food',
            description: 'New queens (+All production)',
            icon: '👑',
            synergies: [5, 10, 25]
        }
    };

    const ROOM_DATA = {
        nursery: {
            id: 'nursery',
            name: 'Nursery',
            baseCost: 100,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.10,
            description: '+10% hatch speed/tier',
            icon: '🥚'
        },
        hatchery: {
            id: 'hatchery',
            name: 'Hatchery',
            baseCost: 250,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.05,
            description: '+5% brood production/tier',
            icon: '🪺'
        },
        granary: {
            id: 'granary',
            name: 'Granary',
            baseCost: 150,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.08,
            description: '+8% food storage/tier',
            icon: '🌾'
        },
        fungusFarm: {
            id: 'fungusFarm',
            name: 'Fungus Farm',
            baseCost: 200,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.05,
            description: '+5% food production/tier',
            icon: '🍄'
        },
        workshop: {
            id: 'workshop',
            name: 'Workshop',
            baseCost: 300,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.10,
            description: '+10% builder rate/tier',
            icon: '🔨'
        },
        barracks: {
            id: 'barracks',
            name: 'Barracks',
            baseCost: 400,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.10,
            description: '+10% soldier buff/tier',
            icon: '⚔️'
        },
        mapRoom: {
            id: 'mapRoom',
            name: 'Map Room',
            baseCost: 350,
            growthTier: 1.35,
            maxTier: 1,
            bonusPerTier: 0.05,
            description: 'Enables exploration',
            icon: '🗺️'
        },
        queensChamber: {
            id: 'queensChamber',
            name: "Queen's Chamber",
            baseCost: 1000,
            growthTier: 1.35,
            maxTier: 1,
            bonusPerTier: 0,
            description: 'Unlocks prestige',
            icon: '👑'
        },
        pheromoneLab: {
            id: 'pheromoneLab',
            name: 'Pheromone Lab',
            baseCost: 800,
            growthTier: 1.35,
            maxTier: 3,
            bonusPerTier: 0.02,
            description: '+2% global production/tier',
            icon: '⚗️'
        }
    };

    // ===== GAME STATE =====
    class GameState {
        constructor() {
            this.version = '1.0.0';
            this.currencies = {
                food: new BigNum(10),
                brood: new BigNum(0),
                royalJelly: new BigNum(0)
            };
            this.units = {};
            this.rooms = {};
            this.stats = {
                startTime: Date.now(),
                lastTick: Date.now(),
                totalClicks: 0,
                totalLifetimeFood: new BigNum(0),
                prestigeCount: 0
            };

            Object.keys(UNIT_DATA).forEach(key => {
                this.units[key] = { level: 0 };
            });

            Object.keys(ROOM_DATA).forEach(key => {
                this.rooms[key] = { tier: 0 };
            });
        }

        calculateUnitCost(unitId) {
            const data = UNIT_DATA[unitId];
            const level = this.units[unitId].level;
            return new BigNum(data.baseCost * Math.pow(data.growth, level));
        }

        calculateRoomCost(roomId) {
            const data = ROOM_DATA[roomId];
            const tier = this.rooms[roomId].tier;
            return new BigNum(data.baseCost * Math.pow(data.growthTier, tier));
        }

        canAffordUnit(unitId) {
            return this.currencies.food.gte(this.calculateUnitCost(unitId));
        }

        canAffordRoom(roomId) {
            const data = ROOM_DATA[roomId];
            if (this.rooms[roomId].tier >= data.maxTier) return false;
            return this.currencies.food.gte(this.calculateRoomCost(roomId));
        }

        buyUnit(unitId) {
            if (!this.canAffordUnit(unitId)) return false;
            const cost = this.calculateUnitCost(unitId);
            this.currencies.food = this.currencies.food.sub(cost);
            this.units[unitId].level++;
            return true;
        }

        buyRoom(roomId) {
            if (!this.canAffordRoom(roomId)) return false;
            const cost = this.calculateRoomCost(roomId);
            this.currencies.food = this.currencies.food.sub(cost);
            this.rooms[roomId].tier++;
            return true;
        }

        calculateProduction() {
            let foodPerSec = new BigNum(0);
            let broodPerSec = new BigNum(0);
            let globalMultiplier = 1.0;

            // Calculate base production from units
            Object.keys(UNIT_DATA).forEach(unitId => {
                const data = UNIT_DATA[unitId];
                const level = this.units[unitId].level;
                if (level > 0) {
                    const baseProd = new BigNum(data.baseProd * level);
                    
                    // Check synergies
                    let synergyMult = 1.0;
                    data.synergies.forEach(threshold => {
                        if (level >= threshold) {
                            synergyMult += 0.5; // +50% per synergy threshold
                        }
                    });
                    
                    const prod = baseProd.mul(synergyMult);
                    
                    if (data.prodType === 'food') {
                        foodPerSec = foodPerSec.add(prod);
                    } else if (data.prodType === 'brood') {
                        broodPerSec = broodPerSec.add(prod);
                    }
                }
            });

            // Apply room bonuses
            Object.keys(this.rooms).forEach(roomId => {
                const data = ROOM_DATA[roomId];
                const tier = this.rooms[roomId].tier;
                if (tier > 0) {
                    const bonus = data.bonusPerTier * tier;
                    globalMultiplier += bonus;
                }
            });

            // Apply Royal Jelly bonus (1% per jelly)
            const jellyBonus = this.currencies.royalJelly.toNumber() * 0.01;
            globalMultiplier += jellyBonus;

            foodPerSec = foodPerSec.mul(globalMultiplier);
            broodPerSec = broodPerSec.mul(globalMultiplier);

            return { foodPerSec, broodPerSec };
        }

        tick() {
            const production = this.calculateProduction();
            const deltaTime = (Date.now() - this.stats.lastTick) / 1000;
            
            const foodGain = production.foodPerSec.mul(deltaTime);
            const broodGain = production.broodPerSec.mul(deltaTime);
            
            this.currencies.food = this.currencies.food.add(foodGain);
            this.currencies.brood = this.currencies.brood.add(broodGain);
            this.stats.totalLifetimeFood = this.stats.totalLifetimeFood.add(foodGain);
            
            this.stats.lastTick = Date.now();
        }

        clickFood() {
            const clickPower = new BigNum(1);
            this.currencies.food = this.currencies.food.add(clickPower);
            this.stats.totalLifetimeFood = this.stats.totalLifetimeFood.add(clickPower);
            this.stats.totalClicks++;
        }

        canPrestige() {
            return this.rooms.queensChamber.tier >= 1 && 
                   this.stats.totalLifetimeFood.gte(new BigNum(1e9));
        }

        prestige() {
            if (!this.canPrestige()) return false;

            // Calculate Royal Jelly reward
            const lifetimeNum = this.stats.totalLifetimeFood.toNumber();
            const jellyGain = Math.max(1, Math.floor(Math.log10(lifetimeNum)));
            
            // Reset currencies and units/rooms
            this.currencies.food = new BigNum(10);
            this.currencies.brood = new BigNum(0);
            this.currencies.royalJelly = this.currencies.royalJelly.add(jellyGain);
            
            Object.keys(this.units).forEach(key => {
                this.units[key].level = 0;
            });
            
            Object.keys(this.rooms).forEach(key => {
                this.rooms[key].tier = 0;
            });
            
            this.stats.prestigeCount++;
            this.stats.totalLifetimeFood = new BigNum(0);
            
            return true;
        }

        calculateOfflineProgress(timeDiff) {
            const hoursOffline = timeDiff / (1000 * 60 * 60);
            if (hoursOffline <= 0) return null;

            let efficiency = 1.0;
            if (hoursOffline > 8) efficiency = 0.5;
            
            const effectiveHours = Math.min(hoursOffline, 16);
            const secondsOffline = effectiveHours * 3600;
            
            const production = this.calculateProduction();
            const foodGain = production.foodPerSec.mul(secondsOffline * efficiency);
            const broodGain = production.broodPerSec.mul(secondsOffline * efficiency);
            
            this.currencies.food = this.currencies.food.add(foodGain);
            this.currencies.brood = this.currencies.brood.add(broodGain);
            this.stats.totalLifetimeFood = this.stats.totalLifetimeFood.add(foodGain);
            
            return { hoursOffline: effectiveHours, foodGain, broodGain };
        }

        save() {
            return {
                version: this.version,
                timestamp: Date.now(),
                currencies: {
                    food: this.currencies.food.toJSON(),
                    brood: this.currencies.brood.toJSON(),
                    royalJelly: this.currencies.royalJelly.toJSON()
                },
                units: this.units,
                rooms: this.rooms,
                stats: {
                    startTime: this.stats.startTime,
                    totalClicks: this.stats.totalClicks,
                    totalLifetimeFood: this.stats.totalLifetimeFood.toJSON(),
                    prestigeCount: this.stats.prestigeCount
                }
            };
        }

        load(data) {
            if (!data || data.version !== this.version) return false;
            
            try {
                this.currencies.food = new BigNum(data.currencies.food);
                this.currencies.brood = new BigNum(data.currencies.brood);
                this.currencies.royalJelly = new BigNum(data.currencies.royalJelly);
                this.units = data.units;
                this.rooms = data.rooms;
                this.stats.startTime = data.stats.startTime;
                this.stats.totalClicks = data.stats.totalClicks;
                this.stats.totalLifetimeFood = new BigNum(data.stats.totalLifetimeFood);
                this.stats.prestigeCount = data.stats.prestigeCount;
                return true;
            } catch (e) {
                console.error('Failed to load save:', e);
                return false;
            }
        }
    }

    // ===== ANT CANVAS ANIMATION =====
    class AntCanvas {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.ants = [];
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            if (!this.canvas) return;
            const container = this.canvas.parentElement;
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        }

        addAnt() {
            if (!this.canvas) return;
            this.ants.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 3 + Math.random() * 2,
                color: `rgba(139, 90, 60, ${0.3 + Math.random() * 0.3})`
            });
        }

        update() {
            if (!this.canvas || !this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ants.forEach(ant => {
                ant.x += ant.vx;
                ant.y += ant.vy;
                
                if (ant.x < 0 || ant.x > this.canvas.width) ant.vx *= -1;
                if (ant.y < 0 || ant.y > this.canvas.height) ant.vy *= -1;
                
                this.ctx.fillStyle = ant.color;
                this.ctx.beginPath();
                this.ctx.arc(ant.x, ant.y, ant.size, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            requestAnimationFrame(() => this.update());
        }

        setAntCount(count) {
            const target = Math.min(30, Math.max(5, count));
            while (this.ants.length < target) {
                this.addAnt();
            }
            while (this.ants.length > target) {
                this.ants.pop();
            }
        }
    }

    // ===== GAME CONTROLLER =====
    class GameController {
        constructor() {
            this.gameState = new GameState();
            this.antCanvas = new AntCanvas('ant-queen-canvas');
            this.saveKey = 'antQueen_save_v1';
            this.lastSave = Date.now();
            
            this.loadGame();
            this.setupUI();
            this.startGameLoop();
            if (this.antCanvas.canvas) {
                this.antCanvas.update();
            }
        }

        loadGame() {
            try {
                const saveData = localStorage.getItem(this.saveKey);
                if (saveData) {
                    const data = JSON.parse(saveData);
                    if (this.gameState.load(data)) {
                        const timeDiff = Date.now() - data.timestamp;
                        const offlineProgress = this.gameState.calculateOfflineProgress(timeDiff);
                        if (offlineProgress && offlineProgress.hoursOffline > 0.1) {
                            this.showOfflineProgress(offlineProgress);
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to load save:', e);
            }
        }

        saveGame() {
            try {
                const saveData = this.gameState.save();
                localStorage.setItem(this.saveKey, JSON.stringify(saveData));
                this.lastSave = Date.now();
            } catch (e) {
                console.error('Failed to save:', e);
            }
        }

        showOfflineProgress(progress) {
            const msg = `Welcome back!\nYou were away for ${progress.hoursOffline.toFixed(1)} hours\nGained ${progress.foodGain.format()} food!`;
            alert(msg);
        }

        setupUI() {
            // Click area
            const clickArea = document.getElementById('ant-queen-click-area');
            if (clickArea) {
                clickArea.addEventListener('click', (e) => {
                    this.gameState.clickFood();
                    this.showPopupNumber(e.clientX, e.clientY, '+1', '#90ee90');
                    this.updateUI();
                });
            }

            // Prestige button
            const prestigeBtn = document.getElementById('ant-queen-prestige-button');
            if (prestigeBtn) {
                prestigeBtn.addEventListener('click', () => {
                    if (this.gameState.canPrestige()) {
                        if (confirm('Prestige will reset your colony but grant Royal Jelly for permanent bonuses. Continue?')) {
                            this.gameState.prestige();
                            this.updateUI();
                            alert('Prestiged! You gained Royal Jelly for permanent production bonuses!');
                        }
                    }
                });
            }

            this.updateUI();
        }

        updateUI() {
            // Update currency display
            const foodEl = document.getElementById('ant-queen-food-amount');
            const broodEl = document.getElementById('ant-queen-brood-amount');
            const jellyEl = document.getElementById('ant-queen-jelly-amount');
            const prodEl = document.getElementById('ant-queen-production-rate');
            
            if (foodEl) foodEl.textContent = this.gameState.currencies.food.format();
            if (broodEl) broodEl.textContent = this.gameState.currencies.brood.format();
            if (jellyEl) jellyEl.textContent = this.gameState.currencies.royalJelly.format();
            
            const production = this.gameState.calculateProduction();
            if (prodEl) prodEl.textContent = production.foodPerSec.format();
            
            // Update stats
            const colonyAge = Math.floor((Date.now() - this.gameState.stats.startTime) / 1000);
            const ageEl = document.getElementById('ant-queen-colony-age');
            const clicksEl = document.getElementById('ant-queen-total-clicks');
            if (ageEl) ageEl.textContent = colonyAge;
            if (clicksEl) clicksEl.textContent = this.gameState.stats.totalClicks;
            
            // Update units shop
            this.updateShop('ant-queen-units-shop', UNIT_DATA, 'unit');
            
            // Update rooms shop
            this.updateShop('ant-queen-rooms-shop', ROOM_DATA, 'room');
            
            // Update prestige button
            const prestigeBtn = document.getElementById('ant-queen-prestige-button');
            if (prestigeBtn) {
                if (this.gameState.canPrestige()) {
                    prestigeBtn.className = 'ant-queen-available';
                    const jellyGain = Math.max(1, Math.floor(Math.log10(this.gameState.stats.totalLifetimeFood.toNumber())));
                    prestigeBtn.textContent = `👑 PRESTIGE (+${jellyGain} Royal Jelly)`;
                } else {
                    prestigeBtn.className = '';
                    prestigeBtn.textContent = '👑 PRESTIGE (Locked)';
                }
            }
            
            // Update ant count based on total units
            const totalUnits = Object.values(this.gameState.units).reduce((sum, u) => sum + u.level, 0);
            if (this.antCanvas) {
                this.antCanvas.setAntCount(5 + Math.floor(totalUnits / 5));
            }
        }

        updateShop(containerId, dataObj, type) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';
            
            Object.keys(dataObj).forEach(itemId => {
                const data = dataObj[itemId];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'ant-queen-shop-item';
                
                let cost, canAfford, level;
                
                if (type === 'unit') {
                    cost = this.gameState.calculateUnitCost(itemId);
                    canAfford = this.gameState.canAffordUnit(itemId);
                    level = this.gameState.units[itemId].level;
                } else {
                    cost = this.gameState.calculateRoomCost(itemId);
                    canAfford = this.gameState.canAffordRoom(itemId);
                    level = this.gameState.rooms[itemId].tier;
                    const maxed = level >= data.maxTier;
                    if (maxed) {
                        itemDiv.classList.add('ant-queen-maxed');
                    }
                }
                
                if (canAfford) {
                    itemDiv.classList.add('ant-queen-affordable');
                }
                
                // Check for synergies
                let synergyBadge = '';
                if (type === 'unit' && data.synergies) {
                    const nextSynergy = data.synergies.find(s => level < s);
                    if (nextSynergy) {
                        const remaining = nextSynergy - level;
                        synergyBadge = `<span class="ant-queen-synergy-badge">⭐ ${remaining} to synergy</span>`;
                    }
                }
                
                itemDiv.innerHTML = `
                    <div class="ant-queen-shop-item-header">
                        <div>
                            <span class="ant-queen-item-icon">${data.icon}</span>
                            <span class="ant-queen-item-name">${data.name}</span>
                            ${synergyBadge}
                        </div>
                        <span class="ant-queen-item-count">${level}</span>
                    </div>
                    <div class="ant-queen-item-cost ${canAfford ? 'ant-queen-affordable' : 'ant-queen-unaffordable'}">
                        ${level >= (data.maxTier || 999) ? 'MAX TIER' : `Cost: ${cost.format()} 🌾`}
                    </div>
                    <div class="ant-queen-item-description">${data.description}</div>
                `;
                
                if (canAfford && level < (data.maxTier || 999)) {
                    itemDiv.style.cursor = 'pointer';
                    itemDiv.addEventListener('click', () => {
                        let success = false;
                        if (type === 'unit') {
                            success = this.gameState.buyUnit(itemId);
                        } else {
                            success = this.gameState.buyRoom(itemId);
                        }
                        if (success) {
                            this.updateUI();
                        }
                    });
                }
                
                container.appendChild(itemDiv);
            });
        }

        showPopupNumber(x, y, text, color) {
            const popup = document.createElement('div');
            popup.className = 'ant-queen-popup-number';
            popup.textContent = text;
            popup.style.left = x + 'px';
            popup.style.top = y + 'px';
            popup.style.color = color;
            document.body.appendChild(popup);
            
            setTimeout(() => popup.remove(), 1000);
        }

        startGameLoop() {
            setInterval(() => {
                this.gameState.tick();
                this.updateUI();
            }, 100); // 10Hz tick rate
            
            // Auto-save every 30 seconds
            setInterval(() => {
                this.saveGame();
            }, 30000);
            
            // Save on page unload
            window.addEventListener('beforeunload', () => {
                this.saveGame();
            });
        }
    }

    // ===== START GAME =====
    window.addEventListener('load', () => {
        new GameController();
    });
})();
