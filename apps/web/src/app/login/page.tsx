"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/");
  }

  return (
    <main className="standalone-page login-page">
      <section className="standalone-card login-card">
        <a href="/" className="standalone-brand" aria-label="PresenCA, início">
          <span className="brand-mark"><BrandLogo /></span>
          <span className="brand-text">Presen<span className="brand-highlight">CA</span></span>
        </a>
        <span className="standalone-icon login-icon"><LockKeyhole size={21} /></span>
        <span className="eyebrow">CRISTO ALEGRIA</span>
        <h1>Entrar no PresenCA</h1>
        <p>Acesse sua conta para continuar.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="settings-label">
            LOGIN
            <input autoComplete="username" required name="login" placeholder="Seu login" />
          </label>
          <label className="settings-label">
            SENHA
            <span className="auth-password">
              <input autoComplete="current-password" required name="password" type={showPassword ? "text" : "password"} placeholder="Sua senha" />
              <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>
          <button type="submit" className="button button-primary login-submit">Entrar <ArrowRight size={15} /></button>
        </form>
      </section>
      <div className="standalone-footer">Sistema de Gestão de Presença <span>·</span> Cristo Alegria</div>
    </main>
  );
}
