import Template from '@templates/Template.js';//importamos el archivo template con un alias

import '@styles/main.css';//importamos el css para que webpack lo ponga en el html

import '@styles/vars.styl';//importamos stylus y webpack llevara todo al mismo main.js juto al css normal

(async function App() {
  const main = null || document.getElementById('main');
  main.innerHTML = await Template();
})();