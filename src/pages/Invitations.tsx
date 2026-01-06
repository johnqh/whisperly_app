/**
 * @fileoverview Invitations Page
 * @description Page for viewing and responding to pending invitations
 */

import { InvitationsPage } from '@sudobility/entity_pages';
import { useEntity } from '../contexts/EntityContext';
import { useQueryClient } from '@tanstack/react-query';

export default function Invitations() {
  const { entityClient } = useEntity();
  const queryClient = useQueryClient();

  const handleInvitationAccepted = () => {
    // Refresh entities list after accepting an invitation
    queryClient.invalidateQueries({ queryKey: ['entities'] });
  };

  return (
    <InvitationsPage
      client={entityClient as unknown as Parameters<typeof InvitationsPage>[0]['client']}
      onInvitationAccepted={handleInvitationAccepted}
    />
  );
}
