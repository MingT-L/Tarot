<template>
  <div class="tarot-scene-3d" ref="sceneContainer">
    <div ref="canvasContainer" class="tarot-scene-3d__canvas"></div>
    <Transition name="fade">
      <div v-if="showUI" class="tarot-scene-3d__overlay">
        <div class="tarot-scene-3d__top-bar">
          <button class="tarot-scene-3d__back-btn" @click="emitBack">
            ← 重新选择
          </button>
          <div class="tarot-scene-3d__title">
            <h2>{{ spreadName }}</h2>
            <span class="tarot-scene-3d__title-en">{{ spreadNameEn }}</span>
          </div>
          <div class="tarot-scene-3d__selection-info">
            <span>{{ selectedCount }} / {{ cardCount }}</span>
          </div>
        </div>
        <div class="tarot-scene-3d__bottom-bar">
          <button
            class="btn btn-gold tarot-scene-3d__result-btn"
            :class="{ 'tarot-scene-3d__result-btn--ready': selectionComplete }"
            :disabled="!selectionComplete"
            @click="emitResult"
          >
            探寻命运
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import cardBackImg from '@/assets/card_bg.png'

const props = defineProps({
  spreadName: { type: String, default: '' },
  spreadNameEn: { type: String, default: '' },
  cardCount: { type: Number, default: 3 },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'result', 'cardsSelected'])

const sceneContainer = ref(null)
const canvasContainer = ref(null)
const showUI = ref(false)
const selectedCount = ref(0)
const selectionComplete = ref(false)

const GOLD = 0xc9a84c
const GOLD_LIGHT = 0xe8d48b
const DARK_BG = 0x0d0a14

let scene, camera, renderer, controls
let cards = []
let cardMeshes = []
let selectedIndices = []
let particleSystem, glowParticles
let animFrameId = null
let raycaster, mouse
let isShuffling = false
let hoveredCard = null
let currentArrangementMode = 'mandala'

const CARD_W = 1.1
const CARD_H = 1.54
const CARD_D = 0.04

let pointerDownPos = { x: 0, y: 0 }

const majorArcanaNames = [
  { cn: '愚者', en: 'The Fool' }, { cn: '魔术师', en: 'The Magician' },
  { cn: '女祭司', en: 'High Priestess' }, { cn: '女皇', en: 'The Empress' },
  { cn: '皇帝', en: 'The Emperor' }, { cn: '教皇', en: 'The Hierophant' },
  { cn: '恋人', en: 'The Lovers' }, { cn: '战车', en: 'The Chariot' },
  { cn: '力量', en: 'Strength' }, { cn: '隐士', en: 'The Hermit' },
  { cn: '命运之轮', en: 'Wheel of Fortune' }, { cn: '正义', en: 'Justice' },
  { cn: '倒吊人', en: 'The Hanged Man' }, { cn: '死神', en: 'Death' },
  { cn: '节制', en: 'Temperance' }, { cn: '恶魔', en: 'The Devil' },
  { cn: '高塔', en: 'The Tower' }, { cn: '星星', en: 'The Star' },
  { cn: '月亮', en: 'The Moon' }, { cn: '太阳', en: 'The Sun' },
  { cn: '审判', en: 'Judgement' }, { cn: '世界', en: 'The World' }
]

