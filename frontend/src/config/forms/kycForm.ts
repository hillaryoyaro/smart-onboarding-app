export const kycForm = {
  title: "KYC Form",
  description: "Know Your Customer details for verification.",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      name: "nationalId",
      label: "National ID",
      type: "text",
      placeholder: "Enter your ID number",
      required: true,
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter your address",
      required: false,
    },
  ],
};
