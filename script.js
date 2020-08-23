// JavaScript

// Globala variabler
var allSelectedCardIds;     // Referens till id av alla kort som valts(array)
var selectedCardElem;       // Referens till de två element som valts(array)
var cards;	                // Referens till alla kort på gränssnitten
var start;                  // Referens tilL "Starta spelet" knappen
var next;                   // Referens till "Nästa" knappen
var nrOfBricksMenu;         // Referens till meny för antal kort att spela med(select element)
var bricksParent;           // Referens till moderelement för korten(div)
var moreInfoLink;           // Referens till länk för att visa mer info
var moreInfoDiv;            // Referens till div för mer info
var turn;                   // Referens till span-elementen som håller värden för antal gånger man vänt på korten
var counter;                // Antal gånger man vänt på korten
var rightGuesses;           // Antal gånger man gissat rätt
var point;                  // Uträknad poäng för en viss runda
var totalPoint;             // Total poäng man samlat ihop under alla spel man spelat
var average;                // Snittpoäng för alla spel man spelat
var tries;                  // Antal gånger man spelat spelet
var gameStarted;            // Flagga för att hålla koll på om spelet är på gång eller inte

// Anropas när sidan har laddats
// Initiera globala variabler och koppla funktion till knappar
function init() {
    gameStarted = false;
    totalPoint = 0;
    average = 0;
    tries = 0;
    cards = document.querySelectorAll("#bricks img");
    selectedCardElem = [];
    allSelectedCardIds = [];
    bricksParent = document.getElementById("bricks");
    start = document.getElementById("startGameBtn");
    next = document.getElementById("nextBtn");
    turn = document.getElementById("turnNr");
    nrOfBricksMenu = document.getElementById("nrOfBricksMenu");
    moreInfoLink = document.getElementById("userInfo").querySelector("p a");
    moreInfoDiv = document.getElementById("userMoreInfo");

    start.disabled = false;
    next.disabled = true;

    loadInfo();     // Anrop till funktionen loadInfo

    addListener(nrOfBricksMenu, "change", amountOfCards);    // Anrop till funktionen addListener
    addListener(start, "click", startGame);                  // Anrop till funktionen addListener
    addListener(moreInfoLink, "click", showMoreInfo);        // Anrop till funktionen addListener

} // End init
addListener(window,"load",init);        // Anrop till funktionen addListener

// Lägg till en händelsehanterare
// obj är elementet, type är händelsen och fn är funktionen
function addListener(obj, type, fn) {
	if (obj.addEventListener) obj.addEventListener(type,fn,false);
	else obj.attachEvent("on"+type,fn);
} // End addListener

// Ta bort en händelsehanterare
function removeListener(obj, type, fn) {
	if (obj.removeEventListener) obj.removeEventListener(type,fn,false);
	else obj.detachEvent("on"+type,fn);
} // End removeListener


// Anropas när Start knappen klickats
// Initiera variabler och koppla funktion till korten
// Anrop till andra funktioner för att initiera varje kort med slumomässiga id värden
function startGame() {
    var i;         // Loopvariabel
    var j;         // Loopvariabel
    var rand;      // Slumpmässig nummer mellan 0 och 20
    var randArr;   // Array som håller de nummer som valts

    point = 0;
    counter = 0;
    rightGuesses = 0;
    turn.innerHTML = "0";
    start.disabled = true;
    randArr = [];
    selectedCardElem = [];
    allSelectedCardIds = [];
    
    if(gameStarted == false) {
        gameStarted = true;
        for(i = 0 ; i < cards.length ; i++) {
            addListener(cards[i], "click", selectCard);
        }
    } else {
        gameStarted = false;
        for(i = 0 ; i < cards.length ; i++) {
            removeListener(cards[i], "click", selectCard);
        }
    }

    for(i = 0 ; i < cards.length ; i++) {
        cards[i].style.visibility = "visible";
        cards[i].className = "brickBack";
        cards[i].src = "pics/backside.png";
    }

    for(i = 0 ; i < cards.length / 2 ; i++) {
        while(true) {
            rand = Math.floor(Math.random()*21);
            if(randArr.indexOf(rand) == -1) {
                randArr.push(rand);
                randArr.push(rand);
                break;
            }
        }
    }

    shuffleArray(randArr);  // Anrop till funktionen shuffleArray

    for(i = 0 ; i < cards.length ; i++) {
        cards[i].id = randArr[i];
    }
} // END startGame

