// ============================================================
// PARAMETRES
// ============================================================

const E0 = 1.0;

let time = 0;
let playing = true;


// ============================================================
// ELEMENTS HTML
// ============================================================

const slider = document.getElementById("thetaSlider");
const thetaValue = document.getElementById("thetaValue");

const ExValue = document.getElementById("ExValue");
const EyValue = document.getElementById("EyValue");
const EoutValue = document.getElementById("EoutValue");
const IValue = document.getElementById("IValue");
const averageValue = document.getElementById("averageValue");

const playButton = document.getElementById("playButton");


// ============================================================
// CANVAS DU CADRAN OXY
// ============================================================

const canvas = document.getElementById("polarisationCanvas");
const ctx = canvas.getContext("2d");

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const scale = 170;


// ============================================================
// CANVAS DU GRAPHE
// ============================================================

const graphCanvas = document.getElementById("intensityCanvas");
const graph = graphCanvas.getContext("2d");


// ============================================================
// CONVERSION COORDONNEES
// ============================================================

function X(x) {
    return cx + x * scale;
}

function Y(y) {
    return cy - y * scale;
}


// ============================================================
// DESSIN D'UNE FLECHE
// ============================================================

function drawArrow(x1, y1, x2, y2, color, width) {

    const head = 12;

    const angle = Math.atan2(
        y2 - y1,
        x2 - x1
    );

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    // Corps de la flèche
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();

    // Pointe
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
// CADRAN OXY
// ============================================================

function drawPolarisation(thetaDeg) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // GRILLE
    // --------------------------------------------------------

    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 1;

    for (let i = -1; i <= 1; i += 0.5) {

        // verticale
        ctx.beginPath();

        ctx.moveTo(
            X(i),
            Y(-1.2)
        );

        ctx.lineTo(
            X(i),
            Y(1.2)
        );

        ctx.stroke();


        // horizontale
        ctx.beginPath();

        ctx.moveTo(
            X(-1.2),
            Y(i)
        );

        ctx.lineTo(
            X(1.2),
            Y(i)
        );

        ctx.stroke();
    }


    // --------------------------------------------------------
    // AXE X
    // --------------------------------------------------------

    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        X(-1.2),
        Y(0)
    );

    ctx.lineTo(
        X(1.2),
        Y(0)
    );

    ctx.stroke();


    // --------------------------------------------------------
    // AXE Y
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.moveTo(
        X(0),
        Y(-1.2)
    );

    ctx.lineTo(
        X(0),
        Y(1.2)
    );

    ctx.stroke();


    // --------------------------------------------------------
    // CERCLE DE POLARISATION
    // --------------------------------------------------------

    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 2;

    ctx.setLineDash([6, 6]);

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        scale * E0,
        0,
        2 * Math.PI
    );

    ctx.stroke();

    ctx.setLineDash([]);


    // --------------------------------------------------------
    // ANGLE DU POLARISEUR
    // --------------------------------------------------------

    const theta =
        thetaDeg * Math.PI / 180;

    const ux = Math.cos(theta);
    const uy = Math.sin(theta);


    // --------------------------------------------------------
    // AXE DU POLARISEUR
    // --------------------------------------------------------

    ctx.strokeStyle = "#8e44ad";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        X(-1.2 * ux),
        Y(-1.2 * uy)
    );

    ctx.lineTo(
        X(1.2 * ux),
        Y(1.2 * uy)
    );

    ctx.stroke();


    // --------------------------------------------------------
    // CHAMP INCIDENT
    // --------------------------------------------------------

    const Ex =
        E0 * Math.cos(time);

    const Ey =
        E0 * Math.sin(time);


    drawArrow(
        ctx,
        cx,
        cy,
        X(Ex),
        Y(Ey),
        "#e74c3c",
        4
    );


    // Point rouge
    ctx.fillStyle = "#e74c3c";

    ctx.beginPath();

    ctx.arc(
        X(Ex),
        Y(Ey),
        6,
        0,
        2 * Math.PI
    );

    ctx.fill();


    // --------------------------------------------------------
    // PROJECTION
    // --------------------------------------------------------

    const Eout =
        Ex * ux +
        Ey * uy;

    const ExProj =
        Eout * ux;

    const EyProj =
        Eout * uy;


    drawArrow(
        ctx,
        cx,
        cy,
        X(ExProj),
        Y(EyProj),
        "#27ae60",
        5
    );


    // --------------------------------------------------------
    // TEXTES
    // --------------------------------------------------------

    ctx.fillStyle = "#222222";
    ctx.font = "15px Arial";

    ctx.fillText(
        "x",
        X(1.15),
        Y(0) - 8
    );

    ctx.fillText(
        "y",
        X(0) + 8,
        Y(1.15)
    );

    ctx.fillText(
        "θ = " + thetaDeg.toFixed(0) + "°",
        15,
        25
    );

    ctx.fillStyle = "#e74c3c";

    ctx.fillText(
        "E incident",
        15,
        48
    );

    ctx.fillStyle = "#27ae60";

    ctx.fillText(
        "E sortie",
        15,
        68
    );

    ctx.fillStyle = "#8e44ad";

    ctx.fillText(
        "Axe analyseur",
        15,
        88
    );
}


// ============================================================
// GRAPHE I(theta)
// ============================================================

