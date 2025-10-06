const fetcher = async (...args) => {
  const res = await fetch(...args);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: "Non-JSON response" };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default fetcher;
