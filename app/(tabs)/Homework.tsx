import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { Button } from "react-native-paper";
export default function App() {
	return (
		<View style={styles.container}>
			<View style={styles.buttonGroup}>
				<Link href="/homework/vibration" asChild style={styles.button}>
					<Button mode="contained">Vibration</Button>
				</Link>
				<Link href="/homework/soundRecording" asChild style={styles.button}>
					<Button mode="contained">Sound Recording</Button>
				</Link>
				<Link href="/homework/camera" asChild style={styles.button}>
					<Button mode="contained">Camera</Button>
				</Link>
				<Link href="/homework/systemSensors" asChild style={styles.button}>
					<Button mode="contained">Sensors</Button>
				</Link>
				<Link href="/homework/saveData" asChild style={styles.button}>
					<Button mode="contained">Save File</Button>
				</Link>
				<Link href="/homework/restApi" asChild style={styles.button}>
					<Button mode="contained">RestApi</Button>
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
		justifyContent: "center",
	},
	button: {
		width: "100%",
	},
});