const suits = ['Wands', 'Cups', 'Swords', 'Pentacles']
const suitsCn = ['权杖', '圣杯', '宝剑', '星币']
const suitsSymbol = ['♤', '♡', '♧', '♢']
const minorRanks = ['Ace', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'Page', 'Knight', 'Queen', 'King']
const minorRanksCn = ['首牌', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍从', '骑士', '王后', '国王']

function generateCardData() {
  const data = []
  for (let i = 0; i < 22; i++) {
    data.push({
      index: i,
      type: 'major',
      number: i,
      nameCn: majorArcanaNames[i].cn,
      nameEn: majorArcanaNames[i].en,
      suit: ''
    })
  }
  let idx = 22
  for (let s = 0; s < 4; s++) {
    for (let r = 0; r < 14; r++) {
      data.push({
        index: idx,
        type: 'minor',
        number: r + 1,
        nameCn: `${minorRanksCn[r]}${suitsCn[s]}`,
        nameEn: `${minorRanks[r]} of ${suits[s]}`,
        suit: suits[s]
      })
      idx++
    }
  }
  return data
}

function createCardFrontTexture(cardData) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 358
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 256, 358)
  grad.addColorStop(0, '#1a1025')
  grad.addColorStop(0.5, '#0d0a14')
  grad.addColorStop(1, '#1a1025')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 358)

  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = 3
  ctx.strokeRect(6, 6, 244, 346)
  ctx.strokeStyle = 'rgba(201,168,76,0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(10, 10, 236, 338)

  const major = cardData.type === 'major'
  ctx.textAlign = 'center'

  if (major) {
    ctx.fillStyle = 'rgba(201,168,76,0.08)'
    ctx.beginPath()
    ctx.arc(128, 140, 60, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(201,168,76,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#c9a84c'
    ctx.font = 'bold 48px Georgia, "Times New Roman", serif'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(201,168,76,0.4)'
    ctx.shadowBlur = 15
    ctx.fillText(cardData.number.toString(), 128, 135)
    ctx.shadowBlur = 0

    ctx.fillStyle = '#c9a84c'
    ctx.font = '20px Georgia, "Times New Roman", serif'
    ctx.fillText(cardData.nameEn.toUpperCase(), 128, 200)
  } else {
    const symbolIndex = suits.indexOf(cardData.suit)
    const symbol = suitsSymbol[symbolIndex] || '♤'

    ctx.fillStyle = '#c9a84c'
    ctx.font = '60px Georgia, serif'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(201,168,76,0.3)'
    ctx.shadowBlur = 10
    ctx.fillText(symbol, 128, 120)
    ctx.shadowBlur = 0

    ctx.fillStyle = '#c9a84c'
    ctx.font = 'bold 40px Georgia, "Times New Roman", serif'
    ctx.fillText(minorRanks[cardData.number - 1], 128, 188)

    ctx.fillStyle = 'rgba(201,168,76,0.7)'
    ctx.font = '16px Georgia, "Times New Roman", serif'
    ctx.fillText(`of ${cardData.suit}`, 128, 215)
  }

  ctx.fillStyle = 'rgba(201,168,76,0.5)'
  ctx.font = '11px Georgia, serif'
  ctx.textBaseline = 'bottom'
  ctx.fillText(cardData.nameCn, 128, 342)
  ctx.textBaseline = 'top'
  ctx.fillText(cardData.nameCn, 128, 14)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * 扇形排列专用：切换卡牌正反面材质
 * 在扇形布局中，默认所有卡牌背面朝用户（y=0），选中后翻面显示正面（y=π）
 * Three.js BoxGeometry 材质索引：[+X, -X, +Y, -Y, +Z, -Z]
 * +Z面(index 4) = frontMat, -Z面(index 5) = backMat
 * 当卡牌 ry=0 时，-Z面朝向相机（看到背面）；ry=π时，+Z面朝向相机（看到正面）
 */
function applyMaterialMode(mesh, showFront) {
  if (showFront && !mesh.userData.isFlipped) {
    mesh.userData.isFlipped = true
  } else if (!showFront && mesh.userData.isFlipped) {
    mesh.userData.isFlipped = false
  }
}

function createCardMesh(cardData, backTex) {
  const frontTex = createCardFrontTexture(cardData)

  const frontMat = new THREE.MeshStandardMaterial({
    map: frontTex,
    roughness: 0.4,
    metalness: 0.3
  })
  const backMat = new THREE.MeshStandardMaterial({
    map: backTex,
    roughness: 0.4,
    metalness: 0.3
  })
  const edgeMat = new THREE.MeshStandardMaterial({
    color: 0x332244,
    roughness: 0.2,
    metalness: 0.5
  })

  const geo = new THREE.BoxGeometry(CARD_W, CARD_H, CARD_D)
  const mats = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]
  const mesh = new THREE.Mesh(geo, mats)
  mesh.userData.cardIndex = cardData.index
  mesh.userData.cardData = cardData
  mesh.userData.isSelected = false
  mesh.userData.targetPosition = new THREE.Vector3()
  mesh.userData.targetRotation = new THREE.Euler()
  mesh.userData.materials = mats
  mesh.userData.edgeMat = edgeMat
  mesh.userData.isFlipped = false

  const glowSprite = createGlowSprite()
  mesh.add(glowSprite)
  glowSprite.visible = false
  mesh.userData.glowSprite = glowSprite

  return mesh
}

function createGlowSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(201,168,76,0.6)')
  grad.addColorStop(0.2, 'rgba(201,168,76,0.3)')
  grad.addColorStop(0.5, 'rgba(201,168,76,0.1)')
  grad.addColorStop(1, 'rgba(201,168,76,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(CARD_W * 2.5, CARD_H * 2.5, 1)
  sprite.position.z = 0
  return sprite
}

function setupScene() {
  const container = canvasContainer.value
  const rect = container.getBoundingClientRect()

  scene = new THREE.Scene()
  scene.background = new THREE.Color(DARK_BG)
  scene.fog = new THREE.FogExp2(DARK_BG, 0.008)

  camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100)
  camera.position.set(8, 4, 12)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  })
  renderer.setSize(rect.width, rect.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 4
  controls.maxDistance = 25
  controls.autoRotate = false
  controls.autoRotateSpeed = 0.5
  controls.target.set(0, 0, 0)

  const ambientLight = new THREE.AmbientLight(0x555577, 1.3)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(GOLD, 2.5)
  mainLight.position.set(5, 12, 8)
  mainLight.castShadow = true
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x9966cc, 1.5)
  fillLight.position.set(-5, 3, -8)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0x8888ff, 0.8)
  rimLight.position.set(0, -5, 10)
  scene.add(rimLight)

  const backLight = new THREE.DirectionalLight(0xaa88dd, 1.2)
  backLight.position.set(0, 0, -8)
  scene.add(backLight)

  const hemiLight = new THREE.HemisphereLight(0x6644aa, 0x332255, 1.0)
  scene.add(hemiLight)

  const centerLight = new THREE.PointLight(GOLD, 3.0, 30)
  centerLight.position.set(0, 0, 0)
  scene.add(centerLight)
  scene.userData.centerLight = centerLight

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
}

