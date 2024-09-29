import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MantineProvider } from "@mantine/core";

export default function Home() {
  return (
    <MantineProvider>
      <Header navSelected="None"/>
        <main className="min-h-screen w-full bg-white">
          <p>home page</p>
        </main>
      <Footer/>
    </MantineProvider>
  );
}
