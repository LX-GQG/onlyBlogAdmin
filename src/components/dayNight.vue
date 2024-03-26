<!--
 * @Author: LX_DUG
 * @Date: 2023-12-06 22:12:19
 * @LastEditors: LX_DUG
 * @LastEditTime: 2023-12-28 17:04:59
 * @Description: description
-->
<template>
    <div class="toggle checkbox-wrapper-54">
        <label class="switch" @change="changeColor">
            <input type="checkbox">
            <span class="slider"></span>
        </label>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
      const changeColor = (menus) => {
        const root = document.documentElement;
        const currentFilterValue = getComputedStyle(root).getPropertyValue('--f').trim();
        const newFilterValue = currentFilterValue === '1' ? '0' : '1';
        root.style.setProperty('--f', newFilterValue);
      } 
      return {
        changeColor
      }
    },
})

</script>


<style lang="scss" scoped>
.toggle {
	position: relative;
	display: flex;
    align-items: center;
    padding: 0 8px;
}

label.toggle-item {
	width: 50px;
	background: #2e394d;
	height: 26px;
	display: inline-block;
	border-radius: 50px;
	position: relative;
	transition: all .3s ease;
	transform-origin: 20% center;
	cursor: pointer;
	&::before {
		display: block;
		width: 40px;
    height: 40px;
		top: 3px;
		left: 4px;
    border-radius: 50%;
    border: 2px solid #88cf8f;
		transition: .3s ease;
	}
}
.checkbox-wrapper-54 input[type="checkbox"] {
    visibility: hidden;
    display: none;
  }

  .checkbox-wrapper-54 *,
  .checkbox-wrapper-54 ::after,
  .checkbox-wrapper-54 ::before {
    box-sizing: border-box;
  }

  /* The switch - the box around the slider */
  .checkbox-wrapper-54 .switch {
    --width-of-switch: 50px;
    --height-of-switch: 26px;
    /* size of sliding icon -- sun and moon */
    --size-of-icon: 20px;
    /* it is like a inline-padding of switch */
    --slider-offset: 8px;
    position: relative;
    width: var(--width-of-switch);
    height: var(--height-of-switch);
    display: inline-block;
  }

  /* The slider */
  .checkbox-wrapper-54 .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f4f4f5;
    transition: .4s;
    border-radius: 30px;
  }

  .checkbox-wrapper-54 .slider:before {
    position: absolute;
    content: "";
    height: var(--size-of-icon,1.4em);
    width: var(--size-of-icon,1.4em);
    border-radius: 20px;
    left: var(--slider-offset,0.3em);
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(40deg,#ff0080,#ff8c00 70%);
   transition: .4s;
  }

  .checkbox-wrapper-54 input:checked + .slider {
    background-color: #303136;
  }

  .checkbox-wrapper-54 input:checked + .slider:before {
    left: calc(100% - (var(--size-of-icon,1.4em) + var(--slider-offset,0.3em)));
    background: #303136;
    /* change the value of second inset in box-shadow to change the angle and direction of the moon  */
    box-shadow: inset -3px -2px 5px -2px #8983f7, inset -10px -4px 0 0 #a3dafb;
  }
</style>