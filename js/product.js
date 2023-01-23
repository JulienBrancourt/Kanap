
//récupération de l'url complète avec l'id du canapé sélectionné en page d'accueil
const urlPageProduit = new URL(window.location.href)
const idProduct = urlPageProduit.searchParams.get('id')
const urlPageProduitComplete = `http://localhost:3000/api/products/${idProduct}`

const boutonAjouter = document.getElementById('addToCart')



//fonction regroupant couleurs + quantité + id pour les envoyer vers le local storage
function produitVersStorage(){
    let canapeStorage = {
        id : idProduct,
        quantite : +document.querySelector('#quantity').value,
        couleur : document.querySelector('#colors').value
    }
    if (isInfoOk(canapeStorage)){
        //si le local storage contient déja canapeStorage, on le retransforme en tableau ... puis on ajoute le canapé actuel et on met à jour le local storage
        if (localStorage.getItem("canapeStorage")) {
            let canapeStorageTableau = JSON.parse(localStorage.getItem("canapeStorage"))
            let canapeExistant = canapeStorageTableau.find(canapeTableau => canapeStorage.id === canapeTableau.id && canapeStorage.couleur === canapeTableau.couleur && canapeStorage.quantite !== canapeTableau.quantite)
            let index = canapeStorageTableau.findIndex(canapeTableau => canapeStorage.id === canapeTableau.id && canapeStorage.couleur === canapeTableau.couleur)
            if (canapeExistant){
                canapeExistant.quantite = Number(document.querySelector('#quantity').value) + Number(canapeExistant.quantite)
                canapeStorageTableau[index] = canapeExistant
                localStorage.setItem("canapeStorage", JSON.stringify(canapeStorageTableau))
            }
            else{
                canapeStorageTableau.push(canapeStorage)
                localStorage.setItem("canapeStorage", JSON.stringify(canapeStorageTableau))
            }   
        //sinon on envoie canapeStorage dans le local storage en l'encapsulant dans un tableau, pour que ce format accueille des ajouts plus tard
        } 
        else{
            localStorage.setItem("canapeStorage", JSON.stringify([canapeStorage]))
        }   
    }
}

//fonction vérifiant que les paramètres couleur et quantité sont correctement remplis
function isInfoOk(canapeStorage){
    if (canapeStorage.couleur === ""){
        window.alert("Sélectionnez une couleur")
        return false
    }
    if (canapeStorage.quantite < 1 || canapeStorage.quantite > 100){
        window.alert("Sélectionnez un nombre d'articles entre 1 et 100")
        return false
    }
    if (Number.isInteger(canapeStorage.quantite)){
    return true
    } 
    else{
        window.alert("Sélectionnez un nombre entier")
    }
}

// fonction ajoutant des éléments HTML nécessaires à l'affichage
function affichageSelection(canape){
    let affichageNom = canape.name
    document.querySelector("#title").innerHTML = affichageNom
    document.querySelector("title").innerHTML = affichageNom

    let affichagePrix = canape.price 
    document.querySelector("#price").innerHTML = affichagePrix

    let affichageDescription = canape.description 
    document.querySelector("#description").innerHTML = affichageDescription

    let affichageImage = `<img src=${canape.imageUrl} alt=${canape.altTxt}>` 
    document.querySelector(".item__img").innerHTML = affichageImage

    let affichageCouleur = ""
    for (let couleur of canape.colors){
        affichageCouleur += `<option value="${couleur}">${couleur}</option>`
    }
    document.querySelector('#colors').innerHTML = affichageCouleur
}

//fonction contenant un fetch pour récupérer les infos de l'API et les mettre dans le HTML
function fetchPageProduit(){
    fetch(urlPageProduitComplete)
    .then (response => response.json())
    .then (canape => {
        affichageSelection(canape)
        boutonAjouter.addEventListener('click',produitVersStorage) 
    })
}


fetchPageProduit()














