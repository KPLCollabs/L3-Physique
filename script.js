// ============================================================
// PARAMÈTRES
// ============================================================

const E0 = 1.0;

// Temps de la polarisation circulaire
let t = 0;

// Angle de l'analyseur
let thetaDeg = 0;


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const intensityCanvas =
    document.getElementById("intensityCanvas");

const vectorCanvas =
    document.getElementById("vectorCanvas");

const thetaSlider =
    document.getElementById("thetaSlider");

const thetaValue =
    document.getElementById("thetaValue");

const thetaDisplay =
    document.getElementById("thetaDisplay");

const exDisplay =
    document.getElementById("exDisplay");

const eyDisplay =
    document.getElementById("eyDisplay");

const esortieDisplay =
    document.getElementById("esortieDisplay");

const intensityDisplay =
    document.getElementById("intensityDisplay");


// ============================================================
// CONTEXTES CANVAS
// ============================================================

const ctxI = intensityCanvas.getContext("2d");
const ctxV = vectorCanvas.getContext("2d");


// ============================================================
// REDIMENSIONNEMENT DES CANVAS
// ============================================================

function resizeCanvas(canvas, ctx) {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resizeAll() {
    resizeCanvas(intensityCanvas, ctxI);
    resizeCanvas(vectorCanvas, ctxV);
}

window.addEventListener("resize", resizeAll);

resizeAll();


// ============================================================
// FONCTION INTENSITÉ
// ============================================================

function intensity(theta, alpha) {

    const Ex = E0 * Math.cos(alpha);
    const Ey = E0 * Math.sin(alpha);

    const Eproj =
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta);

    return Eproj * Eproj;
}


// ============================================================
// DESSIN DU GRAPHE I(theta)
// ============================================================

function drawIntensityGraph() {

    const width = intensityCanvas.clientWidth;
    const height = intensityCanvas.clientHeight;

    ctxI.clearRect(0, 0, width, height);

    const margin = {
        left: 55,
        right: 20,
        top: 20,
        bottom: 45
    };

    const graphWidth =
        width - margin.left - margin.right;

    const graphHeight =
        height - margin.top - margin.bottom;


    // --------------------------------------------------------
    // Fond
    // --------------------------------------------------------

    ctxI.fillStyle = "#ffffff";
    ctxI.fillRect(0, 0, width, height);


    // --------------------------------------------------------
    // Axes
    // --------------------------------------------------------

    ctxI.strokeStyle = "#9ca3af";
    ctxI.lineWidth = 1;

    ctxI.beginPath();

    ctxI.moveTo(
        margin.left,
        margin.top
    );

    ctxI.lineTo(
        margin.left,
        margin.top + graphHeight
    );

    ctxI.lineTo(
        margin.left + graphWidth,
        margin.top + graphHeight
    );

    ctxI.stroke();


    // --------------------------------------------------------
    // Grille
    // --------------------------------------------------------

    ctxI.strokeStyle = "#e5e7eb";

    for (let i = 0; i <= 6; i++) {

        const x =
            margin.left +
            graphWidth * i / 6;

        ctxI.beginPath();

        ctxI.moveTo(x, margin.top);
        ctxI.lineTo(
            x,
            margin.top + graphHeight
        );

        ctxI.stroke();

        ctxI.fillStyle = "#6b7280";
        ctxI.font = "12px Arial";
        ctxI.textAlign = "center";

        ctxI.fillText(
            `${i * 60}°`,
            x,
            height - 18
        );
    }


    // --------------------------------------------------------
    // Courbe
    // --------------------------------------------------------

    ctxI.strokeStyle = "#2563eb";
    ctxI.lineWidth = 2.5;

    ctxI.beginPath();

    for (let i = 0; i <= 500; i++) {

        const theta =
            2 * Math.PI * i / 500;

        const I =
            intensity(theta, t);

        const x =
            margin.left +
            theta / (2 * Math.PI) * graphWidth;

        const y =
            margin.top +
            graphHeight -
            I * graphHeight;

        if (i === 0) {
            ctxI.moveTo(x, y);
        } else {
            ctxI.lineTo(x, y);
        }
    }

    ctxI.stroke();


    // --------------------------------------------------------
    // Point correspondant à theta
    // --------------------------------------------------------

    const theta =
        thetaDeg * Math.PI / 180;

    const I =
        intensity(theta, t);

    const x =
        margin.left +
        theta / (2 * Math.PI) * graphWidth;

    const y =
        margin.top +
        graphHeight -
        I * graphHeight;

    ctxI.fillStyle = "#ef4444";

    ctxI.beginPath();

    ctxI.arc(x, y, 7, 0, 2 * Math.PI);

    ctxI.fill();


    // --------------------------------------------------------
    // Labels
    // --------------------------------------------------------

    ctxI.fillStyle = "#374151";
    ctxI.font = "14px Arial";

    ctxI.textAlign = "center";

    ctxI.fillText(
        "θ (degrés)",
        margin.left + graphWidth / 2,
        height - 2
    );

    ctxI.save();

    ctxI.translate(15, margin.top + graphHeight / 2);
    ctxI.rotate(-Math.PI / 2);

    ctxI.fillText(
        "I",
        0,
        0
    );

    ctxI.();
}


