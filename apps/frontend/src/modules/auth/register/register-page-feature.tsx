import { RegisterForm } from './components/register-form';

export function RegisterPageFeature() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <span className="text-2xl font-bold">Carousel Marketplace</span>
        <blockquote className="space-y-2">
          <p className="text-lg italic">"Get started in minutes, scale for years."</p>
        </blockquote>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
