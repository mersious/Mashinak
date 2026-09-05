import type { ActuatorId, Category, EcuId, Level, SensorId, Vocab } from './types'

export const LEVELS: Record<Level, { name: string; who: string; description: string }> = {
  0: {
    name: 'No Driving Automation',
    who: 'Driver drives. System warns or intervenes for a moment.',
    description:
      'The human does all steering, braking and accelerating. The car may warn (FCW, BSD) or step in for a split second (AEB, ESC). SAE J3016 formally excludes active safety systems like ABS and ESC from the automation scale, but they ship on every L0 car, so they are listed here.',
  },
  1: {
    name: 'Driver Assistance',
    who: 'Driver drives. System sustains either speed or steering, never both.',
    description:
      'One sustained control axis: either longitudinal (ACC holds distance) or lateral (LCC holds the lane). The driver does the other axis and supervises everything.',
  },
  2: {
    name: 'Partial Driving Automation',
    who: 'System steers and controls speed together. Driver supervises every second.',
    description:
      'Both axes are automated at once (ACC + LCC = TJA or ICA). The driver remains the fallback and is legally responsible. "L2+" is a marketing term, not an SAE level: it usually means L2 with better maps, automatic lane changes and hands-off tolerance backed by a driver camera.',
  },
  3: {
    name: 'Conditional Driving Automation',
    who: 'System drives inside its ODD. Driver must take over when asked.',
    description:
      'Inside a defined Operational Design Domain (for example a divided highway under 60 km/h in traffic), the system performs the whole driving task and the driver may look away. The driver must respond to a takeover request within seconds. UN R157 (ALKS) was the first type-approval rule for this level.',
  },
  4: {
    name: 'High Driving Automation',
    who: 'System drives inside its ODD and handles its own fallback.',
    description:
      'No human fallback is needed inside the ODD: if something fails the system reaches a minimal-risk condition on its own. Robotaxis in a geofenced city, automated valet parking, hub-to-hub trucks. Redundant compute, power, braking and steering become mandatory.',
  },
  5: {
    name: 'Full Driving Automation',
    who: 'System drives everywhere a human could.',
    description:
      'No ODD limit at all: any road, any weather, anywhere. No production vehicle exists at this level and the industry does not expect one soon. It is listed so you can see what the last step actually requires.',
  },
}

export const CATEGORIES: Record<Category, Vocab> = {
  chassis: { name: 'Chassis control', short: 'Chassis', description: 'Brake and traction functions inside the ESC unit. No cameras involved.' },
  warning: { name: 'Warnings', short: 'Warn', description: 'Perception-based alerts. The car tells the driver, never acts.' },
  intervention: { name: 'Momentary interventions', short: 'Intervene', description: 'The car acts for a moment when a crash is imminent, then hands back.' },
  comfort: { name: 'Comfort and lighting', short: 'Comfort', description: 'Perception used for convenience rather than safety.' },
  longitudinal: { name: 'Longitudinal assistance', short: 'Speed', description: 'Sustained control of speed and distance.' },
  lateral: { name: 'Lateral assistance', short: 'Steer', description: 'Sustained control of steering within the lane.' },
  combined: { name: 'Combined assistance', short: 'Both', description: 'Speed and steering together, driver supervising.' },
  parking: { name: 'Parking', short: 'Park', description: 'Low-speed manoeuvring using ultrasonics and surround cameras.' },
  automated: { name: 'Automated driving', short: 'Auto', description: 'The system owns the driving task inside its ODD.' },
}

