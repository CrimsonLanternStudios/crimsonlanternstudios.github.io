// Crimson Doom - Game Logic with REAL DOOM SPRITES
// Built by Claude for Crimson Lantern Studios

// DOOM Sprites - Extracted from Freedoom WAD
const SPRITES = {
    enemy: new Image(),
    enemyDead: new Image(),
    pistol: new Image(),
    pistolFire: new Image(),
    shotgun: new Image(),
    shotgunFire: new Image()
};

// Load sprites from base64 data
function loadSprites() {
    const spriteData = EOF
cat /home/claude/CrimsonDoom/sprite_data.json >> /mnt/user-data/outputs/game_v3.js
cat >> /mnt/user-data/outputs/game_v3.js << 'EOF'
;
    
    SPRITES.enemy.src = 'data:image/png;base64,' + spriteData.enemy.data;
    SPRITES.enemyDead.src = 'data:image/png;base64,' + spriteData.enemy_dead.data;
    SPRITES.pistol.src = 'data:image/png;base64,' + spriteData.pistol.data;
    SPRITES.pistolFire.src = 'data:image/png;base64,' + spriteData.pistol_fire.data;
    SPRITES.shotgun.src = 'data:image/png;base64,' + spriteData.shotgun.data;
    SPRITES.shotgunFire.src = 'data:image/png;base64,' + spriteData.shotgun_fire.data;
}

class Enemy {
    constructor(x, y, type = 'demon') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 100;
        this.speed = 0.02;
        this.damage = 10;
        this.attackCooldown = 0;
        this.attackRange = 1.5;
        this.detectionRange = 8;
        this.active = false;
        this.dead = false;
        this.size = 0.3;
    }
    
    update(playerX, playerY) {
        if (this.dead) return;
        
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.detectionRange) {
            this.active = true;
        }
        
        if (this.active) {
            if (distance > this.attackRange) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
            
            if (this.attackCooldown > 0) {
                this.attackCooldown--;
            }
        }
        
        return distance <= this.attackRange && this.attackCooldown === 0;
    }
    
    attack() {
        this.attackCooldown = 60;
        return this.damage;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.dead = true;
            return true;
        }
        return false;
    }
    
    getAngle(playerX, playerY) {
        return Math.atan2(this.y - playerY, this.x - playerX);
    }
}

class Weapon {
    constructor(name, damage, ammo, fireRate, spread) {
        this.name = name;
        this.damage = damage;
        this.ammo = ammo;
        this.maxAmmo = ammo;
        this.fireRate = fireRate;
        this.spread = spread;
        this.cooldown = 0;
        this.pellets = name === 'SHOTGUN' ? 7 : 1;
    }
    
    canFire() {
        return this.cooldown === 0 && this.ammo > 0;
    }
    
    fire() {
        if (!this.canFire()) return false;
        this.ammo--;
        this.cooldown = this.fireRate;
        return true;
    }
    
    update() {
        if (this.cooldown > 0) this.cooldown--;
    }
}

class CrimsonDoom {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.engine = new RaycastEngine(this.canvas);
        
        this.running = false;
        this.health = 100;
        this.maxHealth = 100;
        this.armor = 0;
        this.kills = 0;
        
        this.weapons = {
            pistol: new Weapon('PISTOL', 25, 50, 15, 0.02),
            shotgun: new Weapon('SHOTGUN', 15, 24, 30, 0.1)
        };
        this.currentWeapon = this.weapons.pistol;
        
        this.enemies = [];
        this.spawnEnemies();
        
        this.muzzleFlash = 0;
        this.screenShake = 0;
        this.damageFlash = 0;
        
        this.ui = {
            health: document.getElementById('health'),
            armor: document.getElementById('armor'),
            ammo: document.getElementById('ammo'),
            weapon: document.getElementById('weapon'),
            kills: document.getElementById('kills'),
            container: document.getElementById('ui'),
            menu: document.getElementById('mainMenu'),
            gameOver: document.getElementById('gameOver'),
            finalKills: document.getElementById('finalKills')
        };
        
