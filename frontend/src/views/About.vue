<template>
  <div class="about">
    <!-- Declaramos vue-headful -->
    <vue-headful title="About" />
    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <!-- LISTADOS CON LOGOS Y LINKS DE LAS TECNOLOGÍAS USADAS -->
    <h2>Tecnologías usadas:</h2>
    <div id="logos">
      <ul>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Glossary/JavaScript" target="__blank">
            <img src="../assets/info/javaScript.png" alt="Logo JavaScript" />
            <p>JavaScript</p>
          </a>
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML" target="__blank">
            <img src="../assets/info/HTML.png" alt="Logo HTML" />
            <p>HTML</p>
          </a>
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="__blank">
            <img src="../assets/info/CSS.png" alt="Logo CSS" />
            <p>CSS</p>
          </a>
        </li>
        <li>
          <a href="https://www.mysql.com/" target="__blank">
            <img src="../assets/info/MySQL.png" alt="Logo MySQL" />
            <p>MySQL</p>
          </a>
        </li>
        <li>
          <a href="https://nodejs.org/en/" target="__blank">
            <img src="../assets/info/nodeJS.png" alt="Logo nodeJS" />
            <p>nodeJS</p>
          </a>
        </li>
        <li>
          <a href="https://expressjs.com/es/" target="__blank">
            <img src="../assets/info/Express.png" alt="Logo nodeJs Express" />
            <p>nodeJS Express</p>
          </a>
        </li>
        <li>
          <a href="https://sendgrid.com/" target="__blank">
            <img src="../assets/info/SendGrid.png" alt="Logo SendGrid" />
            <p>SenGrid</p>
          </a>
        </li>
        <li>
          <a href="https://jwt.io/" target="__blank">
            <img src="../assets/info/JWT.jpg" alt="Logo JSON Web Token" />
            <p>JSON Web Token</p>
          </a>
        </li>
        <li>
          <a href="https://date-fns.org/" target="__blank">
            <img src="../assets/info/date-fns.png" alt="Logo date-fns" />
            <p>Date-fns</p>
          </a>
        </li>
        <li>
          <a href="https://lodash.com/" target="__blank">
            <img src="../assets/info/Lodash.png" alt="Logo Lodash" />
            <p>Lodash</p>
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="__blank">
            <img src="../assets/info/Vue.png" alt="Logo Vue" />
            <p>Vue.js</p>
          </a>
        </li>
        <li>
          <a href="https://www.npmjs.com/package/axios#features" target="__blank">
            <img src="../assets/info/axios.png" alt="Logo Axios" />
            <p>Axios</p>
          </a>
        </li>
        <li>
          <a href="https://sweetalert2.github.io/" target="__blank">
            <img src="../assets/info/sweetalert2.png" alt="Logo sweetalert2" />
            <p>sweetalert2</p>
          </a>
        </li>
        <li>
          <a href="https://hapi.dev/" target="__blank">
            <img src="../assets/info/hapi.png" alt="Logo Hapi-Joi" />
            <p>Hapi-Joi</p>
          </a>
        </li>
      </ul>
    </div>
    <!-- AGRADECIMIENTOS -->
    <h2>Agradecimiento:</h2>
    <a href="https://hackaboss.com/" target="__blank">
      <img src="../assets/info/hackABoss.png" alt="Logo de Hack A Boss" />
    </a>
  </div>
</template>

<script>
export default {
  name: "About",
  methods: {
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
};
</script>

<style scoped>
a,
a p {
  text-decoration: none;
  color: var(--dark);
}
h2:last-of-type {
  margin-bottom: 1rem;
}
h2,
p {
  text-decoration: underline;
}
div#logos ul {
  list-style: none;
  display: grid;
  gap: 1.5rem;
  margin: 1.5rem;
  justify-items: center;
  align-items: center;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
}

div#logos ul li img {
  width: 50px;
}
img {
  width: 130px;
}

@media (min-width: 700px) {
  div#logos ul {
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto auto;
  }
  div#logos ul li img {
    width: 100px;
  }
  img {
    width: 170px;
  }
}

@media (min-width: 1000px) {
  div#logos ul {
    grid-template-columns: auto auto auto auto auto;
    grid-template-rows: auto auto auto auto auto;
  }
  div#logos ul li img {
    width: 130px;
  }
  img {
    width: 230px;
  }
}
</style>
