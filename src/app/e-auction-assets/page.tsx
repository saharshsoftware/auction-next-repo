import AllAssets from "@/components/templates/AllAssets";
import React from "react";

import type { Metadata } from "next";
import { getCategoryBoxCollection } from "@/server/actions";
import { IAssetType, ICategoryCollection } from "@/types";
import { getAssetType } from "@/server/actions/auction";

export default async function Page() {
  const data = (await getAssetType()) as unknown as IAssetType[];
  return (
    <>
      <section>
        <AllAssets data={data} />
      </section>
    </>
  );
}
