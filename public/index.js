const input = document.getElementById("location-input");
const locationHeading = document.getElementById("location-heading");
const content = document.getElementById("content");
const frameContainer = document.getElementById("frames");
const statAccuracy = document.getElementById("stat-accuracy");
const statSelection = document.getElementById("stat-selection");
const hourSelection = document.getElementById("hour-selection");
const detailsContainer = document.getElementById("details-container");
const chartContainer = document.getElementById("chart-container");
const resultsFrame = document.getElementById("results-frame")
const serviceFrames = [];

function clearServices() {
    while (serviceFrames.length > 0) {
        serviceFrames.pop().remove();
    }
}

input.addEventListener("change", async event => {
    if (event.target.value) {
        const address = event.target.value;
        const response = await fetch(`/api/forecast/services?address=${encodeURIComponent(address)}`);
        if (response.ok) {
            const result = await response.json();
            clearServices();
            locationHeading.innerText = `${result.address || "Invalid Address"}`;
            for (const service of result.services) {
                const container = document.createElement("div");
                container.classList.add("frame");
                const header = document.createElement("h3");
                container.dataset.name = service.name;
                container.dataset.provider = service.id;
                container.dataset.location = result.id;
                container.dataset.url = service.url;
                header.classList.add("frame__heading");
                header.innerText = service.name;
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
            locationHeading.classList.remove("hidden");
            frameContainer.classList.remove("hide");
            detailsContainer.classList.add("hide");
            content.classList.remove("hidden");
        } else {
            locationHeading.innerText = "Invalid Location";
            input.classList.add("is-active");
            locationHeading.classList.remove("hidden");
            content.classList.add("hidden");
            setTimeout(() => {
                detailsContainer.classList.add("hide");
                clearServices();
            }, 400);
        }
    } else {
        input.classList.remove("is-active");
        content.classList.add("hidden");
        locationHeading.classList.add("hidden");
        setTimeout(() => {
            detailsContainer.classList.add("hide");
            clearServices();
        }, 400);
    }
});

function back() {
    detailsContainer.classList.add("hide");
    frameContainer.classList.remove("hide");
}

/** @type {{data:{label:string;since:string|null;observations:{[timestamp:string]:number};periods:{hour:number;forecasts:{[timestamp:string]:{value:number;accuracy:number}}}[]}[]}} */
let data;

/** @param {number} days @param {number} interval @param {Date} [since] */
function generateTimestamps(days, interval, since) {
    const date = since || new Date();
    date.setMinutes(0, 0, 0);
    const target = new Date(date.getTime());
    date.setDate(date.getDate() - days);
    const timestamps = [];
    while (date <= target) {
        date.setHours(date.getHours() + interval);
        timestamps.push(date.toISOString());
    }
    return timestamps;
}

/** @param {MouseEvent} event */
async function handleFrameClick(event) {
    const frame = event.currentTarget;
    frameContainer.classList.add("hide");
    detailsContainer.classList.remove("hide");
    const { provider, location, name, url } = frame.dataset;
    const res = await fetch(`/api/forecast/accuracy?provider=${encodeURIComponent(provider)}&location=${encodeURIComponent(location)}`);
    data = await res.json();
    resultsFrame.innerHTML = `<a href="${url}">${name}</a>`;
    chart?.clear();
    updateData();
}

async function updateData() {
    try {
        if (!data || !data.data) {
            console.error("Invalid or missing data.");
            return;
        }
        const selectedStat = statSelection.value;
        let selectedHour = parseInt(hourSelection.value) || -3;

        const statData = data.data.find(entry => entry.label === selectedStat);
        if (!statData) {
            console.error("Selected statistic not found");
            return;
        }
        if (statData.periods.length == 0) {
            console.error("No data");
            return;
        }
        if (statData.periods.find(period => period.hour === selectedHour) === undefined) {
            selectedHour = statData.periods[0]?.hour;
        }
        hourSelection.innerHTML = statData.periods.map(period => `<option value="${period.hour}">${Math.abs(period.hour)}</option>`).join("");
        const { observations, periods, since } = statData;
        const forecasts = periods.find(period => period.hour === selectedHour)?.forecasts;

        const timestamps = generateTimestamps(7, 3, since ? new Date(since) : undefined);
        const observedValues = [];
        const forecastedValues = [];
        let accuracySum = 0;
        let accuracyCount = 0;
        // get forecast values
        for (const timestamp of timestamps) {
            observedValues.push(observations[timestamp]);
            const forecast = forecasts?.[timestamp];
            forecastedValues.push(forecast?.value);
            if (forecast?.accuracy != null) {
                accuracySum += forecast.accuracy;
                accuracyCount++;
            }
        };
        // calculate accuracy
        let accuracyText = "";
        if (accuracyCount > 0) {
            if (statData.prefix) {
                accuracyText += statData.prefix;
            }
            accuracyText += Math.trunc(accuracySum / accuracyCount * 100) / 100;
            if (statData.suffix) {
                accuracyText += statData.suffix;
            }
        } else {
            accuracyText = "N/A";
        }
        statAccuracy.innerText = accuracyText;
        // render chart
        renderChart(timestamps.map(timestamp => new Date(timestamp).toLocaleString()), observedValues, forecastedValues, selectedStat);
    } catch (error) {
        console.error("Error in handleFrameClick:", error);
    }
}

/** @type {?Chart} */
let chart = null;

function renderChart(labels, observedData, forecastData, stat) {
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Observed " + stat,
                data: observedData,
                borderColor: "#DE3163",
                borderWidth: 2,
                fill: false
            },
            {
                label: "Forecasted " + stat,
                data: forecastData,
                borderColor: "#6495ED",
                borderWidth: 2,
                fill: false
            }
        ]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: "Time" } },
            y: { title: { display: true, text: stat }, max: stat === "Precipitation" ? 1 : undefined }
        }
    };
    if (chart) {
        chart.data = data;
        chart.options = options;
        chart.update();
    } else {
        const context = document.getElementById("chart");
        chart = new Chart(context, {
            type: "line",
            data,
            options
        });
    }
}