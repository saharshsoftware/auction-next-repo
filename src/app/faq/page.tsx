import FaqPage  from '@/components/templates/FaqPage';
import { getFaqData } from '@/server/actions/footer';

export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static';

export default async function Page() {
  const res = await getFaqData();
  const faqData = res || []
  return (
    <>
      <FaqPage
        faqData={faqData}
      />
    </>
  );
};