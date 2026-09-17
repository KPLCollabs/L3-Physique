/* ============================================================
   PARAMÈTRES
   ============================================================ */

const E0 = 1.0;

let time = 0;

let playing = true;


/* ============================================================
   ÉLÉMENTS HTML
   ============================================================ */

const slider =
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


/* ============================================================
   CANVAS
   ============================================================ */

const canvas =
    document.getElementById(
        "polarisationCanvas"
    );

const ctx =
    canvas.getContext("2d");


/* ============================================================
   PARAMÈTRES DU CADRAN
   ============================================================ */

const cx =
    canvas.width / 2;

const cy =
    canvas.height / 2;

const scale = 170;


/* ============================================================
   CONVERSION COORDONNÉES
   ============================================================ */

function X(x) {

    return cx + x * scale;
}


function Y(y) {

    return cy - y * scale;
}


/* ============================================================
   DESSIN D'UNE FLÈCHE
   ============================================================ */

function drawArrow(
    x1,
    y1,
    x2,
    y2,
    color,
    width
) {

    const headLength = 12;

    const angle =
        Math.atan2(
            y2 - y1,
            x2 - x1
        );


    ctx.strokeStyle = color;

    ctx.fillStyle = color;

    ctx.lineWidth = width;


    /* Corps */

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();


    /* Pointe */

    ctx.beginPath();

    ctx.moveTo(x2, y2);

    ctx.lineTo(
        x2 -
        headLength *
        Math.cos(angle - Math.PI / 6),

        y2 -
        headLength *
        Math.sin(angle - Math.PI / 6)
    );

    ctx.lineTo(
        x2 -
        headLength *
        Math.cos(angle + Math.PI / 6),

        y2 -
        headLength *
        Math.sin(angle + Math.PI / 6)
    );

    ctx.closePath();

    ctx.fill();
}


/* ============================================================
   DESSIN DU CADRAN OXY
   ============================================================ */

function drawPolarisation(thetaDeg) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* --------------------------------------------------------
       GRILLE
       -------------------------------------------------------- */

    ctx.strokeStyle = "#eeeeee";

    ctx.lineWidth = 1;

    for (
        let i = -1;
        i <= 1;
        i += 0.5
    ) {

        /* vertical */

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


        /* horizontal */

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


    /* --------------------------------------------------------
       AXES X Y
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       CERCLE DE POLARISATION
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       ANGLE DU POLARISEUR
       -------------------------------------------------------- */

    const theta =
        thetaDeg *
        Math.PI / 180;


    const ux =
        Math.cos(theta);

    const uy =
        Math.sin(theta);


    /* --------------------------------------------------------
       AXE DU POLARISEUR
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       CHAMP INCIDENT
       -------------------------------------------------------- */

    const Ex =
        E0 * Math.cos(time);

    const Ey =
        E0 * Math.sin(time);


    drawArrow(
        cx,
        cy,
        X(Ex),
        Y(Ey),
        "#e74c3c",
        4
    );


    /* --------------------------------------------------------
       POINT DU CHAMP
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       PROJECTION
       -------------------------------------------------------- */

    const Eproj =
        Ex * ux +
        Ey * uy;


    const ExProj =
        Eproj * ux;

    const EyProj =
        Eproj * uy;


    drawArrow(
        cx,
        cy,
        X(ExProj),
        Y(EyProj),
        "#27ae60",
        5
    );


    /* --------------------------------------------------------
       TEXTES
       -------------------------------------------------------- */

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
        "E sortie = " +
        Eproj.toFixed(3),
        15,
        48
    );
}


/* ============================================================
   GRAPHE INTENSITÉ
   ============================================================ */

const thetaArray = [];

const intensityAverage = [];

const intensityInstant = [];


for (
    let i = 0;
    i <= 360;
    i++
) {

    thetaArray.push(i);

    intensityAverage.push(
        E0 * E0 / 2
    );

    intensityInstant.push(null);
}


