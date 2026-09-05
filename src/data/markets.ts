import type { FeatureId, MarketNote, RegionalMarket } from './types'

type Notes = Partial<Record<RegionalMarket, MarketNote>>

/**
 * How each market treats a feature. Only features with a meaningful regional
 * difference are listed; the rest are engineering-identical everywhere.
 * Dates are for new passenger cars (M1) unless stated.
 */
export const MARKET_NOTES: Partial<Record<FeatureId, Notes>> = {
  ABS: {
    eu: { status: 'mandatory', rules: ['UN R13-H'], note: 'Required on all new cars since 2004.' },
    us: { status: 'mandatory', rules: ['FMVSS 126', 'FMVSS 135'], note: 'Not named as such, but FMVSS 126 (ESC) cannot be met without it, so every car since 2012 has it.' },
    cn: { status: 'mandatory', rules: ['GB 7258', 'GB 21670'], note: 'GB 7258 requires ABS on passenger cars; GB 21670 sets brake performance.' },
  },
  ESC: {
    eu: { status: 'mandatory', rules: ['UN R140', 'UN R13-H Annex 9'], note: 'Mandatory for all new cars since November 2014.' },
    us: { status: 'mandatory', rules: ['FMVSS 126'], note: 'Mandatory since model year 2012. The US rule came first and UN R140 was modelled on it.' },
    cn: { status: 'mandatory', rules: ['GB/T 30677', 'GB 7258'], note: 'Performance defined in GB/T 30677. Effectively universal on new passenger cars since the late 2010s.' },
  },
  AEB: {
    eu: { status: 'mandatory', rules: ['UN R152', 'GSR (EU) 2019/2144', 'Euro NCAP AEB C2C, VRU'], note: 'Car-to-car AEB mandatory for all new cars since July 2024; pedestrian and cyclist detection from July 2026. Euro NCAP tests it at night and at junctions.' },
    us: { status: 'phasing_in', rules: ['FMVSS 127', 'NHTSA NCAP', 'IIHS front crash prevention'], note: 'FMVSS 127 (April 2024) requires AEB with pedestrian detection and no-contact performance up to 62 mph from September 2029. Until then it is voluntary, but every major brand already fits it.' },
    cn: { status: 'rated', rules: ['GB/T 39901-2021', 'C-NCAP'], note: 'Performance standard is recommended, not mandatory, for passenger cars; mandatory only for buses and heavy trucks. C-NCAP scores it including two-wheelers.' },
  },
  FCW: {
    eu: { status: 'mandatory', rules: ['UN R152'], note: 'Bundled into the AEB requirement: R152 demands a warning phase before braking.' },
    us: { status: 'phasing_in', rules: ['FMVSS 127'], note: 'FMVSS 127 requires FCW as the first stage of AEB from 2029. Rated by NHTSA NCAP since 2011.' },
    cn: { status: 'rated', rules: ['GB/T 33577-2017', 'C-NCAP'], note: 'Recommended standard for passenger cars. Mandatory on commercial vehicles under JT/T 883.' },
  },
  LDW: {
    eu: { status: 'mandatory', rules: ['GSR (EU) 2019/2144 via ELKS', 'UN R130 (trucks)'], note: 'For cars the mandatory function is the stronger ELK; a plain warning is no longer enough.' },
    us: { status: 'rated', rules: ['NHTSA NCAP'], note: 'Recommended by NCAP since 2011; no FMVSS requirement.' },
    cn: { status: 'rated', rules: ['GB/T 26773-2011', 'C-NCAP'], note: 'Recommended standard for passenger cars. Mandatory on buses and heavy trucks since 2018 under GB 7258.' },
  },
  ELK: {
    eu: { status: 'mandatory', rules: ['(EU) 2021/646', 'UN R79 Annex 8 CSF'], note: 'Emergency Lane Keeping System mandatory for all new cars since July 2024, active between 70 and 130 km/h.' },
    us: { status: 'unregulated', rules: [], note: 'No equivalent requirement. Offered as part of lane-keeping packages.' },
    cn: { status: 'rated', rules: ['GB/T 39263-2020 (term)', 'C-NCAP LSS'], note: 'Defined as a term and scored by C-NCAP lane support tests, not mandated.' },
  },
  LDP: {
    eu: { status: 'rated', rules: ['UN R79 Annex 8 CSF', 'Euro NCAP LSS'], note: 'Type-approved under R79 corrective steering rules. Euro NCAP Lane Support scoring drives adoption.' },
    us: { status: 'rated', rules: ['NHTSA NCAP (LKA from 2026 protocol)'], note: 'No rule; NCAP added lane keeping to its rating roadmap.' },
    cn: { status: 'rated', rules: ['GB/T 39323-2020', 'C-NCAP'], note: 'Recommended performance standard for lane keeping assist.' },
  },
  LCC: {
    eu: { status: 'permitted', rules: ['UN R79 Annex 8 ACSF B1'], note: 'Requires hands-on detection with warning escalation within seconds, and caps lateral acceleration. This is why European L2 rarely offers hands-off.' },
    us: { status: 'permitted', rules: ['IIHS partial automation safeguards (2024)'], note: 'No rule. Hands-off lane centering has been sold since 2017. IIHS now rates whether the driver is monitored.' },
    cn: { status: 'permitted', rules: ['GB/T 39323-2020', 'GB combined driving assistance (draft 2025)'], note: 'The 2025 draft mandatory standard adds hands-on and driver-attention requirements similar in spirit to UN R79.' },
  },
  ALC: {
    eu: { status: 'permitted', rules: ['UN R79 Annex 8 ACSF C'], note: 'Driver must initiate each lane change; the system must abort if the gap closes. System-initiated changes are only allowed under R157.' },
    us: { status: 'permitted', rules: [], note: 'Unregulated. System-initiated lane changes on L2 are offered by several brands.' },
    cn: { status: 'permitted', rules: ['GB/T 39263-2020 (term)'], note: 'Widely offered on urban and highway navigation assist. Draft 2025 GB standard will set requirements.' },
  },
  HWA: {
    eu: { status: 'permitted', rules: ['UN R79 Annex 8'], note: 'Sold as highway assist with hands-on requirement and driver-initiated lane changes. Map-based automatic lane changes are limited by R79.' },
    us: { status: 'permitted', rules: [], note: 'Hands-off highway systems with automatic lane changes are common and unregulated at federal level.' },
    cn: { status: 'permitted', rules: ['GB/T 40429-2021'], note: 'Highway and urban "navigate on autopilot" is the main competitive battleground. Often fitted with lidar, and marketed as L2+ or L2.9.' },
  },
  TSR: {
    eu: { status: 'mandatory', rules: ['(EU) 2021/1958 ISA', 'UN R171'], note: 'Intelligent Speed Assistance mandatory since July 2024: read the limit and warn or gently resist when exceeded.' },
    us: { status: 'unregulated', rules: [], note: 'No requirement. Speed limit display is a comfort feature; ISA is under discussion after NTSB recommendations.' },
    cn: { status: 'rated', rules: ['GB/T 39263-2020 (term)'], note: 'Common, not mandated.' },
  },
  DMS: {
    eu: { status: 'mandatory', rules: ['(EU) 2021/1341 DDAW', '(EU) 2023/2590 ADDW', 'Euro NCAP 2023'], note: 'Drowsiness warning mandatory since July 2024; camera-based distraction warning mandatory for all new cars from July 2026. Euro NCAP requires it for five stars.' },
    us: { status: 'rated', rules: ['IIHS partial automation safeguards'], note: 'No federal rule. IIHS rating requires camera or hands monitoring for a good score.' },
    cn: { status: 'rated', rules: ['GB/T 41797-2022', 'GB combined driving assistance (draft 2025)'], note: 'Recommended standard for driver attention monitoring. The 2025 draft would make it mandatory alongside L2 functions.' },
  },
  BSD: {
    eu: { status: 'rated', rules: ['ISO 17387', 'UN R151 (trucks)'], note: 'No requirement for cars. Mandatory blind spot information for trucks since 2024.' },
    us: { status: 'rated', rules: ['NHTSA NCAP'], note: 'Recommended technology in NCAP; no FMVSS.' },
    cn: { status: 'rated', rules: ['GB/T 39265-2020', 'C-NCAP'], note: 'Recommended performance standard.' },
  },
  RCTA: {
    eu: { status: 'mandatory', rules: ['(EU) 2021/535 reversing detection'], note: 'Since July 2024 every new car needs a rear camera or rear detection sensors. Cross traffic alert itself is optional.' },
    us: { status: 'mandatory', rules: ['FMVSS 111'], note: 'Rear camera mandatory since May 2018 after a long fight over child back-over deaths. Cross traffic alert is optional.' },
    cn: { status: 'unregulated', rules: [], note: 'Rear cameras are universal but not required by GB.' },
  },
  ACC: {
    eu: { status: 'permitted', rules: ['ISO 15622'], note: 'No approval regulation; ISO defines behaviour.' },
    us: { status: 'permitted', rules: ['ISO 15622'], note: 'No approval regulation.' },
    cn: { status: 'permitted', rules: ['GB/T 20608-2006'], note: 'Recommended performance standard for ACC.' },
  },
  APA: {
    eu: { status: 'permitted', rules: ['UN R79 Annex 8 ACSF A'], note: 'Low-speed manoeuvres below 10 km/h. Remote parking is allowed within 6 m of the driver.' },
    us: { status: 'permitted', rules: [], note: 'Unregulated. Remote "summon" functions are sold under the driver\'s responsibility.' },
    cn: { status: 'permitted', rules: ['GB/T 41630-2022'], note: 'Recommended standard covers automatic and remote parking.' },
  },
  IHC: {
    eu: { status: 'permitted', rules: ['UN R48', 'UN R149'], note: 'Adaptive driving beam (matrix) legal since 2016.' },
    us: { status: 'permitted', rules: ['FMVSS 108 (2022 amendment)'], note: 'Matrix headlights were illegal until February 2022, which is why US cars had simpler high-beam assist.' },
    cn: { status: 'permitted', rules: ['GB 4785'], note: 'Adaptive beams permitted.' },
  },
  ALKS: {
    eu: { status: 'permitted', rules: ['UN R157', 'Germany StVG §1a'], note: 'First L3 type approval in the world (2021). Highway, up to 60 km/h, later 95 and 130 km/h. Manufacturer is liable while engaged.' },
    us: { status: 'pilot', rules: ['Nevada NRS 482A', 'California DMV L3 permit'], note: 'Approved only in Nevada and California for one manufacturer, highway, up to 40 mph, daytime, clear weather.' },
    cn: { status: 'pilot', rules: ['MIIT L3/L4 access pilot (2023)', 'GB/T 40429-2021'], note: 'Pilot plates issued from 2024 in Beijing and Chongqing. National rules for L3 sale still in progress.' },
  },
  HWP: {
    eu: { status: 'permitted', rules: ['UN R157 (2023 amendment)'], note: 'R157 allows up to 130 km/h and system-initiated lane changes since 2023.' },
    us: { status: 'pilot', rules: [], note: 'No approvals at full highway speed yet.' },
    cn: { status: 'pilot', rules: ['MIIT L3/L4 access pilot (2023)'], note: 'Covered by the same pilot programme as ALKS.' },
  },
  AVP: {
    eu: { status: 'pilot', rules: ['ISO 23374', 'EU 2022/1426'], note: 'First driverless parking approval in a Stuttgart car park (2022).' },
    us: { status: 'pilot', rules: [], note: 'Demonstrations only.' },
    cn: { status: 'pilot', rules: ['GB/T 41630-2022'], note: 'Memory parking (car repeats a learned route) is a mass-market feature; true driverless valet is in pilots.' },
  },
  URBAN_L4: {
    eu: { status: 'pilot', rules: ['EU 2022/1426', 'Germany AFGBV'], note: 'Small-series approval framework exists. Services are limited pilots with safety drivers or remote supervisors.' },
    us: { status: 'permitted', rules: ['California DMV and CPUC permits', 'NHTSA SGO 2021-01'], note: 'Commercial driverless robotaxi services operate in several cities. Permits are state and city level.' },
    cn: { status: 'permitted', rules: ['Municipal ICV pilot regulations', 'Shenzhen ICV Regulation 2022'], note: 'Fully driverless commercial services in Wuhan and Beijing since 2023 under city permits. The largest robotaxi fleets outside the US.' },
  },
}
