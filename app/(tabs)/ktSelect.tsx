import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Link } from "expo-router";
export default function App() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sensor tests</Text>
			<View style={styles.buttonGroup}>
				<Link href="/(sensors)/vibration" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>Vibration</Text>
					</Pressable>
				</Link>
				<Link href="/(sensors)/soundrec" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>Sound Recording</Text>
					</Pressable>
				</Link>
				<Link href="/(sensors)/camera" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>Camera</Text>
					</Pressable>
				</Link>
				<Link href="/(sensors)/sysSensors" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>Sensors</Text>
					</Pressable>
				</Link>
				<Link href="/(sensors)/saveData" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>Save File</Text>
					</Pressable>
				</Link>
				<Link href="/(sensors)/restApi" asChild style={styles.button}>
					<Pressable>
						<Text style={styles.buttonText}>RestApi</Text>
					</Pressable>
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonGroup: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		maxWidth: 200,
		width: "80%",
		gap: 18,
	},
	separator: {
		marginVertical: 6,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		marginTop: 16,
	},
	inputLight: {
		width: "80%",
		borderColor: "black",
		borderRadius: 4,
		color: "black",
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	inputDark: {
		width: "80%",
		borderColor: "white",
		borderRadius: 4,
		color: "white",
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	button: {
		fontWeight: "bold",
		textTransform: "uppercase",
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		backgroundColor: "#3498db",
		padding: 12,
		borderRadius: 4,
		height: 48,
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
