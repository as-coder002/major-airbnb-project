const geocodeLocation = async (location, country) => {
    const query = `${location}, ${country}`;

    const url =
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Wanderlust-Learning-Project"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch location coordinates");
    }

    const data = await response.json();

    // console.log("Geocoding query:", query);
    // console.log("Geocoding response:", data);

    if (data.length === 0) {
        return null;
    }

    return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon)
    };
};

module.exports = geocodeLocation;