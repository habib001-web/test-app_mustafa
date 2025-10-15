const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let points = [];
const gravitationalAcceleration = 9.8; // m/s²
const totalPoints = 50;
let randomPoints = [];

// Initialize random points
for (let i = 0; i < totalPoints; i++) {
    randomPoints.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    points.push({ x, y });

    if (points.length === 2) {
        drawLine(points[0], points[1]);
        points = []; // Reset points after drawing
    }
});

document.getElementById('reset').addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    resetRandomPoints();
});

function drawLine(p1, p2) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.stroke();

    const interpolatedPoints = interpolate(p1, p2, 100);
    context.beginPath();
    interpolatedPoints.forEach((point, index) => {
        if (index === 0) {
            context.moveTo(point.x, point.y);
        } else {
            context.lineTo(point.x, point.y);
        }
    });
    context.strokeStyle = 'red';
    context.stroke();

    drawGravityEffect();
}

function interpolate(p1, p2, steps) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        points.push({
            x: (1 - t) * p1.x + t * p2.x,
            y: (1 - t) * p1.y + t * p2.y
        });
    }
    return points;
}

function drawGravityEffect() {
    randomPoints.forEach(point => {
        const thrust = calculateThrust(point);
        point.y += thrust; // Update y position based on thrust
        point.y = Math.min(point.y, canvas.height); // Prevent going below the canvas
        drawPoint(point);
    });
}

function calculateThrust(point) {
    // Higher y values generate lower thrust
    return gravitationalAcceleration * (1 - (point.y / canvas.height));
}

function drawPoint(point) {
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(point.x, point.y, 5, 0, Math.PI * 2);
    context.fill();
}

function resetRandomPoints() {
    randomPoints = [];
    for (let i = 0; i < totalPoints; i++) {
        randomPoints.push({ x: Math.random() * canvas.width, y: 0 }); // Reset to the top of the canvas
    }
}