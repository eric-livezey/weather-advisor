declare interface WeatherOverviewResponse {
    "@odata.context": "api.msn.com/weather/$metadata#overview";
    value: {
        responses: {
            weather: {
                alerts: any[];
                current: {
                    baro: number;
                    cap: string;
                    capAbbr: string;
                    daytime: string;
                    dewPt: number;
                    feels: number;
                    rh: number;
                    icon: number;
                    symbol: string;
                    pvdrIcon: string;
                    urlIcon: string;
                    wx: string;
                    sky: string;
                    temp: number;
                    tempDesc: number;
                    utci: number;
                    uv: number;
                    uvDesc: string;
                    vis: number;
                    windDir: number;
                    windSpd: number;
                    windTh: number;
                    windGust: number;
                    created: string;
                    pvdrCap: string;
                    aqi: number;
                    aqiSeverity: string;
                    aqLevel: number;
                    primaryPollutant: string;
                    aqiValidTime: string;
                    richCaps: any[];
                    cloudCover: number;
                };
                forecast: {
                    days: {
                        hourly: {
                            baro: number;
                            cap: string;
                            pvdrCap: string;
                            feels: number;
                            rh: number;
                            icon: number;
                            symbol: string;
                            pvdrIcon: string;
                            urlIcon: string;
                            precip: number;
                            wx: string;
                            sky: string;
                            temp: number;
                            tempDesc: number;
                            utci: number;
                            uv?: number;
                            valid: string;
                            windDir: number;
                            windSpd: number;
                            created: string;
                            summary: string;
                            vis: number;
                            dewPt: number;
                            windGust?: number;
                            cloudCover: number;
                            rainAmount: number;
                            snowAmount: number;
                            raAccu: number;
                            saAccu: number;
                        }[];
                        daily: {
                            day: {
                                cap: string;
                                pvdrCap: string;
                                pvdrWindDir: string;
                                pvdrWindSpd: string;
                                icon: number;
                                symbol: string;
                                pvdrIcon: string;
                                urlIcon: string;
                                precip: number;
                                sky: string;
                                windDir: number;
                                windSpd: number;
                                summary: string;
                                summaries: string[];
                                wx?: string;
                            };
                            night: {
                                cap: string;
                                pvdrCap: string;
                                pvdrWindDir: string;
                                pvdrWindSpd: string;
                                icon: number;
                                symbol: string;
                                pvdrIcon: string;
                                urlIcon: string;
                                precip: number;
                                sky: string;
                                windDir: number;
                                windSpd: number;
                                summary: string;
                                summaries: string[];
                                wx?: string;
                            };
                            pvdrCap: string;
                            pvdrWindDir: string;
                            pvdrWindSpd: string;
                            valid: string;
                            icon: number;
                            symbol: string;
                            pvdrIcon: string;
                            iconUrl: string;
                            precip: number;
                            windMax: number;
                            windMaxDir: number;
                            windTh: number;
                            rhHi: number;
                            rhLo: number;
                            tempHi: number;
                            tempLo: number;
                            uv: number;
                            uvDesc: string;
                            created: string;
                            rainAmount: number;
                            snowAmount: number;
                            raToMN: number;
                            saToMN: number;
                            feelsHi: number;
                            feelsLo: number;
                            vis: number;
                            dewPt: number;
                            baro: number;
                        };
                        almanac: {
                            valid: string;
                            sunrise: string;
                            sunset: string;
                            moonrise: string;
                            moonset: string;
                            moonState: string;
                            moonPhase: string;
                            moonPhaseCode: string;
                        };
                    }[];
                };
                nowcasting: {
                    precipitation: number[];
                    precipitationRate: number[];
                    precipitationAccumulation: number[];
                    previousPrecipitation: any[];
                    symbols: any[];
                    previousSymbols: any[];
                    templateType: string;
                    minutesToTransit: number;
                    summary: string;
                    shortSummary: string;
                    taskbarSummary: string;
                    horrizonCount: number;
                    minutesBetweenHorrizons: number;
                    enableRainSignal: boolean;
                    raintype: string;
                    timestamp: string;
                    weathertype: number;
                    nowcastingDistance: number;
                    nearbyPrecipitationType: number;
                    taskbarSummaryL1: string;
                    taskbarSummaryL2: string;
                };
                mapsmetadata: {
                    NowcastVectorMap: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    PRateMap: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TileImageMetadata: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    AirQualityHeatMap: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    AqiHeatMap: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    SevereWeatherSvg: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    PollenCity: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    PollenImage: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    HurricaneSvg: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    WildFireSvg: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    SevereWeatherText: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TemperatureGrid: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TemperatureGridRR: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TemperatureGridCC: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    AirQualityHeatMapEu: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    EuPollenCity: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    EuPollenImage: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    ForecastVideo: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    ThunderstormPolygonSvg: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    LightningStrikeSvg: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    SatellitePreRender: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    HurricaneSvgStatic: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    HurricaneCnSvgStatic: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    CloudForecastOmgHd: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TemperatureOmgHdRR: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    TemperatureOmgHdCC: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    PrecipitationOmgHd: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    DewPointOmgHd: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    RelativeHumidityOmgHd: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                    WindSpeedOmgHd: {
                        uris: {
                            [key: string]: string;
                        };
                    };
                };
                contentdata: {
                    id: string;
                    cid: number;
                    ranking: number;
                    contenttype: string;
                    isSpotlight: boolean;
                }[];
                pollen: {
                    forecast: {
                        pollenindex: number;
                        level: string;
                        type: string;
                        valid: string;
                        confidence: number;
                        subTypes: {
                            pollenindex: number;
                            level: string;
                            type: string;
                            valid: string;
                        }[];
                    }[];
                    start: string;
                    provider: {
                        name: string;
                        url: string;
                    };
                };
                LifeActivityResp: {
                    days: {
                        lifeDailyIndices: {
                            type: number;
                            subType: number;
                            value: number;
                            category: number;
                            validTime: number;
                            rankId: number;
                            summary: string;
                            shortSummary: string;
                            taskbarSummary: string;
                            hourlyIndices: any[];
                            validTimeRangeInHour: number[];
                        }[];
                        tempHigh: number;
                        tempLow: number;
                        dailySymbol: string;
                        lifeTips: any[];
                    }[];
                };
                provider: {
                    name: string;
                    url: string;
                    gridEnabled: number;
                };
                aqiProvider: {
                    name: string;
                };
                insights: {
                    insights: {
                        category: string;
                        type: string;
                        teaserText: string;
                        headlineText: string;
                        fullText: string;
                        parameters: {
                            dailyHigh?: number;
                            nightlyLow?: number;
                            temperature?: number;
                            tempDesc?: number;
                            optional?: number;
                            dayTrend?: number;
                            dayTrendDiff?: number;
                            nightTrend?: number;
                            nightTrendDiff?: number;
                            windSpeed?: number;
                            direction?: number;
                            windSpeedNight?: number;
                            directionNight?: number;
                            dailyLow?: number;
                            dailyGust?: number;
                            windGust?: number;
                            peakDirection?: number;
                            peakGust?: number;
                            peakDirection1?: number;
                            peakGust1?: number;
                            peakDirection2?: number;
                            peakGust2?: number;
                            windForce?: number;
                            peakHumidity?: number;
                            humidityConditionDay?: number;
                            humidityConditionNight?: number;
                            humidity?: number;
                            humidityCondition?: number;
                            dewpoint?: number;
                            humidityConditionEvening?: number;
                            humidityConditionOvernight?: number;
                            humidityTrendDay?: number;
                            humidityTrendNight?: number;
                            rain_amount?: number;
                            dayRainTotal?: number;
                            daySnowTotal?: number;
                            nightRainTotal?: number;
                            nightSnowTotal?: number;
                            nightType?: number;
                            nightAmount?: number;
                            dayType?: number;
                            dayAmount?: number;
                            dayTimeWindow?: number;
                            daySpanType?: number;
                            nightSpanType?: number;
                            TempPeak?: number;
                            PeakPeriod?: number;
                            TempType?: number;
                            WindType?: number;
                            SkySummaryType?: number;
                            HumidityType?: number;
                            FutureCloudCondition?: number;
                            FuturePrecipType?: number;
                            FuturePrecipInt?: number;
                            OtherCloudCondition?: number;
                            moonPhasePercentage?: number;
                            lastDist?: number;
                            nextPeak?: number;
                            stationDistance?: number;
                            MaxCoverage?: number;
                            cloudCoverDay?: number;
                            cloudCoverNight?: number;
                            cloudConditionDay?: number;
                            cloudConditionNight?: number;
                            cloudCover?: number;
                            peakCloudCondition?: number;
                            peakCloudCondition1?: number;
                            peakCloudCondition2?: number;
                            cloudTrendDay?: number;
                            cloudTrendNight?: number;
                            peakVisibility?: number;
                            lowVisibility?: number;
                            visibilityConditionDay?: number;
                            visibilityConditionNight?: number;
                            dailyVisibilityCondition?: number;
                            visibility?: number;
                            visibilityLevel?: number;
                            visibilityEvening?: number;
                            visibilityOvernight?: number;
                            DistanceUnit?: number;
                            maxVisibility?: number;
                            minVisibility?: number;
                            visibilityTrendDay?: number;
                            visibilityTrendNight?: number;
                            pressureHighDay?: number;
                            pressureLowDay?: number;
                            pressureHighNight?: number;
                            pressureLowNight?: number;
                            rangeTypeDay?: number;
                            rangeTypeNight?: number;
                            stationPressure?: number;
                            pressureValue?: number;
                            pressureTrend?: number;
                            pressureTrend1?: number;
                            hour?: number;
                            hour1?: number;
                            MaxFeelsTemp?: number;
                            MaxTemp?: number;
                            feelsTrendScale?: number;
                            feelsTrend?: number;
                            feelsTrendCondition?: number;
                            feelsTrend2?: number;
                            currentTemp?: number;
                            currentFeelsTemp?: number;
                            peakFeelsTemp?: number;
                            feelsTempCondition?: number;
                            peakFeelsTempEvening?: number;
                            peakFeelsTempOvernight?: number;
                            maxUvIndex?: number;
                            maxUvRiskLevelStr?: number;
                            maxUvRiskLevel?: number;
                            peakHourExist?: number;
                            curAqi?: number;
                            laterThanSixClock?: number;
                            aqiSeverity?: number;
                            pollenIndex?: number;
                            pollenLevel?: number;
                            pollenLevelStr?: number;
                            mainAllergy?: number;
                            subTypePollenIndex_0?: number;
                            subTypePollenIndex_1?: number;
                            subTypePollenIndex_2?: number;
                        };
                        metadata: {
                            [key: string]: string;
                            unit_nightlyLow?: string;
                            unit_dailyHigh?: string;
                            noSpaceBeforeUnit?: string;
                            validDateTime?: string;
                            NightSummary?: string;
                            unit_temperature?: string;
                            unit_peakTemperature?: string;
                            unit_windSpeedNight?: string;
                            prefix_directionNight?: string;
                            prefix_direction?: string;
                            unit_dailyLow?: string;
                            unit_dailyGust?: string;
                            direction?: string;
                            unit_windSpeed?: string;
                            directionNight?: string;
                            unit_peakSpeed?: string;
                            prefix_peakDirection?: string;
                            peakDirection?: string;
                            peakDirection1?: string;
                            peakDirection2?: string;
                            unit_dayRainTotal?: string;
                            unit_daySnowTotal?: string;
                            unit_nightRainTotal?: string;
                            unit_nightSnowTotal?: string;
                            unit_precipAmount?: string;
                            DaySymbol?: string;
                            NightSymbol?: string;
                            "DaySymbol|cap"?: string;
                            "NightSymbol|cap"?: string;
                            unit_TempPeak?: string;
                            CurrentSymbol?: string;
                            moonPhase?: string;
                            moonPhaseCode?: string;
                            localizedMoonPhase?: string;
                            unit_lastDist?: string;
                            stationName?: string;
                            unit_nextPeak?: string;
                            currentCloudCondition?: string;
                            unit_visibility?: string;
                            visibility?: string;
                            unit_peakVisibility?: string;
                            unit_pressureValue?: string;
                            unit_peakFeelsTemp?: string;
                            largestFactor?: string;
                            unit_peakFeelsTempEvening?: string;
                            unit_peakFeelsTempOvernight?: string;
                            unit_currentFeelsTemp?: string;
                            "loc:primaryPollutant"?: string;
                            prefix_mainAllergy?: string;
                            mainAllergy?: string;
                            subType_1?: string;
                            subType_2?: string;
                            subType_0?: string;
                        };
                        timeSeries?: {
                            trend?: {
                                [key: string]: number;
                            };
                            uvIndex?: {
                                [key: string]: number;
                            };
                            feelsLikeTrend?: {
                                [key: string]: number;
                            };
                            tempTrend?: {
                                [key: string]: number;
                            };
                            peakEvening?: {
                                [key: string]: number;
                            };
                            peakOvernight?: {
                                [key: string]: number;
                            };
                            sp?: {
                                [key: string]: number;
                            };
                            msl?: {
                                [key: string]: number;
                            };
                            timeTrend?: {
                                [key: string]: number;
                            };
                            highLowTrend?: {
                                [key: string]: number;
                            };
                            moonrise?: {
                                [key: string]: number;
                            };
                            moonset?: {
                                [key: string]: number;
                            };
                            fullMoon?: {
                                [key: string]: number;
                            };
                            sunrise?: {
                                [key: string]: number;
                            };
                            sunset?: {
                                [key: string]: number;
                            };
                            nighttimestamp?: {
                                [key: string]: number;
                            };
                            rainTrend?: {
                                [key: string]: number;
                            };
                            daytimestamp?: {
                                [key: string]: number;
                            };
                            dewPoints?: {
                                [key: string]: number;
                            };
                            timestamps?: {
                                [key: string]: number;
                            };
                            windSpeed?: {
                                [key: string]: number;
                            };
                            direction?: {
                                [key: string]: number;
                            };
                            windGust?: {
                                [key: string]: number;
                            };
                            temperature?: {
                                [key: string]: number;
                            };
                        };
                        unitText: string;
                        icon: string;
                        trend: string;
                    }[];
                };
            }[];
            source: {
                id: string;
                coordinates: {
                    lat: number;
                    lon: number;
                };
                location: {
                    Name: string;
                    StateCode: string;
                    CountryCode: string;
                    TimezoneName: string;
                    TimezoneOffset: string;
                };
                utcOffset: string;
                countryCode: string;
            };
        }[];
        units: {
            system: string;
            pressure: string;
            temperature: string;
            speed: string;
            height: string;
            distance: string;
            time: string;
        };
        userProfile: {
            autoDetected: {
                geoCoordinates: {
                    latitude: number;
                    longitude: number;
                    altitude: number;
                    version: number;
                };
                displayName: string;
            };
            followedLocations: {
                geoCoordinates: {
                    latitude: number;
                    longitude: number;
                    altitude: number;
                    version: number;
                };
                definitionName: string;
                subRegion: string;
                readLink: string;
                city: string;
                state: string;
                countryRegion: string;
                isoCode: string;
                locationType: number;
                locationTypeId: string;
                language: string;
                properties: {
                    locationType: string;
                    entitySubTypeHints: string;
                };
            }[];
            used: {
                geoCoordinates: {
                    latitude: number;
                    longitude: number;
                    altitude: number;
                    version: number;
                };
            };
            theme: string;
        };
        copyright: string;
    }[];
}

declare function getWeatherOverview(lat: string | number, lng: string | number): Promise<WeatherOverviewResponse>;

export {
    WeatherOverviewResponse,
    getWeatherOverview
};