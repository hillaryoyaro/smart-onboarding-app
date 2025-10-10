import { kycForm } from "./kycForm";
import { loanForm } from "./loanForm";
import { investmentForm } from "./investmentForm";

export const formRegistry: Record<string, any> = {
  kyc: kycForm,
  loan: loanForm,
  investment: investmentForm,
};
