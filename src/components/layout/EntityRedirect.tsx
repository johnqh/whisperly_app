import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEntities } from "@sudobility/entity_client";
import { entityClient } from "../../config/entityClient";

const LAST_ENTITY_KEY = "whisperly_last_entity";

/**
 * Redirects from /dashboard to /dashboard/:entitySlug
 * Picks the last used entity, personal entity, or first available entity
 */
export function EntityRedirect() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { data: entities, isLoading, error } = useEntities(entityClient);

  useEffect(() => {
    if (isLoading) return;

    if (error || !entities || entities.length === 0) {
      console.error("No entities available for user");
      return;
    }

    // Try to find the last used entity
    const lastEntitySlug = localStorage.getItem(LAST_ENTITY_KEY);
    const lastEntity = lastEntitySlug
      ? entities.find((e) => e.entitySlug === lastEntitySlug)
      : null;

    // Pick default: last used > personal > first
    const defaultEntity =
      lastEntity ||
      entities.find((e) => e.entityType === "personal") ||
      entities[0];

    if (defaultEntity) {
      // Save as last used
      localStorage.setItem(LAST_ENTITY_KEY, defaultEntity.entitySlug);
      // Redirect to the entity dashboard
      navigate(`/${lang}/dashboard/${defaultEntity.entitySlug}`, {
        replace: true,
      });
    }
  }, [entities, isLoading, error, navigate, lang]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );
}

export default EntityRedirect;