// Anropas när användaren har avslutat spelet
// Aktivera samt inaktivera knappar
// Räkna och anropa funktion för att spara resultat
function endGame() {
    gameStarted = false;
    next.disabled = true;
    start.disabled = false;

    point = Math.round(20 - (counter - (cards.length / 2)) * 1.2);
    if(point < 0) {
        point = 0;
    }

   saveInfo();      // Anrop till funktionen saveInfo
} // END endGame

// Anropas när användaren har avslutat spelet
// Spara resultat i localStorage
function saveInfo() {
    totalPoint = parseInt(localStorage.getItem("totalPoint"));
    tries = parseInt(localStorage.getItem("amntOfTries"));

    totalPoint += point;
    tries++;
    average = Math.round(totalPoint / tries); 

    localStorage.setItem("totalPoint", totalPoint);
    localStorage.setItem("amntOfTries", tries);

    displayInfo();      // Anrop till funktionen displayInfo
} // END saveInfo

// Anropas när resultat baserad information behöver visas
// Visa aktuell information kring resultat
function displayInfo() {
    document.getElementById("userTotPoints").textContent = totalPoint;
    document.getElementById("userCountGames").textContent = tries;
    document.getElementById("userMeanPoints").textContent = average;
} // END displayInfo

// Anropas när sidan laddats(inonm init)
// Hämta aktuell information kring resultat
function loadInfo() {
    if(localStorage.getItem("amntOfTries") == null) {
        localStorage.setItem("totalPoint", 0);
        localStorage.setItem("amntOfTries", 0);
    } 
        totalPoint = parseInt(localStorage.getItem("totalPoint"));
        tries = parseInt(localStorage.getItem("amntOfTries"));
        if(isNaN(Math.round(totalPoint / tries))) {
            average = 0;
        } else {
            average = Math.round(totalPoint / tries);
        }
        displayInfo();      // Anrop till funktionen displayInfo
} // END loadInfo

// Anropas om användaren klickar på "visa mer" länken
// Visa snittpoäng och antal försök
function showMoreInfo() {
    if (moreInfoDiv.style.display == "block") {
      moreInfoDiv.style.display = "none";
    } else {
      moreInfoDiv.style.display = "block";
    }
} // END showMoreInfo

// Anropas innan slumpmässigt valda id för brickorna ska tilldelas till varje kort
// Placering av korten i slumpmässig ordning
function shuffleArray(a) {
    var randNumber;      // Slumpmässig nummer
    var i;               // Loopvariabel
    var x;              // Variabel som håller existerande värden i a[]
    for (i = a.length - 1; i > 0; i--) {
        randNumber = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[randNumber];
        a[randNumber] = x;
    }
} // END shuffleArray

// Anropas om användaren gör någon förändring(change) i drop-down menyn för antal kort
// Se antal kort användaren vill ha
function amountOfCards() {
    var index; // Index nummer för vald alternativ
    index = nrOfBricksMenu.selectedIndex;

    if(gameStarted == true || ((cards.length / 2) - rightGuesses) == 1) {
        gameStarted = true;
        chooseImages(index);        // Anrop till funktionen chooseImages
        startGame();                // Anrop till funktionen startGame
        start.disabled = false;
        next.disabled = true;
    } else if (gameStarted == false) {
        chooseImages(index);        // Anrop till funktionen chooseImages
    }
} // END amountOfCards

