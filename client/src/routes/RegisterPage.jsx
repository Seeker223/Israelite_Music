import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-96px)] py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl overflow-hidden shadow-card">
        <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-slate-900 via-brand-800 to-slate-700 text-white">
          <div>
            <img src="/logo.png" alt="Israelite Music" className="w-12 h-12 rounded-xl" />
            <h2 className="mt-6 text-3xl font-semibold leading-tight">
              Join The Israelite Music Community
            </h2>
            <p className="mt-3 text-white/90">
              Create an account to upload music and join the Israelite Music community.
            </p>
          </div>
          <img
            src="/featured2.jpeg"
            alt="Register visual"
            className="rounded-2xl object-cover h-52 w-full border border-white/20"
          />
        </div>
        <div className="p-4 sm:p-6 flex justify-center">
          <SignUp signInUrl="/login" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
