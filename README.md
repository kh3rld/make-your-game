#  Make Your Game: Space Invaders
 
A browser-based implementation of the classic arcade game, built to demonstrate core web development and game programming concepts. This project leverages modern JavaScript to recreate the iconic 1978 gameplay.

##  Program Overview & Functionality  
**Core Systems**:  
1. **Game Loop**: `requestAnimationFrame`-driven updates  
2. **Entity Management**: Player, enemies, bullets  
3. **Collision Detection**: Grid-based hit checks  
4. **State Machine**: Pause/play/win/loss states  
5. **Rendering Pipeline**: DOM manipulation for visuals  

**Key Interactions**:  
- Player movement via keyboard events  
- Real-time bullet trajectory calculations  
- Dynamic enemy formation adjustments  

## Features  
- Classic enemy wave patterns with modern CSS animations  
- Score tracking & lives system  
- Responsive pause/restart functionality  
- Frame-rate independent movement  
- Visual feedback for hits (explosion effects)  

##  Installation & Setup  
1. Clone repo:  
   ```bash
   git clone https://github.com/kh3rld/make-your-game.git
   ```
2. Open `index.html` in any modern browser  
3. No build tools required - pure JS/CSS/HTML!

##  Learning Objectives  

###  **requestAnimationFrame**  
- Used in `gameLoop()` for browser-optimized rendering  
- Synchronizes with display refresh rate (vs `setInterval`)  
- Example:  
  ```javascript
  function gameLoop() {
    requestAnimationFrame(gameLoop);
    // Update logic
  }
  ```

###  **Event Loop**  
- Browser's main thread handling:  
  - Input events → Game state updates → Rendering  
- Demonstrated in keyboard input handling:  
  ```javascript
  document.addEventListener('keydown', handleInput);
  ```

###  **FPS Management**  
- Target 60 FPS via delta timing:  
  ```javascript
  const FRAME_INTERVAL = 1000 / 60; // 16.67ms per frame
  if (deltaTime < FRAME_INTERVAL) return;
  ```

###  **DOM Manipulation**  
- Grid creation:  
  ```javascript
  for (let i = 0; i < 225; i++) {
    grid.appendChild(document.createElement('div'));
  }
  ```
- Dynamic class updates for rendering:  
  ```javascript
  squares[pos].classList.add('enemy');
  ```

###  **Jank Prevention**  
- Techniques used:  
  - Batch DOM updates in `render()`  
  - CSS `transform` for animations (GPU-accelerated)  
  - Avoid synchronous layout thrashing  

###  **CSS Transform/Opacity**  
- Smoother animations via GPU offloading:  
  ```css
  .enemy {
    transition: transform 0.15s ease-in-out;
  }
  .boom {
    opacity: 0;
    transform: scale(1.5);
  }
  ```

###  **Browser Rendering Pipeline**  
1. **JavaScript**: Game state updates  
2. **Styles**: CSS rule calculations  
3. **Layout**: Position calculations  
4. **Paint**: Pixel filling (minimized via layers)  
5. **Composite**: Layer merging (GPU-optimized)  

###  **Developer Tools**  
- **Chrome/Firefox**:  
  - Performance profiling (identify frame drops)  
  - Layout inspector (debug grid positioning)  
  - Frame debugger (break down rendering steps)  

##  Contribution  
Contributions are welcome, feel free to  create a branch with your awesome  update or feature and submit a pull request

**Process**:  
1. Fork repository  
2. Create feature branch  
3. Submit PR with detailed description  

## Authors  
- Khalid Hussein
- Ray Muiruri
- Sheila Fana



##  License  
MIT License - See [LICENSE.md](LICENSE.md)  

