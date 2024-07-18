function obtenerBusqueda(done){
    const result = fetch ('https://api.mercadolibre.com/sites/MLM/search?q=juguetes');
    result.then(Response => Response.json())
    .then(data => {
        done(data)
    });
}

obtenerBusqueda(data => {
    const section = document.querySelector("section");
    data.results.forEach(articulos => {
        
        const articulo = document.createRange().createContextualFragment(
            `<article class="product-item">
                    <img src="${articulos.thumbnail}" alt="${articulos.id}">
                    <h2>${articulos.tittle}</h2>
                    <p>${articulos.price}</p>
                    <button>Comprar</button>
                </article>`
        );
        section.append(articulo);
    });
}

);

