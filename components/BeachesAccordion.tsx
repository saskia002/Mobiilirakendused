import React, { useState } from "react";
import { List, Button } from "react-native-paper";

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

		const handleAccordionPress = () => {
			setIsAccordionOpen(!isAccordionOpen);
	};
	
	const handleItemClick = (beach: Beach) => {
		// Handle item click, e.g., navigate to beach details screen
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
			style={{ width: 160 }}
		>
			{beaches.map((beach) => (
				<Button key={beach.id} onPress={() => handleItemClick(beach)}>
					<List.Item
						key={beach.id}
						title={beach.name}
						/*description={`Latitude: ${beach.latitude}, Longitude: ${beach.longitude}`}*/ style={{ width: 160, padding: 1 }}
					/>
				</Button>
			))}
		</List.Accordion>
	);
};

export default BeachesAccordion;
