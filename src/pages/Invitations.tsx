/**
 * @fileoverview Invitations Page
 * @description Page for viewing and responding to pending invitations
 */

import { InvitationsPage } from '@sudobility/entity_pages';
import { entityClient } from '../config/entityClient';
import { useCurrentEntity } from '../hooks/useCurrentEntity';

export default function Invitations() {
  const { refresh } = useCurrentEntity();

  const handleInvitationAccepted = () => {
    // Refresh entities list after accepting an invitation
    refresh();
  };

  return (
    <InvitationsPage
      client={entityClient}
      onInvitationAccepted={handleInvitationAccepted}
    />
  );
}
