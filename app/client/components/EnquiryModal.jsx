import React, { useState } from "react";
import axios from "axios";

const EnquiryFormModal = ({ cardData }) => {
  const [formData, setFormData] = useState({
    viewerName: "",
    email: "",
    body: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null); // Possible values: 'success', 'error', null
  const [formErrors, setFormErrors] = useState({
    viewerName: "",
    email: "",
    body: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the validation error message when user starts typing
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.viewerName.trim()) {
      setFormErrors({
        ...formErrors,
        viewerName: "Viewer Name is required",
      });
      return;
    }

    if (!formData.email.trim()) {
      setFormErrors({
        ...formErrors,
        email: "email is required",
      });
      return;
    }

    if (!formData.body.trim()) {
      setFormErrors({
        ...formErrors,
        body: "Message is required",
      });
      return;
    }

    try {
      const data = {
        viewerName: formData.viewerName,
        email: formData.email,
        body: formData.body,
        cardOwnerName: cardData?.userName,
        exprienceName: cardData?.arexperienceName,
        userId: cardData?.userId,
        // createdAt:cardData?.updatedAt
      };

      const response = await axios.post(
        "https://sandboxapi.immarsify.com/api/inquiries/add_inquiry",
        data
      );
      console.log("API Response:", response);

      if (response?.status === 201) {
        setSubmitStatus("success");
        setFormData({
          viewerName: "",
          email: "",
          body: "",
        });

        setTimeout(() => {
          setSubmitStatus(null);
          document.getElementById("enquiryModal").style.display = "none";
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }
  };

  return (
    <div>
      <div
        id="enquiryModal"
        style={{
          display: "none",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 2147483647,
        }}
      >
        <div
          style={{
            position: "relative",
            margin: "10% auto",
            padding: "20px",
            width: "80%",
            maxWidth: "500px",
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Close Button */}
          <span
            onClick={() =>
              (document.getElementById("enquiryModal").style.display = "none")
            }
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
              fontSize: "24px",
            }}
          >
            &times;
          </span>

          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Enquiry Form
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="viewerName"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Name:
              </label>
              <input
                type="text"
                id="viewerName"
                name="viewerName"
                value={formData.viewerName}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
              {formErrors.viewerName && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {formErrors.viewerName}
                </p>
              )}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
              {formErrors.email && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {formErrors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="body"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Message:
              </label>
              <textarea
                type="text"
                id="body"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  resize: "none",
                  minHeight: "90px",
                }}
                required
              />
              {formErrors.body && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  {formErrors.body}
                </p>
              )}
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2111a5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>

          {/* Success Message */}
          {submitStatus === "success" && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#dff0d8",
                border: "1px solid #d0e9c6",
                borderRadius: "4px",
                color: "#3c763d",
                textAlign: "center",
              }}
            >
              Form submitted successfully!
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f2dede",
                border: "1px solid #ebccd1",
                borderRadius: "4px",
                color: "#a94442",
                textAlign: "center",
              }}
            >
              Error submitting form. Please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryFormModal;
