const urlPageProduit = new URL(window.location.href)
const orderId = urlPageProduit.searchParams.get('orderId')

let affichageCommande = orderId
document.querySelector("#orderId").innerHTML = affichageCommande