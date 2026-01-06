/**
 * @fileoverview Entity Context
 * @description Provides entity client and current entity state management
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import {
  EntityClient,
  useEntities,
  type EntityWithRole,
} from '@sudobility/entity_client';
import { useApi } from './ApiContext';

const CURRENT_ENTITY_KEY = 'whisperly_current_entity';

interface EntityContextValue {
  entityClient: EntityClient;
  entities: EntityWithRole[];
  currentEntity: EntityWithRole | null;
  isLoading: boolean;
  setCurrentEntity: (entity: EntityWithRole) => void;
}

const EntityContext = createContext<EntityContextValue | null>(null);

export function EntityProvider({ children }: { children: ReactNode }) {
  const { baseUrl, token, isReady } = useApi();
  const [currentEntity, setCurrentEntityState] = useState<EntityWithRole | null>(null);

  const entityClient = useMemo(
    () =>
      new EntityClient({
        baseUrl: `${baseUrl}/api/v1`,
        getAuthToken: async () => token,
      }),
    [baseUrl, token]
  );

  const { data: entities = [], isLoading: entitiesLoading } = useEntities(
    entityClient
  );

  // Load saved entity from localStorage on mount
  useEffect(() => {
    if (entities.length > 0 && !currentEntity) {
      const savedSlug = localStorage.getItem(CURRENT_ENTITY_KEY);
      const savedEntity = savedSlug
        ? entities.find(e => e.entitySlug === savedSlug)
        : null;

      // Use saved entity, or default to personal entity, or first entity
      const defaultEntity =
        savedEntity ||
        entities.find(e => e.entityType === 'personal') ||
        entities[0];

      if (defaultEntity) {
        setCurrentEntityState(defaultEntity);
      }
    }
  }, [entities, currentEntity]);

  const setCurrentEntity = useCallback((entity: EntityWithRole) => {
    setCurrentEntityState(entity);
    localStorage.setItem(CURRENT_ENTITY_KEY, entity.entitySlug);
  }, []);

  const value = useMemo<EntityContextValue>(
    () => ({
      entityClient,
      entities,
      currentEntity,
      isLoading: !isReady || entitiesLoading,
      setCurrentEntity,
    }),
    [entityClient, entities, currentEntity, isReady, entitiesLoading, setCurrentEntity]
  );

  return (
    <EntityContext.Provider value={value}>{children}</EntityContext.Provider>
  );
}

export function useEntity(): EntityContextValue {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
}
