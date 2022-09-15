window.addEventListener('pageshow', async () => {
	const	obs			= new OBSWebSocket(),
			host		= 'ws://localhost:4455',
			password	= '';

	const	ghost				= document.querySelector('.ghost'),
			evidences			= document.querySelector('.evidences'),
			evidences_class		= ['emf-5', 'fingerprints', 'ghost-writing', 'freezing-temperatures', 'dots-projector', 'ghost-orb', 'spirit-box'],
			evidences_ghosts	= {
				0b0100110: 'Banshee',
				0b0111000: 'Demon',
				0b0010101: 'Deogen',
				0b1100100: 'Goryo',
				0b0101010: 'Hantu',
				0b1101000: 'Jinn',
				0b0010011: 'Mare',
				0b0011001: 'Moroi',
				0b1110000: 'Myling',
				0b1100010: 'Obake',
				0b1001100: 'Oni',
				0b0001011: 'Onryo',
				0b0100101: 'Phantom',
				0b0110001: 'Poltergeist',
				0b1000110: 'Raiju',
				0b0011010: 'Revenant',
				0b1011000: 'Shade',
				0b1010001: 'Spirit',
				0b0010110: 'Thaye',
				0b0101011: 'The Mimic',
				0b1001001: 'The Twins',
				0b1000101: 'Wraith',
				0b0000111: 'Yokai',
				0b0001110: 'Yurei'
			};

	function evidences_generator() {
		let value = 0;
		for (let i = (evidences_class.length - 1); i >= 0; --i) {
			const	evidence	= evidences.querySelector(`.${evidences_class[i]}`),
					enabled		= evidence.classList.contains('enabled'),
					disabled	= evidence.classList.contains('disabled');

			if (enabled) value = (value | (1 << ((evidences_class.length - 1) - i)));
		}

		return value;
	}

	function ghost_finder(evidences) {
		let available = [];
		for (const value of Object.keys(evidences_ghosts)) {
			if ((value & evidences) == evidences) available.push(evidences_ghosts[value]);
		}

		if (available.length == 1) return available[0];

		return false;
	}

	obs.on('error', e => {
		console.error('socket error:', e);

		if (e && e.status === undefined) e.status = 'error';
		if (e && e.description === undefined) e.description = 'websocket error (check network connection and whether OBS is still responsive)';

		console.log(e);
	});

	obs.on('ConnectionOpened', () => {
		console.log('Connected');

		setTimeout(() => {
			const data = { prout: 42 };
			const edata = { origin: 'arubinu42', data }
			obs.call('BroadcastCustomEvent', { eventData: edata });
		}, 5000);
	});
	obs.on('ConnectionClosed', () => {
		console.log('Disconnected');

		setTimeout(() => {
			//connect(port, pass, autoReconnect, ip);
		}, 5000);
	});

	obs.on('CustomEvent', event => {
		if (event.origin != 'arubinu42') return;

		console.log('CustomEvent:', event);
		if (typeof(event.data) === 'object' && event.data.target == 'phasmophobia') {
			const evidence_type = ['toggle-evidence', 'on-evidence', 'off-evidence', 'reset-evidence'].indexOf(event.data.name);

			if (evidence_type == 3) {
				for (const evidence of evidences.querySelectorAll(':scope > div')) evidence.classList.remove('enabled', 'disabled');
			} else if (evidence_type >= 0 && evidences_class.indexOf(event.data.data) >= 0) {
				let evidence = evidences.querySelector(`.${event.data.data}`);
				if (evidence) {
					let evidence_enabled = (evidence_type == 1);
					let evidence_disabled = (evidence_type == 2);
					if (evidence_type == 0) {
						evidence_enabled = (!evidence.classList.contains('enabled') && !evidence.classList.contains('disabled'));
						evidence_disabled = evidence.classList.contains('enabled');
					}

					evidence.classList.toggle('enabled', evidence_enabled);
					evidence.classList.toggle('disabled', evidence_disabled);
				}
			}

			const found = ghost_finder(evidences_generator());
			ghost.classList.toggle('show', !!found);
			if (found) ghost.innerText = found;
		}
	});

	try {
		const response = await obs.connect(host, password);
		console.log('response:', response);
	} catch (e) {
		console.log('error:', e);
	}
}, false);
