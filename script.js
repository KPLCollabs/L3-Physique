/* =========================================================
   PARAMÈTRES
   ========================================================= */

const E0 = 1.0;

let time = 0;

let playing = true;


/* =========================================================
   ÉLÉMENTS HTML
   ========================================================= */

const thetaSlider =
    document.getElementById("thetaSlider");

const thetaValue =
    document.getElementById("thetaValue");

const ExValue =
    document.getElementById("ExValue");

const EyValue =
    document.getElementById("EyValue");

const EoutValue =
    document.getElementById("EoutValue");

const IValue =
    document.getElementById("IValue");

const averageValue =
    document.getElementById("averageValue");

const playButton =
    document.getElementById("playButton");


/* =========================================================
   CANVAS OXY
   ========================================================= */

const polarisationCanvas =
    document.getElementById(
        "polarisationCanvas"
    );

const ctx =
    polarisationCanvas.getContext("2d");


/* =========================================================
   CANVAS GRAPHE
   ========================================================= */

const intensityCanvas =
    document.getElementById(
        "intensityCanvas"
    );

const graph =
    intensityCanvas.getContext("2d");


/* =========================================================
   DIMENSIONS CADRAN
   ========================================================= */

const cx = 250;

const cy = 250;

const scale = 170;


/* =========================================================
   COORDONNÉES
   ========================================================= */

function X(x) {

    return cx + x * scale;
}


function Y(y) {

    return cy - y * scale;
}


/* =========================================================
   FLÈCHE
   ========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width
) {

    const head = 12;

    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        );


    ctx.strokeStyle = color;

    ctx.fillStyle = color;

    ctx.lineWidth = width;


    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 - head *
        Math.cos(angle - Math.PI / 6),

        y2 - head *
        Math.sin(angle - Math.PI / 6)
    );

    ctx.lineTo(
        x2 - head *
        Math.cos(angle + Math.PI / 6),

        y2 - head *
        Math.sin(angle + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   CADRAN OXY
   ========================================================= */

