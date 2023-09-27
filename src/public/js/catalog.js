const socket = io()
let cid = "6513926aea1ed4bc69f73a0d"


socket.on('AllProductsCart', (data) => {
    updateProductCatalogList(data);
});

socket.on('newProductinCart', (data) => {
    
    updateProductCounter(data);
});
const manegedivShown = () => {
    const counterSpam = document.getElementById("counter");
    counterSpam.style.display = "none";
};

function updateProductCounter(data) {

    const splitString = data.split("|");
    if (splitString[0] == "SUC") {
        const counterSpam = document.getElementById("counter");
        counterSpam.style.display = "block";
        counterSpam.innerHTML = "Se agrego el producto al carrito"
        setTimeout(manegedivShown, 2000);
       
    } else {
        const counterSpam = document.getElementById("counter");
        counterSpam.style.display = "block";
        counterSpam.innerHTML = "No se pudo agregar al carrito"
        setTimeout(manegedivShown, 2000);
       
    }
}

socket.on('cartInforSend', (messag) => {
    cartID = messag.docs.id
});

// Función para actualizar la lista de productos disponibles en el catalogo en mi página web
function updateProductCatalogList(productList) {
    // console.log(productList)
    const catalogDiv = document.getElementById("catalogo");
    let contenidocambiante = ""

    productList.docs.forEach(({ thumbnail, price, description, _id, code, stock, status, category, title }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        Price: ${price} $ </br> 
                        Description : ${description} </br> 
                        Code: ${code}</br> 
                        Stock: ${stock}</br> 
                        Status: ${status}</br> 
                        Category: ${category}</br> 
                        <button id="btn-catalogo-${_id}" class="btn btn-success">Agregar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
    botonesCatalogo(productList)
}

// Función para actualizar la lista de productos dentro de mi carrito
function updateCartProductsList(CartProductsList) {
    const catalogDiv = document.getElementById("carrito");
    let contenidocambiante = ""

    CartProductsList.forEach(({ thumbnail, _id, title }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        <button id="btn-carrito-${_id}" class="btn btn-danger">Quitar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
}

const botonesCatalogo = (CatalogList) => {
    for (const catalogo of CatalogList.docs) {
        const botonId = `btn-catalogo-${catalogo.id}`;
        const botonNodo = document.getElementById(botonId);
        botonNodo.addEventListener("click", (evt) => {
            evt.preventDefault()
            let pid = catalogo.id;
            console.log(pid)
            console.log(cid)

            socket.emit('addNewProducttoCart', {
                pid, cid,
            })
            // mostrarCarrito();
        });
    }
};

// let productForm = document.getElementById("formProduct");
// productForm.addEventListener('submit', (evt) => {
//     evt.preventDefault()
//     console.log("entra en el form")
//     // productForm.style = 'display:none'
//     let cid = productForm.elements.cartID.value;
//     console.log(cid)
//     socket.emit('obtainCartInfo', {
//         cid,
//     })
//     productForm.reset()
//     productForm.style = 'display:none'
// })

function ManageAnswer(answer) {
    const arrayAnswer = []
    if (answer) {
        const splitString = answer.split("|");
        switch (splitString[0]) {
            case "E01":
                arrayAnswer.push(400)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "E02":
                arrayAnswer.push(404)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "SUC":
                arrayAnswer.push(200)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "ERR":
            default:
                arrayAnswer.push(500)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
        }
    }
}

