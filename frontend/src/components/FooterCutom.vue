<template>
  <div>
    <footer>© 2020 Iñaki GV</footer>
  </div>
</template>

<script>
export default {
  name: "FooterCustom",
};
</script>

<style scoped>
footer {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  background: black;
  box-shadow: 5px 5px 15px gray inset;
  bottom: 0;
  position: absolute;
  width: 100%;
  font-size: 0.6rem;
}

@media (min-width: 700px) {
  footer {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  footer {
    font-size: 1.1rem;
  }
}
</style>