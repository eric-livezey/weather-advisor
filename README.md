# Weather Advisor

This is repository for the Weather Advisor project.

## What is Weather Advisor?

Weather Advisor is a website which intends to inform users about the accuracy of different weather services. This application collects forecasts from various weather services and observations from the National Weather Service over time and stores this data. It then uses this data to show users a visual representation of the accuracy of services over time by comparing different forecasts to the actual observed weather data.

## Using the Website

After navigating to the site, you should be prompted to enter an Address or Zip Code into the search bar. If you do that and press enter, the site will show you a list of weather services and a summary of their accuracy assuming that there is data for that location.

> [!NOTE]
> Due to rate limit limitations on API requests, Weather Advisor currently only supports the 10 most populous cities in the Northeastern United States.

If you then click on a service, you should see a graph of the temperature and options to choose a different statistic or a different number of hours. The hour refers to the number of hours before a particular timestamp that the forecasts were collected on. You then can simply play around with looking at different stastics and services from there.