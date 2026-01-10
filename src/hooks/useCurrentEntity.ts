import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useEntities } from "@sudobility/entity_client";
import { entityClient } from "../config/entityClient";

interface CurrentEntityResult {
  entitySlug: string | undefined;
  entityId: string | undefined;
  isLoading: boolean;
}

/**
 * Hook to get the current entity information from URL params.
 * Returns entityId for subscription purposes.
 */
export function useCurrentEntity(): CurrentEntityResult {
  const { entitySlug } = useParams<{ entitySlug: string }>();
  const { data: entities, isLoading } = useEntities(entityClient);

  const entityId = useMemo(() => {
    if (!entitySlug || !entities) return undefined;
    const entity = entities.find((e) => e.entitySlug === entitySlug);
    return entity?.id;
  }, [entitySlug, entities]);

  return {
    entitySlug,
    entityId,
    isLoading,
  };
}
