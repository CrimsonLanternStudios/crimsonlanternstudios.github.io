/**
 * Window Lock Module for Crimson Lantern Studios Games
 * 
 * Prevents browser hotkeys from activating during gameplay by:
 * - Intercepting and blocking keyboard shortcuts (Ctrl+Tab, Ctrl+W, Alt+Tab, F5, etc.)
 * - Showing a subtle overlay indicator when the lock is active
 * - Allowing the player to unlock with Escape key
 * 
 * Usage:
 *   const lock = new WindowLock();
 *   lock.activate();  // Call when game starts or regains focus
 *   lock.deactivate(); // Call when game ends or loses focus
 *   lock.toggle();    // Toggle the lock state
 * 
 * Built for Crimson Lantern Studios
 */

class WindowLock {
    constructor(options = {}) {
        this.isActive = false;
        this.overlay = null;
        
        // Configuration options with defaults
        this.options = {
            overlayMessage: options.overlayMessage || 'Game Locked — Press Escape to unlock browser controls',
            zIndex: options.zIndex || 10000,
            onActivate: options.onActivate || null,
            onDeactivate: options.onDeactivate || null,
            autoActivateOnFocus: options.autoActivateOnFocus !== false,
            ...options
        };
        
        // Bind methods to preserve context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        
        // Create overlay element
        this.createOverlay();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Create the overlay element with styles
     */
    createOverlay() {
        // Check if overlay already exists
        if (document.getElementById('window-lock-overlay')) {
            this.overlay = document.getElementById('window-lock-overlay');
            return;
        }
        
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.id = 'window-lock-overlay';
        this.overlay.innerHTML = `
            <span class="window-lock-icon">🔒</span>
            <span class="window-lock-message">${this.options.overlayMessage}</span>
        `;
        
        // Apply styles
        this.applyStyles();
        
        // Add to DOM
        document.body.appendChild(this.overlay);
    }
    
    /**
     * Apply CSS styles to the overlay
     */
    applyStyles() {
        // Check if styles already exist
        if (document.getElementById('window-lock-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'window-lock-styles';
        style.textContent = `
            #window-lock-overlay {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.75);
                color: #fff;
                padding: 8px 16px;
                border-radius: 20px;
                font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
                font-size: 12px;
                z-index: ${this.options.zIndex};
                display: none;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(139, 0, 0, 0.5);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            
            #window-lock-overlay.active {
                display: flex;
                opacity: 0.85;
            }
            
            #window-lock-overlay .window-lock-icon {
                font-size: 14px;
            }
            
            #window-lock-overlay .window-lock-message {
                color: #ddd;
                letter-spacing: 0.5px;
            }
            
            /* Fade out after a few seconds but keep active */
            #window-lock-overlay.active.faded {
                opacity: 0.4;
            }
            
            #window-lock-overlay.active:hover {
                opacity: 0.9;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for visibility changes (tab switching)
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Listen for window blur/focus
        window.addEventListener('blur', this.handleBlur);
        window.addEventListener('focus', this.handleFocus);
    }
    
    /**
     * Handle keydown events to block browser hotkeys
     */
    handleKeyDown(e) {
        if (!this.isActive) return;
        
        // Escape key - deactivate the lock
        if (e.key === 'Escape') {
            this.deactivate();
            return;
        }
        
        // Block browser hotkeys
        const blockedKeys = this.getBlockedKeyCombinations(e);
        
        if (blockedKeys) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    /**
     * Check if the key combination should be blocked
     */
    getBlockedKeyCombinations(e) {
        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;
        const alt = e.altKey;
        const shift = e.shiftKey;
        
        // Block Ctrl combinations (browser shortcuts)
        if (ctrl) {
            // Ctrl+Tab, Ctrl+Shift+Tab - switch tabs
            if (key === 'tab') return true;
            // Ctrl+W - close tab
            if (key === 'w') return true;
            // Ctrl+T - new tab
            if (key === 't') return true;
            // Ctrl+N - new window
            if (key === 'n') return true;
            // Ctrl+R - refresh
            if (key === 'r') return true;
            // Ctrl+S - save page
            if (key === 's') return true;
            // Ctrl+P - print
            if (key === 'p') return true;
            // Ctrl+F - find
            if (key === 'f') return true;
            // Ctrl+G - find next (in some browsers)
            if (key === 'g') return true;
            // Ctrl+H - history
            if (key === 'h') return true;
            // Ctrl+J - downloads
            if (key === 'j') return true;
            // Ctrl+K - search bar
            if (key === 'k') return true;
            // Ctrl+L - address bar
            if (key === 'l') return true;
            // Ctrl+O - open file
            if (key === 'o') return true;
            // Ctrl+U - view source
            if (key === 'u') return true;
            // Ctrl+D - bookmark
            if (key === 'd') return true;
            // Ctrl+B - bookmarks
            if (key === 'b') return true;
            // Ctrl+E - search
            if (key === 'e') return true;
            // Ctrl+Shift+I - developer tools
            if (shift && key === 'i') return true;
            // Ctrl+Shift+J - developer console
            if (shift && key === 'j') return true;
            // Ctrl+Shift+C - inspect element
            if (shift && key === 'c') return true;
            // Ctrl+number - switch to tab
            if (/^[1-9]$/.test(key)) return true;
        }
        
        // Block Alt combinations
        if (alt) {
            // Alt+Tab - switch windows (handled by OS, but we try)
            if (key === 'tab') return true;
            // Alt+F4 - close window
            if (key === 'f4') return true;
            // Alt+Left/Right - browser navigation
            if (key === 'arrowleft' || key === 'arrowright') return true;
            // Alt+Home - home page
            if (key === 'home') return true;
            // Alt+D - address bar
            if (key === 'd') return true;
        }
        
        // Block function keys
        // F1 - help
        if (key === 'f1') return true;
        // F3 - find
        if (key === 'f3') return true;
        // F5 - refresh
        if (key === 'f5') return true;
        // F6 - address bar
        if (key === 'f6') return true;
        // F7 - caret browsing
        if (key === 'f7') return true;
        // F11 - fullscreen (allow this one for games)
        // if (key === 'f11') return true;
        // F12 - developer tools
        if (key === 'f12') return true;
        
        return false;
    }
    
    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - auto deactivate
            if (this.isActive) {
                this.deactivate();
            }
        }
        // Note: We don't auto-reactivate on visibility change to let the game control this behavior
    }
    
    /**
     * Handle window blur
     */
    handleBlur() {
        // Auto deactivate when window loses focus
        if (this.isActive) {
            this.deactivate();
        }
    }
    
    /**
     * Handle window focus
     */
    handleFocus() {
        // The game should decide when to reactivate
        // This is just a hook for future use
    }
    
    /**
     * Activate the window lock
     */
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        // Add keydown listener with capture to intercept before other handlers
        document.addEventListener('keydown', this.handleKeyDown, true);
        
        // Show overlay
        if (this.overlay) {
            this.overlay.classList.add('active');
            this.overlay.classList.remove('faded');
            
            // Fade the overlay after 3 seconds
            this.fadeTimeout = setTimeout(() => {
                if (this.overlay && this.isActive) {
                    this.overlay.classList.add('faded');
                }
            }, 3000);
        }
        
        // Call activation callback
        if (typeof this.options.onActivate === 'function') {
            this.options.onActivate();
        }
        
        console.log('Window Lock: Activated');
    }
    
    /**
     * Deactivate the window lock
     */
    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        // Remove keydown listener
        document.removeEventListener('keydown', this.handleKeyDown, true);
        
        // Clear fade timeout
        if (this.fadeTimeout) {
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;
        }
        
        // Hide overlay
        if (this.overlay) {
            this.overlay.classList.remove('active');
            this.overlay.classList.remove('faded');
        }
        
        // Call deactivation callback
        if (typeof this.options.onDeactivate === 'function') {
            this.options.onDeactivate();
        }
        
        console.log('Window Lock: Deactivated');
    }
    
    /**
     * Toggle the window lock state
     */
    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }
    
    /**
     * Check if the lock is currently active
     */
    isLocked() {
        return this.isActive;
    }
    
    /**
     * Update the overlay message
     */
    setMessage(message) {
        this.options.overlayMessage = message;
        if (this.overlay) {
            const messageEl = this.overlay.querySelector('.window-lock-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }
    
    /**
     * Clean up the module
     */
    destroy() {
        this.deactivate();
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('blur', this.handleBlur);
        window.removeEventListener('focus', this.handleFocus);
        
        // Remove overlay
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        
        // Remove styles
        const styles = document.getElementById('window-lock-styles');
        if (styles && styles.parentNode) {
            styles.parentNode.removeChild(styles);
        }
    }
}

// Export for module systems, but also make available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowLock;
}
