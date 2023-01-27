const canapeStorage = JSON.parse(localStorage.getItem("canapeStorage"))??[]
const url_api_produits = `http://localhost:3000/api/products`

// fonction contenant un fetch récupérant les infos de l'API
function fetchProducts(){
  fetch(url_api_produits)
  .then((response) => response.json())
  .then((catalogue) => {
    appels(catalogue)
  })
}

fetchProducts()


//fonction associant chaque élément supprimer à un produit pour suprrimer ce produit
function suppression(catalogue){
  let boutonSupprimer = document.querySelectorAll(".deleteItem")
  for(let i = 0; i< boutonSupprimer.length; i++){
    boutonSupprimer[i].addEventListener('click', ()=> {
      let proche = boutonSupprimer[i].closest("article")
      let idDuProduit = proche.dataset.id
      let couleurDuProduit = proche.dataset.color
      let index = canapeStorage.findIndex(x => x.id === idDuProduit && x.couleur === couleurDuProduit)
      canapeStorage.splice(index, 1)
      localStorage.setItem("canapeStorage",JSON.stringify(canapeStorage))
      appels(catalogue)
    })
  }
}

//fonction permettant de modifier la quantité d'un produit après vérification du nombre saisi. Relance ensuite le calcul du prix total et du nombre d'articles au total
function modifQuantite(catalogue){
  let champsQuantite = document.querySelectorAll(".itemQuantity")
  for (let j = 0; j< champsQuantite.length; j++) {
    champsQuantite[j].addEventListener("change", () => {
      let procheArticleModifie = champsQuantite[j].closest("article")
      let idDuProduit = procheArticleModifie.dataset.id
      let couleurDuProduit = procheArticleModifie.dataset.color
      let index = canapeStorage.findIndex(x => x.id === idDuProduit && x.couleur === couleurDuProduit)
      if (isInfoOk(champsQuantite[j].value)) {
        canapeStorage[index].quantite = Number(champsQuantite[j].value)
        localStorage.setItem("canapeStorage",JSON.stringify(canapeStorage))
        // recupererPrixTotal(catalogue)
        // recupererQuantiteTotal(catalogue)
        appels(catalogue)
      }  
    })
  }
}

//fonction vérifiant la validité des quantités saisies
function isInfoOk(champsQuantite){
  if (champsQuantite < 1 || champsQuantite > 100){
      window.alert("Sélectionnez un nombre d'articles entre 1 et 100")
      return false
  }
  if (Number.isInteger(+champsQuantite)) {
  return true
  }
  else{
    window.alert("Sélectionnez un nombre entier")
  }
}

