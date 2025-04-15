function submitForm() {
    const frontend = document.getElementById("frontendSelect").value;
    const filePath = document.getElementById("filePathInput").value;
  
    if (!frontend || !filePath) {
      alert("Please select a frontend framework and provide a valid file path.");
      return;
    }
  
    fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ frontend, path: filePath }),
    })
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("responseMessage").innerHTML =
          `<div class="alert alert-success">${data.message}</div>`;
      })
      .catch((err) => {
        console.error(err);
        document.getElementById("responseMessage").innerHTML =
          `<div class="alert alert-danger">❌ Error generating project</div>`;
      });
  }
  