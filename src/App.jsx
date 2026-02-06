import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

// SafeIcon Component - handles all icons dynamically
const SafeIcon = ({ name, size = 24, className = '' }) => {
  const [iconModule, setIconModule] = useState(null)

  useEffect(() => {
    import('lucide-react').then((mod) => {
      const iconName = name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      setIconModule(mod[iconName] || mod.HelpCircle)
    })
  }, [name])

  if (!iconModule) return <div style={{ width: size, height: size }} className={className} />

  const IconComponent = iconModule
  return <IconComponent size={size} className={className} />
}

// List of chaotic icons
const chaoticIcons = [
  'pizza', 'coffee', 'gamepad-2', 'flame', 'zap', 'ghost', 'alien', 'rocket',
  'crown', 'diamond', 'sword', 'bomb', 'flask-conical', 'magnet', 'glasses',
  'skull', 'paw-print', 'feather', 'cloud-lightning', 'snowflake', 'sun',
  'moon', 'star', 'heart', 'anchor', 'umbrella', 'camera', 'music', 'film',
  'cpu', 'wifi', 'bluetooth', 'battery-charging', 'plug', 'lightbulb',
  'trash-2', 'scissors', 'paperclip', 'cloud', 'database', 'server', 'code',
  'terminal', 'bug', 'rocket', 'planet', 'sparkles', 'crown', 'trophy', 'target'
]

// Random color classes from Tailwind standard palette
const randomColors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
  'bg-rose-500', 'bg-slate-500', 'bg-gray-500', 'bg-zinc-500'
]

const randomTextColors = [
  'text-red-400', 'text-orange-400', 'text-amber-400', 'text-yellow-400',
  'text-lime-400', 'text-green-400', 'text-emerald-400', 'text-teal-400',
  'text-cyan-400', 'text-sky-400', 'text-blue-400', 'text-indigo-400',
  'text-violet-400', 'text-purple-400', 'text-fuchsia-400', 'text-pink-400'
]

// Generate random position within viewport
const getRandomPosition = () => ({
  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 300),
  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 100 : 300)
})

// Flying Icon Component (The Game)
const FlyingIcon = ({ icon, onCatch, id }) => {
  const controls = useAnimation()
  const [position, setPosition] = useState(getRandomPosition())
  const [color, setColor] = useState(randomColors[Math.floor(Math.random() * randomColors.length)])

  const moveRandomly = useCallback(async () => {
    const newPos = getRandomPosition()
    setPosition(newPos)
    await controls.start({
      x: newPos.x,
      y: newPos.y,
      rotate: Math.random() * 360,
      scale: [1, 1.2, 1],
      transition: {
        duration: 2 + Math.random() * 3,
        ease: "easeInOut"
      }
    })
    moveRandomly()
  }, [controls])

  useEffect(() => {
    moveRandomly()
  }, [moveRandomly])

  const handleClick = () => {
    onCatch(id, icon)
    setColor(randomColors[Math.floor(Math.random() * randomColors.length)])
    setPosition(getRandomPosition())
  }

  return (
    <motion.div
      animate={controls}
      initial={{ x: position.x, y: position.y }}
      className={`fixed z-40 ${color} p-4 rounded-full cursor-pointer shadow-lg hover:scale-125 transition-transform`}
      onClick={handleClick}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.8 }}
    >
      <SafeIcon name={icon} size={32} className="text-white" />
    </motion.div>
  )
}