//fonction gérant l'affichage des produits dans le panier en HTML
function afficherProduit(catalogue){
  let affichage_produits = ""
  for (let canape of catalogue){
    //on cherche pour chaque élément de valeursCanapeStorage un id identique dans canape, on fera ça pour chaque id de canape grâce au "for (let canape of catalogue)" au-dessus 
    let canapeTemporaire = canapeStorage.find(element => element.id === canape._id)
    if (canapeTemporaire) {
      canape.quantite = canapeTemporaire.quantite
      canape.couleur = canapeTemporaire.couleur
      affichage_produits += 
      `<article class="cart__item" data-id="${canape._id}" data-color="${canape.couleur}">
        <div class="cart__item__img">
          <img src=${canape.imageUrl} alt=${canape.altTxt}>
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${canape.name}</h2>
            <p>${canape.couleur}</p>
            <p>${canape.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté :</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canape.quantite}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    }
  }
  document.querySelector("#cart__items").innerHTML = affichage_produits
} 
  
//fonction calculant le total du panier
function recupererPrixTotal(catalogue){
  let prixTotal = 0
  for( let canape of canapeStorage) {
    const canapetrouve = catalogue.find (articleCatalogue=>articleCatalogue._id === canape.id)
    const prixArticle = canape.quantite * canapetrouve.price
    prixTotal = prixTotal + prixArticle // prixTotal += prixArticle
  }
  document.getElementById("totalPrice").innerHTML = prixTotal
}

//fonction calculant le nombre d'articles dans le panier
function recupererQuantiteTotal(){
  let quantiteTotal = 0
  for( let canape of canapeStorage) {
    quantiteTotal = quantiteTotal + canape.quantite
  }
  document.getElementById("totalQuantity").innerHTML = quantiteTotal
}

//fonction lançant les précédentes fonctions si le local storage contient canapeStorage avec au moins 1 produit
function appels (catalogue){
    afficherProduit(catalogue)
    suppression(catalogue)
    recupererPrixTotal(catalogue)
    recupererQuantiteTotal()
    modifQuantite(catalogue)
}

/*
// Vérification du formulaire
*/

const inputPrenom = document.querySelector('#firstName')
const inputNom = document.querySelector('#lastName')
const inputAdresse = document.querySelector('#address')
const inputVille = document.querySelector('#city')
const inputMail = document.querySelector('#email')

const erreurPrenom = document.querySelector('#firstNameErrorMsg')
const erreurNom = document.querySelector('#lastNameErrorMsg')
const erreurAdresse = document.querySelector('#addressErrorMsg')
const erreurVille = document.querySelector('#cityErrorMsg')
const erreurMail = document.querySelector('#emailErrorMsg')

const regexLettres = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/
const regexAdresse = /^[A-zÀ-ú0-9 ,.'\-]+$/
const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

//fonction vérifiant la validité des champs du formulaire
function verifFormulaire(valeurInput,msgErreur,typeRegex){
  if (valeurInput !== ""){
    if (typeRegex.test(valeurInput)){
      msgErreur.textContent = ""
    }
    else{
      msgErreur.textContent = "saisie incorrecte"
    }
  }
  else msgErreur.textContent = ""
}

inputPrenom.addEventListener('change',()=>verifFormulaire(inputPrenom.value,erreurPrenom,regexLettres))
inputNom.addEventListener('change', ()=>verifFormulaire(inputNom.value,erreurNom,regexLettres))
inputAdresse.addEventListener('change',()=>verifFormulaire(inputAdresse.value,erreurAdresse,regexAdresse))
inputVille.addEventListener('change', ()=>verifFormulaire(inputVille.value,erreurVille,regexLettres))
inputMail.addEventListener('change', ()=>verifFormulaire(inputMail.value,erreurMail,regexMail))

/*
//Commande : objet de contact + tableau de produits + orderid (string)
*/

const boutonCommander = document.getElementById("order")

//mise en place du bouton et de la fonction associée (commande du panier après exécution d'un fetch)
boutonCommander.addEventListener("click", (event) => {
  event.preventDefault()
  contact = {
    firstName : inputPrenom.value,
    lastName : inputNom.value,
    address : inputAdresse.value,
    city : inputVille.value,
    email : inputMail.value
  }

  let products
  if (canapeStorage?.length !== 0){
  products = canapeStorage.map(item => item.id)
  } 

  const infosCommande = {
    contact,
    products,
  }

  if(isCommandeOk(canapeStorage)) {
    fetchCommande(infosCommande)
  }


})

//fonction contenant un fetch envoyant à l'API les infos liées à la commande
function fetchCommande(infosCommande) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(infosCommande)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    window.location.href = "confirmation.html?orderId=" + data.orderId
    localStorage.removeItem("canapeStorage")
  })
}

//fonction vérifiant la présence de produit et le contenu des champs du formulaire
function isCommandeOk(canapeStorage){
  if(canapeStorage?.length === 0){
    window.alert("Le panier est vide")
    return false
  }
  else {

    if(inputPrenom.value === "" || inputNom.value === "" || inputAdresse.value === "" || inputVille.value === "" || inputMail.value == ""){
        window.alert("Veuillez renseigner les 5 champs Prénom, Nom, Adresse, Ville et Mail")
        return false
    }
    if(erreurPrenom.textContent === "" && erreurNom.textContent === "" && erreurAdresse.textContent === "" && erreurVille.textContent === "" && erreurMail.textContent === ""){
      return true
    }
    else{
      window.alert("Les informations saisies ne sont pas correctes")
      return false  
    }
  }

}











