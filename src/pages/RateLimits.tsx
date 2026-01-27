import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  RateLimitsPage as RateLimitsPageComponent,
  RateLimitHistoryPage,
} from '@sudobility/ratelimit_pages';
import { useApi } from '../contexts/ApiContext';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import { Section } from '../components/layout/Section';

type TabType = 'limits' | 'history';

export default function RateLimits() {
  const { entitySlug: routeEntitySlug } = useParams<{ entitySlug: string }>();
  const { networkClient, baseUrl, token } = useApi();
  const { currentEntity } = useCurrentEntity();
  const { navigate } = useLocalizedNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('limits');

  const entitySlug = routeEntitySlug || currentEntity?.entitySlug || '';

  return (
    <>
      <Section spacing="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rate Limits</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your API usage and rate limits
        </p>
      </Section>

      <Section spacing="lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab('limits')}
              className={`py-3 text-sm font-medium transition-colors ${
                activeTab === 'limits'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Current Limits
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Usage History
            </button>
          </nav>
        </div>
      </Section>

      {/* Tab Content */}
      {activeTab === 'limits' && (
        <RateLimitsPageComponent
          networkClient={networkClient}
          baseUrl={baseUrl}
          token={token}
          entitySlug={entitySlug}
          onUpgradeClick={() => navigate(`/dashboard/${entitySlug}/subscription`)}
          upgradeButtonLabel="Upgrade Plan"
          autoFetch={true}
          labels={{
            title: 'Rate Limits',
            loadingText: 'Loading...',
            errorText: 'Failed to load rate limits',
            retryText: 'Retry',
            usageTitle: 'Current Usage',
            tiersTitle: 'Plan Comparison',
            usedLabel: 'used',
            limitLabel: 'limit',
            unlimitedLabel: 'Unlimited',
            remainingLabel: 'remaining',
            hourlyLabel: 'Hourly',
            dailyLabel: 'Daily',
            monthlyLabel: 'Monthly',
            currentTierBadge: 'Current',
          }}
        />
      )}

      {activeTab === 'history' && (
        <RateLimitHistoryPage
          networkClient={networkClient}
          baseUrl={baseUrl}
          token={token}
          entitySlug={entitySlug}
          autoFetch={true}
          chartHeight={350}
          labels={{
            title: 'Usage History',
            loadingText: 'Loading...',
            errorText: 'Failed to load usage history',
            retryText: 'Retry',
            chartTitle: '',
            requestsLabel: 'Requests',
            limitLabel: 'Limit',
            noDataLabel: 'No usage data available for this period',
            hourlyTab: 'Hourly',
            dailyTab: 'Daily',
            monthlyTab: 'Monthly',
          }}
        />
      )}
    </>
  );
}
