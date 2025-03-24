const input = document.getElementById("location-input");
const locationHeading = document.getElementById("location-heading");
const content = document.getElementById("container");
const services = document.getElementById("service-list");
const detail = document.getElementById("detail");
const serviceSummaries = [];

input.addEventListener("change", async event => {
    if (event.target.value) {
        const address = event.target.value;
        const response = await fetch(`/api/forecast/services?address=${encodeURIComponent(address)}`);
        if (response.ok) {
            while (serviceSummaries.length > 0) {
                serviceSummaries.pop().remove();
            }
            const result = await response.json();
            locationHeading.innerText = `${result.address || "Invalid Address"}`;
            content.dataset.location = result.id;
            for (const service of result.services) {
                const container = document.createElement("div");
                container.classList.add("service-list__item");
                const header = document.createElement("h3");
                container.dataset.name = service.name;
                container.dataset.id = service.id;
                header.classList.add("service-list__header");
                header.innerText = service.name;
                container.append(header);
                for (const data of service.summary) {
                    const { label, value } = data;
                    const el = document.createElement("p");
                    el.classList.add("service-list__value");
                    el.innerText = `${label}: ${value}`;
                    container.append(el);
                }
                container.addEventListener("click", handleFrameClick)
                services.append(container);
                serviceSummaries.push(container);
            }
            services.classList.remove("hide");
        } else {
            locationHeading.innerText = "Invalid Location"
        }
        input.classList.add("is-active");
        content.classList.remove("hidden");
        locationHeading.classList.remove("hidden");
    } else {
        input.classList.remove("is-active");
        content.classList.add("hidden");
        locationHeading.classList.add("hidden");
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
    services.classList.add("hide");
    detail.classList.remove("hide");
    const location = content.dataset.location;
    const provider = frame.dataset.id;
    const res = await fetch(`/api/forecast/accuracy?provider=${encodeURIComponent(provider)}&location=${encodeURIComponent(location)}`);
    const data = await res.json();
    console.log(data);
    // Display graph and hide frames based on frame content
}