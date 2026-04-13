import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OTP STATES
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ STEP 1: JUST MOVE TO OTP (NO LOGIN HERE)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setStep(2); // 👉 SHOW OTP SCREEN
  };

  // ✅ STEP 2: VERIFY OTP THEN LOGIN
  const verifyOtp = async () => {
    if (otp === "1234") {
      try {
        await login(email, password, role); // ✅ LOGIN HERE

        navigate(
          role === 'entrepreneur'
            ? '/dashboard/entrepreneur'
            : '/dashboard/investor'
        );
      } catch (err) {
        setError("Login failed");
      }
    } else {
      setError("Invalid OTP. Try 1234");
    }
  };

  // Demo credentials
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to Business Nexus
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 🔹 STEP 1: LOGIN */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Role */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md ${role === 'entrepreneur' ? 'bg-primary-50 border-primary-500' : ''
                    }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} /> Entrepreneur
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md ${role === 'investor' ? 'bg-primary-50 border-primary-500' : ''
                    }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} /> Investor
                </button>
              </div>

              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                startAdornment={<User size={18} />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              <Button type="submit" fullWidth leftIcon={<LogIn size={18} />}>
                Sign in
              </Button>

              {/* Demo */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => fillDemoCredentials('entrepreneur')}>
                  Demo Entrepreneur
                </Button>

                <Button variant="outline" onClick={() => fillDemoCredentials('investor')}>
                  Demo Investor
                </Button>
              </div>

            </form>
          )}

          {/* 🔹 STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">

              <p className="text-center text-gray-600">
                Enter OTP (use <b>1234</b>)
              </p>

              <Input
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
              />

              <Button fullWidth onClick={verifyOtp}>
                Verify OTP
              </Button>

            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/register" className="text-primary-600">
              Create account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};