class LemmyEmbed extends HTMLElement {
  url: string
  proxy: string
  title: string
  description: string
  truncatedDescription: string
  coverImage: string
  width: number
  truncateLength: number

  constructor() {
    super()
    this.url = this.getAttribute('url') || ''
    this.proxy = 'https://corsproxy.io/?'
    this.width = 400
    this.truncateLength = 150
    this.title = ''
    this.description = ''
    this.truncatedDescription = ''
    this.coverImage = ''
  }

  static get observedAttributes() {
    return [
      'url',
      'title',
      'description',
      'cover-image',
      'width',
      'truncate-length',
    ]
  }

  async getPageData() {
    if (!this.url) {
      return
    }

    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
    }

    const proxiedUrl = `${this.proxy}${encodeURIComponent(this.url)}`

    const res = await fetch(proxiedUrl, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.error(error))

    return res
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    const content = await this.getPageData() || 'No content found'

    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    this.title = doc.querySelector('title')?.textContent || 'No title found'
    this.description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 'No description found'
    this.truncatedDescription = this.description.length > this.truncateLength ? `${this.description.slice(0, this.truncateLength)}...` : this.description
    this.coverImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''

    shadow.innerHTML = `
      <style>
        :host {
          --link-color: #007bff;
          --border: 2px solid #444;
          --background-color: #333;
          --color: #fff;
          --border-radius: 4px;
          --padding: 1rem;
          --aspect-ratio: 16 / 9;
          --cover-image: url(${this.coverImage});
          --max-width: ${this.width}px;

          color-scheme: light dark;
          border: var(--border);
          background-color: var(--background-color);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        @media (prefers-color-scheme: light) {
          :host {
            --background-color: #fff;
            --color: #333;
            --border: 2px solid #ccc;
          }
        }

        *, *:before, *:after {
          box-sizing: border-box;
        }

        p {
          margin: 0;
        }

        a {
          color: var(--link-color);
        }

        picture {
          display: block;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          aspect-ratio: var(--aspect-ratio);
        }

        picture img {
          display: none;
        }

        .lemmy-card {
          width: var(--max-width);
          max-width: 100%;
          display: flex;
          flex-direction: column;
          color: var(--color);
        }

        .lemmy-card__title {
          margin: 0 0 0.5rem 0;
        }

        .lemmy-card footer {
          padding: var(--padding);
          border-top: var(--border);
        }

        .lemmy-card__info {
          padding: var(--padding);
        }
      </style>
      <div class="lemmy-card">
        ${this.coverImage ? `
        <picture style="background-image: url(${this.coverImage})">
          <img src="${this.coverImage}" alt="${this.title}">
        </picture>
        ` : ''}
        <div class="lemmy-card__info">
          <h3 class="lemmy-card__title">${this.title}</h3>
          <p>${this.truncatedDescription}</p>
        </div>
        ${this.url ? `
        <footer>
          <a
            href="${this.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Lemmy
          </a>
        </footer>
        ` : ''}
      </div>
    `
  }
}

export default LemmyEmbed
