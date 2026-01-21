import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectManager } from '@sudobility/whisperly_lib';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import { useEntity } from '../contexts/EntityContext';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

interface FieldErrors {
  displayName?: string;
  projectName?: string;
}

export default function ProjectNew() {
  const { baseUrl } = useApi();
  const { getIdToken } = useAuth();
  const { currentEntity, isLoading: entityLoading } = useEntity();
  const { entitySlug: routeEntitySlug } = useParams<{ entitySlug: string }>();
  const entitySlug = routeEntitySlug || currentEntity?.entitySlug || '';
  const { navigate } = useLocalizedNavigate();

  const [displayName, setDisplayName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectNameManuallyEdited, setProjectNameManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { projects, createProject, isCreating } = useProjectManager({
    baseUrl,
    getIdToken,
    entitySlug,
  });

  // Get existing project names for duplicate checking
  const existingProjectNames = projects.map(p => p.project_name);

  // Check if project name already exists
  const projectNameExists = (slug: string): boolean => {
    if (!slug) return false;
    return existingProjectNames.some(
      name => name.toLowerCase() === slug.toLowerCase()
    );
  };

  const validateDisplayName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Display name is required';
    }
    if (value.trim().length < 2) {
      return 'Display name must be at least 2 characters';
    }
    return undefined;
  };

  const validateProjectName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Project name is required';
    }
    if (projectNameExists(value.trim())) {
      return 'A project with this name already exists';
    }
    return undefined;
  };

  // Auto-derive project name from display name (unless manually edited)
  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    // Auto-derive project name if not manually edited
    if (!projectNameManuallyEdited) {
      const derived = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setProjectName(derived);
      if (touched.projectName) {
        setFieldErrors(prev => ({
          ...prev,
          projectName: validateProjectName(derived),
        }));
      }
    }
    if (touched.displayName) {
      setFieldErrors(prev => ({
        ...prev,
        displayName: validateDisplayName(value),
      }));
    }
  };

  // Handle manual project name changes
  const handleProjectNameChange = (value: string) => {
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    setProjectName(sanitized);
    setProjectNameManuallyEdited(true);
    if (touched.projectName) {
      setFieldErrors(prev => ({
        ...prev,
        projectName: validateProjectName(sanitized),
      }));
    }
  };

  const handleDisplayNameBlur = () => {
    setTouched(prev => ({ ...prev, displayName: true }));
    setFieldErrors(prev => ({
      ...prev,
      displayName: validateDisplayName(displayName),
    }));
  };

  const handleProjectNameBlur = () => {
    setTouched(prev => ({ ...prev, projectName: true }));
    setFieldErrors(prev => ({
      ...prev,
      projectName: validateProjectName(projectName),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors: FieldErrors = {
      displayName: validateDisplayName(displayName),
      projectName: validateProjectName(projectName),
    };

    setFieldErrors(errors);
    setTouched({ displayName: true, projectName: true });

    // Check if there are any errors
    if (Object.values(errors).some(Boolean)) {
      return;
    }

    try {
      const project = await createProject({
        project_name: projectName.trim(),
        display_name: displayName.trim(),
        description: description.trim() || undefined,
        instructions: undefined,
        default_source_language: undefined,
        default_target_languages: undefined,
        ip_allowlist: undefined,
      });
      if (project) {
        navigate(`/dashboard/${entitySlug}/projects/${project.id}`);
      } else {
        navigate(`/dashboard/${entitySlug}/projects`);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/${entitySlug}/projects`);
  };

  const hasError = (field: keyof FieldErrors) =>
    touched[field] && fieldErrors[field];

  if (entityLoading || !currentEntity) {
    return <Loading />;
  }

  return (
    <Section spacing="lg">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Create New Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={e => handleDisplayNameChange(e.target.value)}
              onBlur={handleDisplayNameBlur}
              placeholder="My Awesome Project"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 outline-none transition-all ${
                hasError('displayName')
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              }`}
              autoFocus
            />
            {hasError('displayName') && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {fieldErrors.displayName}
              </p>
            )}
          </div>

          {/* Project Name (slug) */}
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Project Name (URL-safe identifier)
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={e => handleProjectNameChange(e.target.value)}
              onBlur={handleProjectNameBlur}
              placeholder="my-awesome-project"
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 outline-none transition-all font-mono ${
                hasError('projectName')
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              }`}
            />
            {hasError('projectName') ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {fieldErrors.projectName}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Used in API endpoints. Only lowercase letters, numbers, and hyphens.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description{' '}
              <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !displayName.trim() || !projectName.trim()}
              isLoading={isCreating}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
