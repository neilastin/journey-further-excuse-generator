import { motion } from 'framer-motion';

interface Shape {
  color: string;
  size: number;
  x: number[];
  y: number[];
  duration: number;
  initialX: string;
  initialY: string;
}

export default function AnimatedBackground() {
  const shapes: Shape[] = [
    {
      color: '#00ff88', // accent-green
      size: 400,
      x: [0, 120, -80],
      y: [0, -100, 60],
      duration: 25,
      initialX: '10%',
      initialY: '20%',
    },
    {
      color: '#00d9ff', // accent-blue
      size: 500,
      x: [0, -150, 100],
      y: [0, 120, -80],
      duration: 30,
      initialX: '70%',
      initialY: '10%',
    },
    {
      color: '#b57bff', // accent-purple
      size: 350,
      x: [0, 80, -120],
      y: [0, -80, 100],
      duration: 28,
      initialX: '85%',
      initialY: '60%',
    },
    {
      color: '#00ff88', // accent-green
      size: 300,
      x: [0, -100, 70],
      y: [0, 90, -60],
      duration: 22,
      initialX: '15%',
      initialY: '75%',
    },
    {
      color: '#00d9ff', // accent-blue
      size: 450,
      x: [0, 110, -90],
      y: [0, -70, 85],
      duration: 27,
      initialX: '45%',
      initialY: '85%',
    },
    {
      color: '#b57bff', // accent-purple
      size: 380,
      x: [0, -80, 95],
      y: [0, 110, -70],
      duration: 24,
      initialX: '60%',
      initialY: '40%',
    },
    {
      color: '#00ff88', // accent-green
      size: 320,
      x: [0, 90, -110],
      y: [0, -90, 75],
      duration: 26,
      initialX: '30%',
      initialY: '50%',
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ background: 'transparent' }}>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            opacity: 0.15,
            filter: 'blur(80px)',
            left: shape.initialX,
            top: shape.initialY,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
          animate={{
            x: shape.x,
            y: shape.y,
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
