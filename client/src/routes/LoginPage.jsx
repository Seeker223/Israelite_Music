import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-96px)] py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl overflow-hidden shadow-card">
        <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 text-white">
          <div>
            <img src="/logo.png" alt="Israelite Music" className="w-12 h-12 rounded-xl" />
            <h2 className="mt-6 text-3xl font-semibold leading-tight">
              Welcome Back To Israelite Music
            </h2>
            <p className="mt-3 text-white/90">
              Login to continue reading, writing and engaging with the community.
            </p>
          </div>
          <img
            src="/featured1.jpeg"
            alt="Login visual"
            className="rounded-2xl object-cover h-52 w-full border border-white/20"
          />
        </div>
        <div className="p-4 sm:p-6 flex justify-center">
          <SignIn signUpUrl="/register" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
