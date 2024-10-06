class ABCPlayer extends ABCElement {
    constructor () {
        super();
    }
    loadPlayer () {
        this.status = 'loading';
        this.controller.classList.remove('play');
        this.controller.classList.add('loading');
        this.controller.textContent = 'Loading';
    }
    startPlayer () {
        this.dispatchEvent(this.musicPlaying);
        this.status = 'playing';
        this.controller.classList.remove('loading');
        this.controller.classList.add('pause');
        this.controller.textContent = 'Pause audio';
        this.synth.start();
    }
    pausePlayer () {
        this.status = 'paused';
        this.controller.classList.remove('pause');
        this.controller.classList.add('play');
        this.controller.textContent = 'Play audio';
        this.synth.pause();
    }
    resumePlayer () {
        this.dispatchEvent(this.musicPlaying);
        this.status = 'playing';
        this.controller.classList.remove('play');
        this.controller.classList.add('pause');
        this.controller.textContent = 'Pause audio';
        this.synth.resume();
    }
    stopPlayer () {
        if (this.status == 'adjusting') {
            this.status = 'playing';
            return;
        }
        if (this.status == 'playing') {
            this.synth.seek(0);
            if (this.controls.querySelector('input[type="checkbox"]').checked) {
                return;
            }
            this.pausePlayer();
            this.closeControls();
        }
    }
    closeControls () {
        if (this.controls) {
            this.controller.setAttribute('aria-expanded', 'false');
            this.controls.setAttribute('aria-hidden', 'true');
        }
    }
    adjustSpeed (factor) {
        this.status = 'adjusting';
        this.synth.pause();
        this.settings.millisecondsPerMeasure = this.millisecondsPerMeasure - (factor * (this.millisecondsPerMeasure/7));
        this.synth.init(this.settings).then( () => {
            this.synth.prime();
        }).then( () => {
            this.synth.start();
        });
    }
    render () {
        if ('audioSession' in navigator) {
            navigator.audioSession.type = 'playback';
            navigator.audioSession.addEventListener('statechange', (ev) => {
                if (navigator.audioSession.state === 'interrupted') {
                    this.pausePlayer();
                }
            });
        }
        if (!this.audioContext) {
            this.audioContext = new window.AudioContext();
        }
        if (this.audioContext.state !== 'running') {
            this.audioContext.resume();
        }
        if (!this.visualContext) {
            this.visualContext = window.ABCJS.renderAbc('*', this.abc);
        }
        this.synth = new window.ABCJS.synth.CreateSynth();
        this.settings = {
            visualObj: this.visualContext[0],
            audioContext: this.audioContext,
            millisecondsPerMeasure: this.millisecondsPerMeasure,
            onEnded: (ev) => {
                this.stopPlayer();
            },
            options: {
                program: 21,
                chordsOff: true
            }
        };
        this.synth.init(this.settings).then( () => {
            this.synth.prime().then( () => {
                this.startPlayer();
                this.controller.addEventListener('click', (ev) => {
                    if (this.controller.classList.contains('pause')) {
                        this.pausePlayer();
                    } else {
                        this.resumePlayer();
                    }
                });
                this.controller.addEventListener('dblclick', (ev) => {
                    ev.preventDefault();
                    this.synth.seek(0);
                });
                this.controls.querySelector('input[type="range"]').addEventListener('change', (ev) => {
                    this.adjustSpeed(ev.target.value);
                });
                document.addEventListener('musicPlaying', (ev) => {
                    if (ev.target != this) {
                        this.pausePlayer();
                        this.closeControls();
                    }
                });
                document.addEventListener('closing', (ev) => {
                    if (ev.target.contains(this)) {
                        this.pausePlayer();
                    }
                });
            });
        });
    }
    connectedCallback () {
        this.controller = this.querySelector('button');
        this.controls = this.querySelector('[role="menu"]');
        this.status = '';
        this.musicPlaying = new CustomEvent('musicPlaying', { bubbles: true });
        this.notes_id = this.dataset.notes_id;
        this.abc = document.getElementById(this.notes_id).textContent;
        this.millisecondsPerMeasure = 1000;
        if (this.abc.includes('M: 3/2')) {
            this.millisecondsPerMeasure = 2000;
        }
        if (this.abc.includes('M: 12/8')) {
            this.millisecondsPerMeasure = 1750;
        }
        if (this.abc.includes('M: 9/8')) {
            this.millisecondsPerMeasure = 1500;
        }
        if (this.abc.includes('M: 2/4')) {
            this.millisecondsPerMeasure = 800;
        }
        if (this.abc.includes('M: 4/4')) {
            this.millisecondsPerMeasure = 1250;
        }
        this.controller.addEventListener('click', (ev) => {
            this.loadPlayer();
            if (window.ABCJS) {
                this.render();
            } else {
                this.loadLibrary();
            }
        }, {once: true});
    }
}
customElements.define('abc-player', ABCPlayer);