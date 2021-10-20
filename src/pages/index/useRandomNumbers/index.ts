import { useState } from "react";
import { getRandomNumbers } from "../utils";

const useRandomNumbers = () => {
	const [randomNumbers, setRandomNumbers] = useState(getRandomNumbers());

	return {
		randomNumbers,
		setRandomNumbers
	}
}

export default useRandomNumbers