import { useAuthActions } from "@convex-dev/auth/react";
import { FormEvent } from "react";

export function SignInForm() {
  const { signIn } = useAuthActions();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void signIn("resend", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input name="email" id="email" type="email" required />
      <button type="submit">Send Magic Link</button>
    </form>
  );
}