import { StyleSheet, View, Image, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import { Formik } from "formik";

export type User = {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	avatar: string;
};

export default function App() {
	const [data, setData] = useState<User[]>([]);
	const formRef = useRef();
	const [visible, setVisible] = useState(false);
	const [snackVisible, setSnackVisible] = useState(false);

	const hideDialog = () => setVisible(false);

	useEffect(() => {
		fetch("https://reqres.in/api/users")
			.then((response) => {
				response.json().then((data) => {
					setData(data.data);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	const deleteUserData = (id) => {
		fetch(`https://reqres.in/api/users/${id}`, {
			method: "DELETE",
		})
			.then((response) => {
				console.log(response);
				if (response.status === 204) {
					const newData = data.filter((d) => d.id !== id);
					setData(newData);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSubmit = () => {
		if (formRef.current) {
			formRef.current.handleSubmit();
		}
	};

	const addUser = (values) => {
		if (!values.name || !values.job) return console.log("Please fill all fields");
		fetch("https://reqres.in/api/users", {
			method: "POST",
			body: JSON.stringify(values),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		})
			.then((response) => {
				console.log(response);
				response.json().then((data) => {
					setVisible(false);
					setSnackVisible(true);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<View style={styles.container}>
					{data.map((d) => {
						return (
							<View key={d.id} style={{ marginBottom: 12 }}>
								<Image source={{ uri: d.avatar }} style={{ width: 100, height: 100 }} />
								<Text>
									{d.first_name} {d.last_name}
								</Text>
								<Text>{d.email}</Text>
								<Button mode="contained" onPress={() => deleteUserData(d.id)}>
									Delete
								</Button>
							</View>
						);
					})}
					{data.length === 0 && <Text>No data found</Text>}
				</View>
				<View style={styles.container2}>
					<Button onPress={() => setVisible(true)} mode="contained">
						Add new user
					</Button>
					<Portal style={{ maxWidth: 800 }}>
						<Dialog visible={visible} onDismiss={hideDialog}>
							<Dialog.Icon size={38} icon="account-plus" />
							<Dialog.Title>Add new user</Dialog.Title>
							<Dialog.Content>
								<Formik innerRef={formRef} initialValues={{ name: "", job: "" }} onSubmit={addUser}>
									{({ handleChange, handleBlur, handleSubmit, values }) => (
										<View>
											<TextInput
												autoFocus
												label="name"
												mode="outlined"
												onChangeText={handleChange("name")}
												onBlur={handleBlur("name")}
												value={values.name}
											/>
											<TextInput
												label="job"
												mode="outlined"
												onChangeText={handleChange("job")}
												onBlur={handleBlur("job")}
												value={values.job}
											/>
										</View>
									)}
								</Formik>
							</Dialog.Content>
							<Dialog.Actions>
								<Button mode="contained-tonal" style={{ width: 80 }} onPress={hideDialog}>
									Cancel
								</Button>
								<Button mode="contained" style={{ width: 90 }} onPress={handleSubmit}>
									Add user
								</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
				</View>
			</ScrollView>

			<Portal>
				<Snackbar
					visible={snackVisible}
					onDismiss={() => setSnackVisible(false)}
					action={{
						label: "Undo",
						onPress: () => {
							// Do something
						},
					}}
				>
					User added successfully!
				</Snackbar>
			</Portal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: "5%",
		flex: 1,
		columnGap: 32,
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",

		flexDirection: "row",
		width: "80%",
		backgroundColor: "white",
		color: "black",
	},
	container2: {
		display: "flex",
		paddingBottom: 20,
		alignItems: "center",
		justifyContent: "center",

		width: "80%",
		backgroundColor: "white",
		color: "black",
	},
});
