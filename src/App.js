//importamos librerias necesarias para obtener la información de la API
import React, { useState, useEffect } from 'react';

//componente encabezado con la marca de los productos
//es una fila subencabezado de los productos que ocupa todas las columnas
function ProductBrandRow({ brand }) {
  return (
    <tr>
      <th colSpan="6" style={{ background: 'gray', color: 'white' }}>
        {brand}
      </th>
    </tr>
  );
}

//componente para mostrar un producto por fila, tambien agregar una imagen
function ProductRow({ product }) {
 

  return (
    <tr>
      <td>{product.title}</td>
      <td>{product.description}</td>
      <td>{product.price}</td>
      <td>{product.stock}</td>
      <td>{product.rating}</td>
      <td> <img src={product.thumbnail} alt={product.title} style={{ width: '50px', height: '50px' }} /></td>
    </tr>
  );
}

//componente que define la tabla de productos
function ProductTable({ products, filterText, isCheap }) {
  const rows = [];
  let lastBrand = null;

  products.forEach(product => {
    if (
      product.title.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (isCheap && product.price >= 500) {
      return;
    }
    if (product.brand !== lastBrand) {
      rows.push(
        <ProductBrandRow
          brand={product.brand}
          key={product.brand}
        />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.title}
      />
    );
    lastBrand = product.brand;
  });


  return (
    <table style={{ borderCollapse: 'collapse', border: '1px solid gray' }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Calificaciones</th>
          <th>Imagen</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

//componente barra de busqeuda
function SearchBar({filterText,isCheap,onFilterTextChange, onIsCheapChange}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText}
        placeholder="Buscar..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <br></br>
      <label>
        <input 
          type="checkbox"
          checked={isCheap} 
          onChange={(e) => onIsCheapChange(e.target.checked)} />
        {' '}
        Solo mostrar productos baratos menores a 500
      </label>
    </form>
  );
}

//componente donde esta la estructura de la tabla
function FilterableProductTable({ products }) {

  //agregamos dos variables de estado y le especificamos el estado inicial
  const [filterText, setFilterText] = useState('');
  const [isCheap, setIsCheap] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        isCheap={isCheap}
        onFilterTextChange={setFilterText}
        onIsCheapChange={setIsCheap} />
      <ProductTable 
        products={products}
        filterText={filterText}
        isCheap={isCheap} />
    </div>
  );
}

//componente principal
export default function App() {

    const [products, setProducts] = useState([]);

    //obtengo los datos del json publico y los guardo
    useEffect(() => {
      fetch('https://dummyjson.com/products/category/smartphones')
        .then(response => response.json())
        .then(data => {
          // Almacena los datos en el estado 'products'
          setProducts(data.products);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }, []);

  return <FilterableProductTable products={products} />;
}
