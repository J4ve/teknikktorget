/* TeknikkTorget — Product Catalog
   Blueprint §5.2: Card schema = badge, image, name, desc, price, rating, CTA, Quick View.
   Blueprint §5.3: Filterable specs (motorPower, batteryType, brand, scale).

   Image sourcing strategy:
   - Each product has a primary `img` and a 2-3 image `gallery` (Unsplash + qwenlm AI assets)
   - All URLs are direct CDN links (no placeholders) with onerror fallback to Material Symbol icon

   Norwegian (Bokmål) translations inline per product so the language toggle can swap on the fly.
*/

const TT_PRODUCTS = [
  {
    id: 1,
    name: "AeroPro X4 Professional Quadcopter",
    brand: "AeroPro",
    category: "drones",
    price: 8490,
    salePrice: 7290,
    img: "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=1200&h=900&fit=crop"
    ],
    icon: "flight",
    badge: "Sale",
    rating: 4.5,
    reviews: 128,
    desc: "Professional cinema-grade quadcopter with 4K/60fps gimbal, 8 km range, and omnidirectional obstacle sensing.",
    descNo: "Profesjonell kinodrone med 4K/60fps gimbal, 8 km rekkevidde og hindringsdeteksjon i alle retninger.",
    chips: ["4K 60FPS", "8km Range", "43min Flight"],
    chipsNo: ["4K 60FPS", "8 km rekkevidde", "43 min flytid"],
    specs: {
      Camera: "4/3 CMOS Hasselblad",
      "Flight Time": "43 min",
      Range: "8 km",
      Weight: "958 g",
      Resolution: "4K/60fps",
      "Obstacle Sensing": "Omnidirectional"
    },
    motorPower: "High",
    batteryType: "LiPo 4S",
    scale: ""
  },
  {
    id: 2,
    name: "VoltRider Pro Electric Scooter",
    brand: "VoltRider",
    category: "vehicles",
    price: 12900,
    img: "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1572613230600-c4dd8d3ac63a?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=1200&h=900&fit=crop"
    ],
    icon: "electric_scooter",
    badge: "New",
    rating: 5,
    reviews: 42,
    desc: "Foldable 1000W electric scooter with 50 km range, 35 km/h top speed, and IP54 rating.",
    descNo: "Sammenleggbar 1000 W elsparkesykkel med 50 km rekkevidde, 35 km/t toppfart og IP54-godkjenning.",
    chips: ["1000W", "50km Range", "IP54"],
    chipsNo: ["1000 W", "50 km rekkevidde", "IP54"],
    specs: {
      Motor: "1000W Brushless",
      Range: "50 km",
      "Top Speed": "35 km/h",
      Weight: "16.4 kg",
      "Charge Time": "5 hours",
      "Water Rating": "IP54"
    },
    motorPower: "1000W",
    batteryType: "Li-ion 48V",
    scale: ""
  },
  {
    id: 3,
    name: "CoreDev IoT Development Board V2",
    brand: "CoreDev",
    category: "electronics",
    price: 450,
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=1200&h=900&fit=crop"
    ],
    icon: "memory",
    badge: "",
    rating: 4,
    reviews: 89,
    desc: "ARM Cortex-M4 dev board with WiFi 6, BLE 5.2, and 40 GPIO pins for rapid prototyping.",
    descNo: "ARM Cortex-M4 utviklingskort med WiFi 6, BLE 5.2 og 40 GPIO-pinner for rask prototyping.",
    chips: ["ARM Cortex-M4", "WiFi/BLE"],
    chipsNo: ["ARM Cortex-M4", "WiFi/BLE"],
    specs: {
      MCU: "ARM Cortex-M4 @ 240 MHz",
      Memory: "8 MB Flash, 512 KB RAM",
      Wireless: "WiFi 6 + BLE 5.2",
      GPIO: "40 pins",
      Power: "USB-C / 3.3V",
      Toolchain: "Arduino + PlatformIO"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 4,
    name: "PrintMaster Pro Enclosed 3D Printer",
    brand: "PrintMaster",
    category: "tools",
    price: 6200,
    img: "https://images.unsplash.com/photo-1631710565131-fbcebbe27c44?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1631710565131-fbcebbe27c44?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1612886623474-26c4cf64a93e?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1635355956305-cccfae67e0d9?w=1200&h=900&fit=crop"
    ],
    icon: "deployed_code",
    badge: "",
    rating: 5,
    reviews: 215,
    desc: "Enclosed CoreXY 3D printer with auto-leveling, 300×300×350 mm build volume, dual cooling.",
    descNo: "Innelukket CoreXY 3D-skriver med automatisk nivellering, 300×300×350 mm byggevolum og dobbel kjøling.",
    chips: ["Auto-Leveling", "CoreXY", "300³ mm"],
    chipsNo: ["Auto-nivellering", "CoreXY", "300³ mm"],
    specs: {
      Volume: "300×300×350 mm",
      Kinematics: "CoreXY",
      Leveling: "Auto (BL-Touch)",
      "Max Speed": "500 mm/s",
      "Max Temp": "300 °C nozzle / 110 °C bed",
      Connectivity: "WiFi + USB-C"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 5,
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "electronics",
    price: 3490,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=1200&h=900&fit=crop"
    ],
    icon: "headphones",
    badge: "",
    rating: 4.5,
    reviews: 312,
    desc: "Industry-leading noise canceling with 30-hour battery, multipoint connection, LDAC support.",
    descNo: "Markedsledende støydemping med 30 timers batteri, multipoint-tilkobling og LDAC-støtte.",
    chips: ["ANC", "30h Battery", "LDAC"],
    chipsNo: ["ANC", "30 t batteri", "LDAC"],
    specs: {
      Driver: "30 mm Carbon Fiber",
      Battery: "30 hours",
      "Noise Canceling": "Auto NC Optimizer",
      Weight: "250 g",
      Bluetooth: "5.2",
      Codec: "LDAC, AAC"
    },
    motorPower: "",
    batteryType: "Li-ion",
    scale: ""
  },
  {
    id: 6,
    name: "Mountain E-Bike 750W",
    brand: "TrailWatt",
    category: "vehicles",
    price: 18990,
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=900&fit=crop"
    ],
    icon: "directions_bike",
    badge: "New",
    rating: 4.5,
    reviews: 76,
    desc: "Full-suspension 750W mid-drive e-bike, 100 km range, Shimano 11-speed, hydraulic disc brakes.",
    descNo: "750 W el-terrengsykkel med fjæring foran og bak, 100 km rekkevidde, Shimano 11-trinns og hydrauliske skivebremser.",
    chips: ["750W Mid-drive", "100km Range"],
    chipsNo: ["750 W middrev", "100 km rekkevidde"],
    specs: {
      Motor: "750W Mid-drive",
      Battery: "720 Wh",
      Range: "100 km",
      Gears: "Shimano 11-speed",
      Brakes: "Hydraulic Disc",
      Weight: "23 kg"
    },
    motorPower: "750W",
    batteryType: "Li-ion 48V",
    scale: ""
  },
  {
    id: 7,
    name: "Racing Drone FPV Kit",
    brand: "AeroPro",
    category: "drones",
    price: 6990,
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=1200&h=900&fit=crop"
    ],
    icon: "rocket_launch",
    badge: "",
    rating: 4,
    reviews: 53,
    desc: "Complete FPV racing drone kit with digital goggles, controller, 3 batteries — ready to fly.",
    descNo: "Komplett FPV-racingdrone-pakke med digitale briller, kontroller og 3 batterier — klar til å fly.",
    chips: ["120 km/h", "FPV Goggles"],
    chipsNo: ["120 km/t", "FPV-briller"],
    specs: {
      "Top Speed": "120 km/h",
      Camera: "1080p 60fps",
      "Flight Time": "8 min/battery",
      Batteries: "3× LiPo 4S",
      Goggles: "5.8 GHz Digital",
      Weight: "410 g"
    },
    motorPower: "2400KV",
    batteryType: "LiPo 4S",
    scale: ""
  },
  {
    id: 8,
    name: "Smart Home Hub Pro",
    brand: "NodeNest",
    category: "electronics",
    price: 1290,
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&h=900&fit=crop"
    ],
    icon: "home_iot_device",
    badge: "New",
    rating: 4,
    reviews: 94,
    desc: "Central hub for smart devices — Zigbee, Z-Wave, Matter, WiFi 6E, voice control.",
    descNo: "Sentral hub for smartenheter — Zigbee, Z-Wave, Matter, WiFi 6E og talestyring.",
    chips: ["Matter", "WiFi 6E"],
    chipsNo: ["Matter", "WiFi 6E"],
    specs: {
      Protocols: "Zigbee, Z-Wave, Matter",
      WiFi: "WiFi 6E",
      Display: "7-inch touchscreen",
      Voice: "Alexa + Google",
      Devices: "Up to 300",
      Power: "USB-C PD"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 9,
    name: "Precision Digital Caliper Set",
    brand: "MicroEdge",
    category: "tools",
    price: 690,
    img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&h=900&fit=crop"
    ],
    icon: "straighten",
    badge: "",
    rating: 4.5,
    reviews: 187,
    desc: "Stainless steel digital calipers with 0.01 mm resolution, IP54, Bluetooth data export.",
    descNo: "Digitalt skyvelær i rustfritt stål med 0,01 mm oppløsning, IP54 og Bluetooth-dataeksport.",
    chips: ["0.01mm", "IP54", "Bluetooth"],
    chipsNo: ["0,01 mm", "IP54", "Bluetooth"],
    specs: {
      Range: "0–200 mm",
      Resolution: "0.01 mm",
      Accuracy: "±0.02 mm",
      Material: "Hardened Stainless",
      Battery: "CR2032 (1500 h)",
      Output: "Bluetooth + USB"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 10,
    name: "RC Crawler 1:10 Scale 4WD",
    brand: "TerraClimb",
    category: "vehicles",
    price: 4290,
    img: "https://images.unsplash.com/photo-1623019033012-c1ed1de2eb8c?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1623019033012-c1ed1de2eb8c?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1581235720708-b8c52f6b3c3e?w=1200&h=900&fit=crop"
    ],
    icon: "directions_car",
    badge: "",
    rating: 4,
    reviews: 61,
    desc: "1:10 scale 4WD rock crawler, 540 brushed motor, waterproof ESC, oil-filled shocks.",
    descNo: "1:10 skala 4WD steinklatrer med 540 børsteanker-motor, vanntett ESC og oljefylte støtdempere.",
    chips: ["1:10", "4WD", "Waterproof"],
    chipsNo: ["1:10", "4WD", "Vanntett"],
    specs: {
      Scale: "1:10",
      Drive: "4WD shaft-driven",
      Motor: "540 Brushed",
      ESC: "60A Waterproof",
      Battery: "7.4V 3000 mAh LiPo",
      "Run Time": "35 min"
    },
    motorPower: "540 Brushed",
    batteryType: "LiPo 2S",
    scale: "1:10"
  },
  {
    id: 11,
    name: "ServoBot 6-Axis Robotic Arm",
    brand: "RoboKit",
    category: "robotics",
    price: 5490,
    img: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=900&fit=crop"
    ],
    icon: "precision_manufacturing",
    badge: "",
    rating: 4.5,
    reviews: 38,
    desc: "Educational 6-axis robotic arm with metal gears, 500 g payload, Python + ROS API.",
    descNo: "Pedagogisk 6-akset robotarm med metallgir, 500 g nyttelast og Python + ROS API.",
    chips: ["6-Axis", "ROS"],
    chipsNo: ["6-akset", "ROS"],
    specs: {
      Axes: "6 DoF",
      Payload: "500 g",
      Reach: "420 mm",
      Repeatability: "±0.5 mm",
      Control: "Python / ROS / Arduino",
      Power: "12 V / 5 A"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 12,
    name: "Solar Panel Kit 400W",
    brand: "SunForge",
    category: "components",
    price: 5990,
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1200&h=900&fit=crop"
    ],
    icon: "solar_power",
    badge: "",
    rating: 4.5,
    reviews: 102,
    desc: "Portable 400W solar panel kit with MPPT controller and 1000W pure sine inverter.",
    descNo: "Bærbart 400 W solcellepanelsett med MPPT-regulator og 1000 W ren sinus-omformer.",
    chips: ["400W", "MPPT"],
    chipsNo: ["400 W", "MPPT"],
    specs: {
      Output: "400 W Peak",
      Panels: "2× 200 W Mono",
      Inverter: "1000 W Pure Sine",
      Controller: "MPPT 30 A",
      "Weight/panel": "12 kg",
      Warranty: "25 years"
    },
    motorPower: "",
    batteryType: "Solar",
    scale: ""
  },
  {
    id: 13,
    name: "GPS Tracker Pro 4G",
    brand: "TrackLite",
    category: "electronics",
    price: 790,
    img: "https://images.unsplash.com/photo-1577538928305-3807c3993047?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1577538928305-3807c3993047?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1560732488-7b5e485f6504?w=1200&h=900&fit=crop"
    ],
    icon: "location_on",
    badge: "",
    rating: 4,
    reviews: 71,
    desc: "Real-time 4G LTE GPS tracker with 2-week battery, geofencing, IP67 rating.",
    descNo: "4G LTE GPS-sporer i sanntid med 2 ukers batteri, geofencing og IP67-klassifisering.",
    chips: ["4G LTE", "IP67"],
    chipsNo: ["4G LTE", "IP67"],
    specs: {
      Network: "4G LTE Cat-1",
      Battery: "2 weeks",
      Accuracy: "2.5 m",
      Waterproof: "IP67",
      Geofencing: "Yes",
      App: "iOS + Android"
    },
    motorPower: "",
    batteryType: "Li-ion",
    scale: ""
  },
  {
    id: 14,
    name: "AA Lithium Batteries (8-Pack)",
    brand: "Energizer",
    category: "components",
    price: 129,
    img: "https://images.unsplash.com/photo-1620678398812-a9bea5d44c70?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1620678398812-a9bea5d44c70?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1620478184729-15ade7434c0a?w=1200&h=900&fit=crop"
    ],
    icon: "battery_full",
    badge: "",
    rating: 4.5,
    reviews: 421,
    desc: "Long-lasting lithium AA batteries with 20-year shelf life. Ideal for high-drain devices.",
    descNo: "Langtidsholdbare litium AA-batterier med 20 års lagringstid. Ideelt for strømkrevende enheter.",
    chips: ["20yr Shelf", "High-drain"],
    chipsNo: ["20 års lagring", "Høy belastning"],
    specs: {
      Type: "Lithium AA",
      Count: "8 pack",
      Voltage: "1.5 V",
      "Shelf Life": "20 years",
      Temperature: "-40 °C to +60 °C"
    },
    motorPower: "",
    batteryType: "Lithium",
    scale: ""
  },
  {
    id: 15,
    name: "Fast Home EV Charger 7.7kW",
    brand: "ChargeForge",
    category: "components",
    price: 1990,
    img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1611174743420-3d7df880ce32?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1633707578596-7c79d2f53f95?w=1200&h=900&fit=crop"
    ],
    icon: "ev_station",
    badge: "",
    rating: 4.5,
    reviews: 56,
    desc: "Universal Level-2 EV charger, 32 A, 7.68 kW, app-controlled, UL listed.",
    descNo: "Universell nivå 2 EV-lader, 32 A, 7,68 kW, appstyrt, UL-godkjent.",
    chips: ["7.68 kW", "App"],
    chipsNo: ["7,68 kW", "App"],
    specs: {
      Power: "7.68 kW",
      Voltage: "240 V / 32 A",
      Cable: "7.5 m",
      Connector: "Type 2 / J1772",
      Certification: "UL Listed",
      Smart: "WiFi + App"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 16,
    name: "ServoLine MG996R (4-Pack)",
    brand: "RoboKit",
    category: "robotics",
    price: 290,
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&h=640&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&h=900&fit=crop"
    ],
    badge: "Sale",
    salePrice: 220,
    rating: 4,
    reviews: 198,
    desc: "Metal-gear high-torque servos, 11 kg·cm @ 6 V, ideal for robotics and RC.",
    descNo: "Metallgir-servoer med høyt dreiemoment, 11 kg·cm @ 6 V, ideelt for robotikk og RC.",
    chips: ["11kg·cm", "Metal Gear"],
    chipsNo: ["11 kg·cm", "Metallgir"],
    icon: "settings_input_component",
    specs: {
      Torque: "11 kg·cm @ 6 V",
      Speed: "0.14 s/60° @ 6 V",
      Voltage: "4.8–7.2 V",
      Gears: "Metal",
      Weight: "55 g each",
      Count: "4 servos"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  }
];

const TT_CATEGORIES = [
  { id: "electronics", label: "Electronics", labelNo: "Elektronikk",  icon: "memory" },
  { id: "robotics",    label: "Robotics",    labelNo: "Robotikk",     icon: "smart_toy" },
  { id: "tools",       label: "Tools",       labelNo: "Verktøy",      icon: "build" },
  { id: "components",  label: "Components",  labelNo: "Komponenter",  icon: "settings_input_component" },
  { id: "drones",      label: "Drones",      labelNo: "Droner",       icon: "flight" },
  { id: "vehicles",    label: "Vehicles",    labelNo: "Kjøretøy",     icon: "electric_scooter" }
];

window.TT_PRODUCTS   = TT_PRODUCTS;
window.TT_CATEGORIES = TT_CATEGORIES;
