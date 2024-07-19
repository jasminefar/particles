(function() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const MAX_PARTICLES = 500;
    const colors = ['#FF5733', '#FFBD33', '#75FF33', '#33FF57', '#33FFBD', '#3375FF', '#5733FF', '#BD33FF'];
    const mouse = {
        x: undefined,
        y: undefined,
        down: false
    };
    let gravity = 0.1;
    let wind = 0.01;
    let attractStrength = 0.05;

    function init() {
        resizeCanvas();
        createControlPanel();
        animate();
        window.addEventListener('resize', resizeCanvas, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
    }

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '10px';
        controlPanel.style.left = '10px';
        controlPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        controlPanel.style.padding = '10px';
        controlPanel.style.borderRadius = '5px';
        controlPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        const gravityLabel = document.createElement('label');
        gravityLabel.textContent = 'Gravity: ';
        controlPanel.appendChild(gravityLabel);
        const gravityInput = document.createElement('input');
        gravityInput.type = 'range';
        gravityInput.min = '0';
        gravityInput.max = '1';
        gravityInput.step = '0.01';
        gravityInput.value = gravity;
        gravityInput.addEventListener('input', (e) => {
            gravity = parseFloat(e.target.value);
        });
        controlPanel.appendChild(gravityInput);

        controlPanel.appendChild(document.createElement('br'));

        const windLabel = document.createElement('label');
        windLabel.textContent = 'Wind: ';
        controlPanel.appendChild(windLabel);
        const windInput = document.createElement('input');
        windInput.type = 'range';
        windInput.min = '0';
        windInput.max = '0.1';
        windInput.step = '0.01';
        windInput.value = wind;
        windInput.addEventListener('input', (e) => {
            wind = parseFloat(e.target.value);
        });
        controlPanel.appendChild(windInput);

        controlPanel.appendChild(document.createElement('br'));

        const attractLabel = document.createElement('label');
        attractLabel.textContent = 'Attract Strength: ';
        controlPanel.appendChild(attractLabel);
        const attractInput = document.createElement('input');
        attractInput.type = 'range';
        attractInput.min = '0';
        attractInput.max = '1';
        attractInput.step = '0.01';
        attractInput.value = attractStrength;
        attractInput.addEventListener('input', (e) => {
            attractStrength = parseFloat(e.target.value);
        });
        controlPanel.appendChild(attractInput);

        document.body.appendChild(controlPanel);
    }

    function onMouseMove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        if (mouse.down) {
            emitParticles();
        }
    }

    function onMouseDown(event) {
        mouse.down = true;
    }

    function onMouseUp(event) {
        mouse.down = false;
    }

    function emitParticles() {
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
            if (particles.length > MAX_PARTICLES) {
                particles.shift();
            }
        }
    }

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.type = Math.random() > 0.5 ? 'bounce' : 'attract';
        this.trail = [];
    }

    Particle.prototype.update = function() {
        if (this.type === 'bounce') {
            this.speedY += gravity;
            this.speedX += wind;
        } else if (this.type === 'attract' && mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.speedX += (dx / distance) * attractStrength;
            this.speedY += (dy / distance) * attractStrength;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        this.size *= 0.97;
        if (this.size < 0.2) {
            this.size = 0;
        }

        this.trail.push({ x: this.x, y: this.y, size: this.size });
        if (this.trail.length > 10) {
            this.trail.shift();
        }
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        this.trail.forEach(point => {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    };

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((particle, index) => {
            particle.update();
            if (particle.size <= 0) {
                particles.splice(index, 1);
            }
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
})();
