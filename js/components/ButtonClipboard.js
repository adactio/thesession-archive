class ButtonClipboard extends HTMLElement {
    constructor () {
        super();
    }
    animate () {
        let feedback = document.createElement('span');
        feedback.setAttribute('role', 'status');
        if (this.feedbacktext) {
            feedback.innerHTML = this.feedbacktext;
        } else {
            feedback.innerHTML = this.button.innerHTML;
        }
        document.body.appendChild(feedback);
        let triggerBox = this.button.getBoundingClientRect();
        let feedbackBox = feedback.getBoundingClientRect();
        let ypos = Math.round((triggerBox.top + window.scrollY));
        let xpos = Math.round((triggerBox.left + window.scrollX + (triggerBox.width/2)) - (feedbackBox.width/2));
        feedback.style.left = `${xpos}px`;
        feedback.style.top = `${ypos}px`;
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-75px)';
        feedback.addEventListener('transitionend', (ev) => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        });
    }
    connectedCallback () {
        this.button = this.querySelector('button');
        this.feedbacktext = this.dataset.feedback;
        this.copytext = this.dataset.copytext;
        if (this.dataset.copyelement) {
            this.copytext = document.querySelector(this.dataset.copyelement).textContent;
        }
        this.button.addEventListener('click', (ev) => {
            navigator.clipboard.writeText(this.copytext);
            this.animate();
        });
    }
}
customElements.define('button-clipboard', ButtonClipboard);