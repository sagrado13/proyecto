<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Not Found" />
    <!-- MENSAJE DE ERROR -->
    <h1>404 ERROR</h1>
    <h1>Page Not Found</h1>
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style scoped>
h1 {
  color: var(--dark);
  font-size: 1.3rem;
}
h1:first-of-type {
  margin-top: 50%;
}

@media (min-width: 700px) {
  h1 {
    font-size: 1.6rem;
  }
  h1:first-of-type {
    margin-top: 40%;
  }
}

@media (min-width: 1000px) {
  h1 {
    font-size: 2rem;
  }
  h1:first-of-type {
    margin-top: 25%;
  }
}
</style>
