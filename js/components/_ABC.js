class ABCElement extends HTMLElement {
    constructor () {
        super();
    }
    loadLibrary () {
        let script = document.createElement('script');
        script.src = '../../js/abcjs_basic_5.11.0-min.js';
        script.addEventListener('load', (ev) => {
            this.render();
        });
        document.querySelector('head').appendChild(script);
    }
    render () {
        if (!window.ABCJS) {
            this.loadLibrary();
            return;
        }
        if (this.canvas_id && this.abc) {
            if (this.abc.length < 60) {
                this.staffWidth = 600;
            } else {
                this.staffWidth = 700;
            }
            window.ABCJS.renderAbc(
                this.canvas_id,
                this.abc,
                {
                    scale: 1,
                    staffwidth: this.staffWidth,
                    paddingleft: 0,
                    paddingright: 0,
                    responsive: 'resize',
                    oneSvgPerLine: true
                }
            );
        }
    }
}
customElements.define('abc-element', ABCElement);