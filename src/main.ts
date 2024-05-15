import './style.css'
import HelloWorld from './components/HelloWorld'
import LemmyEmbed from './components/LemmyEmbed'

// mount our component
customElements.define('hello-world', HelloWorld)
customElements.define('lemmy-embed', LemmyEmbed)

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <hello-world name="Bobby"></hello-world>
    <h3>Another component</h3>
    <p>lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.</p>

    <lemmy-embed url="https://orcas.enjoying.yachts/post/798736"></lemmy-embed>
  </main>
`
