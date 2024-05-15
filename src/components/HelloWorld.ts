class HelloWorld extends HTMLElement {
  name: string

  constructor() {
    super()
    this.name = this.getAttribute('name') || 'World'
  }

  static get observedAttributes() {
    return ['name']
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' })
    this.textContent = `Hello, ${this.name}!`

    shadow.innerHTML = `
      <style>
      p {
        margin: 0;
        padding: 0;
        color: yellow;
      }
      </style>

      <p>Hello, ${this.name}!</p>
    `
  }
}

export default HelloWorld
