import HeroSection from "@/components/atoms/HeroSection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import HomeCollections from "@/components/molecules/HomeCollections";

export default async function Home() {
  return (
    <main className="mb-4">
      <section>
        <HeroSection />
      </section>
      <section className="common-section">
        {/* <CategoryCollection /> */}
        <HomeCollections />
      </section>
    </main>
  );
}

export const revalidate = 300;