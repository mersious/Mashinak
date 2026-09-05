import type { ActuatorId, SensorId } from '../data/types'
import { SENSORS } from '../data/vocab'

interface Props {
  sensors: SensorId[]
  actuators: ActuatorId[]
  highlight: boolean
}

// Car occupies x 100..300, y 100..700 (nose at top). Sensor cones extend beyond it.
const cone = (x: number, y: number, len: number, halfW: number) =>
  `M${x},${y} L${x - halfW},${y - len} Q${x},${y - len - halfW * 0.4} ${x + halfW},${y - len} Z`

interface SensorShape { id: SensorId; kind: string; paths?: string[]; dots?: [number, number][]; rings?: [number, number, number][] }

const SENSOR_SHAPES: SensorShape[] = [
  { id: 'front_radar', kind: 'radar', paths: [cone(200, 104, 420, 90)], dots: [[200, 106]] },
  { id: 'front_camera', kind: 'camera', paths: [cone(200, 232, 380, 170)], dots: [[200, 234]] },
  { id: 'corner_radar_front', kind: 'radar', paths: ['M112,118 L-40,-20 Q10,-60 60,-40 Z', 'M288,118 L440,-20 Q390,-60 340,-40 Z'], dots: [[112, 118], [288, 118]] },
  { id: 'corner_radar_rear', kind: 'radar', paths: ['M112,682 L-60,1050 Q20,1090 80,1040 Z', 'M288,682 L460,1050 Q380,1090 320,1040 Z'], dots: [[112, 682], [288, 682]] },
  { id: 'rear_camera', kind: 'camera', paths: ['M200,696 L60,900 Q200,940 340,900 Z'], dots: [[200, 696]] },
  { id: 'surround_cameras', kind: 'camera', paths: ['M96,262 L-60,150 Q-90,262 -60,374 Z', 'M304,262 L460,150 Q490,262 460,374 Z', 'M200,102 L110,-10 Q200,-40 290,-10 Z', 'M200,698 L110,810 Q200,840 290,810 Z'], dots: [[96, 262], [304, 262], [200, 102], [200, 698]] },
  { id: 'ultrasonic', kind: 'ultra', rings: [[125, 103, 45], [160, 100, 45], [200, 99, 45], [240, 100, 45], [275, 103, 45], [125, 697, 45], [160, 700, 45], [200, 701, 45], [240, 700, 45], [275, 697, 45]] },
  { id: 'lidar', kind: 'lidar', rings: [[200, 330, 520]], dots: [[200, 330]] },
  { id: 'gnss_hd_map', kind: 'gnss', rings: [[200, 600, 30], [200, 600, 50]], dots: [[200, 600]] },
  { id: 'driver_camera', kind: 'driver', paths: ['M175,262 L150,320 Q175,330 200,320 Z'], dots: [[175, 262]] },
  { id: 'wheel_speed', kind: 'chassis', dots: [[112, 210], [288, 210], [112, 600], [288, 600]] },
  { id: 'imu', kind: 'chassis', dots: [[200, 420]] },
  { id: 'steering_angle', kind: 'chassis', dots: [[165, 300]] },
  { id: 'brake_pressure', kind: 'chassis', dots: [[145, 170]] },
  { id: 'pedal_position', kind: 'chassis', dots: [[170, 330]] },
]

export default function CarView({ sensors, actuators, highlight }: Props) {
  const on = (id: SensorId) => !highlight || sensors.includes(id)
  const act = (id: ActuatorId) => highlight && actuators.includes(id)
  return (
    <svg className="car" viewBox="-120 -80 640 1180" role="img" aria-label="Top-down view of a car with sensor coverage">
      {/* sensor cones */}
      {SENSOR_SHAPES.map((s) => (
        <g key={s.id} className={`sensor kind-${s.kind} ${on(s.id) ? 'on' : 'off'}`}>
          <title>{SENSORS[s.id].name}</title>
          {s.paths?.map((d, i) => <path key={i} d={d} className="cone" />)}
          {s.rings?.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} className="ring" />)}
        </g>
      ))}

      {/* body */}
      <g className="body">
        <path d="M130,100 Q200,86 270,100 L292,150 Q300,170 300,200 L300,620 Q300,660 290,690 Q200,712 110,690 Q100,660 100,620 L100,200 Q100,170 108,150 Z" />
        <path className="glass" d="M128,235 Q200,220 272,235 L262,300 Q200,292 138,300 Z" />
        <path className="glass" d="M132,560 Q200,548 268,560 L280,630 Q200,640 120,630 Z" />
        <rect className="roof" x="130" y="305" width="140" height="250" rx="18" />
        {/* mirrors */}
        <rect x="80" y="250" width="22" height="26" rx="5" />
        <rect x="298" y="250" width="22" height="26" rx="5" />
        {/* headlamps */}
        <path className={`lamp ${act('headlamps') ? 'act' : ''}`} d="M135,104 Q160,96 185,100 L180,118 L138,120 Z" />
        <path className={`lamp ${act('headlamps') ? 'act' : ''}`} d="M265,104 Q240,96 215,100 L220,118 L262,120 Z" />
        {/* engine / motor */}
        <rect className={`unit ${act('powertrain') ? 'act' : ''}`} x="160" y="140" width="80" height="60" rx="8" />
        {/* gear selector */}
        <rect className={`unit ${act('gear') ? 'act' : ''}`} x="190" y="360" width="20" height="40" rx="5" />
        {/* cluster / hmi */}
        <rect className={`unit ${act('hmi') ? 'act' : ''}`} x="145" y="270" width="60" height="16" rx="4" />
        {/* steering rack */}
        <line className={`rack ${act('steering') ? 'act' : ''}`} x1="112" y1="210" x2="288" y2="210" />
        {/* wheels */}
        {[[112, 210], [288, 210], [112, 600], [288, 600]].map(([x, y], i) => (
          <rect key={i} className={`wheel ${act('brake') ? 'act' : ''} ${act('steering') && i < 2 ? 'act' : ''}`} x={x - 13} y={y - 34} width="26" height="68" rx="7" />
        ))}
      </g>

      {/* sensor dots on top */}
      {SENSOR_SHAPES.map((s) => (
        <g key={s.id} className={`sensor kind-${s.kind} ${on(s.id) ? 'on' : 'off'}`}>
          {s.dots?.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="7" className="dot" />)}
        </g>
      ))}
    </svg>
  )
}
