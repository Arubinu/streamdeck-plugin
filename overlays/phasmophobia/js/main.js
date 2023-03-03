window.addEventListener('pageshow', async () => {
  const ghost = document.querySelectorAll('.ghost'),
    evidences = document.querySelector('.evidences'),
    evidences_class = ['emf-5', 'fingerprints', 'ghost-writing', 'freezing-temperatures', 'dots-projector', 'ghost-orb', 'spirit-box'],
    evidences_ghosts = {
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
      const  evidence = evidences.querySelector(`.${evidences_class[i]}`),
        enabled = evidence.classList.contains('enabled'),
        disabled = evidence.classList.contains('disabled');

      if (enabled) {
        value = value | (1 << ((evidences_class.length - 1) - i));
      }
    }

    return value;
  }

  function ghost_finder(evidences) {
    let available = [];
    for (const value of Object.keys(evidences_ghosts)) {
      if ((value & evidences) === evidences) {
        available.push(evidences_ghosts[value]);
      }
    }

    if (available.length === 1) {
      return available[0];
    }

    return false;
  }

  function connect() {
    window.socket = new WebSocket('ws://localhost:5042');

    window.socket.onopen = event => {
      console.log('socket.onopen');
    };

    window.socket.onmessage = event => {
      console.log('socket.onmessage:', event.data);
      if (typeof event.data === 'string') {
        let data = event.data;
        try {
          data = JSON.parse(data);
        } catch (e) {}

        if (typeof data === 'object' && data.origin === 'arubinu42') {
          if (data.data.target === 'phasmophobia') {
            const evidence_type = ['toggle-evidence', 'on-evidence', 'off-evidence', 'reset-evidence'].indexOf(data.data.name);
            if (evidence_type === 3) {
              for (const evidence of evidences.querySelectorAll(':scope > div')) evidence.classList.remove('enabled', 'disabled');
            } else if (evidence_type >= 0 && evidences_class.indexOf(data.data.data) >= 0) {
              let evidence = evidences.querySelector(`.${data.data.data}`);
              if (evidence) {
                let evidence_enabled = (evidence_type === 1);
                let evidence_disabled = (evidence_type === 2);
                if (evidence_type === 0) {
                  evidence_enabled = (!evidence.classList.contains('enabled') && !evidence.classList.contains('disabled'));
                  evidence_disabled = evidence.classList.contains('enabled');
                }
      
                evidence.classList.toggle('enabled', evidence_enabled);
                evidence.classList.toggle('disabled', evidence_disabled);
              }
            }

            const found = ghost_finder(evidences_generator());
            for (const elem of ghost) {
              elem.classList.toggle('show', !!found);
              if (found) elem.innerText = found;
            }
          }
        }
      }
    };

    window.socket.onclose = event => {
      if (event.wasClean) {
        console.log(`socket.onclose: Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      }

      setTimeout(connect, 3000);
    };

    window.socket.onerror = error => {
      if (error.message) {
        console.log('socket.onerror:', error.message);
      }

      window.socket.close();
    };
  }

  connect();
}, false);