// ============================================================
// DESSIN DU CADRAN OXY
// ============================================================

function drawVectorDiagram() {

    const width = vectorCanvas.clientWidth;
    const height = vectorCanvas.clientHeight;

    ctxV.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const scale =
        Math.min(width, height) * 0.36;


    // --------------------------------------------------------
    // Fond
    // --------------------------------------------------------

    ctxV.fillStyle = "#ffffff";
    ctxV.fillRect(0, 0, width, height);


    // --------------------------------------------------------
    // Cercle de polarisation
    // --------------------------------------------------------

    ctxV.strokeStyle = "#d1d5db";
    ctxV.lineWidth = 1;
    ctxV.setLineDash([5, 5]);

    ctxV.beginPath();

    ctxV.arc(
        cx,
        cy,
        scale,
        0,
        2 * Math.PI
    );

    ctxV.stroke();

    ctxV.setLineDash([]);


    // --------------------------------------------------------
    // Axes x et y
    // --------------------------------------------------------

    ctxV.strokeStyle = "#374151";
    ctxV.lineWidth = 1.5;

    // x

    ctxV.beginPath();

    ctxV.moveTo(cx - scale * 1.2, cy);
    ctxV.lineTo(cx + scale * 1.2, cy);

    ctxV.stroke();

    // y

    ctxV.beginPath();

    ctxV.moveTo(cx, cy + scale * 1.2);
    ctxV.lineTo(cx, cy - scale * 1.2);

    ctxV.stroke();


    // Flèche x
    drawArrow(
        ctxV,
        cx + scale * 1.2,
        cy,
        cx + scale * 1.05,
        cy,
        "#374151"
    );

    // Flèche y
    drawArrow(
        ctxV,
        cx,
        cy - scale * 1.2,
        cx,
        cy - scale * 1.05,
        "#374151"
    );


    // Labels

    ctxV.fillStyle = "#111827";
    ctxV.font = "16px Arial";

    ctxV.fillText(
        "x",
        cx + scale * 1.15,
        cy + 20
    );

    ctxV.fillText(
        "y",
        cx + 10,
        cy - scale * 1.15
    );


    // --------------------------------------------------------
    // Champ incident circulaire
    // --------------------------------------------------------

    const Ex =
        E0 * Math.cos(t);

    const Ey =
        E0 * Math.sin(t);

    const ex =
        cx + Ex * scale;

    const ey =
        cy - Ey * scale;


    // --------------------------------------------------------
    // Projections Ex et Ey
    // --------------------------------------------------------

    ctxV.setLineDash([5, 5]);

    ctxV.lineWidth = 2;

    // Projection x

    ctxV.strokeStyle = "#3b82f6";

    ctxV.beginPath();

    ctxV.moveTo(cx, cy);
    ctxV.lineTo(ex, cy);

    ctxV.stroke();


    // Projection y

    ctxV.strokeStyle = "#10b981";

    ctxV.beginPath();

    ctxV.moveTo(ex, cy);
    ctxV.lineTo(ex, ey);

    ctxV.stroke();

    ctxV.setLineDash([]);


    // --------------------------------------------------------
    // Axe de l'analyseur
    // --------------------------------------------------------

    const theta =
        thetaDeg * Math.PI / 180;

    const ux = Math.cos(theta);
    const uy = Math.sin(theta);

    ctxV.strokeStyle = "#8b5cf6";
    ctxV.lineWidth = 3;

    ctxV.beginPath();

    ctxV.moveTo(
        cx - ux * scale * 1.1,
        cy + uy * scale * 1.1
    );

    ctxV.lineTo(
        cx + ux * scale * 1.1,
        cy - uy * scale * 1.1
    );

    ctxV.stroke();


    // --------------------------------------------------------
    // Projection du champ sur l'analyseur
    // --------------------------------------------------------

    const Eproj =
        Ex * ux +
        Ey * uy;

    const px =
        cx + Eproj * ux * scale;

    const py =
        cy - Eproj * uy * scale;

    drawArrow(
        ctxV,
        cx,
        cy,
        px,
        py,
        "#10b981",
        4
    );


    // --------------------------------------------------------
    // Champ incident
    // --------------------------------------------------------

    drawArrow(
        ctxV,
        cx,
        cy,
        ex,
        ey,
        "#ef4444",
        4
    );


    // Point à l'extrémité du champ

    ctxV.fillStyle = "#ef4444";

    ctxV.beginPath();

    ctxV.arc(
        ex,
        ey,
        6,
        0,
        2 * Math.PI
    );

    ctxV.fill();


    // --------------------------------------------------------
    // Labels
    // --------------------------------------------------------

    ctxV.fillStyle = "#3b82f6";
    ctxV.font = "14px Arial";

    ctxV.fillText(
        "Ex",
        cx + (ex - cx) / 2,
        cy + 20
    );

    ctxV.fillStyle = "#10b981";

    ctxV.fillText(
        "Ey",
        ex + 8,
        cy + (ey - cy) / 2
    );

    ctxV.fillStyle = "#8b5cf6";

    ctxV.fillText(
        "analyseur",
        cx + ux * scale * 0.7,
        cy - uy * scale * 0.7
    );
}


