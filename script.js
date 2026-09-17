/* ============================================================
   STYLE GÉNÉRAL
   ============================================================ */

* {
    box-sizing: border-box;
}

body {
    margin: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background: #f4f6f8;

    color: #222;
}


/* ============================================================
   EN-TÊTE
   ============================================================ */

header {
    background: #17202a;

    color: white;

    padding: 22px;

    text-align: center;
}

header h1 {
    margin: 0;

    font-size: 28px;
}

header p {
    margin-bottom: 0;

    color: #d5d8dc;
}


/* ============================================================
   CONTENEUR
   ============================================================ */

.container {
    max-width: 1250px;

    margin: 25px auto;

    padding: 0 20px;
}


/* ============================================================
   DEUX FIGURES
   ============================================================ */

.figures {

    display: grid;

    grid-template-columns:
        1fr
        1.15fr;

    gap: 25px;
}


/* ============================================================
   CARTES
   ============================================================ */

.card {

    background: white;

    border-radius: 12px;

    padding: 20px;

    box-shadow:
        0 3px 12px
        rgba(0, 0, 0, 0.12);
}

.card h2 {

    text-align: center;

    margin-top: 0;

    margin-bottom: 15px;
}


/* ============================================================
   CANVAS OXY
   ============================================================ */

#polarisationCanvas {

    width: 100%;

    max-width: 500px;

    height: auto;

    display: block;

    margin: auto;
}


/* ============================================================
   GRAPHE
   ============================================================ */

.chart-container {

    position: relative;

    height: 430px;

    width: 100%;
}


/* ============================================================
   CURSEUR
   ============================================================ */

.slider-card {

    background: white;

    border-radius: 12px;

    padding: 20px;

    margin-top: 25px;

    box-shadow:
        0 3px 12px
        rgba(0, 0, 0, 0.12);

    text-align: center;
}


.slider-card label {

    display: block;

    font-size: 20px;

    font-weight: bold;

    margin-bottom: 15px;
}


#thetaValue {

    color: #8e44ad;

    font-size: 22px;
}


#thetaSlider {

    width: 80%;

    cursor: pointer;
}


#playButton {

    display: block;

    margin: 18px auto 0;

    padding: 10px 25px;

    border: none;

    border-radius: 7px;

    background: #8e44ad;

    color: white;

    font-size: 16px;

    cursor: pointer;
}


#playButton:hover {

    background: #6c3483;
}


/* ============================================================
   VALEURS
   ============================================================ */

.values {

    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 12px;

    margin-top: 20px;
}


.value {

    background: white;

    padding: 15px;

    border-radius: 8px;

    text-align: center;

    box-shadow:
        0 2px 7px
        rgba(0, 0, 0, 0.08);
}


.value strong {

    display: block;

    font-size: 14px;

    color: #555;

    margin-bottom: 8px;
}


.value span {

    font-size: 20px;

    font-weight: bold;
}


/* Intensité moyenne */

.value.average {

    background: #eaf2f8;

    border: 2px solid #2471a3;
}


.value.average span {

    color: #2471a3;
}


/* ============================================================
   ÉQUATIONS
   ============================================================ */

.equations {

    margin-top: 25px;

    background: #17202a;

    color: white;

    padding: 25px;

    border-radius: 10px;
}


.equations h2 {

    text-align: center;

    margin-top: 0;

    margin-bottom: 20px;
}


.equation {

    text-align: center;

    font-size: 18px;

    margin: 12px;
}


.equation.important {

    font-size: 21px;

    color: #5dade2;

    margin-top: 20px;
}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 900px) {

    .figures {

        grid-template-columns: 1fr;
    }


    .values {

        grid-template-columns:
            repeat(2, 1fr);
    }
}


@media (max-width: 600px) {

    .container {

        padding: 0 10px;
    }


    .values {

        grid-template-columns: 1fr;
    }


    #thetaSlider {

        width: 100%;
    }


    .equation {

        font-size: 15px;
    }

}
