const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let points = [];

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