// ============================================================
// FONCTION POUR DESSINER UNE FLÈCHE
// ============================================================

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    lineWidth = 2
) {

    const angle =
        Math.atan2(y2 - y1, x2 - x1);

    const head = 10;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 - head * Math.cos(angle - Math.PI / 6),
        y2 - head * Math.sin(angle - Math.PI / 6)
    );

    ctx.lineTo(
        x2 - head * Math.cos(angle + Math.PI / 6),
        y2 - head * Math.sin(angle + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fill();
}


// ============================================================
// MISE À JOUR DES VALEURS
// ============================================================

function updateValues() {

    const theta =
        thetaDeg * Math.PI / 180;

    const Ex =
        E0 * Math.cos(t);

    const Ey =
        E0 * Math.sin(t);

    const Eproj =
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta);

    const I =
        Eproj * Eproj;


    thetaValue.textContent =
        thetaDeg.toFixed(0);

    thetaDisplay.textContent =
        thetaDeg.toFixed(0) + "°";

    exDisplay.textContent =
        Ex.toFixed(2);

    eyDisplay.textContent =
        Ey.toFixed(2);

    esortieDisplay.textContent =
        Eproj.toFixed(2);

    intensityDisplay.textContent =
        I.toFixed(2);
}


// ============================================================
// CURSEUR THETA
// ============================================================

thetaSlider.addEventListener("input", function () {

    thetaDeg =
        Number(thetaSlider.value);

    updateValues();

    drawIntensityGraph();

    drawVectorDiagram();
});


// ============================================================
// ANIMATION
// ============================================================
function animate() {

    // Le temps sert uniquement à faire tourner
    // le champ électrique incident
    t += 0.025;

    updateValues();

    drawIntensityGraph();

    drawVectorDiagram();

    requestAnimationFrame(animate);
}


animate();
