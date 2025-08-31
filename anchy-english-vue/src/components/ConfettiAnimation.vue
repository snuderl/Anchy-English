<template>
  <div 
    v-if="isActive" 
    class="confetti-container"
    @animationend="onAnimationEnd"
  >
    <div 
      v-for="(piece, index) in confettiPieces" 
      :key="index"
      class="confetti-piece"
      :style="piece.style"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  },
  pieceCount: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['finished'])

const isActive = ref(false)
const confettiPieces = ref([])

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
]

function generateConfettiPiece() {
  const color = colors[Math.floor(Math.random() * colors.length)]
  const x = Math.random() * 100
  const delay = Math.random() * 0.5
  const duration = 2 + Math.random() * 2
  const rotation = Math.random() * 360
  const size = 4 + Math.random() * 8
  const shape = Math.random() > 0.5 ? 'square' : 'circle'
  
  return {
    style: {
      position: 'absolute',
      left: x + '%',
      top: '-10px',
      width: size + 'px',
      height: size + 'px',
      backgroundColor: color,
      borderRadius: shape === 'circle' ? '50%' : '0',
      transform: `rotate(${rotation}deg)`,
      animation: `fall ${duration}s ${delay}s ease-in-out forwards`,
      zIndex: 1000
    }
  }
}

function startConfetti() {
  isActive.value = true
  confettiPieces.value = Array.from({ length: props.pieceCount }, generateConfettiPiece)
  
  setTimeout(() => {
    stopConfetti()
  }, props.duration)
}

function stopConfetti() {
  isActive.value = false
  confettiPieces.value = []
  emit('finished')
}

function onAnimationEnd() {
  // Individual confetti piece finished falling
}

watch(() => props.active, (newValue) => {
  if (newValue) {
    startConfetti()
  }
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1000;
}

@keyframes fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>