function drawPolarisation(thetaDeg) {

    ctx.clearRect(
        0,
        0,
        500,
        500
    );


    /* -----------------------------------------------------
       GRILLE
       ----------------------------------------------------- */

    ctx.strokeStyle = "#eeeeee";

    ctx.lineWidth = 1;

    for (
        let i = -1;
        i <= 1;
        i += 0.5
    ) {

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


    /* -----------------------------------------------------
       AXES
       ----------------------------------------------------- */

    ctx.strokeStyle = "#222";

    ctx.lineWidth = 1.5;


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


    /* -----------------------------------------------------
       CERCLE
       ----------------------------------------------------- */

    ctx.strokeStyle = "#999";

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


    /* -----------------------------------------------------
       ANGLE POLARISEUR
       ----------------------------------------------------- */

    const theta =
        thetaDeg * Math.PI / 180;

    const ux =
        Math.cos(theta);

    const uy =
        Math.sin(theta);


    /* -----------------------------------------------------
       AXE POLARISEUR
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       CHAMP INCIDENT
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       PROJECTION
       ----------------------------------------------------- */

    const Eproj =
        Ex * ux +
        Ey * uy;


    const ExProj =
        Eproj * ux;

    const EyProj =
        Eproj * uy;


    drawArrow(
        ctx,
        cx,
        cy,
        X(ExProj),
        Y(EyProj),
        "#27ae60",
        5
    );


    /* -----------------------------------------------------
       POINT DU CHAMP
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       TEXTE
       ----------------------------------------------------- */

    ctx.fillStyle = "#222";

    ctx.font = "16px Arial";

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


    ctx.font = "14px Arial";

    ctx.fillText(
        "θ = " +
        thetaDeg.toFixed(0) +
        "°",
        15,
        25
    );


    ctx.fillText(
        "Rouge : E incident",
        15,
        45
    );


    ctx.fillText(
        "Vert : E sortie",
        15,
        65
    );


    ctx.fillStyle = "#8e44ad";

    ctx.fillText(
        "Violet : axe analyseur",
        15,
        85
    );
}


/* =========================================================
   GRAPHE
   ========================================================= */

function drawGraph(thetaDeg, Iinst) {

    const w =
        intensityCanvas.width;

    const h =
        intensityCanvas.height;


    graph.clearRect(
        0,
        0,
        w,
        h
    );


    /* Marges */

    const left = 70;

    const right = 25;

    const top = 35;

    const bottom = 60;


    const plotWidth =
        w - left - right;

    const plotHeight =
        h - top - bottom;


    /* -----------------------------------------------------
       COORDONNÉES GRAPHE
       ----------------------------------------------------- */

    function graphX(theta) {

        return left +
            theta / 360 *
            plotWidth;
    }


    function graphY(I) {

        return top +
            (1.1 - I) / 1.1 *
            plotHeight;
    }


    /* -----------------------------------------------------
       FOND
       ----------------------------------------------------- */

    graph.fillStyle = "#ffffff";

    graph.fillRect(
        0,
        0,
        w,
        h
    );


    /* -----------------------------------------------------
       GRILLE HORIZONTALE
       ----------------------------------------------------- */

    graph.strokeStyle = "#dddddd";

    graph.lineWidth = 1;

    for (
        let I = 0;
        I <= 1;
        I += 0.25
    ) {

        const y =
            graphY(I);

        graph.beginPath();

        graph.moveTo(
            left,
            y
        );

        graph.lineTo(
            w - right,
            y
        );

        graph.stroke();


        graph.fillStyle = "#555";

        graph.font = "12px Arial";

        graph.fillText(
            I.toFixed(2),
            20,
            y + 4
        );
    }


    /* -----------------------------------------------------
       AXES
       ----------------------------------------------------- */

    graph.strokeStyle = "#222";

    graph.lineWidth = 2;


    graph.beginPath();

    graph.moveTo(
        left,
        top
    );

    graph.lineTo(
        left,
        h - bottom
    );

    graph.lineTo(
        w - right,
        h - bottom
    );

    graph.stroke();


    /* -----------------------------------------------------
       AXE THETA
       ----------------------------------------------------- */

    graph.fillStyle = "#222";

    graph.font = "13px Arial";


    for (
        let theta = 0;
        theta <= 360;
        theta += 60
    ) {

        const x =
            graphX(theta);

        graph.fillText(
            theta + "°",
            x - 10,
            h - 35
        );
    }


    /* -----------------------------------------------------
       TITRES AXES
       ----------------------------------------------------- */

    graph.font = "15px Arial";


    graph.fillText(
        "θ (angle du polariseur)",
        w / 2 - 70,
        h - 10
    );


    graph.save();

    graph.translate(
        15,
        h / 2
    );

    graph.rotate(-Math.PI / 2);

    graph.fillText(
        "Intensité",
        0,
        0
    );

    graph.restore();


    /* -----------------------------------------------------
       COURBE MOYENNE
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       POINT INSTANTANÉ
       ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       LÉGENDE
       ----------------------------------------------------- */

    graph.fillStyle = "#2471a3";

    graph.fillRect(
        left + 20,
        top + 10,
        25,
        4
    );


    graph.fillStyle = "#222";

    graph.font = "13px Arial";

    graph.fillText(
        "Intensité moyenne <I(θ)>ₜ = E₀²/2",
        left + 55,
        top + 15
    );


    graph.fillStyle = "#e74c3c";

    graph.beginPath();

    graph.arc(
        left + 32,
        top + 38,
        5,
        0,
        2 * Math.PI
    );

    graph.fill();


    graph.fillStyle = "#222";

    graph.fillText(
        "I(t,θ) instantanée",
        left + 55,
        top + 43
    );
}


/* =========================================================
   MISE À JOUR GÉNÉRALE
   ========================================================= */

function update() {

    const thetaDeg =
        Number(thetaSlider.value);

    const theta =
        thetaDeg * Math.PI / 180;


    /* Champ circulaire */

    const Ex =
        E0 * Math.cos(time);

    const Ey =
        E0 * Math.sin(time);


    /* Projection */

    const Eout =
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta);


    /* Intensité */

    const Iinst =
        Eout * Eout;


    /* Intensité moyenne */

    const Iavg =
        E0 * E0 / 2;


    /* Affichage */

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


    /* Dessins */

    drawPolarisation(thetaDeg);

    drawGraph(
        thetaDeg,
        Iinst
    );
}


/* =========================================================
   CURSEUR
   ========================================================= */

thetaSlider.addEventListener(
    "input",
    update
);


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

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


/* =========================================================
   ANIMATION
   ========================================================= */

function animate() {

    if (playing) {

        time += 0.04;

        update();
    }


    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   DÉMARRAGE
   ========================================================= */

update();

animate();
