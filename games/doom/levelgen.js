// Crimson Doom - BSP Level Generator
// Binary Space Partitioning for DOOM-style levels

class BSPNode {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = null;
        this.right = null;
        this.room = null;
        this.corridor = null;
    }
    
    split(minSize = 6, maxSize = 12) {
        // Stop splitting if too small
        if (this.width < minSize * 2 || this.height < minSize * 2) {
            return false;
        }
        
        // Decide split direction
        const splitHorizontal = Math.random() > 0.5;
        
        if (this.width > this.height && this.width / this.height >= 1.25) {
            // Force vertical split if too wide
            return this.splitVertical(minSize);
        } else if (this.height > this.width && this.height / this.width >= 1.25) {
            // Force horizontal split if too tall
            return this.splitHorizontal(minSize);
        }
        
        return splitHorizontal ? 
            this.splitHorizontal(minSize) : 
            this.splitVertical(minSize);
    }
    
    splitHorizontal(minSize) {
        const maxSplit = this.height - minSize;
        if (maxSplit < minSize) return false;
        
        const split = minSize + Math.floor(Math.random() * (maxSplit - minSize));
        
        this.left = new BSPNode(this.x, this.y, this.width, split);
        this.right = new BSPNode(this.x, this.y + split, this.width, this.height - split);
        
        return true;
    }
    
    splitVertical(minSize) {
        const maxSplit = this.width - minSize;
        if (maxSplit < minSize) return false;
        
        const split = minSize + Math.floor(Math.random() * (maxSplit - minSize));
        
        this.left = new BSPNode(this.x, this.y, split, this.height);
        this.right = new BSPNode(this.x + split, this.y, this.width - split, this.height);
        
        return true;
    }
    
    createRooms(minRoomSize = 4, maxRoomSize = 8) {
        if (this.left || this.right) {
            // Not a leaf, recurse
            if (this.left) this.left.createRooms(minRoomSize, maxRoomSize);
            if (this.right) this.right.createRooms(minRoomSize, maxRoomSize);
            
            // Create corridor between children's rooms
            if (this.left && this.right) {
                this.createCorridor();
            }
        } else {
            // Leaf node - create a room
            const roomWidth = minRoomSize + Math.floor(Math.random() * (Math.min(this.width - 2, maxRoomSize) - minRoomSize + 1));
            const roomHeight = minRoomSize + Math.floor(Math.random() * (Math.min(this.height - 2, maxRoomSize) - minRoomSize + 1));
            
            const roomX = this.x + 1 + Math.floor(Math.random() * (this.width - roomWidth - 1));
            const roomY = this.y + 1 + Math.floor(Math.random() * (this.height - roomHeight - 1));
            
            this.room = {
                x: roomX,
                y: roomY,
                width: roomWidth,
                height: roomHeight,
                center: {
                    x: roomX + Math.floor(roomWidth / 2),
                    y: roomY + Math.floor(roomHeight / 2)
                }
            };
        }
    }
    
    createCorridor() {
        const leftRoom = this.left.getRoom();
        const rightRoom = this.right.getRoom();
        
        if (!leftRoom || !rightRoom) return;
        
        const start = leftRoom.center;
        const end = rightRoom.center;
        
        // Create L-shaped corridor
        this.corridor = {
            points: [
                start,
                { x: start.x, y: end.y },
                end
            ]
        };
    }
    
    getRoom() {
        if (this.room) return this.room;
        
        let leftRoom = this.left ? this.left.getRoom() : null;
        let rightRoom = this.right ? this.right.getRoom() : null;
        
        return leftRoom || rightRoom;
    }
    
    getAllRooms() {
        const rooms = [];
        
        if (this.room) {
            rooms.push(this.room);
        }
        
        if (this.left) {
            rooms.push(...this.left.getAllRooms());
        }
        
        if (this.right) {
            rooms.push(...this.right.getAllRooms());
        }
        
        return rooms;
    }
    
    getAllCorridors() {
        const corridors = [];
        
        if (this.corridor) {
            corridors.push(this.corridor);
        }
        
        if (this.left) {
            corridors.push(...this.left.getAllCorridors());
        }
        
        if (this.right) {
            corridors.push(...this.right.getAllCorridors());
        }
        
        return corridors;
    }
}

class LevelGenerator {
    constructor(width = 64, height = 64) {
        this.width = width;
        this.height = height;
    }
    
