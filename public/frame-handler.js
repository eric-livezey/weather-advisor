const input = document.getElementById("location-input");
const locationHeading = document.getElementById("location-heading");
const content = document.getElementById("content");
const frameContainer = document.getElementById("frames");
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
        frameContainer.classList.remove("hide");
    } else {
        input.classList.remove("is-active");
        content.classList.add("hidden");
        locationHeading.classList.add("hidden");
        setTimeout(() => {
            while (serviceFrames.length > 0) {
                serviceFrames.pop().remove();
            }
        }, 400);
    }
});

/**
 * 
 * @param {MouseEvent} event 
 */
async function handleFrameClick(event) {
    const frame = event.currentTarget;
    frameContainer.classList.add("hide");
    const name = frame.dataset.name;
    const res = await fetch("/api/forecast/services/" + encodeURIComponent(name));
    const data = await res.json();
    console.log(data);
    // Display graph and hide frames based on frame content
}