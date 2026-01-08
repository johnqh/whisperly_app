import { Outlet, Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import { useAuth } from '../contexts/AuthContext';
import { useEntity } from '../contexts/EntityContext';
import { EntitySelector } from '@sudobility/entity-components';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/projects', label: 'Projects' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/rate-limits', label: 'Rate Limits' },
  { path: '/members', label: 'Members' },
  { path: '/settings', label: 'Settings' },
  { path: '/subscription', label: 'Subscription' },
];

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const { entities, currentEntity, setCurrentEntity } = useEntity();

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-4">
                <Link to="/" className="text-xl font-bold text-primary-600">
                  Whisperly
                </Link>
                <EntitySelector
                  entities={entities}
                  currentEntity={currentEntity}
                  onSelect={setCurrentEntity}
                  onCreateNew={() => window.location.href = '/workspaces'}
                />
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
