import { useState } from "react";

// Custom hook to prevent multiple form submissions
const usePreventMultipleSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preventMultipleSubmit = async (callback: () => any) => {
    if (isSubmitting) {
      return; // If the form is already being submitted, do nothing
    }

    setIsSubmitting(true); // Set the isSubmitting state to true to prevent further submissions

    try {
      await callback();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      // After the form submission (success or error), reset the isSubmitting state
      setIsSubmitting(false);
    }
  };

  return preventMultipleSubmit;
};

export default usePreventMultipleSubmit;
