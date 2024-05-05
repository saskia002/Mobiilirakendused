import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, Text, Image, Platform, Linking, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import DeepARView, { IDeepARHandle, TextureSourceTypes, CameraPermissionRequestResult, Camera, ErrorTypes, CameraPositions } from "react-native-deepar";
import RNFetchBlob from "rn-fetch-blob";

export const Effects = [
	{
		name: "me",
		title: "Me",
		platforms: ["ios", "android"],
	},
	{
		name: "face_painting",
		title: "Face Painting",
		platforms: ["ios", "android"],
	},
	{
		name: "viking_helmet",
		title: "Viking Helmet",
		platforms: ["ios", "android"],
	},
	{
		name: "stallone",
		title: "Stallone",
		platforms: ["ios", "android"],
	},
	{
		name: "ping_pong",
		title: "Ping Pong",
		platforms: ["ios", "android"],
	},
	{
		name: "humanoid",
		title: "Humanoid",
		platforms: ["ios", "android"],
	},
	{
		name: "fire_effect",
		title: "Fire Effect",
		platforms: ["ios", "android"],
	},
	{
		name: "emotion_meter",
		title: "Emotion Meter",
		platforms: ["ios", "android"],
	},
	{
		name: "emotions_exaggerator",
		title: "Emotion Exaggerator",
		platforms: ["ios", "android"],
	},
	{
		name: "look1",
		title: "Look 1",
		platforms: ["ios", "android"],
	},
	{
		name: "look2",
		title: "Look 2",
		platforms: ["ios", "android"],
	},
	{
		name: "aviators",
		title: "Aviators",
		platforms: ["ios", "android"],
	},
	{
		name: "ball_face",
		title: "Ball face",
		platforms: ["ios", "android"],
	},
	{
		name: "beard",
		title: "Beard",
		platforms: ["ios", "android"],
	},
	{
		name: "beauty",
		title: "Beauty",
		platforms: ["ios", "android"],
	},
	{
		name: "fairy_lights",
		title: "Fairy Lights",
		platforms: ["ios", "android"],
	},
	{
		name: "background_segmentation",
		title: "Background Segmentation",
		platforms: ["ios", "android"],
	},
	{
		name: "hair_segmentation",
		title: "Hair Segmentation",
		platforms: ["ios"],
	},
	{
		name: "flower_crown",
		title: "Flower Crown",
		platforms: ["ios", "android"],
	},
	{
		name: "frankenstein",
		title: "Frankenstein",
		platforms: ["ios", "android"],
	},
	{
		name: "lion",
		title: "Lion",
		platforms: ["ios", "android"],
	},
	{
		name: "manly_face",
		title: "Manly Face",
		platforms: ["ios", "android"],
	},
	{
		name: "plastic_ocean",
		title: "Plastic Ocean",
		platforms: ["ios", "android"],
	},
	{
		name: "pumpkin",
		title: "Pumpkin",
		platforms: ["ios", "android"],
	},
	{
		name: "scuba",
		title: "Scuba Diver",
		platforms: ["ios", "android"],
	},
	{
		name: "tape_face",
		title: "Tape Face",
		platforms: ["ios", "android"],
	},
	{
		name: "tiny_sunglasses",
		title: "Tiny Sunglasses",
		platforms: ["ios", "android"],
	},
	{
		name: "topology",
		title: "Topology",
		platforms: ["ios", "android"],
	},
];

type ARScreenProps = StackScreenProps<RootStackParamList, "AR">;