function createParticles() {
  const starCount = 3000
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const sizes = new Float32Array(starCount)

  for (let i = 0; i < starCount; i++) {
    const radius = 10 + Math.random() * 30
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

    const c = 0.3 + Math.random() * 0.5
    colors[i * 3] = c
    colors[i * 3 + 1] = c * 0.8
    colors[i * 3 + 2] = c * 0.6
    sizes[i] = 0.02 + Math.random() * 0.06
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })
  particleSystem = new THREE.Points(geo, mat)
  scene.add(particleSystem)

  const glowCount = 500
  const gPositions = new Float32Array(glowCount * 3)
  const gSizes = new Float32Array(glowCount)
  const gSpeeds = new Float32Array(glowCount)

  for (let i = 0; i < glowCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * 8
    gPositions[i * 3] = Math.cos(angle) * r
    gPositions[i * 3 + 1] = (Math.random() - 0.5) * 6
    gPositions[i * 3 + 2] = Math.sin(angle) * r
    gSizes[i] = 0.03 + Math.random() * 0.1
    gSpeeds[i] = 0.2 + Math.random() * 0.5
  }

  const gGeo = new THREE.BufferGeometry()
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPositions, 3))
  gGeo.setAttribute('size', new THREE.BufferAttribute(gSizes, 1))

  const gMat = new THREE.PointsMaterial({
    size: 0.06,
    color: GOLD,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })
  glowParticles = { mesh: new THREE.Points(gGeo, gMat), speeds: gSpeeds }
  scene.add(glowParticles.mesh)
}

function buildCards() {
  const cardData = generateCardData()
  const loader = new THREE.TextureLoader()
  const backTex = loader.load(cardBackImg)

  cardData.forEach((data) => {
    const mesh = createCardMesh(data, backTex)
    cards.push(data)
    cardMeshes.push(mesh)
    scene.add(mesh)
  })

  positionCardsInitial()
}

function positionCardsInitial() {
  cardMeshes.forEach((mesh, i) => {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.5 + Math.random() * 2
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * radius
    )
    mesh.rotation.x = (Math.random() - 0.5) * 0.5
    mesh.rotation.y = Math.random() * Math.PI * 2
    mesh.rotation.z = (Math.random() - 0.5) * 0.5
    mesh.scale.set(1, 1, 1)
  })
}

