// Crimson Doom - Enhanced Raycasting Engine with Textures
// Built by Claude for Crimson Lantern Studios

class TextureGenerator {
    constructor() {
        this.textures = {};
        this.generateTextures();
    }
    
    generateTextures() {
        // Generate wall textures
        this.textures.wall1 = this.createBrickTexture('#8B0000', '#650000');
        this.textures.wall2 = this.createStoneTexture('#666666', '#444444');
        this.textures.wall3 = this.createPanelTexture('#654321', '#543210');
        this.textures.wall4 = this.createTechTexture('#006400', '#004400');
        
        // Generate floor/ceiling textures
        this.textures.floor = this.createFloorTexture('#4a4a4a', '#3a3a3a');
        this.textures.ceiling = this.createFloorTexture('#2a2a2a', '#1a1a1a');
        
        // Generate enemy sprites
        this.textures.enemy = this.createEnemySprite();
        this.textures.enemyDead = this.createDeadEnemySprite();
        
        // Generate weapon sprites
        this.textures.pistol = this.createPistolSprite();
        this.textures.shotgun = this.createShotgunSprite();
    }
    
    createBrickTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 64, 64);
        
        // Bricks
        ctx.fillStyle = color2;
        for (let y = 0; y < 64; y += 16) {
            for (let x = 0; x < 64; x += 32) {
                const offsetX = (y / 16) % 2 === 0 ? 0 : 16;
                ctx.fillRect(x + offsetX, y, 30, 14);
            }
        }
        
        // Mortar lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        for (let y = 0; y < 64; y += 16) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(64, y);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    createStoneTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 64, 64);
        
        // Random stone pattern
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? color2 : color1;
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 8 + 2;
            ctx.fillRect(x, y, size, size);
        }
        
        return canvas;
    }
    
    createPanelTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 64, 64);
        
        // Panel borders
        ctx.strokeStyle = color2;
        ctx.lineWidth = 3;
        ctx.strokeRect(8, 8, 48, 48);
        ctx.strokeRect(4, 4, 56, 56);
        
        return canvas;
    }
    
    createTechTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 64, 64);
        
        // Tech lines
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 12);
            ctx.lineTo(64, i * 12);
            ctx.stroke();
        }
        
        // Dots
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(8 + i * 16, 8, 4, 4);
        }
        
        return canvas;
    }
    
    createFloorTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, 64, 64);
        
        // Tile pattern
        ctx.strokeStyle = color2;
        ctx.lineWidth = 1;
        for (let x = 0; x < 64; x += 32) {
            for (let y = 0; y < 64; y += 32) {
                ctx.strokeRect(x, y, 32, 32);
            }
        }
        
        return canvas;
    }
    
    createEnemySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Body (demon-like)
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(20, 20, 24, 35);
        
        // Head
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(22, 15, 20, 15);
        
        // Horns
        ctx.fillStyle = '#654321';
        ctx.fillRect(20, 12, 6, 8);
        ctx.fillRect(38, 12, 6, 8);
        
        // Eyes (glowing)
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(26, 20, 4, 4);
        ctx.fillRect(34, 20, 4, 4);
        
        // Arms
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(14, 25, 6, 20);
        ctx.fillRect(44, 25, 6, 20);
        
        // Legs
        ctx.fillRect(24, 55, 6, 9);
        ctx.fillRect(34, 55, 6, 9);
        
        // Outline for definition
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, 24, 35);
        ctx.strokeRect(22, 15, 20, 15);
        
        return canvas;
    }
    
    createDeadEnemySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Dead body (horizontal)
        ctx.fillStyle = '#4a0000';
        ctx.fillRect(10, 40, 44, 12);
        
        // Blood pool
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(32, 48, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }
    
    createPistolSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // Gun body
        ctx.fillStyle = '#333';
        ctx.fillRect(25, 40, 30, 50);
        
        // Barrel
        ctx.fillStyle = '#222';
        ctx.fillRect(35, 20, 10, 30);
        
        // Handle
        ctx.fillStyle = '#654321';
        ctx.fillRect(30, 70, 20, 30);
        
        // Trigger
        ctx.fillStyle = '#888';
        ctx.fillRect(40, 75, 6, 10);
        
        // Highlights
        ctx.fillStyle = '#666';
        ctx.fillRect(27, 42, 4, 40);
        ctx.fillRect(37, 22, 4, 25);
        
        return canvas;
    }
    
    createShotgunSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // Stock
        ctx.fillStyle = '#654321';
        ctx.fillRect(10, 60, 40, 20);
        
        // Main body
        ctx.fillStyle = '#333';
        ctx.fillRect(20, 45, 60, 25);
        
        // Barrels (double barrel)
        ctx.fillStyle = '#222';
        ctx.fillRect(35, 25, 12, 30);
        ctx.fillRect(53, 25, 12, 30);
        
        // Pump
        ctx.fillStyle = '#654321';
        ctx.fillRect(50, 55, 20, 10);
        
        // Highlights
        ctx.fillStyle = '#555';
        ctx.fillRect(37, 27, 10, 25);
        ctx.fillRect(55, 27, 10, 25);
        
        return canvas;
    }
    
    getTexture(name) {
        return this.textures[name];
    }
}

class RaycastEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Initialize texture generator
        this.textureGen = new TextureGenerator();
        
        // Player properties
        this.player = {
            x: 3.5,
            y: 3.5,
            angle: 0,
            fov: Math.PI / 3,
            speed: 0.05,
            rotSpeed: 0.03
        };
        
        // Level map (1-4 = different wall types, 0 = empty)
        this.map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,2,2,2,0,0,0,0,3,3,3,0,0,1],
            [1,0,0,2,0,2,0,0,0,0,0,0,3,0,0,1],
            [1,0,0,2,0,2,0,0,0,0,0,0,3,0,0,1],
            [1,0,0,2,2,2,0,0,0,0,3,3,3,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,4,4,0,0,0,0,0,0,1],
            [1,0,0,3,3,3,0,4,4,0,2,2,2,0,0,1],
            [1,0,0,3,0,0,0,0,0,0,2,0,2,0,0,1],
            [1,0,0,3,0,0,0,0,0,0,2,0,2,0,0,1],
            [1,0,0,3,3,3,0,0,0,0,2,2,2,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.mapWidth = this.map[0].length;
        this.mapHeight = this.map.length;
        
        // Wall texture mapping
        this.wallTextures = {
            1: this.textureGen.getTexture('wall1'),
            2: this.textureGen.getTexture('wall2'),
            3: this.textureGen.getTexture('wall3'),
            4: this.textureGen.getTexture('wall4')
        };
        
        // Rendering settings
        this.rayCount = 320;
        this.maxDepth = 20;
        
        // Input
        this.keys = {};
        this.mouseX = 0;
        this.mouseLocked = false;
    }
    
    castRay(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        let distance = 0;
        let hitWall = false;
        let wallType = 0;
        let hitX, hitY;
        let side = 0; // 0 = vertical wall, 1 = horizontal wall
        
        while (!hitWall && distance < this.maxDepth) {
            distance += 0.01;
            
            const testX = this.player.x + cos * distance;
            const testY = this.player.y + sin * distance;
            
            const mapX = Math.floor(testX);
            const mapY = Math.floor(testY);
            
            if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) {
                hitWall = true;
                distance = this.maxDepth;
            } else if (this.map[mapY][mapX] > 0) {
                hitWall = true;
                wallType = this.map[mapY][mapX];
                hitX = testX;
                hitY = testY;
                
                // Determine which side of wall we hit
                const dx = testX - mapX;
                const dy = testY - mapY;
                side = (Math.abs(dx - 0.5) > Math.abs(dy - 0.5)) ? 0 : 1;
            }
        }
        
        return { distance, wallType, hitX, hitY, side };
    }
    
    render() {
        // Clear screen
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw ceiling with texture
        this.drawTexturedPlane(0, this.height / 2, this.textureGen.getTexture('ceiling'));
        
        // Draw floor with texture
        this.drawTexturedPlane(this.height / 2, this.height, this.textureGen.getTexture('floor'));
        
        // Cast rays for walls
        for (let x = 0; x < this.rayCount; x++) {
            const rayAngle = (this.player.angle - this.player.fov / 2) + 
                           (x / this.rayCount) * this.player.fov;
            
            const { distance, wallType, hitX, hitY, side } = this.castRay(rayAngle);
            
            if (wallType === 0) continue;
            
            // Fix fish-eye effect
            const correctedDistance = distance * Math.cos(rayAngle - this.player.angle);
            
            // Calculate wall height
            const wallHeight = (this.height / correctedDistance) * 0.5;
            
            // Calculate wall position
            const wallTop = (this.height / 2) - wallHeight;
            const wallBottom = (this.height / 2) + wallHeight;
            
            // Get texture
            const texture = this.wallTextures[wallType];
            if (texture) {
                // Calculate texture X coordinate
                let texX;
                if (side === 0) {
                    texX = hitY % 1;
                } else {
                    texX = hitX % 1;
                }
                texX = Math.floor(texX * texture.width);
                
                // Draw textured wall slice
                const sliceWidth = this.width / this.rayCount;
                
                // Apply distance shading
                const shade = Math.max(0.3, 1 - (correctedDistance / this.maxDepth));
                this.ctx.globalAlpha = shade;
                
                // Additional shading for side walls
                if (side === 1) {
                    this.ctx.globalAlpha *= 0.8;
                }
                
                this.ctx.drawImage(
                    texture,
                    texX, 0, 1, texture.height,
                    x * sliceWidth, wallTop, sliceWidth + 1, wallBottom - wallTop
                );
                
                this.ctx.globalAlpha = 1.0;
            }
        }
    }
    
    drawTexturedPlane(startY, endY, texture) {
        const pattern = this.ctx.createPattern(texture, 'repeat');
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, startY, this.width, endY - startY);
    }
    
    update() {
        // Rotation
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.angle -= this.player.rotSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.angle += this.player.rotSpeed;
        }
        
        // Mouse look
        if (this.mouseLocked && this.mouseX !== 0) {
            this.player.angle += this.mouseX * 0.002;
            this.mouseX = 0;
        }
        
        // Movement
        let moveX = 0;
        let moveY = 0;
        
        if (this.keys['ArrowUp'] || this.keys['w']) {
            moveX += Math.cos(this.player.angle) * this.player.speed;
            moveY += Math.sin(this.player.angle) * this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            moveX -= Math.cos(this.player.angle) * this.player.speed;
            moveY -= Math.sin(this.player.angle) * this.player.speed;
        }
        
        // Strafe
        if (this.keys['q']) {
            moveX += Math.cos(this.player.angle - Math.PI / 2) * this.player.speed;
            moveY += Math.sin(this.player.angle - Math.PI / 2) * this.player.speed;
        }
        if (this.keys['e']) {
            moveX += Math.cos(this.player.angle + Math.PI / 2) * this.player.speed;
            moveY += Math.sin(this.player.angle + Math.PI / 2) * this.player.speed;
        }
        
        // Collision detection
        const newX = this.player.x + moveX;
        const newY = this.player.y + moveY;
        
        if (this.map[Math.floor(newY)][Math.floor(newX)] === 0) {
            this.player.x = newX;
            this.player.y = newY;
        }
    }
    
    handleKeyDown(e) {
        this.keys[e.key] = true;
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    handleMouseMove(e) {
        if (this.mouseLocked) {
            this.mouseX += e.movementX;
        }
    }
    
    handleClick() {
        if (!this.mouseLocked) {
            this.canvas.requestPointerLock();
        }
    }
    
    handlePointerLockChange() {
        this.mouseLocked = document.pointerLockElement === this.canvas;
    }
}
