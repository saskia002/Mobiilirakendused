import React, { useState } from "react";
import { List, Button, Surface, useTheme } from "react-native-paper";

interface Beach {
	id: string;
	name: string;
	latitude: string;
	longitude: string;
}

interface BeachesAccordionProps {
	beaches: Beach[];
	onBeachSelect: (latitude: string, longitude: string) => void;
	isOpen: boolean;
	handleAccordionPress: () => void;
}

const BeachesAccordion: React.FC<BeachesAccordionProps> = ({ beaches, onBeachSelect }) => {
	const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
	const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

	const theme = useTheme();

	const handleAccordionPress = () => {
		setIsAccordionOpen(!isAccordionOpen);
	};

	const handleItemClick = (beach: Beach) => {
		onBeachSelect(beach.latitude, beach.longitude);
		setSelectedBeach(beach);
		setIsAccordionOpen(false);
	};
	return (
		<List.Accordion
			title={selectedBeach ? selectedBeach.name : "Beaches"}
			id="beaches-accordion"
			expanded={isAccordionOpen}
			onPress={handleAccordionPress}
			style={{ width: 200, backgroundColor: theme.colors.elevation.level1 }}
		>
			{beaches.map((beach) => (
				<List.Item onPress={() => handleItemClick(beach)} key={beach.id} title={beach.name} style={{ width: 160, padding: 1 }} />
			))}
		</List.Accordion>
	);
};

export default BeachesAccordion;
