import { useState } from 'react';
import {
  RateLimitsPage as RateLimitsPageComponent,
  RateLimitHistoryPage,
} from '@sudobility/ratelimit-pages';
import { useApi } from '../contexts/ApiContext';
import { useNavigate } from 'react-router-dom';

type TabType = 'limits' | 'history';

export default function RateLimits() {
  const { networkClient, baseUrl, token } = useApi();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('limits');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rate Limits</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your API usage and rate limits
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('limits')}
            className={`py-3 text-sm font-medium transition-colors ${
              activeTab === 'limits'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Current Limits
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usage History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'limits' && (
        <RateLimitsPageComponent
          networkClient={networkClient}
          baseUrl={baseUrl}
          token={token}
          onUpgradeClick={() => navigate('/subscription')}
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
    </div>
  );
}
