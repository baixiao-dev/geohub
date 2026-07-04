import { Header } from "@/components/layout/header"
import { Hero } from "@/components/sections/hero"
import { AIPlatforms } from "@/components/sections/ai-platforms"
import { Features } from "@/components/sections/features"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AIPlatforms />
        <Features />
      </main>
      <Footer />
    </>
  )
}
