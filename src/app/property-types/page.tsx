import AllAssets from "@/components/templates/AllAssets";
import React from "react";

import { IAssetType } from "@/types";
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