/* ============================================================
   CHART.JS
   ============================================================ */

const chart =
    new Chart(

        document.getElementById(
            "intensityChart"
        ),

        {

            type: "line",

            data: {

                labels:
                    thetaArray,

                datasets: [

                    /* ----------------------------------------
                       MOYENNE
                       ---------------------------------------- */

                    {

                        label:
                            "Intensité moyenne ⟨I(θ)⟩ₜ",

                        data:
                            intensityAverage,

                        borderColor:
                            "#2471a3",

                        backgroundColor:
                            "rgba(36,113,163,0.1)",

                        borderWidth: 3,

                        pointRadius: 0,

                        tension: 0

                    },


                    /* ----------------------------------------
                       POINT INSTANTANÉ
                       ---------------------------------------- */

                    {

                        label:
                            "Intensité instantanée I(t,θ)",

                        data:
                            intensityInstant,

                        borderColor:
                            "#e74c3c",

                        backgroundColor:
                            "#e74c3c",

                        borderWidth: 0,

                        pointRadius: 7,

                        showLine: false

                    }

                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,


                scales: {

                    x: {

                        title: {

                            display: true,

                            text:
                                "θ : angle du polariseur (°)"

                        },

                        min: 0,

                        max: 360

                    },


                    y: {

                        title: {

                            display: true,

                            text:
                                "Intensité"

                        },

                        min: 0,

                        max: 1.1

                    }

                },


                plugins: {

                    legend: {

                        display: true

                    }

                }

            }
        }
    );


/* ============================================================
   MISE À JOUR
   ============================================================ */

function update() {

    const thetaDeg =
        Number(slider.value);

    const theta =
        thetaDeg *
        Math.PI / 180;


    /* --------------------------------------------------------
       CHAMP INCIDENT
       -------------------------------------------------------- */

    const Ex =
        E0 * Math.cos(time);

    const Ey =
        E0 * Math.sin(time);


    /* --------------------------------------------------------
       PROJECTION
       -------------------------------------------------------- */

    const Eproj =
        Ex * Math.cos(theta) +
        Ey * Math.sin(theta);


    /* --------------------------------------------------------
       INTENSITÉ INSTANTANÉE
       -------------------------------------------------------- */

    const Iinst =
        Eproj * Eproj;


    /* --------------------------------------------------------
       INTENSITÉ MOYENNE
       -------------------------------------------------------- */

    const Iaverage =
        E0 * E0 / 2;


    /* --------------------------------------------------------
       AFFICHAGE
       -------------------------------------------------------- */

    thetaValue.textContent =
        thetaDeg.toFixed(0) + "°";


    ExValue.textContent =
        Ex.toFixed(3);


    EyValue.textContent =
        Ey.toFixed(3);


    EoutValue.textContent =
        Eproj.toFixed(3);


    IValue.textContent =
        Iinst.toFixed(3);


    averageValue.textContent =
        Iaverage.toFixed(3);


    /* --------------------------------------------------------
       POINT ROUGE
       -------------------------------------------------------- */

    chart.data.datasets[1].data =
        thetaArray.map(
            () => null
        );


    chart.data.datasets[1].data[
        Math.round(thetaDeg)
    ] = Iinst;


    chart.update("none");


    /* --------------------------------------------------------
       CADRAN
       -------------------------------------------------------- */

    drawPolarisation(thetaDeg);
}


/* ============================================================
   CURSEUR
   ============================================================ */

slider.addEventListener(
    "input",
    update
);


/* ============================================================
   BOUTON PLAY / PAUSE
   ============================================================ */

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


/* ============================================================
   ANIMATION
   ============================================================ */

function animate() {

    if (playing) {

        time += 0.04;

        update();
    }


    requestAnimationFrame(
        animate
    );
}


/* ============================================================
   INITIALISATION
   ============================================================ */

update();

animate();
