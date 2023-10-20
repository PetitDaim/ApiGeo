const formCP = document.querySelector('#formCP');
const inputCodePostal = document.querySelector("#codePostal");
let selectNomsVilles = document.querySelector("#selectNomsVilles");
let nbNomsVilles = 0;
// let nomVilleUniqueSelected = "";
let villesOptions = [];
let villes = [];
let nomsVilles = [];
let selectHasEventListener = false;
    
var map = L.map('map').setView([44, 0], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var markerGroup = new L.featureGroup();

function showVilles(data, nomVilleUnique="") {
    // console.log(data)
    if( ! data.length ) return;
    nbNomsVilles = 0
    villes = [];
    nomsVilles = [];
    villesOptions = [];
    // initialise les villes
    data.forEach( (ville) => {
        villes.push(ville)
    })
    selectNomsVilles.innerHTML = "<option id='choice_ville' value=''" + ((!nomVilleUnique.length)?" selected":"") + ">Choisissez une ville</option>"
    villes.forEach( (ville) => {
        // console.log(ville)
        selectNomsVilles.innerHTML += "<option id='ville_" + ville.nom.replace(" ", "_") + "' value='" + ville.nom + "'" + ((nomVilleUnique.length)?" selected":"") + ">" + ville.nom + "</option>"
        nomsVilles[nbNomsVilles] = ville.nom;
        nbNomsVilles++
        let codesPostaux = "CP: ";
        let codesPostauxNb = 0;
        ville.codesPostaux.forEach( cp =>{
            codesPostaux += ((codesPostauxNb)?", ":"") + cp;
            codesPostauxNb++;
        })
        let lat = ville.mairie.coordinates[0]
        let long = ville.mairie.coordinates[1]
        var marker = L.marker([long,lat]);
        marker.bindPopup("<strong>"+ville.nom+"</strong><br>"+ville.population+" habitants<br>"+codesPostaux).openPopup()
        markerGroup.addLayer(marker)
    })
    if( selectHasEventListener ) 
    {
        selectNomsVilles.removeEventListener('change', selectEventListener );
    }
    // pose un écouteur de changement de valeur sur ce select
    selectNomsVilles.addEventListener('change', selectEventListener );
    selectHasEventListener = true;
    console.log(villesOptions);
    markerGroup.addTo(map)
    map.fitBounds(markerGroup.getBounds())
}

function selectEventListener() {
    console.log( "select changed");
    refreshVilles(this.value);
}

function refreshVilles( nomVilleUnique="" ) {
    console.log("nomVilleUnique="+nomVilleUnique);
    map.eachLayer((mark) => {
        // console.log(mark);
        if( ( mark instanceof L.Marker ) ) {
            console.log(mark);
            map.removeLayer( mark );
        }
    });
    markerGroup.eachLayer((mark) => {
        // console.log(mark);
        if( ( mark instanceof L.Marker ) ) {
            console.log(mark);
            markerGroup.removeLayer( mark );
        }
    });
    selectNomsVilles.innerText = null;
    // console.log(inputCodePostal.value)
    let isNomVille = inputCodePostal.value != parseInt(inputCodePostal.value);
    fetch("https://geo.api.gouv.fr/communes?"+ ( isNomVille  ? (nomVilleUnique.length ? "nom="+nomVilleUnique : "nom=" + inputCodePostal.value ) : "codePostal=" + inputCodePostal.value )  + ((nomVilleUnique.length && ( ! isNomVille) )?"&nom="+nomVilleUnique:"") +"&fields=nom,population,codesPostaux,mairie,id")
    .then( (response) => response.json())
    .then( (data) => showVilles(data, nomVilleUnique) )
    .catch( (error) => console.log(error))
}

inputCodePostal.addEventListener( "focusout", (event) => {
    refreshVilles()
})

formCP.addEventListener( "submit", (event) => {
    event.preventDefault();
    refreshVilles();
})
