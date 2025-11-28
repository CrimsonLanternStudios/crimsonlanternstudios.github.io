// Crimson Doom - Raycasting Engine
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
        
        // Wall colors for different wall types
        this.wallColors = {
            1: '#8B0000', // Dark red
            2: '#666666', // Gray
            3: '#654321', // Brown
            4: '#006400'  // Dark green
        };
        
        // Rendering settings
        this.rayCount = 320; // Number of rays to cast
        this.maxDepth = 20;  // Maximum ray distance
        
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
        
        while (!hitWall && distance < this.maxDepth) {
            distance += 0.1;
            
            const testX = this.player.x + cos * distance;
            const testY = this.player.y + sin * distance;
            
            const mapX = Math.floor(testX);
            const mapY = Math.floor(testY);
            
            // Check if out of bounds
            if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) {
                hitWall = true;
                distance = this.maxDepth;
            } else if (this.map[mapY][mapX] > 0) {
                hitWall = true;
                wallType = this.map[mapY][mapX];
            }
        }
        
        return { distance, wallType };
    }
    
    render() {
        // Clear screen
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw ceiling
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.width, this.height / 2);
        
        // Draw floor
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
        
        // Cast rays
        for (let x = 0; x < this.rayCount; x++) {
            const rayAngle = (this.player.angle - this.player.fov / 2) + 
                           (x / this.rayCount) * this.player.fov;
            
            const { distance, wallType } = this.castRay(rayAngle);
            
            // Fix fish-eye effect
            const correctedDistance = distance * Math.cos(rayAngle - this.player.angle);
            
            // Calculate wall height
            const wallHeight = (this.height / correctedDistance) * 0.5;
            
            // Calculate wall position
            const wallTop = (this.height / 2) - wallHeight;
            const wallBottom = (this.height / 2) + wallHeight;
            
            // Determine wall color with distance shading
            const baseColor = this.wallColors[wallType] || '#ff0000';
            const shade = Math.max(0, 1 - (correctedDistance / this.maxDepth));
            
            // Draw wall slice
            const sliceWidth = this.width / this.rayCount;
            this.ctx.fillStyle = this.shadeColor(baseColor, shade);
            this.ctx.fillRect(x * sliceWidth, wallTop, sliceWidth + 1, wallBottom - wallTop);
            
            // Add some texture variation
            if (x % 2 === 0) {
                this.ctx.fillStyle = this.shadeColor(baseColor, shade * 0.9);
                this.ctx.fillRect(x * sliceWidth, wallTop, sliceWidth + 1, wallBottom - wallTop);
            }
        }
    }
    
    shadeColor(color, factor) {
        // Convert hex to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Apply shading
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
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
