document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("image-input");
  const imagePreview = document.getElementById("image-preview");
  const imageName = document.getElementById("image-name");
  const previewImg = document.getElementById("preview-img");
  const removeButton = document.getElementById("remove-button");
  const translateButton = document.getElementById("translate-button");
  const loadingSpinner = document.getElementById("loading");
  const resultsSection = document.getElementById("results");
  const resultsList = document.getElementById("results-list");

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (file) {
      imageName.textContent = file.name;
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImg.src = e.target.result;
        imagePreview.classList.remove("hidden"); // Show the preview section
        translateButton.disabled = false;
      };

      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.add("hidden"); // Hide the preview section if no file is selected
      translateButton.disabled = true;
    }
  });

  removeButton.addEventListener("click", function () {
    imageInput.value = "";
    imagePreview.classList.add("hidden"); // Hide the preview section
    translateButton.disabled = true;
    previewImg.src = "";
  });

  translateButton.addEventListener("click", async function () {
    const file = imageInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    loadingSpinner.classList.remove("hidden");
    translateButton.disabled = true;
    resultsSection.classList.add("hidden");
    resultsList.innerHTML = "";

    try {
      const response = await fetch("/detect/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.detections.length > 0) {
          data.detections.forEach((detection) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Word: ${detection.word}, Emotion: ${detection.emotion}`;
            resultsList.appendChild(listItem);
          });
          resultsSection.classList.remove("hidden");
        } else {
          // No detections found in the image
          const noDetectionsMessage = document.createElement("p");
          noDetectionsMessage.textContent =
            "No detections were found in the image.";
          noDetectionsMessage.style.color = "#ff4d4d"; // Red color for better visibility
          resultsList.appendChild(noDetectionsMessage);
          resultsSection.classList.remove("hidden");
        }
      } else {
        alert(data.detail);
      }
    } catch (error) {
      alert("Error while processing the image. Please try again.");
    } finally {
      loadingSpinner.classList.add("hidden");
      translateButton.disabled = false;
    }
  });
});
