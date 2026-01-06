/**
 * @fileoverview Members Page
 * @description Page for managing entity members and invitations
 */

import { MembersManagementPage } from '@sudobility/entity_pages';
import { useEntity } from '../contexts/EntityContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

export default function Members() {
  const { entityClient, currentEntity, isLoading } = useEntity();
  const { user } = useAuth();

  if (isLoading || !currentEntity) {
    return <Loading />;
  }

  if (!user?.uid) {
    return null;
  }

  return (
    <MembersManagementPage
      client={entityClient as unknown as Parameters<typeof MembersManagementPage>[0]['client']}
      entity={currentEntity}
      currentUserId={user.uid}
    />
  );
}
