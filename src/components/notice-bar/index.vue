<style lang="less">
	.wii-noticebar {
		display: flex;
		height: 32px;
		line-height: 32px;
		font-size: 30/20rem;
		color: #fff;
		// background-color: #fefcec;
		overflow: hidden;
		&-icon {
			display: flex;
			margin-left: 15px;
			align-items: center;
			&+view {
				margin-left: 5px;
			}
		}
		&-operation {
			display: flex;
			margin-right: 8px;
			align-items: center;
		}
		&-content-wrap {
			position: relative;
			flex: 1;
			margin: 0 15px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			.wii-noticebar-content {
				position: absolute;
				transition-duration: 20s;
				animation: mymove 5s infinite;
			}
		}
		@keyframes mymove {
			from {
				transform: translateX(0);
				left: 0;
			}
			to {
				transform: translateX(-100%);
				left: 0;
			}
		}
	}
	
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s;
	}
	
	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>

<template>
	<transition name="fade">
		<div v-if="show" class="wii-class wii-noticebar">
			<div class="wii-noticebar-content-wrap">
				<div class="wii-noticebar-content" ref="content" :class="[loop?'wii-noticebar-content-loop':'']" :style="{animation: animationName+ ' ' + duration+'s linear infinite'}">
					<slot></slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: 'wii-notice-bar',
		props: {
			closable: {
				type: Boolean,
				default: false
			},
			icon: {
				type: String,
				default: ''
			},
			loop: {
				type: Boolean,
				default: false
			},
			reset: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: true,
				wrapWidth: 0,
				width: 0,
				duration: 0,
				animationData: null,
				duration: 0,
				animationName: 'mymove',
				timer: -1
			}
		},
		watch:{
			reset(newVal){
				console.log(`newVal--------->${newVal}`)
				if(newVal){
					this.animationName = ''
					clearTimeout(this.timer)
					this.timer = setTimeout(()=>{
						this.animationName = 'mymove'
					},1000)
				}
			}
		},
		mounted() {
			if (this.loop) {
				this.width = this.$refs.content.offsetWidth
				this.duration = this.width / 40
			}
		},
		methods: {
			handleClose() {
				this.show = false;
			}
		}
	}
</script>