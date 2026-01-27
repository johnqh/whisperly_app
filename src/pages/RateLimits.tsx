import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RateLimitsDashboard } from '@sudobility/ratelimit_pages';
import { useApi } from '../contexts/ApiContext';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import { Section } from '../components/layout/Section';

export default function RateLimits() {
  const { t } = useTranslation('rateLimits');
  const { entitySlug: routeEntitySlug } = useParams<{ entitySlug: string }>();
  const { networkClient, baseUrl, token, testMode } = useApi();
  const { currentEntity } = useCurrentEntity();
  const { navigate } = useLocalizedNavigate();

  const entitySlug = routeEntitySlug || currentEntity?.entitySlug || '';

  const handleUpgradeClick = () => {
    navigate(`/dashboard/${entitySlug}/subscription`);
  };

  return (
    <>
      <Section spacing="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('pageTitle', 'Rate Limits')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('pageDescription', 'View your API usage and rate limits')}
        </p>
      </Section>

      <RateLimitsDashboard
        networkClient={networkClient}
        baseUrl={baseUrl}
        token={token}
        entitySlug={entitySlug}
        onUpgradeClick={handleUpgradeClick}
        upgradeButtonLabel={t('upgradeButton', 'Upgrade Plan')}
        testMode={testMode}
        labels={{
          currentLimitsTab: t('tabs.currentLimits', 'Current Limits'),
          usageHistoryTab: t('tabs.usageHistory', 'Usage History'),
          limitsPage: {
            title: t('limits.title', 'Rate Limits'),
            loadingText: t('loading', 'Loading...'),
            errorText: t('error', 'Failed to load rate limits'),
            retryText: t('retry', 'Retry'),
            usageTitle: t('usage.title', 'Current Usage'),
            tiersTitle: t('tiers.title', 'Plan Comparison'),
            usedLabel: t('usage.used', 'used'),
            limitLabel: t('usage.limit', 'limit'),
            unlimitedLabel: t('usage.unlimited', 'Unlimited'),
            remainingLabel: t('usage.remaining', 'remaining'),
            hourlyLabel: t('periods.hourly', 'Hourly'),
            dailyLabel: t('periods.daily', 'Daily'),
            monthlyLabel: t('periods.monthly', 'Monthly'),
            currentTierBadge: t('currentTier', 'Current'),
          },
          historyPage: {
            title: t('history.title', 'Usage History'),
            loadingText: t('loading', 'Loading...'),
            errorText: t('historyError', 'Failed to load usage history'),
            retryText: t('retry', 'Retry'),
            chartTitle: '',
            requestsLabel: t('history.requests', 'Requests'),
            limitLabel: t('usage.limit', 'Limit'),
            noDataLabel: t('history.noData', 'No usage data available for this period'),
            hourlyTab: t('periods.hourly', 'Hourly'),
            dailyTab: t('periods.daily', 'Daily'),
            monthlyTab: t('periods.monthly', 'Monthly'),
          },
        }}
      />
    </>
  );
}
