/**
 * @fileoverview Members Page
 * @description Page for managing entity members and invitations
 */

import { MembersManagementPage } from '@sudobility/entity_pages';
import { useAuthStatus } from '@sudobility/auth-components';
import { entityClient } from '../config/entityClient';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import Loading from '../components/Loading';

export default function Members() {
  const { currentEntity, isLoading } = useCurrentEntity();
  const { user } = useAuthStatus();

  if (isLoading || !currentEntity) {
    return <Loading />;
  }

  if (!user?.uid) {
    return null;
  }

  return (
    <MembersManagementPage
      client={entityClient}
      entity={currentEntity}
      currentUserId={user.uid}
    />
  );
}
