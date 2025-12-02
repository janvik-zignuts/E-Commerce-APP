import { JSX } from "react";

export interface ProviderConfig {
  name: "Google" | "Facebook";
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
  borderColor: string;
}