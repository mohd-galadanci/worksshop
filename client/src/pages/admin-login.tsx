import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '@/lib/admin';
import { Button, Input } from '@/components/ui';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginAdmin(email, password);
    if (res.success) {
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2"
      />
      <Button onClick={handleLogin}>Login</Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
