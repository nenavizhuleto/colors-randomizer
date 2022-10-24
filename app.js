const cols = document.querySelectorAll('.col');
const hash = window.location.hash;

document.addEventListener('keydown', (event) => {
	if (event.code.toLowerCase() === 'space') {
		setRandomColors();
	}
});

document.addEventListener('click', (e) => {
	const type = e.target.dataset.type;

	if (type === 'lock') {
		e.target.classList.toggle('fa-lock-open');
		e.target.classList.toggle('fa-lock');

		return;
	}

	if (type === 'hex') {
		copyToClipboard(e.target.innerHTML);
		return;
	}
});

const copyToClipboard = (text) => {
	return navigator.clipboard.writeText(text);
};

const generateRandomHexColor = () => {
	const hexCodes = '0123456789ABCDEF';
	let color = '';

	for (let i = 0; i < 6; i++) {
		// generating random hex values
		color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
	}

	return '#' + color;
};

const updateUrlHash = (colors) => {
	window.location.hash = colors.reduce((prev, curr) => {
		return prev + curr.substring(1);
	}, '');
};

const setRandomColors = () => {
	const colors = [];

	for (let i = 0; i < cols.length; i++) {
		colors.push(generateRandomHexColor());
	}

	setColors(colors);
};

const setColors = (colors) => {
	// set individual color for column
	cols.forEach((col, i) => {
		const isLocked = col.querySelector('i').classList.contains('fa-lock');
		const text = col.querySelector('h2');
		const button = col.querySelector('i');

		if (isLocked) {
			// if column is locked, replace that color with locked one
			// might be implemented better than that
			// because currently setColors function modifies initial colors array (not good)
			colors[i] = text.innerHTML;
			return;
		}

		hexColor = colors[i];
		luminance = calculateLuminance(hexColor);

		// change text color in respect of luminance to be more readable
		textColor = luminance > 0.5 ? 'black' : 'white';

		text.innerHTML = hexColor;
		text.style.color = textColor;
		button.style.color = textColor;
		col.style.background = hexColor;
	});

	updateUrlHash(colors);
};

const setColorsFromHash = (hash) => {
	// check if hash is valid size
	if (hash.length - 1 !== cols.length * 6) {
		console.error('invalid hash size: randomizing colors...');
		setRandomColors();
		return;
	}
	// removing '#' symbol from hash
	const cleanHash = hash.substring(1);
	colors = [];
	// getting colors from hash
	for (let i = 0; i < cleanHash.length / 6; i++) {
		colors.push('#' + cleanHash.substring(i * 6, i * 6 + 6));
	}
	setColors(colors);
};

const calculateLuminance = (hexColor) => {
	// coefficients according to conversion formula from rgb to luminance separeted by rgb channels
	coefficients = [0.212, 0.7152, 0.0722];
	luminance = 0;
	// i < 3 -> red, green, blue channels
	for (let i = 0; i < 3; i += 1) {
		// converting hex to decimal ignoring '#' symbol
		hexValue = Number('0x' + hexColor[1 + i * 2] + hexColor[2 + i * 2]);
		// calculating luminance;
		luminance += coefficients[i] * hexValue;
	}
	// normalize luminance to snap between 0 to 1
	return luminance / 255;
};

if (hash.length > 1) {
	setColorsFromHash(hash);
} else {
	setRandomColors();
}
