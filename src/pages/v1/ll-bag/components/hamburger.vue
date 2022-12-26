<template>
  <div class="hamburger-body">
    <div class="main-btn" :class="{ active: true }">
      <div class="custom-menu-toggle openMenu"></div>
    </div>
    <div class="side-btns">
      <div class="side-btn"></div>
    </div>
  </div>
</template>
<script>
/* import { ref, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isShowPhoneNav = computed(() => {
  return store.state.isShowPhoneNav;
}); */
</script>

<style lang='scss' scoped>
$height: 0.04rem;
$width: 0.3rem;
.main-btn {
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  font-size: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  border-radius: 50%;
  cursor: pointer;

  color: #fff;
  transition: 400ms;
  transform: rotate(0deg);
  opacity: 1;
}
.main-btn:hover {
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.04);
}

.custom-menu-toggle {
  position: absolute;
  width: $width;
  height: $height;
  border-radius: 2px;
  background-color: #000000;
  display: block;
  margin: auto;
  transition: 400ms;
}
.custom-menu-toggle:before {
  position: absolute;
  width: $width;
  height: $height;
  border-radius: 2px;
  background-color: #000000;
  display: block;
  margin: auto;
  transition: 400ms;
  content: "";
  backface-visibility: hidden;
  transform: rotate(0deg) translateY(7px);
}
.custom-menu-toggle:after {
  position: absolute;
  width: $width;
  height: $height;
  border-radius: 2px;
  background-color: #000000;
  display: block;
  margin: auto;
  transition: 400ms;
  content: "";
  backface-visibility: hidden;
  transform: rotate(0deg) translateY(-7px);
}

.main-btn.active .custom-menu-toggle {
  background-color: rgba(255, 255, 255, 0);
}
.main-btn.active .custom-menu-toggle:before {
  position: absolute;
  width: $width;
  height: $height;
  border-radius: 2px;
  background-color: #000000;
  display: block;
  margin: auto;
  transition: 400ms;
  content: "";
  transform: rotate(45deg) translateY(0px);
}
.main-btn.active .custom-menu-toggle:after {
  position: absolute;
  width: $width;
  height: $height;
  border-radius: 2px;
  background-color: #000000;
  display: block;
  margin: auto;
  transition: 400ms;
  content: "";
  transform: rotate(-45deg) translateY(0px);
}
</style>