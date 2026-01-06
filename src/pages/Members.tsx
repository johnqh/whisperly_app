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
      client={entityClient}
      entity={currentEntity}
      currentUserId={user.uid}
    />
  );
}
