
class RobinUnreadability extends HTMLElement {
  constructor () {
    super();
  }
  connectedCallback () {
    const sr = this.attachShadow({ mode: 'closed' });
    const root = document.createElement('div');
    const score = parseFloat(this.getAttribute('score')).toFixed(0);
    let colour = 'red';
    if (score >= 50) colour = 'orange';
    if (score >= 60) colour = 'green';
    root.setAttribute('class', colour);
    const schoolLevel = this.getAttribute('school-level');
    root.textContent = `${score} (${schoolLevel})`
    const style = document.createElement('style');
    style.textContent = `
    :host { display: block; }
    div {
      border: 1px solid;
      padding: 4px;
      font-family: sans-serif;
      font-size: 0.8rem;
      max-width: fit-content;
    }
    div.green   { color: #069C56; border-color: #069C56; }
    div.orange  { color: #FF681E; border-color: #FF681E; }
    div.red     { color: #D3212C; border-color: #D3212C; }
    `;
    sr.append(style, root);
  }
}
customElements.define('robin-unreadability', RobinUnreadability);