function calculateMandalaPositions() {
  const positions = []
  const totalCards = 78
  const innerCount = 30
  const outerCount = totalCards - innerCount
  const innerRadius = 3.0
  const outerRadius = 5.5

  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2
    const waveY = Math.sin(i * 0.5) * 0.15
    positions.push({
      x: Math.cos(angle) * innerRadius,
      y: waveY,
      z: Math.sin(angle) * innerRadius,
      ry: angle + Math.PI,
      rx: -0.2,
      rz: 0,
      scale: 1
    })
  }

  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2 + 0.1
    const waveY = Math.cos(i * 0.7) * 0.1
    positions.push({
      x: Math.cos(angle) * outerRadius,
      y: waveY,
      z: Math.sin(angle) * outerRadius,
      ry: angle + Math.PI,
      rx: -0.2,
      rz: 0,
      scale: 1
    })
  }

  return positions
}

function calculateSpherePositions() {
  const totalCards = 78
  const radius = 5.0
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const positions = []

  for (let i = 0; i < totalCards; i++) {
    const y = 1 - (i / (totalCards - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i

    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY

    const tiltAngle = Math.asin(y)
    positions.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      ry: Math.atan2(x, z),
      rx: -tiltAngle,
      rz: 0,
      scale: 1
    })
  }

  return positions
}

/**
 * 计算孔雀开屏式扇形排列
 * 78张牌沿180度半圆弧展开，形成壮观的扇形阵列
 * 
 * 视觉效果设计：
 * - 展开角度：180度（Math.PI），形成完整的半圆扇形
 * - 半径：5.0，卡片紧凑排列但保持间距
 * - Y轴弧度：中心卡片抬升至+2.5，边缘下沉至-0.5，形成优雅的抛物线
 * - 缩放：中心1.0倍，边缘0.4倍，增强纵深感
 * - 倾斜：每张卡向弧心微微倾斜，增强立体感
 * - 旋转：每张卡朝向弧心，背面统一朝向观众
 * 
 * 孔雀开屏特征：
 * 1. 所有"羽毛"从中心向外辐射
 * 2. 中间最高最亮，两侧渐低渐暗
 * 3. 形成完美的半圆形展开
 * 4. 有明显的层次感和深度
 */
function calculateFanPositions() {
  const positions = []
  const totalCards = 78
  const radius = 5.0
  const spreadAngle = Math.PI  // 180度完整半圆
  const startAngle = -spreadAngle / 2
  const angleStep = spreadAngle / (totalCards - 1)

  for (let i = 0; i < totalCards; i++) {
    const angle = startAngle + angleStep * i
    const t = i / (totalCards - 1)  // 0到1的归一化位置

    // 弧线位置计算（孔雀羽毛展开）
    const x = Math.sin(angle) * radius
    const z = -Math.cos(angle) * radius

    // Y轴弧形：中心最高，两侧渐低（抛物线）
    const arcHeight = 2.5  // 中心抬升高度
    const arcDepth = -0.5  // 边缘下沉深度
    const y = arcHeight * Math.sin(t * Math.PI) + arcDepth * (1 - Math.sin(t * Math.PI))

    // 缩放：中心最大，边缘最小
    const maxScale = 1.0
    const minScale = 0.4
    const scale = minScale + (maxScale - minScale) * Math.sin(t * Math.PI)

    // 旋转：每张卡朝向弧心（背面朝观众）
    const ry = angle
    // X轴倾斜：中间直立，边缘向外倾斜（孔雀羽毛形态）
    const rx = -0.1 + Math.sin(t * Math.PI - Math.PI / 2) * 0.4
    // Z轴倾斜：微妙的扭转，增强立体感
    const rz = Math.sin(t * Math.PI) * 0.15

    // 渲染优先级：中心卡片在上层
    const renderPriority = Math.round(Math.sin(t * Math.PI) * 100)

    positions.push({
      x, y, z, ry, rx, rz, scale,
      renderPriority,
      selectedX: 0,
      selectedY: 1.2,
      selectedZ: 4.5,
      selectedRy: angle + Math.PI,
      selectedRx: -0.1,
      selectedRz: 0
    })
  }

  return positions
}

