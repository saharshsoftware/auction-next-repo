import HeroSection from "@/components/atoms/HeroSection";
import CategoryCollection from "@/components/molecules/CategoryCollection";
import HomeCollections from "@/components/molecules/HomeCollections";
import { getHomeBoxCollection } from "@/server/actions/auction";
import { getHomeBoxCollectionClient } from "@/services/auction";
import { IHomeBoxCollection } from "@/types";

export default async function Home() {
  const res = (await getHomeBoxCollection()) as unknown as IHomeBoxCollection[];
  return (
    <main className="mb-4">
      <section>
        <HeroSection />
      </section>
      <section className="common-section md:my-auto mt-12">
        {/* <CategoryCollection /> */}
        <HomeCollections collectionsData={res}/>
      </section>
    </main>
  );
}

export const revalidate = 36000;