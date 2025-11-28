// Crimson Doom - Raycasting Engine WITH TEXTURES (V2 - Actually Working Edition)
// Built by Claude for Crimson Lantern Studios

class RaycastEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Player properties
        this.player = {
            x: 3.5,
            y: 3.5,
            angle: 0,
            fov: Math.PI / 3,
            speed: 0.05,
            rotSpeed: 0.03
        };
        
        // Level map (1 = wall, 0 = empty)
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
        
        // Generate textures
        this.wallTextures = this.generateWallTextures();
        
        // Rendering settings
        this.rayCount = 320;
        this.maxDepth = 20;
        
        // Input
        this.keys = {};
        this.mouseX = 0;
        this.mouseLocked = false;
    }
    
    generateWallTextures() {
        const textures = {};
        
        // Texture 1: Red Bricks
        textures[1] = this.createBrickTexture('#8B0000', '#650000', '#2a0000');
        
        // Texture 2: Gray Stone
        textures[2] = this.createStoneTexture('#666666', '#555555', '#444444');
        
        // Texture 3: Brown Panels
        textures[3] = this.createPanelTexture('#654321', '#543210', '#3a2a10');
        
        // Texture 4: Green Tech
        textures[4] = this.createTechTexture('#006400', '#004400', '#00ff00');
        
        return textures;
    }
    
    createBrickTexture(baseColor, mortarColor, shadowColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Background (mortar)
        ctx.fillStyle = mortarColor;
        ctx.fillRect(0, 0, 64, 64);
        
        // Draw bricks
        for (let y = 0; y < 64; y += 16) {
            for (let x = 0; x < 64; x += 32) {
                const offset = (y / 16) % 2 === 0 ? 0 : 16;
                
                // Brick
                ctx.fillStyle = baseColor;
                ctx.fillRect(x + offset + 1, y + 1, 30, 14);
                
                // Brick highlight
                ctx.fillStyle = this.lightenColor(baseColor, 1.2);
                ctx.fillRect(x + offset + 1, y + 1, 28, 3);
                ctx.fillRect(x + offset + 1, y + 1, 3, 12);
                
                // Brick shadow
                ctx.fillStyle = shadowColor;
                ctx.fillRect(x + offset + 28, y + 12, 3, 3);
                ctx.fillRect(x + offset + 1, y + 12, 30, 2);
            }
        }
        
        return canvas;
    }
    
    createStoneTexture(baseColor, darkColor, lightColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 64, 64);
        
        // Random stone chunks
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 6 + 2;
            const shade = Math.random() > 0.5 ? darkColor : lightColor;
            
            ctx.fillStyle = shade;
            ctx.fillRect(x, y, size, size);
        }
        
        // Add some larger blocks
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 60;
            const y = Math.random() * 60;
            ctx.fillStyle = Math.random() > 0.5 ? darkColor : baseColor;
            ctx.fillRect(x, y, 8, 8);
        }
        
        return canvas;
    }
    
    createPanelTexture(baseColor, borderColor, shadowColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 64, 64);
        
        // Panel border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(6, 6, 52, 52);
        
        // Inner panel
        ctx.strokeStyle = shadowColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, 44, 44);
        
        // Highlight
        ctx.strokeStyle = this.lightenColor(baseColor, 1.3);
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, 48, 48);
        
        return canvas;
    }
    
    createTechTexture(baseColor, darkColor, lightColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 64, 64);
        
        // Horizontal lines
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 8);
            ctx.lineTo(64, i * 8);
            ctx.stroke();
        }
        
        // Indicator lights
        ctx.fillStyle = lightColor;
        for (let i = 0; i < 6; i++) {
            ctx.fillRect(8 + i * 10, 4, 4, 4);
            ctx.fillRect(8 + i * 10, 28, 4, 4);
            ctx.fillRect(8 + i * 10, 52, 4, 4);
        }
        
        return canvas;
    }
    
    lightenColor(color, factor) {
        // Parse hex color
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Lighten
        const newR = Math.min(255, Math.floor(r * factor));
        const newG = Math.min(255, Math.floor(g * factor));
        const newB = Math.min(255, Math.floor(b * factor));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    castRay(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        let distance = 0;
        let hitWall = false;
        let wallType = 0;
        let hitX = 0;
        let hitY = 0;
        let side = 0; // Which side of wall (for shading)
        
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
                
                // Determine which side we hit (for texture mapping)
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
        
        // Draw ceiling
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height / 2);
        
        // Draw floor with simple gradient
        const gradient = this.ctx.createLinearGradient(0, this.height / 2, 0, this.height);
        gradient.addColorStop(0, '#4a4a4a');
        gradient.addColorStop(1, '#2a2a2a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
        
        // Cast rays
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
                    texX = (hitY % 1) * texture.width;
                } else {
                    texX = (hitX % 1) * texture.width;
                }
                texX = Math.floor(texX);
                
                // Draw textured wall slice
                const sliceWidth = this.width / this.rayCount;
                
                // Apply distance shading
                const shade = Math.max(0.2, 1 - (correctedDistance / this.maxDepth));
                
                // Additional shading for horizontal walls
                const sideShade = side === 1 ? 0.7 : 1.0;
                
                this.ctx.globalAlpha = shade * sideShade;
                
                this.ctx.drawImage(
                    texture,
                    texX, 0, 1, texture.height,
                    x * sliceWidth, wallTop, sliceWidth + 1, wallBottom - wallTop
                );
                
                this.ctx.globalAlpha = 1.0;
            }
        }
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
    
    shadeColor(color, factor) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
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