function triggerShuffle() {
  if (isShuffling) return
  isShuffling = true
  selectionComplete.value = false
  selectedCount.value = 0
  selectedIndices = []
  cardMeshes.forEach(m => {
    m.userData.isSelected = false
    m.renderOrder = 0
    if (m.userData.glowSprite) m.userData.glowSprite.visible = false
  })

  const tl = gsap.timeline({
    onComplete: () => {
      arrangeCards()
    }
  })

  const shuffled = [...cardMeshes].sort(() => Math.random() - 0.5)
  const center = new THREE.Vector3(0, 0, 0)

  shuffled.forEach((mesh, i) => {
    const delay = i * 0.008
    const angle = Math.random() * Math.PI * 2
    const r = 0.5 + Math.random() * 1.5

    tl.to(mesh.position, {
      x: Math.cos(angle) * r,
      y: (Math.random() - 0.5) * 4,
      z: Math.sin(angle) * r,
      duration: 0.4,
      ease: 'power2.in',
      delay
    }, 0)

    tl.to(mesh.rotation, {
      x: (Math.random() - 0.5) * Math.PI,
      y: Math.random() * Math.PI * 4,
      z: (Math.random() - 0.5) * Math.PI,
      duration: 0.6,
      ease: 'power1.inOut',
      delay
    }, 0)

    tl.to(mesh.scale, {
      x: 1.2, y: 1.2, z: 1.2,
      duration: 0.3,
      ease: 'power1.out',
      delay
    }, 0)
    tl.to(mesh.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.3,
      ease: 'power1.in',
      delay: delay + 0.3
    }, 0)
  })

  shuffled.forEach((mesh, i) => {
    const delay = i * 0.006 + 0.6
    const spreadX = (Math.random() - 0.5) * 12
    const spreadZ = (Math.random() - 0.5) * 12
    tl.to(mesh.position, {
      x: spreadX,
      y: (Math.random() - 0.5) * 8,
      z: spreadZ,
      duration: 0.7,
      ease: 'power2.out',
      delay
    }, 0)

    tl.to(mesh.rotation, {
      x: (Math.random() - 0.5) * Math.PI * 2,
      y: Math.random() * Math.PI * 6,
      z: (Math.random() - 0.5) * Math.PI * 2,
      duration: 0.8,
      ease: 'power1.inOut',
      delay
    }, 0)
  })

  tl.to({}, {
    duration: 1,
    ease: 'none'
  }, 0.6 + shuffled.length * 0.006)
}

function arrangeCards() {
  const mode = Math.floor(Math.random() * 3)
  // const mode = 3
  let positions
  if (mode === 0) {
    // 双圆环排列
    positions = calculateMandalaPositions()
    currentArrangementMode = 'mandala'
  } else if (mode === 1) {
    // Fibonacci球体
    positions = calculateSpherePositions()
    currentArrangementMode = 'sphere'
  } else {
    // 扇形排列
    positions = calculateFanPositions()
    currentArrangementMode = 'fan'
  }
  const shuffledIndices = [...Array(cardMeshes.length).keys()].sort(() => Math.random() - 0.5)

  const tl = gsap.timeline({
    onComplete: () => {
      isShuffling = false
      controls.autoRotate = true
    }
  })

  shuffledIndices.forEach((cardIdx, posIdx) => {
    const pos = positions[posIdx]
    const mesh = cardMeshes[cardIdx]

    tl.to(mesh.position, {
      x: pos.x, y: pos.y, z: pos.z,
      duration: 1.5,
      ease: 'back.out(1.2)',
      delay: posIdx * 0.015
    }, 0)
    tl.to(mesh.rotation, {
      x: pos.rx, y: pos.ry, z: pos.rz,
      duration: 1.2,
      ease: 'power2.out',
      delay: posIdx * 0.015
    }, 0)
    tl.to(mesh.scale, {
      x: pos.scale, y: pos.scale, z: pos.scale,
      duration: 1.0,
      ease: 'back.out(1.2)',
      delay: posIdx * 0.015
    }, 0)

    mesh.userData.targetPosition.set(pos.x, pos.y, pos.z)
    mesh.userData.targetRotation.set(pos.rx, pos.ry, pos.rz)

    if (currentArrangementMode === 'fan' && pos.renderPriority !== undefined) {
      mesh.renderOrder = pos.renderPriority
    }
  })

  tl.to({}, { duration: 0.5 }, 2.0)
}

