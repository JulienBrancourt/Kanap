fetchProducts()

//fonction contenant un fetch pour récupérer les infos de l'API
function fetchProducts(){
    const url_api_produits = `http://localhost:3000/api/products`

    fetch(url_api_produits)
    .then((response) =>
        response.json()
    .then((data) => {
        affichageCatalogue(data)
    })
    )
}


// fonction ajoutant des éléments HTML nécessaires à l'affichage
function affichageCatalogue(data){
    let affichage_produits = ""
    for (let canape of data) {
        affichage_produits += 
        `<a href="./product.html?id=${canape._id}">
            <article>
                <img src=${canape.imageUrl} alt=${canape.altTxt}
                <h3 class="productName">${canape.name}
                <p class="productDescription">${canape.description}
            </article>
        </a>`
    }
    document.querySelector("#items").innerHTML = affichage_produits
}

