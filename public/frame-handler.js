const input = document.getElementById("location-input");
const locationHeading = document.getElementById("location-heading");
const content = document.getElementById("content");
const frameContainer = document.getElementById("frames");
const statSelection = document.getElementById("stat-selection");
const hourSelection = document.getElementById("hour-selection");
const chartContainer = document.getElementById("chart-container");
const chartPlaceholder = document.querySelector(".chart-placeholder");
const resultsFrame = document.getElementById("results-frame")
const serviceFrames = [];

input.addEventListener("change", async event => {
    if (event.target.value) {
        const address = event.target.value;
        const response = await fetch(`/api/forecast/services?address=${encodeURIComponent(address)}`);
        const result = await response.json();
        locationHeading.innerText = `${result.address || "Invalid Address"}`;
        for (const service of result.services) {
            const container = document.createElement("div");
            container.classList.add("frame");
            const header = document.createElement("h3");
            container.dataset.name = service.name;
            container.dataset.provider = service.id;
            container.dataset.location = result.id;
            header.classList.add("frame__heading");
            header.innerText = service.name;
            header.tabIndex = -1;
            container.append(header);
            for (const data of service.summary) {
                const { label, value } = data;
                const el = document.createElement("p");
                el.classList.add("frame__value");
                el.innerText = `${label}: ${value}`;
                container.append(el);
            }
            container.addEventListener("click", handleFrameClick)
            frameContainer.append(container);
            serviceFrames.push(container);
        }
        input.classList.add("is-active");
        content.classList.remove("hidden");
        locationHeading.classList.remove("hidden");
    } else {
        input.classList.remove("is-active");
        content.classList.add("hidden");
        locationHeading.classList.add("hidden");
        chartContainer.classList.add("hide")
        setTimeout(() => {
            detail.classList.add("hide");
        }, 400);
    }
});

/**
 * 
 * @param {MouseEvent} event 
 */
async function handleFrameClick(event) {
    const frame = event.currentTarget;
    content.classList.add("hide");
    chartContainer.classList.remove("hide");
    
    const name = frame.dataset.name;
    const res = await fetch("/api/forecast/services/" + encodeURIComponent(name));
    const data = await res.json();
    resultsFrame.innerText = data.service;
    resultsFrame.classList.remove("frame:hover");
    console.log(data);
    updateData()
}
async function updateData() {
    try {
        const res = await fetch("data.json");
        if (!res.ok) throw new Error(`Failed to load data.json: ${res.statusText}`);

        const data = await res.json();
        if (!data || !data.data) {
            console.error("Invalid or missing data in data.json");
            return;
        }
        const selectedStat = statSelection.value;
        const selectedHour = parseInt(hourSelection.value, 10); 

        const statData = data.data.find(entry => entry.label === selectedStat);
        if (!statData) {
            chartPlaceholder.innerHTML ="Selected statistic not found in data.json";
            return;
        }

        const timestamps = [];
        const observedValues = [];
        const forecastedValues = [];


        statData.data.forEach(entry => {
            const forecast = entry.forecasts.find(f => f.hour === selectedHour); 
            if (forecast) {
                const timestamp = new Date(entry.timestamp).toLocaleString();
                timestamps.push(timestamp);
                observedValues.push(entry.observed);
                forecastedValues.push(forecast.value);
            }
        });

        renderChart(timestamps, observedValues, forecastedValues, selectedStat);
    } catch (error) {
        console.error("Error in handleFrameClick:", error);
    }
}

function renderChart(labels, observedData, forecastData, stat) {    
    const ctx = document.createElement("canvas");
    chartPlaceholder.innerHTML = ""; 
    chartPlaceholder.appendChild(ctx); 

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,  
            datasets: [
                {
                    label: "Observed " + stat,
                    data: observedData, 
                    borderColor: "#FF0000",
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: "Forecasted " + stat,
                    data: forecastData, 
                    borderColor: "#0000FF",
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: stat } }
            }
        }
    });

    document.getElementById("results-frame").addEventListener("click", handleFrameClick);
    statSelection.addEventListener("change", updateData);
    hourSelection.addEventListener("change", updateData);
}