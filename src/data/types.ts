export type Level = 0 | 1 | 2 | 3 | 4 | 5

export type Category =
  | 'chassis'
  | 'warning'
  | 'intervention'
  | 'longitudinal'
  | 'lateral'
  | 'combined'
  | 'parking'
  | 'automated'
  | 'comfort'

export const SENSOR_IDS = [
  'wheel_speed',
  'imu',
  'steering_angle',
  'brake_pressure',
  'pedal_position',
  'front_camera',
  'front_radar',
  'corner_radar_front',
  'corner_radar_rear',
  'rear_camera',
  'surround_cameras',
  'ultrasonic',
  'lidar',
  'gnss_hd_map',
  'driver_camera',
] as const
export type SensorId = (typeof SENSOR_IDS)[number]

export const ACTUATOR_IDS = ['brake', 'steering', 'powertrain', 'gear', 'hmi', 'headlamps'] as const
export type ActuatorId = (typeof ACTUATOR_IDS)[number]

export const ECU_IDS = ['esc', 'adas', 'eps', 'powertrain', 'body', 'ad_computer'] as const
export type EcuId = (typeof ECU_IDS)[number]

export const FEATURE_IDS = [
  // chassis
  'ABS', 'EBD', 'BAS', 'BOS', 'ESC', 'TCS', 'HSA', 'HDC',
  // warnings
  'FCW', 'LDW', 'BSD', 'LCA', 'RCW', 'DOW', 'RCTA', 'TSR', 'DMS',
  // momentary interventions
  'AEB', 'ELK', 'RCTB',
  // comfort
  'IHC',
  // L1
  'CC', 'ACC', 'LDP', 'LCC',
  // L2
  'TJA', 'ICA', 'HWA', 'ALC', 'APA',
  // L3
  'ALKS', 'HWP',
  // L4
  'AVP', 'URBAN_L4',
  // L5
  'FULL_L5',
] as const
export type FeatureId = (typeof FEATURE_IDS)[number]

export interface Feature {
  id: FeatureId
  name: string
  aliases: string[]
  category: Category
  level: Level
  ecu: EcuId
  sensors: SensorId[]
  actuators: ActuatorId[]
  dependsOn: FeatureId[]
  regulations: string[]
  summary: string
  detail: string
}

export interface Vocab {
  name: string
  short: string
  description: string
}