function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  if (isShuffling) return

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cardMeshes)

  if (intersects.length > 0) {
    const mesh = intersects[0].object
    if (hoveredCard !== mesh) {
      if (hoveredCard && hoveredCard.userData.glowSprite && !hoveredCard.userData.isSelected) {
        hoveredCard.userData.glowSprite.visible = false
      }
      hoveredCard = mesh
      if (!mesh.userData.isSelected && mesh.userData.glowSprite) {
        mesh.userData.glowSprite.visible = true
        mesh.userData.glowSprite.material.opacity = 0.4
      }
      renderer.domElement.style.cursor = 'pointer'
    }
  } else {
    if (hoveredCard) {
      if (hoveredCard.userData.glowSprite && !hoveredCard.userData.isSelected) {
        hoveredCard.userData.glowSprite.visible = false
      }
      hoveredCard = null
      renderer.domElement.style.cursor = 'default'
    }
  }
}

function onPointerDown(event) {
  pointerDownPos.x = event.clientX
  pointerDownPos.y = event.clientY
}

function onPointerUp(event) {
  if (isShuffling) return
  if (selectedIndices.length >= props.cardCount) return

  const dx = Math.abs(event.clientX - pointerDownPos.x)
  const dy = Math.abs(event.clientY - pointerDownPos.y)
  if (dx > 15 || dy > 15) return

  const rect = renderer.domElement.getBoundingClientRect()
  const mx = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const my = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(new THREE.Vector2(mx, my), camera)
  const intersects = raycaster.intersectObjects(cardMeshes, false)

  if (intersects.length > 0) {
    const mesh = intersects[0].object
    const idx = mesh.userData.cardIndex

    if (mesh.userData.isSelected) {
      mesh.userData.isSelected = false
      if (mesh.userData.glowSprite) mesh.userData.glowSprite.visible = false
      selectedIndices = selectedIndices.filter(i => i !== idx)

      if (currentArrangementMode === 'fan') {
        const origPos = mesh.userData.targetPosition
        gsap.to(mesh.position, {
          x: origPos.x, y: origPos.y, z: origPos.z,
          duration: 0.5, ease: 'back.out(1.5)'
        })
        gsap.to(mesh.rotation, {
          x: mesh.userData.targetRotation.x,
          y: mesh.userData.targetRotation.y,
          z: mesh.userData.targetRotation.z,
          duration: 0.5, ease: 'power2.out'
        })
        gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(1.5)' })
        mesh.renderOrder = 0
      }
    } else {
      if (selectedIndices.length < props.cardCount) {
        mesh.userData.isSelected = true
        if (mesh.userData.glowSprite) mesh.userData.glowSprite.visible = true
        selectedIndices.push(idx)

        if (currentArrangementMode === 'fan') {
          gsap.to(mesh.position, {
            x: 0, y: 1.2, z: 4.5,
            duration: 0.6, ease: 'back.out(2)'
          })
          gsap.to(mesh.rotation, {
            x: -0.1, y: Math.PI, z: 0,
            duration: 0.6, ease: 'power2.inOut'
          })
          gsap.to(mesh.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.5, ease: 'back.out(2)' })
          mesh.renderOrder = 1
        } else {
          gsap.to(mesh.position, {
            y: mesh.position.y + 0.4,
            duration: 0.3,
            ease: 'back.out(2)'
          })

          gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI,
            duration: 0.6,
            ease: 'power2.inOut'
          })
        }
      }
    }

    selectedCount.value = selectedIndices.length
    selectionComplete.value = selectedIndices.length >= props.cardCount

    if (selectionComplete.value) {
      emit('cardsSelected', [...selectedIndices])
    }
  }
}

function animateParticles(time) {
  if (particleSystem) {
    particleSystem.rotation.y = time * 0.008
    particleSystem.rotation.x = Math.sin(time * 0.005) * 0.02
  }
  if (glowParticles) {
    const pos = glowParticles.mesh.geometry.attributes.position
    const speeds = glowParticles.speeds
    for (let i = 0; i < pos.count; i++) {
      const y = pos.array[i * 3 + 1]
      if (y > 3) {
        pos.array[i * 3 + 1] = -3
      }
      pos.array[i * 3 + 1] += speeds[i] * 0.005
      const radius = Math.sqrt(pos.array[i * 3] ** 2 + pos.array[i * 3 + 2] ** 2)
      const angle = Math.atan2(pos.array[i * 3 + 2], pos.array[i * 3]) + speeds[i] * 0.001
      pos.array[i * 3] = Math.cos(angle) * radius
      pos.array[i * 3 + 2] = Math.sin(angle) * radius
    }
    pos.needsUpdate = true
    glowParticles.mesh.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.15
  }
}

