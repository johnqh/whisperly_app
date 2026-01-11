/**
 * @fileoverview Workspaces Page
 * @description Page for listing and managing user's workspaces
 */

import { EntityListPage } from '@sudobility/entity_pages';
import { entityClient } from '../config/entityClient';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import type { EntityWithRole } from '@sudobility/entity_client';

export default function Workspaces() {
  const { navigate } = useLocalizedNavigate();
  const { selectEntity } = useCurrentEntity();

  const handleSelectEntity = (entity: EntityWithRole) => {
    selectEntity(entity.entitySlug);
    navigate(`/dashboard/${entity.entitySlug}`);
  };

  return (
    <EntityListPage
      client={entityClient}
      onSelectEntity={handleSelectEntity}
    />
  );
}
