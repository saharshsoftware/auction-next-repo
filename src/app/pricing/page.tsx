import PricingPlans from "@/components/templates/PricingPlans";

export default function Page(): JSX.Element {
  // // Option 1: With tooltips (default) - reduces repetition by showing descriptions on hover
  // return <PricingPlans showTooltips={true} showLegend={false} showDescriptions={false} />;
  
  // Option 2: With legend - reduces repetition by showing all definitions once at the bottom
  // return <PricingPlans showTooltips={false} showLegend={true} showDescriptions={false} />;
  
  // Option 3: With inline descriptions (original behavior)
  return <PricingPlans showTooltips={false} showLegend={false} showDescriptions={true} />;
}

