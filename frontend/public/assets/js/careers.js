const setupCareersForm = () => {
  const form = document.getElementById("careers-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    formData.set("email", String(formData.get("email") || "").trim());
    const role = String(formData.get("position") || "");
    const roleMap = {
      "MERN Developer": "Frontend Developer",
      "Web Developer": "Frontend Developer",
      "AI Engineer": "Backend Developer",
      "Data Analyst": "Technical Writer",
      "Business Developer": "Other",
      "Sales Executive": "Other",
      "Graphics Designer": "UI/UX Designer",
    };
    formData.set("position", roleMap[role] || "Other");

    const response = await fetch("/api/jobs", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      form.reset();
    }
  });
};

document.addEventListener("DOMContentLoaded", setupCareersForm);
