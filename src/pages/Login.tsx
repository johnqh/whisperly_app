import { useNavigate } from 'react-router-dom';
import { LoginPage } from '@sudobility/building_blocks';
import { getFirebaseAuth } from '@sudobility/auth_lib';

export default function Login() {
  const navigate = useNavigate();
  const auth = getFirebaseAuth();

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Firebase not configured</p>
      </div>
    );
  }

  return (
    <LoginPage
      appName="Whisperly"
      auth={auth}
      onSuccess={() => navigate('/')}
    />
  );
}
