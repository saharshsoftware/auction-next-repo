import React from 'react'
import SubscriptionPlans from '../molecules/SubscriptionPlans'
import { fetchSubscriptions } from '@/server/actions/subscription';

const Subscriptions = async () => {
  const subscriptions = await fetchSubscriptions();

  if (!subscriptions) {
    return <div>Error fetching subscriptions</div>;
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Choose your plan</h1>
        <p className="text-muted-foreground text-lg">
          Subscribe to unlock premium features and take your experience to the next level.
        </p>
      </div>
      <SubscriptionPlans plans={subscriptions} />
    </div>
  )
}

export default Subscriptions