function animateBreathing(time) {
  if (isShuffling) return
  cardMeshes.forEach((mesh) => {
    if (mesh.userData.isSelected) return
    const tPos = mesh.userData.targetPosition
    const tRot = mesh.userData.targetRotation
    if (tPos && (currentArrangementMode === 'mandala' || tPos.x !== 0 || tPos.z !== 0)) {
      const breathe = Math.sin(time * 0.3 + mesh.id * 0.1) * 0.03
      mesh.position.y = tPos.y + breathe
      const rotBreathe = Math.sin(time * 0.2 + mesh.id * 0.05) * 0.008
      mesh.rotation.z = tRot.z + rotBreathe

      if (mesh.userData.glowSprite) {
        const glowIntensity = mesh.userData.isSelected ? 1 : 0.2 + Math.sin(time * 0.5 + mesh.id) * 0.1
        mesh.userData.glowSprite.material.opacity = glowIntensity
      }
    }
  })
}

function animate() {
  const time = performance.now() * 0.001
  animateParticles(time)
  animateBreathing(time)
  controls.update()
  renderer.render(scene, camera)
  animFrameId = requestAnimationFrame(animate)
}

function handleResize() {
  const container = canvasContainer.value
  if (!container || !renderer) return
  const rect = container.getBoundingClientRect()
  camera.aspect = rect.width / rect.height
  camera.updateProjectionMatrix()
  renderer.setSize(rect.width, rect.height)
}

function emitBack() {
  controls.autoRotate = false
  emit('back')
}

function emitResult() {
  if (!selectionComplete.value) return
  controls.autoRotate = false
  emit('result')
}

function startScene() {
  setupScene()
  createParticles()
  buildCards()
  showUI.value = true
  animate()

  renderer.domElement.addEventListener('pointermove', onMouseMove)
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  window.addEventListener('resize', handleResize)

  gsap.delayedCall(1.5, () => {
    triggerShuffle()
  })
}

function destroyScene() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  if (renderer) {
    renderer.domElement.removeEventListener('pointermove', onMouseMove)
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.removeEventListener('pointerup', onPointerUp)
  }
  window.removeEventListener('resize', handleResize)
  if (controls) controls.dispose()
  if (renderer) {
    renderer.dispose()
    const canvas = renderer.domElement
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
  }
  cardMeshes = []
  cards = []
}

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => {
      startScene()
    })
  } else {
    destroyScene()
  }
})

onMounted(() => {
  if (props.visible) {
    nextTick(() => startScene())
  }
})

onUnmounted(() => {
  destroyScene()
})

defineExpose({
})
</script>

<style scoped>
.tarot-scene-3d {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.tarot-scene-3d__canvas {
  width: 100%;
  height: 100%;
}

.tarot-scene-3d__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.tarot-scene-3d__top-bar {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: auto;
}

.tarot-scene-3d__back-btn {
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.25);
  color: var(--color-gold);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 10px 18px;
  border-radius: 10px;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  font-family: var(--font-body);
}

.tarot-scene-3d__back-btn:hover {
  background: rgba(201, 168, 76, 0.2);
  border-color: rgba(201, 168, 76, 0.5);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.2);
}

.tarot-scene-3d__title {
  text-align: center;
}

.tarot-scene-3d__title h2 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-gold);
  margin: 0;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
}

.tarot-scene-3d__title-en {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.tarot-scene-3d__selection-info {
  color: var(--color-gold);
  font-family: var(--font-display);
  font-size: 1rem;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
}

.tarot-scene-3d__bottom-bar {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  align-items: center;
  pointer-events: auto;
}

.tarot-scene-3d__result-btn {
  padding: 14px 36px;
  font-size: 1rem;
  border-radius: 50px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.tarot-scene-3d__result-btn--ready {
  opacity: 1;
}

.tarot-scene-3d__result-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .tarot-scene-3d__top-bar {
    top: 10px;
    left: 10px;
    right: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tarot-scene-3d__title h2 {
    font-size: 1rem;
  }
  .tarot-scene-3d__bottom-bar {
    bottom: 20px;
    gap: 10px;
  }
  .tarot-scene-3d__result-btn {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>