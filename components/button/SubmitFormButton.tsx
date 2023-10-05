import React, { useState } from "react";
import { Button } from "../ui/button";

interface SubmitFormButtonProps {
  onSubmit: () => Promise<void>;
  buttonText: string;
}

const SubmitFormButton: React.FC<SubmitFormButtonProps> = ({
  onSubmit,
  buttonText,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit();
        setIsSuccess(true);
      } catch (error) {
        // Handle any submission errors here
      } finally {
        setIsSubmitting(false);

        // Reset the success state after a delay (e.g., 2 seconds)
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      }
    }
  };

  return (
    <Button
      type="button"
      onclick={handleClick}
      className={`comment-form_btn ${
        isSubmitting ? "keep-colors-disabled" : ""
      }`}
      disabled={isSubmitting}>
      {
        isSubmitting
          ? "Loading..." // Show a loading message
          : isSuccess
          ? "Success ✓" // Show a success message
          : buttonText // Use the custom button text
      }
    </Button>
  );
};

export default SubmitFormButton;
