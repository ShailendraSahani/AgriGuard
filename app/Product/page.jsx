"use client";
import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((p) => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <p>₹{(p.price_cents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
