import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, StatusBar } from "react-native";
import * as Location from "expo-location";
import BeachesAccordion from "@/components/BeachesAccordion";
import { Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const beaches = [
	{
		id: "1",
		name: "Harku",
		latitude: "59.41",
		longitude: "24.63",
	},
	{
		id: "2",
		name: "Maardu",
		latitude: "59.45",
		longitude: "24.99",
	},
	{
		id: "3",
		name: "Vaibla",
		latitude: "58.4",
		longitude: "26.07",
	},
	{
		id: "4",
		name: "Kauksi",
		latitude: "58.98",
		longitude: "27.21",
	},
	{
		id: "5",
		name: "Paralepa",
		latitude: "58.94",
		longitude: "23.51",
	},
	{
		id: "6",
		name: "Pirita",
		latitude: "59.48",
		longitude: "24.83",
	},
	{
		id: "7",
		name: "Santos",
		latitude: "-24.02",
		longitude: "-46.28",
	},
];

export default function App() {
	const [location, setLocation] = useState<any>(null);
	const [errorMsg, setErrorMsg] = useState<any>(null);
	const [weather, setWeather] = useState<any>(null);
	const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

	const mapRef = useRef<MapView>(null);

	const handleBeachSelect = (latitude: string, longitude: string) => {
		setLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
		if (mapRef.current) {
			mapRef.current.animateToRegion({
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
				latitudeDelta: 0.1,
				longitudeDelta: 0.1,
			});
		}
	};

	const handleCloseAccordion = () => {
		setIsAccordionOpen(false);
	};

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location.coords);
		})();
	}, []);

	useEffect(() => {
		getData();
	}, [location]);

	let text = "Waiting..";
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}

	function getData() {
		// console.log("Getting data");
		fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${location?.latitude}&longitude=${location?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=uv_index_max,precipitation_probability_mean&wind_speed_unit=ms&timezone=auto&forecast_days=1`
		)
			.then((response) => {
				response.json().then((data) => {
					setWeather({
						current: data.current,
						daily: data.daily,
					});
				});
				// console.log("Weather data", weather);
			})
			.catch((error) => {
				console.error(
					`There was a problem with
                       the fetch operation:`,
					error
				);
			});
	}

	function calcBeachDay() {
		if (weather?.current && weather?.daily) {
			if (
				weather.current.temperature_2m > 18 &&
				weather.current.rain < 5 &&
				weather.daily.precipitation_probability_mean < 20 &&
				weather.current.wind_speed_10m < 5
			) {
				return true;
			}
		}
		return false;
	}

	function calcBBQDay() {
		if (weather?.current && weather?.daily) {
			if (
				weather.current.temperature_2m > 5 &&
				weather.current.rain < 50 &&
				weather.daily.precipitation_probability_mean < 99 &&
				weather.current.wind_speed_10m < 100
			) {
				return true;
			}
		}
		return false;
	}

	const updateCords = (long: any, lat: any) => {
		const longitude = parseFloat(long);
		const latitude = parseFloat(lat);
		setLocation({ longitude: longitude, latitude: latitude });
	};

	return (
		<SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
			<View
				style={{
					flex: 1,
				}}
			>
				{location && weather && (
					<View>
						<MapView
							ref={mapRef}
							showsUserLocation
							loadingEnabled
							initialRegion={{
								latitude: location?.latitude,
								longitude: location?.longitude,
								latitudeDelta: 1,
								longitudeDelta: 1,
							}}
							style={styles.map}
							onRegionChangeComplete={(region) => {
								updateCords(region.longitude, region.latitude);
							}}
							rotateEnabled={false}
						>
							{beaches.map((beach) => (
								<Marker
									key={beach.id}
									coordinate={{
										latitude: parseFloat(beach.latitude),
										longitude: parseFloat(beach.longitude),
									}}
									title={beach.name} // Marker title
								/>
							))}
						</MapView>
						{weather?.current && weather?.daily && (
							<View
								style={{
									display: "flex",
									height: "100%",
									flexDirection: "column",
									justifyContent: "space-between",
								}}
							>
								<Surface
									style={{
										display: "flex",
										flexDirection: "row",
									}}
									mode="flat"
									elevation={1}
								>
									<View>
										<BeachesAccordion
											beaches={beaches}
											onBeachSelect={handleBeachSelect}
											handleAccordionPress={handleCloseAccordion}
											isOpen={isAccordionOpen}
										/>
									</View>
									<View
										style={{
											display: "flex",
											flexDirection: "column",
											justifyContent: "flex-start",
											alignItems: "flex-start",
											width: "auto",
											paddingLeft: 12,
											paddingTop: 4,
										}}
									>
										{calcBeachDay() ? <Text>Perfect day for beach!</Text> : <Text>Not a beach day!</Text>}
										{calcBBQDay() ? <Text>Perfect day for BBQ!</Text> : <Text>Not a BBQ day!</Text>}
										{!calcBeachDay() && !calcBBQDay() && <Text>A sad miserable day :(</Text>}
										{calcBeachDay() && calcBBQDay() && <Text>Absolutely perfect day :)</Text>}
									</View>
								</Surface>

								<Surface mode="flat" elevation={1} style={styles.mapTextBox}>
									<Text>Temp: {weather?.current.temperature_2m} °C</Text>
									<Text>Feels like: {weather?.current.temperature_2m} °C</Text>
									<Text>Rain: {weather?.current.rain} mm</Text>
									<Text>Rain prob: {weather?.daily.precipitation_probability_mean} %</Text>
									<Text>Pres: {weather?.current.pressure_msl} hPa</Text>
								</Surface>
							</View>
						)}
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	mapTextBox: {
		display: "flex",
		flexDirection: "column",
		width: 128,
		margin: 0,
		padding: 8,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});
