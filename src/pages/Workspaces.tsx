/**
 * @fileoverview Workspaces Page
 * @description Page for listing and managing user's workspaces
 */

import { useNavigate } from 'react-router-dom';
import { EntityListPage } from '@sudobility/entity_pages';
import { useEntity } from '../contexts/EntityContext';
import type { EntityWithRole } from '@sudobility/entity_client';

export default function Workspaces() {
  const navigate = useNavigate();
  const { entityClient, setCurrentEntity } = useEntity();

  const handleSelectEntity = (entity: EntityWithRole) => {
    setCurrentEntity(entity);
    navigate('/');
  };

  return (
    <EntityListPage
      client={entityClient}
      onSelectEntity={handleSelectEntity}
    />
  );
}
