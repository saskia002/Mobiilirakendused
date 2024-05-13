import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Button } from "react-native-paper";

export default function App() {
	// Refs for the audio
	const AudioRecorder = useRef(new Audio.Recording());
	const AudioPlayer = useRef(new Audio.Sound());

	// States for UI
	const [RecordedURI, SetRecordedURI] = useState<string>("");
	const [AudioPermission, SetAudioPermission] = useState<boolean>(false);
	const [IsRecording, SetIsRecording] = useState<boolean>(false);
	const [IsPLaying, SetIsPLaying] = useState<boolean>(false);

	useEffect(() => {
		GetPermission();
	}, []);

	const GetPermission = async () => {
		const getAudioPerm = await Audio.requestPermissionsAsync();
		SetAudioPermission(getAudioPerm.granted);
	};

	const StartRecording = async () => {
		try {
			if (AudioPermission === true) {
				try {
					// Prepare the Audio Recorder
					await AudioRecorder.current.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);

					// Start recording
					await AudioRecorder.current.startAsync();
					SetIsRecording(true);
				} catch (error) {
					console.log(error);
				}
			} else {
				// If user has not given the permission to record, then ask for permission
				GetPermission();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const StopRecording = async () => {
		try {
			await AudioRecorder.current.stopAndUnloadAsync();

			const result = AudioRecorder.current.getURI();
			if (result) SetRecordedURI(result);

			// Reset the Audio Recorder
			AudioRecorder.current = new Audio.Recording();
			SetIsRecording(false);
		} catch (error) {}
	};

	// Function to play the recorded audio
	const PlayRecordedAudio = async () => {
		try {
			// Load the Recorded URI
			await AudioPlayer.current.loadAsync({ uri: RecordedURI }, {}, true);

			// Get Player Status
			const playerStatus = await AudioPlayer.current.getStatusAsync();

			// Play if song is loaded successfully
			if (playerStatus.isLoaded) {
				if (playerStatus.isPlaying === false) {
					AudioPlayer.current.playAsync();
					SetIsPLaying(true);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const StopPlaying = async () => {
		try {
			const playerStatus = await AudioPlayer.current.getStatusAsync();
			if (playerStatus.isLoaded === true) await AudioPlayer.current.unloadAsync();
			SetIsPLaying(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.container}>
			<Button mode="contained" style={{ width: "80%" }} onPress={IsPLaying ? StopRecording : StartRecording}>
				{IsRecording ? "Stop Recording" : "Start Recording"}
			</Button>

			{RecordedURI && (
				<Button mode="contained" style={{ width: "80%" }} onPress={IsPLaying ? StopPlaying : PlayRecordedAudio}>
					{IsPLaying ? "Stop Sound" : "Play Sound"}
				</Button>
			)}

			<Text>{RecordedURI}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