const ARScreen = ({ navigation }: { navigation: any }) => {
	const deepARRef = useRef<IDeepARHandle>(null);

	const [permsGranted, setPermsGranted] = useState(false);
	const [switchCameraInProgress, setSwitchCameraInProgress] = useState(false);
	const [isStatsEnabled, setIsStatsEnabled] = useState(false);
	const [currEffectIndex, setCurrEffectIndex] = useState(0);
	const [videoMode, setVideoMode] = useState(false);
	const [isVideoRecording, setIsVideoRecording] = useState(false);
	const [isVideoRecordingPaused, setIsVideoRecordingPaused] = useState(false);
	const [isFacePaintingStarted, setIsFacePaintingStarted] = useState(false);
	const [cameraPosition, setCameraPosition] = useState(CameraPositions.FRONT);

	const isCurrEffectSupported = useMemo(() => Effects[currEffectIndex].platforms.includes(Platform.OS), [currEffectIndex]);

	useEffect(() => {
		const requestPermissions = async () => {
			const cameraPermission = await Camera.requestCameraPermission();
			const microphonePermission = await Camera.requestMicrophonePermission();

			const isCameraAllowed = cameraPermission === CameraPermissionRequestResult.AUTHORIZED;
			const isMicrophoneAllowed = microphonePermission === CameraPermissionRequestResult.AUTHORIZED;

			if (isCameraAllowed && isMicrophoneAllowed) {
				setPermsGranted(true);
			} else {
				Linking.openSettings();
			}
		};

		requestPermissions();
	}, []);

	const switchCamera = () => {
		if (deepARRef && switchCameraInProgress === false) {
			setCameraPosition(cameraPosition === CameraPositions.FRONT ? CameraPositions.BACK : CameraPositions.FRONT);
			setSwitchCameraInProgress(true);
		}
	};

	const changeEffect = (direction: number) => {
		if (!deepARRef) {
			return;
		}

		let newIndex = direction > 0 ? currEffectIndex + 1 : currEffectIndex - 1;

		if (newIndex >= Effects.length) {
			newIndex = 0;
		}

		if (newIndex < 0) {
			newIndex = Effects.length - 1;
		}

		const newEffect = Effects[newIndex];

		if (newEffect.platforms.includes(Platform.OS)) {
			deepARRef?.current?.switchEffect({
				mask: newEffect.name,
				slot: "effect",
			});
		} else {
			deepARRef?.current?.switchEffect({
				mask: Effects[0].name,
				slot: "effect",
			});
		}

		setCurrEffectIndex(newIndex);
	};

	const takeScreenshot = () => {
		if (deepARRef) {
			deepARRef?.current?.takeScreenshot();
		}
	};

	const renderPhotoViewButtons = () => {
		if (videoMode) {
			return null;
		}

		return (
			<>
				<View style={styles.upLeftButtons}>
					<Button
						mode="contained"
						onPress={() => {
							setIsStatsEnabled(!isStatsEnabled);
							deepARRef?.current?.showStats(!isStatsEnabled);
						}}
					>
						Show Stats
					</Button>
					<Button
						mode="contained"
						onPress={() => {
							RNFetchBlob.config({
								fileCache: true,
							})
								.fetch("GET", "http://betacoins.magix.net/public/deepar-filters/" + "8bitHearts")
								.then((res) => {
									deepARRef?.current?.switchEffectWithPath({
										path: res.path(),
										slot: "mask",
									});
								});
						}}
					>
						Load Effect on Fly
					</Button>
					<Button
						mode="contained"
						onPress={() => {
							setCurrEffectIndex(0);
							deepARRef?.current?.switchEffect({
								mask: Effects[0].name,
								slot: "effect",
							});
							deepARRef?.current?.switchEffect({
								mask: Effects[0].name,
								slot: "mask",
							});
						}}
					>
						Clear All Effects
					</Button>
					<Button
						mode="contained"
						onPress={() => {
							setVideoMode(true);
						}}
					>
						Switch Video Mode
					</Button>
					<Button
						disabled={Effects[currEffectIndex].name !== "background_segmentation"}
						mode="contained"
						onPress={() => {
							RNFetchBlob.config({})
								.fetch("GET", "https://random.imagecdn.app/450/800")
								.then((res) => {
									deepARRef?.current?.changeParameterTexture({
										gameObject: "Background",
										component: "MeshRenderer",
										parameter: "s_texColor",
										type: TextureSourceTypes.BASE64,
										value: res.base64(),
									});
								});
						}}
					>
						Random Background Image
					</Button>
					<Button
						disabled={Effects[currEffectIndex].name !== "face_painting"}
						mode="contained"
						onPress={() => {
							const isStarted = !isFacePaintingStarted;

							if (isStarted) {
								deepARRef?.current?.setTouchMode(true);
							} else {
								deepARRef?.current?.setTouchMode(false);
							}

							setIsFacePaintingStarted(isStarted);
						}}
					>
						{isFacePaintingStarted ? "Stop Face Painting" : "Start Face Painting"}
					</Button>
					<Button
						mode="contained"
						onPress={() => {
							navigation.goBack();
						}}
					>
						Go Back
					</Button>
				</View>
				<Button onPress={() => switchCamera()}></Button>
				<View style={styles.bottomButtonContainer}>
					<Button onPress={() => changeEffect(-1)}>Previous</Button>
					<Button onPress={() => takeScreenshot()}></Button>
					<Button onPress={() => changeEffect(1)}>Next</Button>
				</View>
			</>
		);
	};

	const renderVideoViewButtons = () => {
		if (videoMode === false) {
			return null;
		}

		return (
			<View style={styles.upLeftButtons}>
				<Button
					onPress={() => {
						if (isVideoRecording) {
							deepARRef?.current?.finishRecording();
						} else {
							deepARRef?.current?.startRecording();
						}
					}}
				>
					{isVideoRecording ? "Stop Recording" : "Start Recording"}
				</Button>
				<Button
					disabled={!isVideoRecording}
					onPress={() => {
						if (isVideoRecordingPaused) {
							setIsVideoRecordingPaused(false);
							deepARRef?.current?.resumeRecording();
						} else {
							setIsVideoRecordingPaused(true);
							deepARRef?.current?.pauseRecording();
						}
					}}
				>
					{isVideoRecordingPaused ? "Resume Recording" : "Pause Recording"}
				</Button>
				<Button disabled={isVideoRecording} onPress={() => setVideoMode(false)}>
					Switch Photo View
				</Button>
			</View>
		);
	};

	const renderEffectName = () => {
		if (isCurrEffectSupported === false) {
			return <Text style={[styles.title, styles.notSupportedEffectName]}>{Effects[currEffectIndex].title}</Text>;
		}

		return <Text style={styles.title}>{Effects[currEffectIndex].title}</Text>;
	};

	const renderDeepARView = () => {
		if (permsGranted === false) {
			return null;
		}

		return (
			<>
				<DeepARView
					ref={deepARRef}
					apiKey="d5b16120783e1ea9e02f3964038110190e0cf15a45a67d29427bab6c90766e575458167d60d5803d"
					position={cameraPosition}
					videoWarmup={false}
					onCameraSwitched={() => {
						setSwitchCameraInProgress(false);
					}}
					onScreenshotTaken={(screenshotPath: String) => {
						const path = "file://" + screenshotPath;
						navigation.navigate("Preview", {
							path,
							type: "photo",
						});
					}}
					onVideoRecordingPrepared={() => {
						console.log("onVideoRecordingPrepared");
					}}
					onVideoRecordingStarted={() => {
						console.log("onVideoRecordingStarted");
						setIsVideoRecording(true);
					}}
					onVideoRecordingFinished={(videoPath: String) => {
						setIsVideoRecording(false);
						console.log("onVideoRecordingFinished =>", videoPath);
						const path = "file://" + videoPath;
						navigation.navigate("Preview", {
							path,
							type: "video",
						});
					}}
					onError={(text: String, type: ErrorTypes) => {
						console.log("onError =>", text, "type =>", type);
					}}
					// eslint-disable-next-line react-native/no-inline-styles
				/>
				{renderPhotoViewButtons()}
				{renderVideoViewButtons()}
				{renderEffectName()}
			</>
		);
	};

	return <View style={styles.container}>{renderDeepARView()}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	upLeftButtons: {
		position: "absolute",
		alignItems: "flex-start",
		left: 20,
		top: 40,
	},
	upLeftButton: {
		marginBottom: 10,
	},
	switchCameraButton: {
		position: "absolute",
		top: 40,
		right: 40,
	},
	cameraIcon: {
		width: 50,
		height: 40,
	},
	bottomButtonContainer: {
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		bottom: 60,
		height: 50,
	},
	screenshotIcon: {
		width: 70,
		height: 70,
	},
	title: {
		position: "absolute",
		bottom: 10,
		fontSize: 20,
		color: "#FFF",
		backgroundColor: "#000",
		borderWidth: 1,
		borderColor: "#FFF",
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	notSupportedEffectName: {
		color: "#F00",
	},
});

export default ARScreen;
