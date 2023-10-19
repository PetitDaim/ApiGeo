const formCP = document.querySelector('#formCP');
const inputCodePostal = document.querySelector("#codePostal");
let infos = document.querySelector('#infos');
let selectNomsVilles = document.querySelector('#selectNomsVilles');
let nbNomsVilles = 0;

formCP.addEventListener( "submit", (event) => {
    event.preventDefault();
    getInfosAPI( inputCodePostal );
})

inputCodePostal.addEventListener( "change", (event) => {
    console.log(inputCodePostal)
    fetch("https://geo.api.gouv.fr/communes?codePostal=" + inputCodePostal.value + "&fields=nom,population,codesPostaux")
    .then( (response) => response.json())
    .then( (data) => {
        console.log(data)
        selectNomsVilles.innerHTML = "";
        nbNomsVilles = 0
        data.forEach( (ville) => {
            nbNomsVilles++
            selectNomsVilles.innerHTML += "<option>" + ville.nom + "</option>"
        })
    })
    .catch( (error) => console.log(error))
})

inputCodePostal.addEventListener( "mouseout", (event) => {
    console.log(inputCodePostal)
    fetch("https://geo.api.gouv.fr/communes?codePostal=" + inputCodePostal.value + "&fields=nom,population,codesPostaux")
    .then( (response) => response.json())
    .then( (data) => {
        console.log(data)
        selectNomsVilles.innerHTML = "";
        nbNomsVilles = 0
        data.forEach( (ville) => {
            nbNomsVilles++
            selectNomsVilles.innerHTML += "<option>" + ville.nom + "</option>"
        })
    })
    .catch( (error) => console.log(error))
})

function getInfosAPI( inputCodePostal ) {
    console.log(inputCodePostal)
    fetch("https://geo.api.gouv.fr/communes?codePostal=" + inputCodePostal.value + ((nbNomsVilles)?("&nom="+selectNomsVilles.value):"") + "&fields=nom,population,codesPostaux,contour")
    .then( (response) => response.json())
    .then( (data) => {
        console.log(data)
        infos.innerHTML = ""
        data.forEach( (ville) => {
            infos.innerHTML += "<h2>" + ville.nom + "</h2><br>"
            + ville.population + " habitants<br><ul><h2>Codes postaux</h2>"
            ville.codesPostaux.forEach(codePostal => {
                infos.innerHTML += "<li>" +codePostal + "</li>"
            });
            infos.innerHTML += "</ul><br>"
        })
    })
    .catch( (error) => console.log(error))
}