// Chaotic Card Component
const ChaoticCard = ({ title, content, index }) => {
  const [rotation, setRotation] = useState(Math.random() * 20 - 10)
  const [bgColor, setBgColor] = useState(randomColors[Math.floor(Math.random() * randomColors.length)])
  const [textColor, setTextColor] = useState(randomTextColors[Math.floor(Math.random() * randomTextColors.length)])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.1,
        rotate: rotation + Math.random() * 30 - 15,
        zIndex: 50
      }}
      onClick={() => {
        setRotation(Math.random() * 40 - 20)
        setBgColor(randomColors[Math.floor(Math.random() * randomColors.length)])
        setTextColor(randomTextColors[Math.floor(Math.random() * randomTextColors.length)])
      }}
      className={`${bgColor} p-6 rounded-3xl shadow-2xl cursor-pointer min-h-[200px] flex flex-col justify-center items-center text-center border-4 border-white/20`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <motion.h3
        className={`text-2xl font-black mb-4 ${textColor} glitch-text`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        {title}
      </motion.h3>
      <p className="text-white font-bold text-lg">{content}</p>
      <div className="mt-4 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <SafeIcon
            key={i}
            name={chaoticIcons[Math.floor(Math.random() * chaoticIcons.length)]}
            size={20}
            className="text-white/60"
          />
        ))}
      </div>
    </motion.div>
  )
}

