const input = document.getElementById("location-input");
let locationHeading = document.querySelector(".location-heading");
const framesContainer = document.querySelector(".frames-container");


if (!locationHeading) {
    locationHeading = document.createElement("h2");
    locationHeading.className = "location-heading";
    locationHeading.style.display = "none";

    input.insertAdjacentElement("afterend", locationHeading);
}


input.addEventListener("change", async event => {
    const address = event.target.value;
    const response = await fetch(`/api/forecast/services?address=${encodeURIComponent(address)}`);
    const result = await response.json();
    if (location) {
        input.classList.add("is-active");
        locationHeading.innerText = `${result.address}`;
        locationHeading.style.display = "block";
        framesContainer.style.display = "flex";
    } else {
        input.classList.remove("is-active");
        locationHeading.style.display = "none";
        framesContainer.style.display = "none";
    }
});

document.querySelectorAll(".frame").forEach(frame => {
    frame.addEventListener("click", function () {
        document.querySelectorAll(".frame").forEach(f => {
            if (f !== frame) {
                f.style.opacity = "0";
                setTimeout(() => f.classList.add("hidden"), 400);
            }
        });

        frame.style.transform = "scale(1.1)";

        const chartContainer = document.querySelector(".chart-container");
        chartContainer.classList.remove("hidden");
        setTimeout(() => chartContainer.classList.add("show"), 10);
    });
});