// Anropas inom föregående funktion(amountOfCards)
// Skapa eller ta bort element(img)
// Anpassa gränssnittet(width) enligt vald antal kort
function chooseImages(index) {
    switch(index) {
        case 0:
            for(i = 16 ; i < cards.length ; i++ ) {
                bricksParent.removeChild(cards[i]);
            }
            bricksParent.style.width = "280px";
            cards = document.querySelectorAll("#bricks img");
            break;
        case 1:
            if(cards.length < 20) {
                for(i = 16 ; i < 20 ; i++ ) {
                    newElement = document.createElement("img");
                    newElement.className = "brickBack";
                    newElement.src="pics/backside.png";
                    bricksParent.appendChild(newElement);
                }
            } else if(cards.length > 20) {
                for(i = 20 ; i < cards.length ; i++ ) {
                    bricksParent.removeChild(cards[i]);
                }
            }

            bricksParent.style.width = "350px";
            cards = document.querySelectorAll("#bricks img");
            break;
        case 2:
        if(cards.length < 24) {
            for(i = cards.length ; i < 24 ; i++ ) {
                newElement = document.createElement("img");
                newElement.className = "brickBack";
                newElement.src="pics/backside.png";
                bricksParent.appendChild(newElement);
            }
        } else if(cards.length > 24) {
            for(i = 24 ; i < cards.length ; i++ ) {
                bricksParent.removeChild(cards[i]);
            }
        }
            bricksParent.style.width = "420px";
            cards = document.querySelectorAll("#bricks img");
            break;
        case 3:
        if(cards.length < 30) {
            for(i = cards.length ; i < 30 ; i++ ) {
                newElement = document.createElement("img");
                newElement.className = "brickBack";
                newElement.src="pics/backside.png";
                bricksParent.appendChild(newElement);
            }
        } else if(cards.length > 30) {
            for(i = 30 ; i < cards.length ; i++ ) {
                bricksParent.removeChild(cards[i]);
            }
        }
            bricksParent.style.width = "420px";
            cards = document.querySelectorAll("#bricks img");
            break;
        case 4:
        if(cards.length < 36) {
            for(i = cards.length ; i < 36 ; i++ ) {
                newElement = document.createElement("img");
                newElement.className = "brickBack";
                newElement.src="pics/backside.png";
                bricksParent.appendChild(newElement);
            }
        } else if(cards.length > 36) {
            for(i = 36 ; i < cards.length ; i++ ) {
                bricksParent.removeChild(cards[i]);
            }
        }
            bricksParent.style.width = "420px";
            cards = document.querySelectorAll("#bricks img");
            break;
    }
} // END chooseImages


// Anropas när man klickat på ett kort
// Kontrollera om spelet ska avslutas eller fortsätta
function selectCard() {
    var i;  // Loopvariabel
    var f;  // Flagga(true/false)
    
    selectedCardElem.push(this);
    removeListener(this, "click", selectCard);
    this.className = "brickFront";
    this.src = "pics/" + this.id + ".png";

    if(selectedCardElem.length == 2) {
        if(( (cards.length / 2) - rightGuesses) == 1) {
            endGame();          // Anrop till funktionen endGame
        } else {
            for(i = 0 ; i < cards.length ; i++) {
                removeListener(cards[i], "click", selectCard);
            }
            f = compare();      // Anrop till funktionen compare
            next.disabled = false;
            counter++;
            turn.textContent = counter;
            if(f) {
                addListener(next, "click", rightSelection);     // Anrop till funktionen addListener
            } else {
                addListener(next, "click", wrongSelection);     // Anrop till funktionen addListener
            }
        }
    }
} // END selectCard

// Anropas när två kort valts(om det inte är sista paret)
// Jämför om brickorna är lika och returnera true eller false enligt resultatet
function compare() {
    var f;  // Flagga(true/false)

    if(selectedCardElem[0].id == selectedCardElem[1].id) {
        f = true;
    } else {
        f = false;
    }

    return f;
} // END compare

// Anropas när "Nästa" knappen klickas och rätt val gjorts
// Om brickorn är lika
function rightSelection() {
    var i;      // Loopvariabel

        for(i = 0; i < selectedCardElem.length; i++) { 
            selectedCardElem[i].className = "brickEmpty";
            selectedCardElem[i].src = "pics/empty.png";
            removeListener(selectedCardElem[i], "click", selectCard);
        }
        allSelectedCardIds.push(selectedCardElem[0].id);
        cards = document.querySelectorAll("#bricks img");
        next.disabled = true;
        removeListener(next, "click", rightSelection);      // Anrop till funktionen removeListener
        
        for(i = 0 ; i < cards.length ; i++) {
            if(allSelectedCardIds.indexOf(cards[i].id ) > -1) {
                continue;
            } else {
                addListener(cards[i], "click", selectCard);     // Anrop till funktionen addListener
            }
    }

    selectedCardElem = [];
    rightGuesses++;
}  // END rightSelection

// Anropas när "Nästa" knappen klickas och fel val gjorts
// Om brickorn inte är lika
function wrongSelection() {
    var i;      // Loopvariabel

    for(i = 0; i < selectedCardElem.length; i++) {
        selectedCardElem[i].className = "brickBack";
        selectedCardElem[i].src = "pics/backside.png";
    }
    selectedCardElem = [];

    next.disabled = true;
    removeListener(next, "click", wrongSelection);      // Anrop till funktionen removeListener
    for(i = 0 ; i < cards.length ; i++) {
        if(allSelectedCardIds.indexOf(cards[i].id ) > -1) {
            continue;
        } else {
            addListener(cards[i], "click", selectCard);     // Anrop till funktionen addListener
        }
    }
} // END wrongSelection