import { createApp, defineComponent, onMounted } from 'vue3-for-server'

import { watchProcessDeath } from 'watch-process-death'
import { renderToString } from 'vue/server-renderer'
console.log('Vue2:', createApp)

const app1 = createApp(
    defineComponent({
        // suspensible: false,
        setup: async () => {
            await new Promise((resolve, reject) => setTimeout(resolve, 2000))
            console.log(1123)

            return () => 'test'
        },
        async created() {
            await new Promise((resolve, reject) => setTimeout(resolve, 3000))
            await console.log('async created')
        },
        async mounted() {
            await console.log('async mounted')
        },
    })
)
const app1Instance = app1.mount('body')
console.log('app:', app1, app1Instance)

const unmountApp = () => {
    app1.unmount()
}
watchProcessDeath(unmountApp)
module.hot?.dispose(unmountApp)

export const getWebApp = async () => {
    const renderedHtml = renderToString(app1).then(html => {
        return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="importmap">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
            }
          }
        </script>
        <script type="module" src="/client.js"></script>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `
    })
    if (!renderedHtml) return
    return renderedHtml
}
export default null
