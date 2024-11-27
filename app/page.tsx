'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Home from "@/components/Home";
import { MantineProvider, Paper } from "@mantine/core";
import { CartProvider } from "@/utils/useCart";

export default function HomePage() {
  return (
    <MantineProvider>
      <CartProvider>
        <Header navSelected="None"/>
        <Paper shadow="xl">
          <Home />
        </Paper>
        <Footer/>
      </CartProvider>
    </MantineProvider>
  );
}
