import HeroSection from "@/components/atoms/HeroSection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import HomeCollections from "@/components/molecules/HomeCollections";
import { getHomeBoxCollection } from "@/server/actions/auction";
import { getHomeBoxCollectionClient } from "@/services/auction";
import { IHomeBoxCollection } from "@/types";

export default async function Home() {
  const res = (await getHomeBoxCollection()) as unknown as IHomeBoxCollection[];
  
  const renderHomeCollection = () =>{ 
    if (res) {
      return (
        <section className="common-section md:my-auto mt-12">
          <HomeCollections collectionsData={res} />
        </section>
      );
    }
    return null
  }

  return (
    <main className="mb-4">
      <section>
        <HeroSection />
      </section>
      {renderHomeCollection()}
    </main>
  );
}

export const revalidate = 3600; // 1hr