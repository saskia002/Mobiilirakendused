import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, Platform } from "react-native";
import * as Location from "expo-location";
import BeachesAccordion from "@/components/BeachesAccordion";

export default function App() {
	const [location, setLocation] = useState<any>(null);
	const [errorMsg, setErrorMsg] = useState<any>(null);
	const [timeOut, setTimeOut] = useState<number>(50);
	const [weather, setWeather] = useState<any>(null);
	const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

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
			name: "Antalya",
			latitude: "36.85",
			longitude: "30.83",
		},
	];

	const handleBeachSelect = (latitude: string, longitude: string) => {
		setLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
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
		fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${location?.latitude}&longitude=${location?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=uv_index_max,precipitation_probability_mean&wind_speed_unit=ms&timezone=auto&forecast_days=1`
		)
			.then((response) => {
				response.json().then((data) => {
					setWeather({
						current: data.current,
						daily: data.daily,
					});
					// console.log(weather);
				});
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
		if (timeOut !== 0) {
			setTimeOut(timeOut - 1);
		} else {
			setLocation({ longitude: long, latitude: lat });
			setTimeOut(50);
		}
	};

	return (
		<>
			{location && weather && (
				<View style={styles.container}>
					<MapView
						showsCompass
						showsScale
						zoomControlEnabled
						showsUserLocation
						// followsUserLocation
						loadingEnabled
						region={{
							latitude: location?.latitude,
							longitude: location?.longitude,
							latitudeDelta: 1,
							longitudeDelta: 1,
						}}
						style={styles.map}
						onRegionChange={(region) => {
							updateCords(region.longitude, region.latitude);
						}}
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
						<>
							<View style={styles.mapText}>
								<View style={styles.mapTextBox}>
									<Text>Temp: {weather?.current.temperature_2m} °C</Text>
									<Text>Feels like: {weather?.current.temperature_2m} °C</Text>
									<Text>Rain: {weather?.current.rain} mm</Text>
									<Text>Rain prob: {weather?.daily.precipitation_probability_mean} %</Text>
									<Text>Pres: {weather?.current.pressure_msl} hPa</Text>
								</View>
							</View>
							<View style={styles.epic}>
								<View style={styles.epicInner}>
									{calcBeachDay() ? <Text>Perfect day for beach!</Text> : <Text>Not a beach day!</Text>}
									{calcBBQDay() ? <Text>Perfect day for BBQ!</Text> : <Text>Not a BBQ day!</Text>}
									{!calcBeachDay() && !calcBBQDay() && <Text>A sad miserable day :(</Text>}
									{calcBeachDay() && calcBBQDay() && <Text>Absolutely perfect day :)</Text>}
									<BeachesAccordion
										beaches={beaches}
										onBeachSelect={handleBeachSelect}
										handleAccordionPress={handleCloseAccordion}
										isOpen={isAccordionOpen}
									></BeachesAccordion>
								</View>
							</View>
						</>
					)}
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
	},
	mapText: {
		justifyContent: "flex-end",
		...StyleSheet.absoluteFillObject,
	},
	mapTextBox: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "white",
		width: 128,
		margin: 0,
		padding: 8,
	},
	epic: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
	},
	epicInner: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		width: 180,
		margin: 0,
		padding: 8,
	},
	map: {
		...StyleSheet.absoluteFillObject,
		//width: "100%",
		//height: "100%",
	},
});