        // Load sprites then setup
        loadSprites();
        this.setupControls();
    }
    
    spawnEnemies() {
        const spawnPoints = [
            {x: 6.5, y: 4.5}, {x: 10.5, y: 4.5}, {x: 4.5, y: 9.5},
            {x: 11.5, y: 9.5}, {x: 8.5, y: 8.5}, {x: 13.5, y: 13.5},
            {x: 2.5, y: 13.5}, {x: 7.5, y: 2.5}, {x: 12.5, y: 6.5},
            {x: 3.5, y: 10.5}
        ];
        
        spawnPoints.forEach(point => {
            this.enemies.push(new Enemy(point.x, point.y));
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.engine.handleKeyDown(e);
            if (e.key === '1') this.currentWeapon = this.weapons.pistol;
            if (e.key === '2') this.currentWeapon = this.weapons.shotgun;
        });
        
        document.addEventListener('keyup', (e) => this.engine.handleKeyUp(e));
        document.addEventListener('mousemove', (e) => this.engine.handleMouseMove(e));
        
        this.canvas.addEventListener('click', (e) => {
            this.engine.handleClick();
            if (this.running && this.engine.mouseLocked) {
                this.shoot();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.engine.handlePointerLockChange();
        });
        
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('restartButton').addEventListener('click', () => this.restart());
    }
    
    startGame() {
        this.ui.menu.classList.add('hidden');
        this.ui.container.classList.remove('hidden');
        this.running = true;
        this.gameLoop();
    }
    
    restart() {
        this.health = this.maxHealth;
        this.armor = 0;
        this.kills = 0;
        this.enemies = [];
        this.spawnEnemies();
        this.weapons.pistol.ammo = 50;
        this.weapons.shotgun.ammo = 24;
        this.currentWeapon = this.weapons.pistol;
        this.engine.player.x = 3.5;
        this.engine.player.y = 3.5;
        this.ui.gameOver.style.display = 'none';
        this.running = true;
        this.updateUI();
    }
    
    shoot() {
        if (!this.currentWeapon.fire()) return;
        
        this.muzzleFlash = 10;
        this.screenShake = 5;
        
        for (let i = 0; i < this.currentWeapon.pellets; i++) {
            const spread = (Math.random() - 0.5) * this.currentWeapon.spread;
            const hitEnemy = this.checkRayHit(this.engine.player.angle + spread);
            
            if (hitEnemy && hitEnemy.takeDamage(this.currentWeapon.damage)) {
                this.kills++;
            }
        }
        
        this.updateUI();
    }
    
    checkRayHit(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        let closestEnemy = null;
        let closestDist = Infinity;
        
        this.enemies.forEach(enemy => {
            if (enemy.dead) return;
            
            const dx = enemy.x - this.engine.player.x;
            const dy = enemy.y - this.engine.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const enemyAngle = Math.atan2(dy, dx);
            const angleDiff = Math.abs(enemyAngle - angle);
            
            if (angleDiff < 0.2 && dist < closestDist) {
                closestDist = dist;
                closestEnemy = enemy;
            }
        });
        
        return closestEnemy;
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            const shouldAttack = enemy.update(this.engine.player.x, this.engine.player.y);
            
            if (shouldAttack) {
                const damage = enemy.attack();
                this.takeDamage(damage);
            }
        });
    }
    
    takeDamage(amount) {
        const armorDamage = Math.min(this.armor, amount);
        this.armor -= armorDamage;
        
        const healthDamage = amount - armorDamage;
        this.health -= healthDamage;
        
        this.damageFlash = 20;
        this.screenShake = 8;
        
        if (this.health <= 0) {
            this.gameOver();
        }
        
        this.updateUI();
    }
    
    gameOver() {
        this.running = false;
        this.ui.finalKills.textContent = this.kills;
        this.ui.gameOver.style.display = 'block';
    }
    
    updateUI() {
        this.ui.health.textContent = Math.max(0, Math.floor(this.health));
        this.ui.armor.textContent = Math.floor(this.armor);
        this.ui.ammo.textContent = this.currentWeapon.ammo;
        this.ui.weapon.textContent = this.currentWeapon.name;
        this.ui.kills.textContent = this.kills;
    }
    
    renderEnemies() {
        const ctx = this.engine.ctx;
        
        const sortedEnemies = this.enemies
            .map(e => {
                const dx = e.x - this.engine.player.x;
                const dy = e.y - this.engine.player.y;
                return {
                    enemy: e,
                    distance: Math.sqrt(dx * dx + dy * dy),
                    angle: Math.atan2(dy, dx)
                };
            })
            .sort((a, b) => b.distance - a.distance);
        
        sortedEnemies.forEach(({enemy, distance, angle}) => {
            if (enemy.dead) return;
            
            let relativeAngle = angle - this.engine.player.angle;
            while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
            while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;
            
            if (Math.abs(relativeAngle) > this.engine.player.fov / 2) return;
            
            const screenX = (relativeAngle / this.engine.player.fov + 0.5) * this.canvas.width;
            const spriteHeight = (this.canvas.height / distance) * 0.8;
            const spriteWidth = spriteHeight;
            const screenY = (this.canvas.height / 2) - (spriteHeight / 2);
            
            const shade = Math.max(0.3, 1 - (distance / this.engine.maxDepth));
            ctx.globalAlpha = shade;
            
            // Draw REAL sprite
            ctx.drawImage(
                SPRITES.enemy,
                screenX - spriteWidth / 2,
                screenY,
                spriteWidth,
                spriteHeight
            );
            
            ctx.globalAlpha = 1.0;
            
            // Health bar
            const barWidth = spriteWidth;
            const barHeight = 4;
            ctx.fillStyle = '#000';
            ctx.fillRect(screenX - barWidth / 2, screenY - 10, barWidth, barHeight);
            ctx.fillStyle = enemy.health > 30 ? '#0f0' : '#f00';
            ctx.fillRect(screenX - barWidth / 2, screenY - 10, barWidth * (enemy.health / 100), barHeight);
        });
    }
    
    renderEffects() {
        const ctx = this.engine.ctx;
        
        // Muzzle flash
        if (this.muzzleFlash > 0) {
            ctx.fillStyle = `rgba(255, 200, 0, ${this.muzzleFlash / 10})`;
            ctx.fillRect(this.canvas.width / 2 - 30, this.canvas.height - 100, 60, 60);
            this.muzzleFlash--;
        }
        
        // Damage flash
        if (this.damageFlash > 0) {
            ctx.fillStyle = `rgba(255, 0, 0, ${this.damageFlash / 40})`;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.damageFlash--;
        }
        
        // Crosshair
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY);
        ctx.lineTo(centerX + 10, centerY);
        ctx.moveTo(centerX, centerY - 10);
        ctx.lineTo(centerX, centerY + 10);
        ctx.stroke();
        
        this.renderWeapon();
    }
    
    renderWeapon() {
        const ctx = this.engine.ctx;
        const weaponY = this.canvas.height - 120 + (this.screenShake > 0 ? Math.random() * this.screenShake : 0);
        
        // Draw REAL weapon sprite
        const weaponSprite = this.muzzleFlash > 5 ? 
            (this.currentWeapon.name === 'PISTOL' ? SPRITES.pistolFire : SPRITES.shotgunFire) :
            (this.currentWeapon.name === 'PISTOL' ? SPRITES.pistol : SPRITES.shotgun);
        
        const scale = 2;
        const weaponWidth = weaponSprite.width * scale;
        const weaponHeight = weaponSprite.height * scale;
        
        ctx.drawImage(
            weaponSprite,
            this.canvas.width / 2 - weaponWidth / 2,
            weaponY,
            weaponWidth,
            weaponHeight
        );
        
        if (this.screenShake > 0) this.screenShake--;
    }
    
    gameLoop() {
        if (!this.running) return;
        
        this.engine.update();
        this.updateEnemies();
        this.currentWeapon.update();
        
        this.engine.render();
        this.renderEnemies();
        this.renderEffects();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new CrimsonDoom();
});
