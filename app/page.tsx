import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MantineProvider, Paper } from "@mantine/core";

export default function Home() {
  return (
    <MantineProvider>
      <Header navSelected="None"/>
      <Paper shadow="xl">
        <main className="min-h-screen mb-[18rem] w-full bg-white">
            <p>home page</p>
        </main>
        </Paper>
      <Footer/>
    </MantineProvider>
  );
}
