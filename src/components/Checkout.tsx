// components/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Product } from '../models/products';

const Checkout: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [sku: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(true);


  const fetchProducts = async () => {
    setIsProductLoading(true);
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data.products);
    setIsProductLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (sku: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [sku]: (prevCart[sku] || 0) + 1,
    }));
    // await calculateTotal();
  };

  const clearCart = async () => {
    setCart({});
    setDiscountedPrice(0);
    setTotalPrice(0);
  };

  const calculateTotal = async () => {
    setIsLoading(true);

    const skus = Object.entries(cart).flatMap(([sku, quantity]) => Array(quantity).fill(sku));

    const response = await fetch('/api/calculate-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skus }),
    });

    const data = await response.json();
    setDiscountedPrice(data.discountedPrice);
    setTotalPrice(data.totalPrice);

    setIsLoading(false);
  };

  return (
    <Box p={10}>
      <Heading as="h1" size="xl" mb={8}>
        Swift Checkout
      </Heading>

      {
        isProductLoading ? (
          <Text>Loading products...</Text>
        ) : products && products.length > 0 ? (
          <Stack spacing={4}>
            {products.map((product) => (
              <Box key={product.sku} display="flex" justifyContent="space-between" alignItems="center">
                <Text>
                  {product.name} - ${product.price}
                </Text>
                <Button onClick={() => addToCart(product.sku)}>Add to Cart</Button>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No products found.</Text>
        )
      }

      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Cart
        </Heading>
        {Object.entries(cart).map(([sku, quantity]) => {
          const product = products.find((p) => p.sku === sku);
          return (
            <Text key={sku}>
              {product?.name} x {quantity}
            </Text>
          );
        })}
      </Box>



      <Button mt={4} onClick={calculateTotal}>
        Calculate Total
      </Button>


      <Text mt={4}>
        Total Price: {isLoading ? 'Loading...' : `$${totalPrice.toFixed(2)}`}
      </Text>
      <Text mt={4}>
        Discounted Price: {isLoading ? 'Loading...' : `$${discountedPrice.toFixed(2)}`}
      </Text>

      <Button mt={4} onClick={clearCart}>
        Clear Cart
      </Button>

    </Box>
  );
};

export default Checkout;