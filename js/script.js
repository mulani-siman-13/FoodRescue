console.log("script.js loaded");
// Initialize the map
const mapElement = document.getElementById("map");

if (mapElement) {
var map = L.map('map').setView([18.5204, 73.8567], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([18.5204, 73.8567]).addTo(map)
.bindPopup("<b>Vaishali Restaurant</b><br>🍱 25 Meals Ready for Pickup");

L.marker([18.5314, 73.8446]).addTo(map)
.bindPopup("<b>Hotel Shreyas</b><br>🥘 18 Meals Ready for Pickup");

L.marker([18.5091, 73.8326]).addTo(map)
.bindPopup("<b>Cafe Goodluck</b><br>🍛 32 Meals Ready for Pickup");

L.marker([18.5140,73.8397]).addTo(map)
.bindPopup("<b>Wadeshwar FC Road</b><br>🍛 14 Meals Available");

L.marker([18.5362,73.8930]).addTo(map)
.bindPopup("<b>Barbeque Nation</b><br>🍽️ 38 Meals Available");

L.marker([18.5209,73.8567]).addTo(map)
.bindPopup("<b>McDonald's JM Road</b><br>🍔 12 Meals Available");

L.marker([18.5450,73.9050]).addTo(map)
.bindPopup("<b>Starbucks Koregaon Park</b><br>🥪 9 Meals Available");

L.marker([18.5602,73.8075]).addTo(map)
.bindPopup("<b>Burger King Hinjawadi</b><br>🍟 17 Meals Available");

L.marker([18.5318,73.8477]).addTo(map)
.bindPopup("<b>Hotel Rupali</b><br>🥘 21 Meals Available");
}

const analyzeBtn = document.getElementById("analyzeBtn");

if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
        const button = analyzeBtn;
        const image = document.getElementById("foodImage");

        if (!image.files.length) {
            alert("Please select a food image first.");
            return;
        }
     button.disabled = true;
button.innerHTML = "⏳ Analyzing...";   

        const formData = new FormData();
formData.append("foodImage", image.files[0]);

fetch("http://localhost:3000/analyze-food", {
    method: "POST",
    body: formData
})
.then(async response => {

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;

})
.then(data => {
    console.log(data);

    const analysis = data.analysis;

document.getElementById("foodName").textContent =
    analysis.food;

document.getElementById("mealCount").textContent =
    analysis.estimatedMeals;

document.getElementById("freshness").textContent =
    analysis.freshness;

document.getElementById("pickupTime").textContent =
    analysis.pickupBefore;
    button.disabled = false;
button.innerHTML = "Analyze & Submit";
})
.catch(error => {

    console.error(error);

    alert(error.message);

    button.disabled = false;
    button.innerHTML = "Analyze & Submit";

});
});
}