import { useSubscriptionManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

const TIER_INFO = {
  starter: {
    name: 'Starter',
    price: '$29/mo',
    features: [
      '10,000 requests/month',
      '500 requests/hour',
      'Up to 5 projects',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$99/mo',
    features: [
      '50,000 requests/month',
      '2,000 requests/hour',
      'Unlimited projects',
      'Priority support',
      'Custom glossaries',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited requests',
      'Custom rate limits',
      'Unlimited projects',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
};

export default function Subscription() {
  const client = useWhisperly();
  const {
    subscription,
    tier,
    monthlyUsed,
    monthlyLimit,
    monthlyRemaining,
    hourlyUsed,
    hourlyLimit,
    hourlyRemaining,
    isLoading,
    syncWithRevenueCat,
    isSyncing,
  } = useSubscriptionManager(client);

  if (isLoading) {
    return <Loading />;
  }

  const currentTier = tier ? TIER_INFO[tier] : null;
  const usagePercent =
    monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0;
  const hourlyPercent =
    hourlyLimit > 0 ? (hourlyUsed / hourlyLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your subscription and view usage
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => syncWithRevenueCat()}
          isLoading={isSyncing}
        >
          Sync Subscription
        </Button>
      </div>

      {currentTier && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentTier.name} Plan
              </h2>
              <p className="text-2xl font-bold text-primary-600 mt-1">
                {currentTier.price}
              </p>
            </div>
            <span className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
              Current Plan
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {currentTier.features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900">Monthly Usage</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{monthlyUsed.toLocaleString()} used</span>
              <span>{monthlyLimit.toLocaleString()} limit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  usagePercent > 90
                    ? 'bg-red-500'
                    : usagePercent > 70
                    ? 'bg-yellow-500'
                    : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {monthlyRemaining.toLocaleString()} requests remaining this month
            </p>
            {subscription?.month_reset_at && (
              <p className="text-xs text-gray-500 mt-1">
                Resets on{' '}
                {new Date(subscription.month_reset_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900">Hourly Usage</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{hourlyUsed.toLocaleString()} used</span>
              <span>{hourlyLimit.toLocaleString()} limit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  hourlyPercent > 90
                    ? 'bg-red-500'
                    : hourlyPercent > 70
                    ? 'bg-yellow-500'
                    : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(hourlyPercent, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {hourlyRemaining.toLocaleString()} requests remaining this hour
            </p>
            {subscription?.hour_reset_at && (
              <p className="text-xs text-gray-500 mt-1">
                Resets at{' '}
                {new Date(subscription.hour_reset_at).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Available Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          {Object.entries(TIER_INFO).map(([tierId, info]) => (
            <div
              key={tierId}
              className={`p-6 ${
                tier === tierId ? 'bg-primary-50' : ''
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {info.name}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {info.price}
              </p>
              <ul className="mt-4 space-y-2">
                {info.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {tier === tierId ? (
                  <span className="text-sm text-primary-600 font-medium">
                    Current Plan
                  </span>
                ) : (
                  <Button
                    variant={tierId === 'enterprise' ? 'secondary' : 'primary'}
                    size="sm"
                    className="w-full"
                  >
                    {tierId === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
