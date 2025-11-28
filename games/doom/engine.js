// Crimson Doom - Raycasting Engine with Door Support
// Built by Claude for Crimson Lantern Studios

class RaycastEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.player = {
            x: 3.5,
            y: 3.5,
            angle: 0,
            fov: Math.PI / 3,
            moveSpeed: 0.05,
            rotSpeed: 0.03
        };
        
        this.keys = {};
        this.mouseLocked = false;
        this.rayCount = 320;
        this.maxDepth = 20;
        
        // Wall textures with colors
        this.textures = this.generateTextures();
        
        // Door states
        this.doors = new Map(); // Track door opening states
    }
    
    generateTextures() {
        const size = 64;
        const textures = {};
        
        // Brick texture (red)
        textures[1] = this.createBrickTexture(size, '#8B0000', '#A00000');
        
        // Stone texture (gray)
        textures[2] = this.createStoneTexture(size, '#505050', '#606060');
        
        // Panel texture (brown)
        textures[3] = this.createPanelTexture(size, '#4A2511', '#5A3520');
        
        // Tech texture (green)
        textures[4] = this.createTechTexture(size, '#004400', '#006600');
        
        // Red door
        textures[5] = this.createDoorTexture(size, '#AA0000', '#880000');
        
        // Blue door  
        textures[6] = this.createDoorTexture(size, '#0000AA', '#000088');
        
        // Yellow door
        textures[7] = this.createDoorTexture(size, '#AAAA00', '#888800');
        
        // Exit portal
        textures[9] = this.createExitTexture(size);
        
        return textures;
    }
    
    createBrickTexture(size, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Base
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, size, size);
        
        // Bricks
        const brickHeight = size / 8;
        const brickWidth = size / 4;
        
        ctx.fillStyle = color2;
        for (let y = 0; y < size; y += brickHeight) {
            const offset = (y / brickHeight) % 2 === 0 ? 0 : brickWidth / 2;
            for (let x = -brickWidth; x < size; x += brickWidth) {
                ctx.strokeStyle = '#000';
                ctx.strokeRect(x + offset, y, brickWidth - 1, brickHeight - 1);
            }
        }
        
        return canvas;
    }
    
    createStoneTexture(size, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, size, size);
        
        // Random stone pattern
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = Math.random() < 0.5 ? color2 : color1;
            ctx.fillRect(
                Math.random() * size,
                Math.random() * size,
                Math.random() * 10 + 2,
                Math.random() * 10 + 2
            );
        }
        
        return canvas;
    }
    
    createPanelTexture(size, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, size, size);
        
        // Vertical panels
        ctx.fillStyle = color2;
        for (let x = 0; x < size; x += size / 4) {
            ctx.fillRect(x, 0, size / 8, size);
        }
        
        return canvas;
    }
    
    createTechTexture(size, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, size, size);
        
        // Tech panels
        ctx.fillStyle = color2;
        for (let y = 0; y < size; y += size / 8) {
            ctx.fillRect(0, y, size, 2);
        }
        
        return canvas;
    }
    
    createDoorTexture(size, color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, size, size);
        
        // Door panels
        ctx.fillStyle = color2;
        ctx.fillRect(size * 0.1, size * 0.1, size * 0.8, size * 0.35);
        ctx.fillRect(size * 0.1, size * 0.55, size * 0.8, size * 0.35);
        
        // Handle
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(size * 0.75, size * 0.45, size * 0.1, size * 0.1);
        
        return canvas;
    }
    
    createExitTexture(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Swirling portal effect
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gradient.addColorStop(0, '#00FFFF');
        gradient.addColorStop(0.5, '#0088FF');
        gradient.addColorStop(1, '#000088');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        return canvas;
    }
    
    setMap(map) {
        this.map = map;
    }
    
    setDoors(doors) {
        this.doors.clear();
        doors.forEach(door => {
            const key = `${door.x},${door.y}`;
            this.doors.set(key, {
                ...door,
                openAmount: 0,
                opening: false
            });
        });
    }
    
    openDoor(x, y) {
        const key = `${Math.floor(x)},${Math.floor(y)}`;
        const door = this.doors.get(key);
        if (door && !door.locked) {
            door.opening = true;
        }
    }
    
    unlockDoor(color) {
        this.doors.forEach(door => {
            if (door.color === color) {
                door.locked = false;
            }
        });
    }
    
    updateDoors() {
        this.doors.forEach(door => {
            if (door.opening && door.openAmount < 1) {
                door.openAmount += 0.05;
                if (door.openAmount >= 1) {
                    door.opening = false;
                    door.openAmount = 1;
                }
            }
        });
    }
    
    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') {
            // Try to open door in front of player
            const dx = Math.cos(this.player.angle);
            const dy = Math.sin(this.player.angle);
            const checkX = Math.floor(this.player.x + dx * 1.5);
            const checkY = Math.floor(this.player.y + dy * 1.5);
            this.openDoor(checkX, checkY);
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }
    
    handleMouseMove(e) {
        if (this.mouseLocked) {
            this.player.angle += e.movementX * 0.002;
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
    
    update() {
        this.updateDoors();
        
        const moveX = Math.cos(this.player.angle) * this.player.moveSpeed;
        const moveY = Math.sin(this.player.angle) * this.player.moveSpeed;
        const strafeX = Math.cos(this.player.angle + Math.PI/2) * this.player.moveSpeed;
        const strafeY = Math.sin(this.player.angle + Math.PI/2) * this.player.moveSpeed;
        
        // Movement
        if (this.keys['w']) {
            if (this.canMove(this.player.x + moveX, this.player.y + moveY)) {
                this.player.x += moveX;
                this.player.y += moveY;
            }
        }
        if (this.keys['s']) {
            if (this.canMove(this.player.x - moveX, this.player.y - moveY)) {
                this.player.x -= moveX;
                this.player.y -= moveY;
            }
        }
        if (this.keys['a']) {
            if (this.canMove(this.player.x - strafeX, this.player.y - strafeY)) {
                this.player.x -= strafeX;
                this.player.y -= strafeY;
            }
        }
        if (this.keys['d']) {
            if (this.canMove(this.player.x + strafeX, this.player.y + strafeY)) {
                this.player.x += strafeX;
                this.player.y += strafeY;
            }
        }
        
        // Rotation
        if (this.keys['arrowleft'] || this.keys['q']) {
            this.player.angle -= this.player.rotSpeed;
        }
        if (this.keys['arrowright'] || this.keys['e']) {
            this.player.angle += this.player.rotSpeed;
        }
    }
    
    canMove(x, y) {
        const mapX = Math.floor(x);
        const mapY = Math.floor(y);
        
        if (!this.map || mapY < 0 || mapY >= this.map.length || 
            mapX < 0 || mapX >= this.map[0].length) {
            return false;
        }
        
        const cell = this.map[mapY][mapX];
        
        // Check if it's a door
        if (cell >= 5 && cell <= 7) {
            const key = `${mapX},${mapY}`;
            const door = this.doors.get(key);
            return door && door.openAmount > 0.5;
        }
        
        return cell === 0 || cell === 9; // Floor or exit
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ceiling
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height / 2);
        
        // Draw floor
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
        
        // Cast rays
        for (let ray = 0; ray < this.rayCount; ray++) {
            const rayAngle = this.player.angle - this.player.fov / 2 + 
                           (ray / this.rayCount) * this.player.fov;
            
            const hit = this.castRay(rayAngle);
            
            if (hit) {
                this.drawWallSlice(ray, hit);
            }
        }
    }
    
    castRay(angle) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        let distance = 0;
        let hitWall = false;
        let wallType = 0;
        let hitX, hitY, textureX;
        
        while (!hitWall && distance < this.maxDepth) {
            distance += 0.05;
            
            const testX = this.player.x + cos * distance;
            const testY = this.player.y + sin * distance;
            
            const mapX = Math.floor(testX);
            const mapY = Math.floor(testY);
            
            if (mapY < 0 || mapY >= this.map.length || 
                mapX < 0 || mapX >= this.map[0].length) {
                hitWall = true;
                wallType = 1;
            } else {
                const cell = this.map[mapY][mapX];
                
                if (cell > 0) {
                    // Check if door
                    if (cell >= 5 && cell <= 7) {
                        const key = `${mapX},${mapY}`;
                        const door = this.doors.get(key);
                        if (!door || door.openAmount < 1) {
                            hitWall = true;
                            wallType = cell;
                        }
                    } else {
                        hitWall = true;
                        wallType = cell;
                    }
                    
                    if (hitWall) {
                        hitX = testX;
                        hitY = testY;
                        
                        // Calculate texture X coordinate
                        const hitSide = Math.abs(testX - mapX - 0.5) > Math.abs(testY - mapY - 0.5);
                        textureX = hitSide ? (testY % 1) : (testX % 1);
                    }
                }
            }
        }
        
        if (!hitWall) return null;
        
        // Fish-eye correction
        distance *= Math.cos(angle - this.player.angle);
        
        return { distance, wallType, textureX };
    }
    
    drawWallSlice(rayIndex, hit) {
        const wallHeight = (this.canvas.height / hit.distance) * 0.5;
        const wallTop = (this.canvas.height - wallHeight) / 2;
        
        const x = (rayIndex / this.rayCount) * this.canvas.width;
        const sliceWidth = Math.ceil(this.canvas.width / this.rayCount);
        
        // Apply distance fog
        const shade = Math.max(0.2, 1 - (hit.distance / this.maxDepth));
        
        // Draw textured wall
        const texture = this.textures[hit.wallType] || this.textures[1];
        const textureX = Math.floor(hit.textureX * texture.width);
        
        this.ctx.save();
        this.ctx.globalAlpha = shade;
        this.ctx.drawImage(
            texture,
            textureX, 0, 1, texture.height,
            x, wallTop, sliceWidth, wallHeight
        );
        this.ctx.restore();
    }
}
