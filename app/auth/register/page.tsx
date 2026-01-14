import { Metadata } from "next";
import { RegisterClient } from "./register-client";

export const metadata: Metadata = {
  title: "Join Stallion",
  description: "Create an account to hire talent or find high-impact bounties.",
};

export default function RegisterPage(props: { searchParams: Promise<{ role?: string }> }) {
  return <RegisterClient searchParamsPromise={props.searchParams} />;
}
