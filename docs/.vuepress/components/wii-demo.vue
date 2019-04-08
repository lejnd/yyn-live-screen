<style>
	.wii-demo{
		background-color: pink;
	}
</style>

<template>
  <p class="wii-demo">
    {{ msg }}<slot></slot>
  </p>
</template>

<script>
export default {
	props:{
		test: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
		  msg: '我其实是自定义标签哦'
		}
	}
}
</script>
