import FaqPage  from '@/components/templates/FaqPage';
import { getFaqData } from '@/server/actions/footer';

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