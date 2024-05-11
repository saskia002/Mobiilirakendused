import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";

export default function App() {
	const [location, setLocation] = useState<any>(null);
	const [errorMsg, setErrorMsg] = useState<any>(null);
	const [timeOut, setTimeOut] = useState<number>(50);
	const [weather, setWeather] = useState<any>(null);

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
			`https://api.open-meteo.com/v1/forecast?latitude=${location?.latitude}&longitude=${location?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&daily=uv_index_max,precipitation_probability_mean&wind_speed_unit=ms&timezone=Europe%2FMoscow&forecast_days=1`
		)
			.then((response) => {
				response.json().then((data) => {
					setWeather({
						current: data.current,
						daily: data.daily,
					});
					console.log(weather);
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
						followsUserLocation
						loadingEnabled
						initialRegion={{
							latitude: location?.latitude,
							longitude: location?.longitude,
							latitudeDelta: 1,
							longitudeDelta: 1,
						}}
						style={styles.map}
						onRegionChange={(region) => {
							updateCords(region.longitude, region.latitude);
						}}
					/>
					{weather?.current && weather?.daily && (
						<>
							<View style={styles.mapText}>
								<View style={styles.mapTextBox}>
									<Text>Temp: {weather?.current.temperature_2m} °C</Text>
									<Text>Feels like: {weather?.current.temperature_2m} °C</Text>
									<Text>Rain: {weather?.current.rain} mm</Text>
									<Text>Rain prob: {weather?.daily.precipitation_probability_mean} %</Text>
									<Text>Temp: {weather?.current.pressure_msl}</Text>
								</View>
							</View>
							<View style={styles.epic}>
								<View style={styles.epicInner}>
									{calcBeachDay() ? <Text>Perfect day for beach!</Text> : <Text>Not a beach day!</Text>}
									{calcBBQDay() ? <Text>Perfect day for BBQ!</Text> : <Text>Not a BBQ day!</Text>}
									{!calcBeachDay() && !calcBBQDay() && <Text>A sad miserable day :(</Text>}
									{calcBeachDay() && calcBBQDay() && <Text>Absolutely perfect day :)</Text>}
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