// Glitch Text Component
const GlitchText = ({ text, className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10"
        animate={{
          x: [0, -2, 2, -2, 0],
          opacity: [1, 0.8, 1, 0.9, 1]
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-red-500 opacity-50"
        animate={{ x: [-2, 2, -2], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-cyan-500 opacity-50"
        animate={{ x: [2, -2, 2], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4 }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
    </div>
  )
}

// Main App Component
function App() {
  const [score, setScore] = useState(0)
  const [flyingIcons, setFlyingIcons] = useState([])
  const [caughtIcons, setCaughtIcons] = useState([])
  const [bgHue, setBgHue] = useState(0)
  const [clickEffects, setClickEffects] = useState([])

  // Initialize flying icons
  useEffect(() => {
    const icons = []
    for (let i = 0; i < 15; i++) {
      icons.push({
        id: i,
        icon: chaoticIcons[Math.floor(Math.random() * chaoticIcons.length)]
      })
    }
    setFlyingIcons(icons)
  }, [])

  // Background color animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgHue((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Handle catching icons
  const handleCatch = (id, icon) => {
    setScore((prev) => prev + 10)
    setCaughtIcons((prev) => [...prev, { icon, id: Date.now() }])

    // Play sound effect (simulated with visual feedback)
    const newEffect = {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }
    setClickEffects((prev) => [...prev, newEffect])
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((e) => e.id !== newEffect.id))
    }, 1000)
  }

  // Chaotic sections data
  const chaoticSections = [
    { title: "RANDOM BLOCK #1", content: "Click me! I spin and change colors! 🎨" },
    { title: "CHAOS ZONE", content: "Everything here is unpredictable! 🎲" },
    { title: "WILD CARD", content: "Hover over me for surprises! 🃏" },
    { title: "GLITCH MODE", content: "System malfunction in progress... ⚠️" },
    { title: "BOUNCE HOUSE", content: "I jump around when you least expect it! 🏀" },
    { title: "RAINBOW CORE", content: "Colors colors everywhere! 🌈" },
    { title: "TILT WORLD", content: "Gravity is just a suggestion here! 🌍" },
    { title: "PIXEL CHAOS", content: "Digital madness unleashed! 👾" }
  ]

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden relative"
      style={{
        background: `linear-gradient(${bgHue}deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        transition: 'background 0.1s ease'
      }}
    >
      {/* Flying Icons Game Layer */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {flyingIcons.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <FlyingIcon
              icon={item.icon}
              id={item.id}
              onCatch={handleCatch}
            />
          </div>
        ))}
      </div>

      {/* Click Effects */}
      <AnimatePresence>
        {clickEffects.map((effect) => (
          <motion.div
            key={effect.id}
            initial={{ scale: 0, opacity: 1, x: effect.x, y: effect.y }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none"
          >
            <div className="text-6xl">💥</div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Score Board */}
      <motion.div
        className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-purple-500"
        animate={{
          scale: [1, 1.05, 1],
          borderColor: ['#a855f7', '#ec4899', '#a855f7']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-white font-black text-xl">
          SCORE: <span className="text-yellow-400 text-3xl">{score}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">Catch the flying icons!</div>
      </motion.div>

      {/* Caught Icons Display */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-wrap gap-2 max-w-[200px]">
        <AnimatePresence>
          {caughtIcons.slice(-10).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              className="bg-white/10 p-2 rounded-lg"
            >
              <SafeIcon name={item.icon} size={20} className="text-white" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mobile-safe-container">
        {/* Hero Section - Absolute Chaos */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-600 rounded-full blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -100, rotate: -180 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-center relative z-10"
          >
            <GlitchText
              text="CHAOS ZONE"
              className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 block mb-4"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-xl md:text-3xl text-white/80 font-bold text-center max-w-2xl mt-8 glitch-text"
          >
            Welcome to the most unpredictable website ever created.
            Nothing makes sense here. Everything is random.
            Catch the flying icons for points!
          </motion.p>

          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12"
          >
            <SafeIcon name="arrow-down" size={48} className="text-white animate-bounce" />
          </motion.div>
        </section>

        {/* Chaotic Grid Section */}
        <section className="py-20 px-4">
          <motion.h2
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-center mb-16 text-white glitch-text"
          >
            RANDOM BLOCKS OF MADNESS
          </motion.h2>

          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {chaoticSections.map((section, index) => (
                <ChaoticCard
                  key={index}
                  title={section.title}
                  content={section.content}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Chaos Playground */}
        <section className="py-20 px-4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, pink 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, cyan 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, purple 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-12 text-white glitch-text">
              CLICK EVERYTHING
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(20)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.5, rotate: Math.random() * 360 }}
                  whileTap={{ scale: 0.5 }}
                  onClick={() => setScore((prev) => prev + 5)}
                  className={`${randomColors[i % randomColors.length]} px-6 py-3 rounded-full text-white font-bold shadow-lg transform transition-all`}
                  animate={{
                    y: [0, Math.random() * 20 - 10, 0],
                    rotate: [0, Math.random() * 20 - 10, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  <SafeIcon
                    name={chaoticIcons[i % chaoticIcons.length]}
                    size={24}
                    className="text-white"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Spinning Icon Carousel of Doom */}
        <section className="py-20 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex justify-center items-center"
          >
            <div className="relative w-[600px] h-[600px]">
              {chaoticIcons.slice(0, 12).map((icon, index) => {
                const angle = (index / 12) * Math.PI * 2
                const x = Math.cos(angle) * 200
                const y = Math.sin(angle) * 200

                return (
                  <motion.div
                    key={index}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    whileHover={{ scale: 2 }}
                  >
                    <div className={`${randomColors[index]} p-4 rounded-2xl shadow-2xl`}>
                      <SafeIcon name={icon} size={40} className="text-white" />
                    </div>
                  </motion.div>
                )
              })}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-white p-8 rounded-full shadow-2xl"
                >
                  <SafeIcon name="sparkles" size={60} className="text-purple-600" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* WTF Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                borderRadius: ['20%', '50%', '20%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-12 inline-block"
            >
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 glitch-text">
                WHAT IS HAPPENING?
              </h2>
              <p className="text-2xl text-white/90 font-bold">
                Even we don't know anymore. Just enjoy the ride! 🎢
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Chaos */}
        <footer className="py-12 px-4 border-t-4 border-dashed border-white/20">
          <div className="container mx-auto flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <SafeIcon name="crown" size={60} className="text-yellow-400" />
            </motion.div>

            <p className="text-white/60 text-center font-bold text-lg glitch-text">
              © {new Date().getFullYear()} CHAOS INC.
              ALL RIGHTS RESERVED.
              NO RIGHTS RESERVED.
              MAYBE SOME RIGHTS.
              WHO KNOWS?
            </p>

            <div className="flex gap-4 mt-6">
              {['github', 'twitter', 'instagram', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.5, rotate: 360 }}
                  className="bg-white/10 p-3 rounded-full"
                >
                  <SafeIcon name={social} size={24} className="text-white" />
                </motion.a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App