"use client";

import { useActionState, useState } from "react";
import {
  login,
  sendMagicLink,
  type LoginState,
  type MagicLinkState,
} from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

const initialLoginState: LoginState = { error: null };
const initialMagicLinkState: MagicLinkState = { error: null, sent: false };

function PasswordForm({ next, onUseMagicLink }: { next: string; onUseMagicLink: () => void }) {
  const [state, formAction, pending] = useActionState(login, initialLoginState);

  return (
    <form action={formAction}>
      <FieldGroup>
        <input type="hidden" name="next" value={next} />
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        {state.error ? (
          <FieldError errors={[{ message: state.error }]} />
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onUseMagicLink}
        >
          Sign in with a magic link instead
        </Button>
      </FieldGroup>
    </form>
  );
}

function MagicLinkForm({ next, onUsePassword }: { next: string; onUsePassword: () => void }) {
  const [state, formAction, pending] = useActionState(
    sendMagicLink,
    initialMagicLinkState
  );

  if (state.sent) {
    return (
      <FieldGroup>
        <FieldDescription>
          Check your email for a sign-in link. You can close this tab once
          you&apos;ve clicked it.
        </FieldDescription>
        <Button type="button" variant="outline" className="w-full" onClick={onUsePassword}>
          Back to password sign-in
        </Button>
      </FieldGroup>
    );
  }

  return (
    <form action={formAction}>
      <FieldGroup>
        <input type="hidden" name="next" value={next} />
        <Field>
          <FieldLabel htmlFor="magic-email">Email</FieldLabel>
          <Input
            id="magic-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <FieldDescription>
            We&apos;ll email you a link to sign in without a password.
          </FieldDescription>
        </Field>
        {state.error ? (
          <FieldError errors={[{ message: state.error }]} />
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending…" : "Send magic link"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onUsePassword}
        >
          Back to password sign-in
        </Button>
      </FieldGroup>
    </form>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"password" | "magic-link">("password");

  return mode === "password" ? (
    <PasswordForm next={next} onUseMagicLink={() => setMode("magic-link")} />
  ) : (
    <MagicLinkForm next={next} onUsePassword={() => setMode("password")} />
  );
}
