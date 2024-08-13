const API_URL = "https://majazocom.github.io/Data/candyshop.json";
onLoad();

async function onLoad() {
    // kolla om vi redan har data i LS
    let candyFromLS = JSON.parse(localStorage.getItem('candyProductsLS'));
    // Om vi inte har data från LS, behöver vi hämta från API
    if (candyFromLS.length > 0) {
        // hämta datan från API
        const res = await fetch(API_URL);
        const data = await res.json();
        // spara datan från API till Local Storage
        localStorage.setItem('candyProductsLS', JSON.stringify(data));
        // nu har vi besökt sidan en första gång
        alreadyVisitedSite = true;
        // få ut godisarna i vårt UI
        addCandyToUI(data);
    } else {
        addCandyToUI(candyFromLS);
    }
};

// funktionen för att få ut alla godisar till vårt UI
function addCandyToUI(candyProducts) {
    // ha ett redan befintligt element att förankra våra godisar i
    const candyProductsEl = document.querySelector('.candy-items-container');
    // tömmer vårt candyProductsEl utifall det redan finns element i, för vi vill inte ha dubletter
    candyProductsEl.innerHTML = "";
    // för varje godis i vår lista ska vi skapa nya element
    candyProducts.forEach(candyProduct => {
        console.log(candyProduct);
        let candyProductEl = document.createElement('article');
        candyProductEl.innerHTML = `
            <input id="nameInput-${candyProduct.id}" value="${candyProduct.name}"/>
        `;
        let updateBtn = document.createElement('button');
        updateBtn.innerText = 'Update name';
        // eventlyssnare för när vi vill ändra namn på godis
        updateBtn.addEventListener('click', () => {
            // uppdatera godisnamn
            // leta reda på input för att få ut det nya namnet
            const nameInput = document.getElementById(`nameInput-${candyProduct.id}`).value;
            updateCandyName(candyProduct, nameInput);
        });
        candyProductEl.appendChild(updateBtn);
        candyProductsEl.appendChild(candyProductEl);
    });
};

function updateCandyName(candy, newName) {
    console.log(candy, newName);
    // nu ska vi byta ut namnet i vårt godis-objekt
    candy.name = newName;
    console.log(candy);
    // nu har vi bara uppdaterat godisen i vår kod, vi ska nu uppdatera den i LS
    // steg 1: få tag på local storage
    // JSON.parse för att översätta vår sträng från LS till ett js objekt
    let candyFromLS = JSON.parse(localStorage.getItem('candyProductsLS'));
    console.log(candyFromLS);
    // steg 2: byta ut det gamla godis-objektet som finns i LS mot det nya med vårt uppdaterade namn!
    // hitta index på godiset i listan
    const index = candyFromLS.findIndex((c) => c.id === candy.id);
    //nu vet vi vilken plats i listan som vårt godis är på, så vi kan splicea ut den
    candyFromLS.splice(index, 1, candy);
    console.log(candyFromLS);
    // steg 3: uppdatera själva LS till vår nya godislista
    localStorage.setItem('candyProductsLS', JSON.stringify(candyFromLS));
}