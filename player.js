class Entity {
    constructor(container, className, x, y, width, height) {
        this.element = document.createElement('div');
        this.element.className = `entity ${className}`;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDestroyed = false;
        container.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    destroy() {
        this.element.remove();
        this.isDestroyed = true;
    }

    checkCollision(other) {
        return !(this.x + this.width < other.x ||
                this.x > other.x + other.width ||
                this.y + this.height < other.y ||
                this.y > other.y + other.height);
    }
}

class Player extends Entity {
    constructor(container) {
        const width = 40;
        const height = 20;
        super(container, 'player', 
            container.clientWidth / 2 - width / 2,
            container.clientHeight - height - 10,
            width, height);
        this.speed = 5;
        this.lives = 3;
        this.container = container;
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.x < this.container.clientWidth - this.width) {
            this.x += this.speed;
            this.updatePosition();
        }
    }

    hit() {
        this.lives--;
        this.element.style.opacity = '0.5';
        setTimeout(() => {
            this.element.style.opacity = '1';
        }, 200);
    }
}

