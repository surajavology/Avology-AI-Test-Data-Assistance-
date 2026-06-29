let generatedData = [];

document
    .getElementById("generateBtn")
    .addEventListener("click", generateData);

document
    .getElementById("downloadBtn")
    .addEventListener("click", downloadCSV);

async function generateData() {

    const country =
        document.getElementById("country").value;

    const count =
        parseInt(
            document.getElementById("recordCount").value
        );

    document.getElementById("result").innerHTML =
        "<p>Generating data...</p>";

    try {

const response = await fetch(
    "https://avology-ai-test-data-backend.onrender.com/generate",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country,
            count
        })
    }
);

        const result =
            await response.json();

        if (result.error) {

            document.getElementById("result").innerHTML = `
    <div class="loading-container">
        <div class="loader"></div>
        <p>Generating realistic test records...</p>
    </div>
`;

            return;
        }

        generatedData = result;

        let html = `
            <h3>Generated Test Data</h3>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Age</th>
                </tr>
        `;

        generatedData.forEach(record => {

            html += `
                <tr>
                    <td>${record.name || ""}</td>
                    <td>${record.email || ""}</td>
                    <td>${record.phone || ""}</td>
                    <td>${record.address || ""}</td>
                    <td>${record.age || ""}</td>
                </tr>
            `;

        });

        html += `</table>`;

        document.getElementById("result").innerHTML =
            html;

        document.getElementById("downloadBtn").style.display =
            "block";

    }
    catch(error) {

        document.getElementById("result").innerHTML =
            `<p>Error: ${error.message}</p>`;

    }

}

function downloadCSV() {

    let csv =
        "Name,Email,Phone,Address,Age\n";

    generatedData.forEach(record => {

        csv +=
`${record.name},${record.email},${record.phone},${record.address},${record.age}\n`;

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "test-data.csv";

    a.click();

    URL.revokeObjectURL(url);
}