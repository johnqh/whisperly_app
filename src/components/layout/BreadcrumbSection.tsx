import { ChevronRight, Home } from "lucide-react";
import { LocalizedLink } from "./LocalizedLink";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";

export function BreadcrumbSection() {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-border bg-muted/30 px-4 py-2"
    >
      <div className="container mx-auto">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {crumb.href ? (
                <LocalizedLink
                  to={crumb.href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  {index === 0 && <Home className="h-4 w-4" />}
                  <span>{crumb.label}</span>
                </LocalizedLink>
              ) : (
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default BreadcrumbSection;
