<template>
  <div class="footer">
    <!-- LINKS DE GITHUB, LINKEDIN, TWITTER Y GMAIL -->
    <div id="links">
      <a href="https://github.com/sagrado13?tab=repositories" target="_blank">
        <img src="../assets/github.svg" alt="Logo Github" />
      </a>
      <a
        href="https://www.linkedin.com/in/i%C3%B1aki-gonz%C3%A1lez-v%C3%A1zquez-862681b7//"
        target="_blank"
      >
        <img src="../assets/linkedin.svg" alt="Logo LinkedIn" />
      </a>
      <a href="https://twitter.com/home" target="_blank">
        <img src="../assets/twitter.svg" alt="Logo Twitter" />
      </a>
      <a href="mailto:legalshield5.33@gmail.com?Subject=Sugerencias%20o%20dudas" target="_blank">
        <img src="../assets/gmail.svg" alt="Logo email" />
      </a>
    </div>

    <!-- FOOTER -->
    <footer>
      <router-link :to="{ name: 'Privacy' }">Privacidad</router-link>
      <p>Copyright © 2020 by Iñaki GV</p>
      <router-link :to="{ name: 'Info' }">Más info</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
div#links {
  position: absolute;
  bottom: 0;
}
img {
  width: 20px;
  margin: 1rem;
}
footer {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: black;
  box-shadow: 5px 5px 15px gray inset;
  bottom: 0;
  position: absolute;
  width: 100%;
  font-size: 0.6rem;
  display: flex;
  justify-content: space-evenly;
}
footer a {
  color: white;
  cursor: pointer;
}
footer p {
  color: white;
}

@media (min-width: 700px) {
  img {
    width: 25px;
    margin: 1.5rem;
  }
  footer {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  img {
    width: 30px;
    margin: 2rem;
  }
  footer {
    font-size: 1.1rem;
  }
}
</style>