export const SENSORS: Record<SensorId, Vocab> = {
  wheel_speed: { name: 'Wheel speed sensors', short: 'Wheel speed', description: 'Hall or inductive sensor on each wheel hub. The oldest sensor in the stack: ABS lives on it.' },
  imu: { name: 'Inertial measurement unit', short: 'IMU', description: 'Yaw rate and lateral acceleration. Tells ESC how the car is actually rotating.' },
  steering_angle: { name: 'Steering angle sensor', short: 'Steering angle', description: 'Where the driver wants to go. Compared with the IMU to detect skids.' },
  brake_pressure: { name: 'Brake pressure sensor', short: 'Brake pressure', description: 'Master-cylinder pressure. Also reveals how fast the driver hit the pedal.' },
  pedal_position: { name: 'Pedal position sensors', short: 'Pedals', description: 'Accelerator and brake pedal travel. Used by brake override and cruise control.' },
  front_camera: { name: 'Forward camera', short: 'Front camera', description: 'Mono or stereo camera behind the windshield. Lanes, signs, lights, pedestrians, classification of objects.' },
  front_radar: { name: 'Forward radar', short: 'Front radar', description: '77 GHz long-range radar in the grille. Range and closing speed of objects up to about 200 m, in any weather.' },
  corner_radar_front: { name: 'Front corner radars', short: 'Front corners', description: 'Short-range radars in the front bumper corners. Cross traffic and cut-ins.' },
  corner_radar_rear: { name: 'Rear corner radars', short: 'Rear corners', description: 'Short-range radars in the rear bumper corners. Blind spots and approaching vehicles.' },
  rear_camera: { name: 'Rear camera', short: 'Rear camera', description: 'Reversing view and rear object detection.' },
  surround_cameras: { name: 'Surround-view cameras', short: 'Surround cams', description: 'Four fisheye cameras in the mirrors and bumpers. Parking slots, kerbs, 360-degree view.' },
  ultrasonic: { name: 'Ultrasonic sensors', short: 'Ultrasonics', description: 'Twelve short-range sensors in the bumpers. Centimetre accuracy below about 5 m.' },
  lidar: { name: 'Lidar', short: 'Lidar', description: 'Laser range sensor. Precise 3D geometry, used for redundancy at L3 and above.' },
  gnss_hd_map: { name: 'GNSS and HD map', short: 'GNSS + HD map', description: 'Positioning fused with a high-definition lane map. Lets the system know the road ahead beyond sensor range.' },
  driver_camera: { name: 'Driver monitoring camera', short: 'Driver camera', description: 'Infrared camera on the dashboard. Eye gaze and head pose. Required for hands-off L2 and for L3 takeover readiness.' },
}

export const ACTUATORS: Record<ActuatorId, Vocab> = {
  brake: { name: 'Hydraulic brakes via ESC', short: 'Brakes', description: 'Only the ESC unit touches brake pressure. Every other feature sends it a deceleration request.' },
  steering: { name: 'Electric power steering', short: 'Steering', description: 'The EPS motor accepts a torque or angle request over the vehicle bus.' },
  powertrain: { name: 'Powertrain torque', short: 'Torque', description: 'Engine or motor torque request. Cruise control and traction control both use it.' },
  gear: { name: 'Gear selector', short: 'Gear', description: 'Shift-by-wire, needed to park automatically.' },
  hmi: { name: 'Driver interface', short: 'HMI', description: 'Cluster icons, chimes, seat or steering-wheel vibration.' },
  headlamps: { name: 'Headlamps', short: 'Lamps', description: 'High beam and matrix segments controlled by the body controller.' },
}

export const ECUS: Record<EcuId, Vocab> = {
  esc: { name: 'ESC unit', short: 'ESC', description: 'Brake hydraulic unit with its own controller. Owns wheel speeds and brake pressure.' },
  adas: { name: 'ADAS domain controller', short: 'ADAS', description: 'The perception and decision box for camera and radar features. Often the front camera module itself on smaller cars.' },
  eps: { name: 'Steering controller', short: 'EPS', description: 'Electric power steering motor controller.' },
  powertrain: { name: 'Powertrain controller', short: 'PCM', description: 'Engine or inverter control.' },
  body: { name: 'Body controller', short: 'BCM', description: 'Lighting, doors, comfort.' },
  ad_computer: { name: 'Automated driving computer', short: 'AD computer', description: 'High-performance, redundant compute for L3 and above. Fuses cameras, radars, lidar and map.' },
}
