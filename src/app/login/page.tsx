'use client';

import Header from '../../components/Header';
import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';
import ErrorMessage from '../../components/ErrorMessage';
import FormContainer from '../../components/FormContainer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.includes('@') || formData.password.length < 8) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    setError('');
    console.log('Login successful:', formData);
    router.push('/topics');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <Header 
        title="Login" 
        subtitle="" 
        titleClass="text-4xl text-gray-800" 
      />
      <FormContainer>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <PasswordField
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />
          <ErrorMessage message={error} />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:text-blue-700 font-medium">
              Sign up here
            </a>
          </p>
        </div>
      </FormContainer>
    </div>
  );
}