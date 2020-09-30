<template>
  <div>
    <!-- SPINNER -->
    <div v-if="isLoading">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h2>Cargando...</h2>
    </div>

    <!-- AQUÍ VAN LOS DATOS CUANDO ESTÁN CARGADOS Y DESAPARECE EL SPINNER -->
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoaderSpiner",
  props: {
    isLoading: Boolean,
  },
};
</script>

<style scoped>
.lds-ring {
  margin-top: 15%;
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 150px;
  height: 150px;
  margin: 8px;
  border: 30px ridge;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: deepskyblue transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
