export const loanForm = {
  title: "Loan Application Form",
  description: "Please fill this form to apply for a loan.",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      name: "amount",
      label: "Loan Amount",
      type: "number",
      placeholder: "Enter loan amount",
      required: true,
    },
    {
      name: "duration",
      label: "Loan Duration (Months)",
      type: "number",
      required: true,
    },
    {
      name: "purpose",
      label: "Purpose",
      type: "textarea",
      placeholder: "What is the purpose of the loan?",
      required: false,
    },
  ],
};
