export const investmentForm = {
  title: "Investment Declaration Form",
  description: "Provide your investment preferences.",
  fields: [
    {
      name: "investorName",
      label: "Investor Name",
      type: "text",
      placeholder: "Enter your name",
      required: true,
    },
    {
      name: "investmentType",
      label: "Investment Type",
      type: "select",
      options: ["Stocks", "Bonds", "Mutual Funds"],
      required: true,
    },
    {
      name: "amount",
      label: "Investment Amount",
      type: "number",
      placeholder: "Enter amount to invest",
      required: true,
    },
  ],
};
