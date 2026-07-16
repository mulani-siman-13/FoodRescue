console.log("script.js loaded");
// Initialize the map
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