import type { ActuatorId, SensorId } from '../data/types'
import { SENSORS } from '../data/vocab'

interface Props {
  sensors: SensorId[]
  actuators: ActuatorId[]
  selected: boolean
}

// Car occupies x 100..300, y 100..700 (nose at top). Sensor cones extend beyond it.
const cone = (x: number, y: number, len: number, halfW: number) =>
  `M${x},${y} L${x - halfW},${y - len} Q${x},${y - len - halfW * 0.4} ${x + halfW},${y - len} Z`

interface Shape {
  id: SensorId
  paths?: string[]
  dots?: [number, number][]
  rings?: [number, number, number][]
  label: [number, number, 'start' | 'end' | 'middle']
}

const SHAPES: Shape[] = [
  { id: 'front_radar', paths: [cone(200, 104, 330, 90)], dots: [[200, 106]], label: [200, -250, 'middle'] },
  { id: 'front_camera', paths: [cone(200, 232, 300, 170)], dots: [[200, 234]], label: [200, -100, 'middle'] },
  { id: 'corner_radar_front', paths: ['M112,118 L-40,-20 Q10,-60 60,-40 Z', 'M288,118 L440,-20 Q390,-60 340,-40 Z'], dots: [[112, 118], [288, 118]], label: [-40, -70, 'start'] },
  { id: 'corner_radar_rear', paths: ['M112,682 L-60,1050 Q20,1090 80,1040 Z', 'M288,682 L460,1050 Q380,1090 320,1040 Z'], dots: [[112, 682], [288, 682]], label: [-60, 1080, 'start'] },
  { id: 'rear_camera', paths: ['M200,696 L60,900 Q200,940 340,900 Z'], dots: [[200, 696]], label: [200, 960, 'middle'] },
  { id: 'surround_cameras', paths: ['M96,262 L-60,150 Q-90,262 -60,374 Z', 'M304,262 L460,150 Q490,262 460,374 Z', 'M200,102 L110,-10 Q200,-40 290,-10 Z', 'M200,698 L110,810 Q200,840 290,810 Z'], dots: [[96, 262], [304, 262], [200, 102], [200, 698]], label: [-90, 400, 'start'] },
  { id: 'ultrasonic', rings: [[125, 103, 45], [160, 100, 45], [200, 99, 45], [240, 100, 45], [275, 103, 45], [125, 697, 45], [160, 700, 45], [200, 701, 45], [240, 700, 45], [275, 697, 45]], label: [330, 60, 'start'] },
  { id: 'lidar', rings: [[200, 330, 520]], dots: [[200, 330]], label: [216, 322, 'start'] },
  { id: 'gnss_hd_map', rings: [[200, 600, 30], [200, 600, 50]], dots: [[200, 600]], label: [258, 606, 'start'] },
  { id: 'driver_camera', paths: ['M175,262 L150,320 Q175,330 200,320 Z'], dots: [[175, 262]], label: [136, 254, 'end'] },
  { id: 'wheel_speed', dots: [[112, 210], [288, 210], [112, 600], [288, 600]], label: [92, 570, 'end'] },
  { id: 'imu', dots: [[200, 420]], label: [216, 426, 'start'] },
  { id: 'steering_angle', dots: [[165, 300]], label: [150, 306, 'end'] },
  { id: 'brake_pressure', dots: [[145, 170]], label: [130, 176, 'end'] },
  { id: 'pedal_position', dots: [[170, 330]], label: [155, 350, 'end'] },
]

export default function CarView({ sensors, actuators, selected }: Props) {
  const state = (id: SensorId) => (!selected ? 'idle' : sensors.includes(id) ? 'on' : 'off')
  const act = (id: ActuatorId) => selected && actuators.includes(id)
  return (
    <svg className="car" viewBox="-120 -270 640 1370" role="img" aria-label="Top-down view of a car with sensor coverage and actuators">
      {SHAPES.map((s) => (
        <g key={s.id} className={`sensor ${state(s.id)}`}>
          <title>{SENSORS[s.id].name}</title>
          {s.paths?.map((d, i) => <path key={i} d={d} className="cone" />)}
          {s.rings?.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} className="ring" />)}
        </g>
      ))}

      <g className="body">
        <path d="M130,100 Q200,86 270,100 L292,150 Q300,170 300,200 L300,620 Q300,660 290,690 Q200,712 110,690 Q100,660 100,620 L100,200 Q100,170 108,150 Z" />
        <path className="glass" d="M128,235 Q200,220 272,235 L262,300 Q200,292 138,300 Z" />
        <path className="glass" d="M132,560 Q200,548 268,560 L280,630 Q200,640 120,630 Z" />
        <rect className="roof" x="130" y="305" width="140" height="250" rx="18" />
        <rect x="80" y="250" width="22" height="26" rx="5" />
        <rect x="298" y="250" width="22" height="26" rx="5" />
        <path className={`lamp ${act('headlamps') ? 'act' : ''}`} d="M135,104 Q160,96 185,100 L180,118 L138,120 Z" />
        <path className={`lamp ${act('headlamps') ? 'act' : ''}`} d="M265,104 Q240,96 215,100 L220,118 L262,120 Z" />
        <rect className={`unit ${act('powertrain') ? 'act' : ''}`} x="160" y="140" width="80" height="60" rx="8" />
        <rect className={`unit ${act('gear') ? 'act' : ''}`} x="190" y="360" width="20" height="40" rx="5" />
        <rect className={`unit ${act('hmi') ? 'act' : ''}`} x="145" y="270" width="60" height="16" rx="4" />
        <line className={`rack ${act('steering') ? 'act' : ''}`} x1="112" y1="210" x2="288" y2="210" />
        {[[112, 210], [288, 210], [112, 600], [288, 600]].map(([x, y], i) => (
          <rect key={i} className={`wheel ${act('brake') || (act('steering') && i < 2) ? 'act' : ''}`} x={x - 13} y={y - 34} width="26" height="68" rx="7" />
        ))}
      </g>

      {SHAPES.map((s) => (
        <g key={s.id} className={`sensor ${state(s.id)}`}>
          {s.dots?.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="6" className="dot" />)}
          {selected && <text className="label" x={s.label[0]} y={s.label[1]} textAnchor={s.label[2]}>{SENSORS[s.id].short}</text>}
        </g>
      ))}
      {!selected && <text className="caption" x="200" y="1080" textAnchor="middle">all sensor positions · pick a feature</text>}
    </svg>
  )
}