function drawGraph(thetaDeg, Iinst) {

    const width = graphCanvas.width;
    const height = graphCanvas.height;

    graph.clearRect(
        0,
        0,
        width,
        height
    );


    // Marges
    const left = 70;
    const right = 25;
    const top = 35;
    const bottom = 60;

    const plotWidth =
        width - left - right;

    const plotHeight =
        height - top - bottom;


    // Conversion theta -> x
    function graphX(theta) {

        return left +
            theta / 360 *
            plotWidth;
    }


    // Conversion intensité -> y
    function graphY(I) {

        return top +
            (1.1 - I) / 1.1 *
            plotHeight;
    }


    // --------------------------------------------------------
    // GRILLE
    // --------------------------------------------------------

    graph.strokeStyle = "#dddddd";
    graph.lineWidth = 1;

    for (let I = 0; I <= 1; I += 0.25) {

        const y = graphY(I);

        graph.beginPath();

        graph.moveTo(left, y);
        graph.lineTo(width - right, y);

        graph.stroke();


        graph.fillStyle = "#555555";
        graph.font = "12px Arial";

        graph.fillText(
            I.toFixed(2),
            25,
            y + 4
        );
    }


    // --------------------------------------------------------
    // AXES
    // --------------------------------------------------------

    graph.strokeStyle = "#222222";
    graph.lineWidth = 2;

    graph.beginPath();

    graph.moveTo(left, top);

    graph.lineTo(left, height - bottom);

    graph.lineTo(width - right, height - bottom);

    graph.stroke();


    // --------------------------------------------------------
    // VALEURS THETA
    // --------------------------------------------------------

    graph.fillStyle = "#222222";
    graph.font = "13px Arial";

    for (
        let theta = 0;
        theta <= 360;
        theta += 60
    ) {

        const x = graphX(theta);

        graph.fillText(
            theta + "°",
            x - 10,
            height - 35
        );
    }


    // --------------------------------------------------------
    // COURBE MOYENNE
    // --------------------------------------------------------

    const Iavg =
        E0 * E0 / 2;

    graph.strokeStyle = "#2471a3";
    graph.lineWidth = 3;

    graph.beginPath();

    for (
        let theta = 0;
        theta <= 360;
        theta++
    ) {

        const x =
            graphX(theta);

        const y =
            graphY(Iavg);

        if (theta === 0) {

            graph.moveTo(x, y);

        } else {

            graph.lineTo(x, y);
        }
    }

    graph.stroke();


    // --------------------------------------------------------
    // POINT ROUGE
    // --------------------------------------------------------

    const px =
        graphX(thetaDeg);

    const py =
        graphY(Iinst);

    graph.fillStyle = "#e74c3c";

    graph.beginPath();

    graph.arc(
        px,
        py,
        7,
        0,
        2 * Math.PI
    );

    graph.fill();


    // --------------------------------------------------------
    // TITRE AXE X
    // --------------------------------------------------------

    graph.fillStyle = "#222222";
    graph.font = "14px Arial";

    graph.fillText(
        "θ : angle du polariseur (°)",
        width / 2 - 80,
        height - 10
    );


    // --------------------------------------------------------
    // LEGENDE
    // --------------------------------------------------------

    graph.strokeStyle = "#2471a3";
    graph.lineWidth = 3;

    graph.beginPath();

    graph.moveTo(
        left + 20,
        top + 15
    );

    graph.lineTo(
        left + 45,
        top + 15
    );

    graph.stroke();


    graph.fillStyle = "#222222";
    graph.font = "13px Arial";

    graph.fillText(
        "I moyenne = E₀² / 2",
        left + 55,
        top + 20
    );


    graph.fillStyle = "#e74c3c";

    graph.beginPath();

    graph.arc(
        left + 32,
        top + 42,
        5,
        0,
        2 * Math.PI
    );

    graph.fill();


    graph.fillStyle = "#222222";

    graph.fillText(
        "I(t,θ) instantanée",
        left + 55,
        top + 47
    );
}


// ============================================================
// MISE A JOUR
// ============================================================

function update() {

    const thetaDeg =
        Number(thetaSlider.value);

    const theta =
        thetaDeg * Math.PI / 180;


    // Champ incident

    const Ex =
        E0 * Math.cos(time);

    const Ey =
        E0 * Math.sin(time);


    // Projection

    const Eout =
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta);


    // Intensité instantanée

    const Iinst =
        Eout * Eout;


    // Intensité moyenne

    const Iavg =
        E0 * E0 / 2;


    // Affichage

    thetaValue.textContent =
        thetaDeg.toFixed(0) + "°";

    ExValue.textContent =
        Ex.toFixed(3);

    EyValue.textContent =
        Ey.toFixed(3);

    EoutValue.textContent =
        Eout.toFixed(3);

    IValue.textContent =
        Iinst.toFixed(3);

    averageValue.textContent =
        Iavg.toFixed(3);


    // Dessins

    drawPolarisation(thetaDeg);

    drawGraph(
        thetaDeg,
        Iinst
    );
}


// ============================================================
// CURSEUR
// ============================================================

thetaSlider.addEventListener(
    "input",
    update
);


// ============================================================
// BOUTON PLAY / PAUSE
// ============================================================

playButton.addEventListener(
    "click",
    function() {

        playing = !playing;

        if (playing) {

            playButton.textContent =
                "⏸ Pause";

        } else {

            playButton.textContent =
                "▶ Animation";
        }
    }
);


// ============================================================
// ANIMATION
// ============================================================

function animate() {

    if (playing) {

        time += 0.04;

        update();
    }

    requestAnimationFrame(animate);
}


// ============================================================
// DEMARRAGE
// ============================================================

update();

animate();
