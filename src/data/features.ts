import { MARKET_NOTES } from './markets'
import type { Feature, FeatureId } from './types'

const f = (x: Feature) => x

/**
 * Order matters: within each level, features are listed in learning order. Foundations that
 * other features build on come first, then the functions regulators mandate, then helpers
 * and comfort. The UI keeps this order, so reordering here reorders the app.
 */

export const FEATURES: Record<FeatureId, Feature> = {
  // ─── L0 · no automation: chassis foundations, then the mandated safety functions, then the rest ───
  ABS: f({
    id: 'ABS', name: 'Anti-lock Braking System', aliases: [], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['wheel_speed', 'brake_pressure'], actuators: ['brake'], dependsOn: [],
    regulations: ['UN R13-H'],
    summary: 'Keeps wheels from locking under hard braking so the driver can still steer.',
    detail: 'Compares each wheel speed with the vehicle speed estimate. When a wheel decelerates far faster than the car, it is about to lock: ABS releases and re-applies pressure to that wheel many times per second. Everything above it in the stack (ESC, AEB) reuses this per-wheel pressure modulation.',
  }),
  ESC: f({
    id: 'ESC', name: 'Electronic Stability Control', aliases: ['ESP Electronic Stability Program', 'VSC', 'DSC', 'VDC'], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['wheel_speed', 'imu', 'steering_angle', 'brake_pressure'], actuators: ['brake', 'powertrain'], dependsOn: ['ABS', 'TCS'],
    regulations: ['UN R140', 'FMVSS 126'],
    summary: 'Brakes individual wheels to stop the car from spinning or plowing when it starts to skid.',
    detail: 'Compares the yaw rate the driver asked for (steering angle and speed) with the yaw rate the IMU measures. Oversteer: brake the outer front wheel. Understeer: brake the inner rear wheel and cut torque. ESP is Bosch\'s trade name and became the everyday word. This ECU is the actuator for every braking feature above it.',
  }),
  AEB: f({
    id: 'AEB', name: 'Autonomous Emergency Braking', aliases: ['Automatic Emergency Braking', 'AEB-Pedestrian', 'AEB-Cyclist'], category: 'intervention', level: 0, ecu: 'adas',
    sensors: ['front_camera', 'front_radar'], actuators: ['brake', 'hmi'], dependsOn: ['FCW', 'ESC', 'BAS'],
    regulations: ['UN R152', 'EU GSR 2019/2144', 'Euro NCAP AEB C2C / VRU'],
    summary: 'Brakes on its own when the driver does not react to the collision warning.',
    detail: 'Stage 1 is FCW. Stage 2 pre-fills the brake lines so pedal response is instant. Stage 3 sends a deceleration request over the vehicle bus to the ESC unit, which executes it. The ADAS controller never touches hydraulics itself: that separation between deciding and actuating is the core L2 architecture pattern.',
  }),
  FCW: f({
    id: 'FCW', name: 'Forward Collision Warning', aliases: [], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['front_camera', 'front_radar'], actuators: ['hmi'], dependsOn: [],
    regulations: ['Euro NCAP Safety Assist'],
    summary: 'Warns when the time to collision with the vehicle ahead drops below a threshold.',
    detail: 'Radar gives range and closing speed; the camera confirms the object is a vehicle and in the same lane. Time-to-collision around 2.5 s triggers a chime and cluster icon. FCW is the first stage of AEB.',
  }),
  ELK: f({
    id: 'ELK', name: 'Emergency Lane Keeping', aliases: ['ELKA'], category: 'intervention', level: 0, ecu: 'adas',
    sensors: ['front_camera', 'corner_radar_rear'], actuators: ['steering', 'hmi'], dependsOn: ['LDW', 'BSD'],
    regulations: ['UN R79 Annex 8 (CSF)', 'EU GSR 2019/2144'],
    summary: 'Steers back hard if the car is about to leave the road or cut into oncoming traffic.',
    detail: 'Stronger and later than LDP: it only fires when the edge of the road or an oncoming or overtaking vehicle makes the departure dangerous. Sends a torque request to the EPS. Mandatory in the EU since 2022.',
  }),
  LDW: f({
    id: 'LDW', name: 'Lane Departure Warning', aliases: [], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['front_camera'], actuators: ['hmi'], dependsOn: [],
    regulations: ['UN R130', 'EU GSR 2019/2144'],
    summary: 'Warns when the car drifts over a lane marking without the indicator on.',
    detail: 'The camera fits polynomials to the lane markings and predicts when a tyre will cross one. Active above about 60 km/h. Mandatory on new EU vehicles since 2022.',
  }),
  BSD: f({
    id: 'BSD', name: 'Blind Spot Detection', aliases: ['BSM Blind Spot Monitoring', 'BSW'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear'], actuators: ['hmi'], dependsOn: [],
    regulations: ['ISO 17387'],
    summary: 'Lights an icon in the mirror when a vehicle sits in the adjacent lane beside you.',
    detail: 'Rear corner radars cover a zone from the B-pillar to a few metres behind. The icon flashes and a chime sounds if the indicator is switched on while the zone is occupied.',
  }),
  DMS: f({
    id: 'DMS', name: 'Driver Monitoring System', aliases: ['DDAW Driver Drowsiness and Attention Warning'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['driver_camera', 'steering_angle'], actuators: ['hmi'], dependsOn: [],
    regulations: ['EU GSR 2019/2144', 'Euro NCAP 2023'],
    summary: 'Watches the driver\'s eyes and warns on drowsiness or distraction.',
    detail: 'Simple versions infer fatigue from steering micro-corrections. Camera versions track gaze. It becomes a hard prerequisite for hands-off L2 and for any L3 system, which must know the driver is ready to take over.',
  }),
  TSR: f({
    id: 'TSR', name: 'Traffic Sign Recognition', aliases: ['ISA Intelligent Speed Assistance'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['front_camera', 'gnss_hd_map'], actuators: ['hmi'], dependsOn: [],
    regulations: ['UN R171 (ISA)', 'EU GSR 2019/2144'],
    summary: 'Reads speed limit signs and shows the current limit in the cluster.',
    detail: 'Camera classification fused with map speed limits when the sign is missing. ISA adds a warning or gentle pedal counter-force when the limit is exceeded. Feeds the set speed of ACC on newer cars.',
  }),
  TCS: f({
    id: 'TCS', name: 'Traction Control System', aliases: ['ASR', 'TRC'], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['wheel_speed'], actuators: ['brake', 'powertrain'], dependsOn: ['ABS'],
    regulations: [],
    summary: 'Stops a driven wheel from spinning on launch by braking it or cutting torque.',
    detail: 'The mirror image of ABS: too much slip while accelerating instead of braking. Braking the spinning wheel also sends torque across an open differential to the wheel with grip.',
  }),
  EBD: f({
    id: 'EBD', name: 'Electronic Brakeforce Distribution', aliases: [], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['wheel_speed'], actuators: ['brake'], dependsOn: ['ABS'],
    regulations: ['UN R13-H'],
    summary: 'Sends less brake force to the rear axle as it unloads, so the rear never locks first.',
    detail: 'During braking, weight shifts forward and the rear tyres lose grip. EBD limits rear pressure based on the slip difference between axles. It replaced the mechanical proportioning valve and is a software function of the ABS controller.',
  }),
  BAS: f({
    id: 'BAS', name: 'Brake Assist', aliases: ['EBA Emergency Brake Assist', 'HBA Hydraulic Brake Assist', 'BA'], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['brake_pressure', 'pedal_position'], actuators: ['brake'], dependsOn: ['ABS'],
    regulations: ['UN R13-H Annex 9'],
    summary: 'Detects a panic stop from how fast the pedal moves and jumps to full braking.',
    detail: 'Most drivers brake too softly in an emergency. If pedal speed exceeds a threshold, BAS raises pressure to the ABS limit regardless of how hard the foot presses. Brochures often list BAS and EBA separately; they are the same function under different supplier names.',
  }),
  BOS: f({
    id: 'BOS', name: 'Brake Override System', aliases: ['Brake-throttle override'], category: 'chassis', level: 0, ecu: 'powertrain',
    sensors: ['pedal_position'], actuators: ['powertrain'], dependsOn: [],
    regulations: [],
    summary: 'If brake and accelerator are pressed together, the brake wins and engine torque is cut.',
    detail: 'Protects against a stuck accelerator or a trapped floor mat. Purely a powertrain-side rule, but listed with chassis features because it changes how the pedals behave.',
  }),
  HSA: f({
    id: 'HSA', name: 'Hill Start Assist', aliases: ['HAC Hill-Up Assist Control', 'HHC Hill Hold Control'], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['imu', 'brake_pressure', 'pedal_position'], actuators: ['brake'], dependsOn: ['ESC'],
    regulations: [],
    summary: 'Holds brake pressure for about two seconds after the pedal is released on a slope.',
    detail: 'The IMU\'s longitudinal accelerometer measures the slope while stopped. ESC keeps the hydraulic valves closed so the car does not roll back while the foot moves to the accelerator.',
  }),
  HDC: f({
    id: 'HDC', name: 'Hill Descent Control', aliases: ['HDC Hill-Down Assist Control', 'DAC Downhill Assist Control'], category: 'chassis', level: 0, ecu: 'esc',
    sensors: ['wheel_speed', 'imu'], actuators: ['brake', 'powertrain'], dependsOn: ['ESC'],
    regulations: [],
    summary: 'Holds a slow constant speed down a steep slope with no pedal input.',
    detail: 'Driver-enabled, typically below 30 km/h. ESC modulates all four brakes to hold a target speed; the driver can adjust it with the pedals or cruise buttons.',
  }),
  LCA: f({
    id: 'LCA', name: 'Lane Change Alert', aliases: ['Lane Change Assist (warning variant)', 'CVW Closing Vehicle Warning'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear'], actuators: ['hmi'], dependsOn: ['BSD'],
    regulations: ['ISO 17387'],
    summary: 'Extends blind spot detection to fast vehicles approaching from up to about 70 m behind.',
    detail: 'Same radars as BSD, longer range and closing-speed logic. Some brochures use the same name for an active lane change on request; that function is listed separately as ALC.',
  }),
  RCTA: f({
    id: 'RCTA', name: 'Rear Cross Traffic Alert', aliases: ['CTA', 'RCTW'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear', 'rear_camera'], actuators: ['hmi'], dependsOn: [],
    regulations: [],
    summary: 'Warns when reversing out of a parking bay into crossing traffic.',
    detail: 'Rear corner radars look sideways when reverse gear is selected. The camera view shows the direction of the threat.',
  }),
  RCTB: f({
    id: 'RCTB', name: 'Rear Cross Traffic Braking', aliases: ['Rear AEB'], category: 'intervention', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear', 'ultrasonic', 'rear_camera'], actuators: ['brake'], dependsOn: ['RCTA', 'ESC'],
    regulations: [],
    summary: 'Brakes automatically while reversing if a crossing vehicle or obstacle is detected.',
    detail: 'Low-speed reversing AEB. Ultrasonics catch poles and walls, corner radars catch crossing cars.',
  }),
  RCW: f({
    id: 'RCW', name: 'Rear Collision Warning', aliases: ['Rear-end Collision Warning'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear'], actuators: ['hmi'], dependsOn: [],
    regulations: [],
    summary: 'Flashes the hazard lights when a vehicle approaches fast from behind.',
    detail: 'The car cannot avoid being hit from behind; it warns the driver behind instead. Some systems also pre-tension the seat belts.',
  }),
  DOW: f({
    id: 'DOW', name: 'Door Opening Warning', aliases: ['Exit Warning', 'Safe Exit Assist'], category: 'warning', level: 0, ecu: 'adas',
    sensors: ['corner_radar_rear'], actuators: ['hmi'], dependsOn: ['BSD'],
    regulations: [],
    summary: 'Warns before a door opens into a cyclist or car approaching from behind.',
    detail: 'Rear corner radars keep running for a while after the car is parked. Advanced versions delay the door unlock.',
  }),
  IHC: f({
    id: 'IHC', name: 'Intelligent High Beam Control', aliases: ['AHB Automatic High Beam', 'HBA', 'ADB Adaptive Driving Beam'], category: 'comfort', level: 0, ecu: 'adas',
    sensors: ['front_camera'], actuators: ['headlamps'], dependsOn: [],
    regulations: ['UN R48', 'UN R149'],
    summary: 'Switches high beam on and off, or masks segments, based on oncoming headlights.',
    detail: 'The forward camera detects headlamps and tail lamps at night. The decision goes to the body controller, which drives the lamps. Matrix versions keep high beam on while cutting a dark slot around each other vehicle.',
  }),
  // ─── L1 · one sustained axis ───
  ACC: f({
    id: 'ACC', name: 'Adaptive Cruise Control', aliases: ['ACC Stop & Go', 'Full-speed-range ACC'], category: 'longitudinal', level: 1, ecu: 'adas',
    sensors: ['front_radar', 'front_camera', 'wheel_speed'], actuators: ['powertrain', 'brake'], dependsOn: ['CC', 'ESC'],
    regulations: ['ISO 15622'],
    summary: 'Holds a set speed but slows to keep a time gap behind the vehicle ahead.',
    detail: 'Radar tracks the lead vehicle; the controller targets a time gap of about 1 to 2 s, sending torque requests to the powertrain and deceleration requests to ESC. Stop & Go versions brake to a halt and resume. Deceleration is limited to roughly 3.5 m/s²; anything harder is AEB\'s job.',
  }),
  LCC: f({
    id: 'LCC', name: 'Lane Centering Control', aliases: ['LKA (centering type)', 'LCK', 'Lane Tracing Assist'], category: 'lateral', level: 1, ecu: 'adas',
    sensors: ['front_camera', 'steering_angle'], actuators: ['steering'], dependsOn: ['LDP'],
    regulations: ['UN R79 Annex 8 (ACSF B1)'],
    summary: 'Continuously steers to keep the car in the middle of the lane.',
    detail: 'A path controller runs at all times, not only at the lane edge. Requires both markings and hands on the wheel (capacitive or torque detection). UN R79 caps its lateral acceleration and demands a hands-off warning within seconds.',
  }),
  LDP: f({
    id: 'LDP', name: 'Lane Departure Prevention', aliases: ['LKA Lane Keeping Assist', 'LKS'], category: 'lateral', level: 1, ecu: 'adas',
    sensors: ['front_camera'], actuators: ['steering', 'hmi'], dependsOn: ['LDW'],
    regulations: ['UN R79 Annex 8 (CSF)'],
    summary: 'Gently steers back when a tyre is about to cross the lane marking.',
    detail: 'LDW plus a corrective torque request to the EPS. Only acts at the edge of the lane, so the car ping-pongs between the lines if the driver lets go. Compare LCC, which holds the centre.',
  }),
  CC: f({
    id: 'CC', name: 'Cruise Control', aliases: [], category: 'longitudinal', level: 1, ecu: 'powertrain',
    sensors: ['wheel_speed', 'pedal_position'], actuators: ['powertrain'], dependsOn: [],
    regulations: [],
    summary: 'Holds a set speed with no sensing of other traffic.',
    detail: 'The oldest L1 feature, purely a speed controller on the powertrain. Cancels when the brake is touched. It is the base ACC builds on.',
  }),
  // ─── L2 · both axes, driver supervising ───
  ICA: f({
    id: 'ICA', name: 'Integrated Cruise Assist', aliases: ['Highway Assist (basic)', 'Pilot Assist', 'Co-Pilot'], category: 'combined', level: 2, ecu: 'adas',
    sensors: ['front_camera', 'front_radar', 'wheel_speed'], actuators: ['powertrain', 'brake', 'steering'], dependsOn: ['ACC', 'LCC'],
    regulations: ['UN R79 Annex 8'],
    summary: 'ACC and lane centering running together across the full speed range.',
    detail: 'This is the textbook L2 feature: both axes automated, driver watching. The name varies by manufacturer more than any other feature on this list.',
  }),
  TJA: f({
    id: 'TJA', name: 'Traffic Jam Assist', aliases: [], category: 'combined', level: 2, ecu: 'adas',
    sensors: ['front_camera', 'front_radar', 'wheel_speed'], actuators: ['powertrain', 'brake', 'steering'], dependsOn: ['ACC', 'LCC'],
    regulations: ['UN R79 Annex 8'],
    summary: 'ACC Stop & Go plus lane centering at low speed, following the car ahead in a jam.',
    detail: 'Below about 60 km/h. When lane markings vanish in dense traffic it follows the lead vehicle\'s path instead. Same components as ICA, tuned for stop-and-go.',
  }),
  HWA: f({
    id: 'HWA', name: 'Highway Navigation Assist', aliases: ['NOA Navigate on Autopilot', 'NOP Navigation on Pilot', 'Highway Assist Pro'], category: 'combined', level: 2, ecu: 'adas',
    sensors: ['front_camera', 'front_radar', 'corner_radar_front', 'corner_radar_rear', 'gnss_hd_map', 'driver_camera'], actuators: ['powertrain', 'brake', 'steering', 'hmi'], dependsOn: ['ICA', 'ALC', 'DMS', 'TSR'],
    regulations: ['UN R79 Annex 8 (ACSF C)'],
    summary: 'Follows the navigation route on highways, changing lanes and taking exits by itself.',
    detail: 'The feature usually sold as "L2+". Adds map awareness, automatic lane changes and often hands-off driving backed by DMS. Legally still L2: the driver must watch the road every second.',
  }),
  ALC: f({
    id: 'ALC', name: 'Automatic Lane Change', aliases: ['Lane Change Assist (active variant)', 'ALCA'], category: 'combined', level: 2, ecu: 'adas',
    sensors: ['front_camera', 'corner_radar_front', 'corner_radar_rear'], actuators: ['steering', 'powertrain'], dependsOn: ['LCC', 'BSD', 'LCA'],
    regulations: ['UN R79 Annex 8 (ACSF C)'],
    summary: 'Performs the lane change when the driver taps the indicator and the lane is clear.',
    detail: 'Needs rear corner radars to prove the gap is safe. UN R79 requires the driver to initiate it and the manoeuvre to abort if the gap closes.',
  }),
  APA: f({
    id: 'APA', name: 'Automatic Parking Assist', aliases: ['Park Assist', 'IPA Intelligent Park Assist', 'RPA Remote Park Assist'], category: 'parking', level: 2, ecu: 'adas',
    sensors: ['ultrasonic', 'surround_cameras', 'wheel_speed', 'steering_angle'], actuators: ['steering', 'brake', 'powertrain', 'gear'], dependsOn: ['ESC'],
    regulations: ['ISO 16787'],
    summary: 'Finds a parking slot and steers, brakes and shifts into it while the driver supervises.',
    detail: 'Ultrasonics measure the slot while driving past; surround cameras find painted lines. Wheel speed pulses give centimetre odometry. Early versions only steered (L1); full versions handle all pedals and gear (L2). Remote versions move the car from a phone.',
  }),
  // ─── L3 · system drives inside its ODD ───
  ALKS: f({
    id: 'ALKS', name: 'Automated Lane Keeping System', aliases: ['Traffic Jam Pilot', 'Drive Pilot'], category: 'automated', level: 3, ecu: 'ad_computer',
    sensors: ['front_camera', 'front_radar', 'corner_radar_front', 'corner_radar_rear', 'lidar', 'gnss_hd_map', 'driver_camera'], actuators: ['powertrain', 'brake', 'steering', 'hmi'], dependsOn: ['TJA', 'HWA', 'DMS'],
    regulations: ['UN R157'],
    summary: 'The first legal L3 function: drives itself in slow highway traffic while the driver looks away.',
    detail: 'UN R157 allowed 60 km/h in 2021 and 130 km/h with lane changes from 2023. The system must detect a takeover need, warn the driver, and if nobody responds within about 10 s perform a minimal-risk manoeuvre. Redundant braking, steering and power supply are required. A data recorder logs every takeover.',
  }),
  HWP: f({
    id: 'HWP', name: 'Highway Pilot', aliases: ['Highway Chauffeur'], category: 'automated', level: 3, ecu: 'ad_computer',
    sensors: ['front_camera', 'front_radar', 'corner_radar_front', 'corner_radar_rear', 'lidar', 'gnss_hd_map', 'driver_camera', 'surround_cameras'], actuators: ['powertrain', 'brake', 'steering', 'hmi'], dependsOn: ['ALKS', 'ALC'],
    regulations: ['UN R157 (2023 extension)'],
    summary: 'L3 across the full highway speed range, including lane changes, entry to exit.',
    detail: 'Extends ALKS to full speed and to system-initiated lane changes. Still highway only, still asks the driver back before the exit ramp.',
  }),
  // ─── L4 · no human fallback inside the ODD ───
  URBAN_L4: f({
    id: 'URBAN_L4', name: 'Urban Driverless Operation', aliases: ['Robotaxi', 'Geofenced L4'], category: 'automated', level: 4, ecu: 'ad_computer',
    sensors: ['front_camera', 'surround_cameras', 'front_radar', 'corner_radar_front', 'corner_radar_rear', 'lidar', 'gnss_hd_map'], actuators: ['powertrain', 'brake', 'steering', 'gear'], dependsOn: ['HWP'],
    regulations: ['ISO 34502', 'UL 4600', 'local permits'],
    summary: 'Drives passengers through a mapped city area with no one behind the wheel.',
    detail: 'Multiple lidars, a dozen cameras, redundant compute and a remote assistance centre. The ODD is a geofence plus weather limits. Scenario-based safety argumentation replaces the human fallback.',
  }),
  AVP: f({
    id: 'AVP', name: 'Automated Valet Parking', aliases: [], category: 'automated', level: 4, ecu: 'ad_computer',
    sensors: ['ultrasonic', 'surround_cameras', 'lidar', 'gnss_hd_map'], actuators: ['steering', 'brake', 'powertrain', 'gear'], dependsOn: ['APA'],
    regulations: ['ISO 23374'],
    summary: 'Drop the car at the entrance; it parks itself with nobody inside.',
    detail: 'A tiny ODD (one car park, low speed) makes this the most reachable L4 function. Infrastructure sensors in the garage may share the perception load.',
  }),
  // ─── L5 · everywhere ───
  FULL_L5: f({
    id: 'FULL_L5', name: 'Full Driving Automation', aliases: [], category: 'automated', level: 5, ecu: 'ad_computer',
    sensors: ['front_camera', 'surround_cameras', 'front_radar', 'corner_radar_front', 'corner_radar_rear', 'lidar', 'gnss_hd_map'], actuators: ['powertrain', 'brake', 'steering', 'gear'], dependsOn: ['URBAN_L4'],
    regulations: ['none exist yet'],
    summary: 'Any road, any weather, no steering wheel required. Does not exist.',
    detail: 'The difference from L4 is the removal of every ODD limit: unmapped roads, snowstorms, a police officer waving you through. Listed so the gap between "robotaxi in one city" and "drives everywhere" stays visible.',
  }),
}

for (const [id, notes] of Object.entries(MARKET_NOTES)) FEATURES[id as FeatureId].markets = notes

export const ALL_FEATURES = Object.values(FEATURES)

export function enabledBy(id: FeatureId): Feature[] {
  return ALL_FEATURES.filter((x) => x.dependsOn.includes(id))
}
