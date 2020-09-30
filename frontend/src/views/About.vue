<template>
  <div>
    <h1>¿Por qué confiar en nosotros?</h1>
    <ul>
      <li>
        <img src="../assets/about/magnifying-glass.png" alt="Lupa" />
        <p>Búsquedas exhaustivas por especialidad, localidad y urgencia, según tus preferencias.</p>
      </li>
      <li>
        <img src="../assets/about/spain.png" alt="Mapa de españa" />
        <p>Busca abogados en toda españa, trabajamos con abogados de todas las provincias del país.</p>
      </li>
      <li>
        <img src="../assets/about/security.png" alt="Logo de seguridad" />
        <p>Manten la confidencialidad y privacidad en todos los procesos que abras.</p>
      </li>
      <li>
        <img src="../assets/about/pig.png" alt="Hucha cerdito" />
        <p>Puedes ahorrar mucho dinero y tiempo, abriendo un proceso con uno de nuestros profesionales, y si no te encaja el presupuesto puedes rechazarlo sin compromiso.</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
div {
  margin-bottom: 5rem;
}
ul {
  list-style: none;
  margin: 0.5rem;
}
div {
  padding: 0.5rem;
  background-color: var(--background);
}
h1 {
  font-size: 1.3rem;
}
img {
  margin-top: 1rem;
  width: 150px;
}
p {
  font-size: 0.7rem;
  font-weight: bold;
}

@media (min-width: 700px) {
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 3% auto;
  }
  h1 {
    font-size: 1.6rem;
  }
  ul {
    display: grid;
    gap: 1rem;

    align-items: baseline;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
  }
  img {
    width: 200px;
  }
  p {
    font-size: 0.9rem;
  }
}

@media (min-width: 1250px) {
  div {
    margin: 10% auto;
  }
  ul {
    grid-template-columns: auto auto auto auto;
  }
  h1 {
    font-size: 2rem;
  }
  img {
    width: 260px;
  }
  p {
    font-size: 1rem;
  }
}
</style>