    generate(level = 1) {
        // Create map filled with walls
        const map = [];
        for (let y = 0; y < this.height; y++) {
            map[y] = [];
            for (let x = 0; x < this.width; x++) {
                map[y][x] = 1; // 1 = wall
            }
        }
        
        // Create BSP tree
        const root = new BSPNode(0, 0, this.width, this.height);
        
        // Split recursively
        const splitIterations = 4 + Math.floor(level / 3); // More splits = more complex
        this.splitNode(root, splitIterations);
        
        // Create rooms
        root.createRooms(4, 8);
        
        // Get all rooms and corridors
        const rooms = root.getAllRooms();
        const corridors = root.getAllCorridors();
        
        // Assign texture zones to rooms for visual variety (1-4 are wall types)
        rooms.forEach((room, index) => {
            room.wallType = (index % 4) + 1; // Cycle through wall types 1-4
        });
        
        // Carve out rooms and set surrounding wall texture
        rooms.forEach(room => {
            // Set walls around this room to its texture type
            for (let y = room.y - 1; y <= room.y + room.height; y++) {
                for (let x = room.x - 1; x <= room.x + room.width; x++) {
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        if (y < room.y || y >= room.y + room.height || 
                            x < room.x || x >= room.x + room.width) {
                            // Only set wall texture if it's still a wall
                            if (map[y][x] !== 0) {
                                map[y][x] = room.wallType;
                            }
                        }
                    }
                }
            }
            
            // Carve out the room floor
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        map[y][x] = 0; // 0 = floor
                    }
                }
            }
        });
        
        // Carve out corridors
        corridors.forEach(corridor => {
            for (let i = 0; i < corridor.points.length - 1; i++) {
                const start = corridor.points[i];
                const end = corridor.points[i + 1];
                this.carveCorridor(map, start.x, start.y, end.x, end.y);
            }
        });
        
        // Place doors in corridors
        const doors = this.placeDoors(map, rooms, corridors, level);
        
        // Place keys
        const keys = this.placeKeys(rooms, doors, level);
        
        // Place pickups
        const pickups = this.placePickups(rooms, level);
        
        // Place enemies
        const enemies = this.placeEnemies(rooms, level);
        
        // Find spawn point (first room)
        const spawnRoom = rooms[0];
        const spawn = {
            x: spawnRoom.center.x + 0.5,
            y: spawnRoom.center.y + 0.5
        };
        
        // Find exit (last room)
        const exitRoom = rooms[rooms.length - 1];
        const exit = {
            x: exitRoom.center.x,
            y: exitRoom.center.y
        };
        map[exit.y][exit.x] = 9; // 9 = exit
        
        return {
            map,
            spawn,
            exit,
            doors,
            keys,
            pickups,
            enemies,
            rooms
        };
    }
    
    splitNode(node, depth) {
        if (depth <= 0) return;
        
        if (node.split()) {
            this.splitNode(node.left, depth - 1);
            this.splitNode(node.right, depth - 1);
        }
    }
    
    carveCorridor(map, x1, y1, x2, y2) {
        const width = 2; // Corridor width
        
        if (x1 === x2) {
            // Vertical corridor
            const startY = Math.min(y1, y2);
            const endY = Math.max(y1, y2);
            for (let y = startY; y <= endY; y++) {
                for (let w = -Math.floor(width/2); w <= Math.floor(width/2); w++) {
                    const x = x1 + w;
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        map[y][x] = 0;
                    }
                }
            }
        } else {
            // Horizontal corridor
            const startX = Math.min(x1, x2);
            const endX = Math.max(x1, x2);
            for (let x = startX; x <= endX; x++) {
                for (let w = -Math.floor(width/2); w <= Math.floor(width/2); w++) {
                    const y = y1 + w;
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                        map[y][x] = 0;
                    }
                }
            }
        }
    }
    
    placeDoors(map, rooms, corridors, level) {
        const doors = [];
        const colors = ['red', 'blue', 'yellow'];
        
        // Place locked doors in some corridors
        const numDoors = Math.min(3, 1 + Math.floor(level / 2));
        
        for (let i = 0; i < numDoors && i < corridors.length; i++) {
            const corridor = corridors[Math.floor(Math.random() * corridors.length)];
            if (corridor.points.length >= 2) {
                const mid = corridor.points[1];
                const color = colors[i % colors.length];
                
                doors.push({
                    x: mid.x,
                    y: mid.y,
                    color: color,
                    locked: true
                });
                
                map[mid.y][mid.x] = 5 + i; // 5=red, 6=blue, 7=yellow door
            }
        }
        
        return doors;
    }
    
    placeKeys(rooms, doors, level) {
        const keys = [];
        
        doors.forEach((door, i) => {
            if (i < rooms.length - 1) {
                const room = rooms[i + 1];
                keys.push({
                    x: room.center.x + 0.5,
                    y: room.center.y + 0.5,
                    color: door.color
                });
            }
        });
        
        return keys;
    }
    
    placePickups(rooms, level) {
        const pickups = [];
        
        rooms.forEach((room, i) => {
            if (i > 0) {
                // Always place at least one pickup per room
                const numPickups = 1 + Math.floor(Math.random() * 2);
                
                for (let p = 0; p < numPickups; p++) {
                    const type = Math.random() < 0.4 ? 'health' : 
                                 Math.random() < 0.6 ? 'ammo' : 'armor';
                    
                    const offsetX = (Math.random() - 0.5) * (room.width - 2);
                    const offsetY = (Math.random() - 0.5) * (room.height - 2);
                    
                    pickups.push({
                        x: room.center.x + offsetX + 0.5,
                        y: room.center.y + offsetY + 0.5,
                        type: type
                    });
                }
            }
        });
        
        return pickups;
    }
    
    placeEnemies(rooms, level) {
        const enemies = [];
        const enemiesPerRoom = 1 + Math.floor(level / 2);
        
        rooms.forEach((room, i) => {
            if (i > 1) { // Skip first TWO rooms to give player breathing room
                const count = Math.floor(Math.random() * enemiesPerRoom) + 1;
                
                for (let e = 0; e < count; e++) {
                    const x = room.x + 1 + Math.random() * (room.width - 2);
                    const y = room.y + 1 + Math.random() * (room.height - 2);
                    
                    enemies.push({
                        x: x + 0.5,
                        y: y + 0.5,
                        type: 'demon'
                    });
                }
            }
        });
        
        return enemies;
    }
}
