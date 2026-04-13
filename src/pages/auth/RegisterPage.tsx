import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OTP STATES
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // ✅ PASSWORD STRENGTH
  const getStrength = () => {
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (getStrength() === "Weak") return "text-red-500";
    if (getStrength() === "Medium") return "text-yellow-500";
    return "text-green-600";
  };

  // ✅ STEP 1 REGISTER → GO TO OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);

      // ❌ NO DIRECT NAVIGATION
      // ✅ GO TO OTP STEP
      setStep(2);
      setIsLoading(false);

    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  // ✅ STEP 2 VERIFY OTP
  const verifyOtp = () => {
    if (otp === "1234") {
      navigate(
        role === 'entrepreneur'
          ? '/dashboard/entrepreneur'
          : '/dashboard/investor'
      );
    } else {
      setError("Invalid OTP. Try 1234");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {/* ERROR */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 🔹 STEP 1 REGISTER */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* ROLE */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md ${role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50'
                      : ''
                    }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} /> Entrepreneur
                </button>

                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md ${role === 'investor'
                      ? 'border-primary-500 bg-primary-50'
                      : ''
                    }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} /> Investor
                </button>
              </div>

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                startAdornment={<User size={18} />}
              />

              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                startAdornment={<Mail size={18} />}
              />

              {/* PASSWORD */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  startAdornment={<Lock size={18} />}
                />

                {password && (
                  <p className={`text-sm mt-1 ${getStrengthColor()}`}>
                    Strength: {getStrength()}
                  </p>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                startAdornment={<Lock size={18} />}
              />

              <Button type="submit" fullWidth isLoading={isLoading}>
                Create Account
              </Button>

            </form>
          )}

          {/* 🔹 STEP 2 OTP */}
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

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-600">
              Already have an account?
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};