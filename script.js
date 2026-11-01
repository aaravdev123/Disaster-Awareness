const disasterProfiles = {
  flood: {
    name: 'Floods',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/KatrinaNewOrleansFlooded_edit2.jpg',
    imageAlt: 'Aerial view of flooded roads in New Orleans after Hurricane Katrina',
    imageSource: 'https://commons.wikimedia.org/wiki/File:KatrinaNewOrleansFlooded_edit2.jpg',
    imageCredit: 'Photo: U.S. Coast Guard / Petty Officer 2nd Class Kyle Niemi (public domain)',
    intro: 'Floods are rapid rises in water that can overwhelm rivers, drains, roads, and homes, often after persistent rain or cyclones.',
    overview: 'Flooding is one of the most widespread and destructive disasters, affecting homes, transport, agriculture, and public health in urban and rural areas.',
    keyFacts: ['Floodwater can rise in minutes during intense rain or dam release events', 'Standing water often hides hidden hazards like debris, electrical lines, and contamination', 'Floods can disrupt drinking water, sanitation, and emergency access for days'],
    whyItMatters: 'Even a few centimetres of flowing water can knock people off balance and seriously damage buildings, roads, and farmland.',
    causes: ['Heavy rainfall and storms', 'River overflow and urban drainage failure', 'Cyclones and coastal surges', 'Dam or embankment failures'],
    warningSigns: ['Rapidly rising river levels', 'Persistent heavy rain in vulnerable zones', 'Blocked drains and overflowing streams', 'Warnings from local authorities and weather agencies'],
    riskFactors: ['Low-lying areas and river basins', 'Dense urban settlements with poor drainage', 'People living in informal housing', 'Communities near coastlines and floodplains'],
    effects: ['Loss of life and injuries', 'Property and crop damage', 'Water contamination and disease', 'Disruption of transport and emergency services'],
    prevention: ['Improve drainage and flood barriers', 'Protect floodplains and wetlands', 'Establish early warning systems', 'Build resilient housing and infrastructure'],
    before: ['Keep emergency kits ready', 'Store valuables above ground level', 'Know local flood routes and safe shelters', 'Follow official weather and flood advisories'],
    during: ['Move to higher ground if advised', 'Avoid roads and riverbanks', 'Turn off electrical appliances if safe', 'Listen to official broadcasts and emergency authorities'],
    after: ['Check for injuries and structural damage', 'Avoid floodwater and contaminated food', 'Report damaged infrastructure to authorities', 'Reconnect with local support networks'],
    resources: ['India Meteorological Department', 'National Disaster Management Authority', 'Local district disaster management offices']
  },
  earthquake: {
    name: 'Earthquakes',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/2023_Turkey_Earthquake_Damage_Diyarbakir.jpg/1280px-2023_Turkey_Earthquake_Damage_Diyarbakir.jpg',
    imageAlt: 'Buildings damaged by the 2023 Turkey earthquake in Diyarbakir',
    imageSource: 'https://commons.wikimedia.org/wiki/File:2023_Turkey_Earthquake_Damage_Diyarbakir.jpg',
    intro: 'Earthquakes are sudden ground shaking caused by movement in the Earth’s crust, often with little warning.',
    overview: 'Earthquakes can strike without notice, damaging buildings, roads, utilities, and critical infrastructure in moments.',
    keyFacts: ['The shaking can last only seconds but cause widespread destruction', 'Aftershocks may continue for days or weeks after the main event', 'Older buildings and weak foundations are often the most vulnerable'],
    whyItMatters: 'Preparedness, safe building design, and rapid response reduce injuries and protect families in high-risk zones.',
    causes: ['Movement along tectonic faults', 'Volcanic activity', 'Deep underground stress release'],
    warningSigns: ['Foreshocks or unusual seismic activity', 'Ground cracks or sudden changes in water levels', 'Warnings from seismological agencies'],
    riskFactors: ['Areas near active fault lines', 'Old or poorly built structures', 'Dense urban zones with vulnerable infrastructure'],
    effects: ['Collapsed buildings and injuries', 'Landslides and secondary hazards', 'Power and communication outages', 'Long-term displacement and trauma'],
    prevention: ['Retrofitting vulnerable structures', 'Building code enforcement', 'Public awareness and drills', 'Seismic risk mapping and safer land use'],
    before: ['Secure heavy furniture and appliances', 'Prepare emergency kits and contact plans', 'Learn Drop, Cover, and Hold On drills', 'Identify safe exits and meeting points'],
    during: ['Drop to the ground, cover your head', 'Stay away from windows and heavy objects', 'Do not use lifts or rush outdoors unless it is safe', 'After shaking stops, move carefully to safe areas'],
    after: ['Check for injuries and trapped persons', 'Avoid damaged buildings and utility lines', 'Follow official instructions and safety checks', 'Expect aftershocks and remain alert'],
    resources: ['National Centre for Seismology', 'State disaster management authorities', 'Local emergency responders']
  },
  cyclone: {
    name: 'Cyclones',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Severe_Tropical_Cyclone_Yasi_storm_damage_in_Townsville.jpg/1280px-Severe_Tropical_Cyclone_Yasi_storm_damage_in_Townsville.jpg',
    imageAlt: 'Storm damage in Townsville after Severe Tropical Cyclone Yasi',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Severe_Tropical_Cyclone_Yasi_storm_damage_in_Townsville.jpg',
    intro: 'Cyclones are intense rotating storms that bring extremely strong winds, heavy rainfall, and storm surges to coastal areas.',
    overview: 'Cyclones can devastate coastal communities through flooding, destructive winds, damaged infrastructure, and long power outages.',
    keyFacts: ['Storm surge can rise above normal sea levels and flood coastal settlements', 'Strong winds may damage roofs, power lines, and transport networks', 'Cyclones can cause both direct wind damage and major flooding'],
    whyItMatters: 'Early warnings and safe evacuation routes save lives when wind speeds and surge risk rise quickly.',
    causes: ['Warm ocean waters', 'Low-pressure systems', 'Moist tropical air movement'],
    warningSigns: ['Issued cyclone warnings from meteorological services', 'Rapid atmospheric pressure drops', 'Strong winds and heavy rain', 'Rising coastal water'],
    riskFactors: ['Coastal and low-lying communities', 'Poorly built shelters and weak infrastructure', 'Fishing and island communities'],
    effects: ['Wind damage to homes and crops', 'Storm surge flooding', 'Power outages and transport disruption', 'Saltwater contamination and long recovery periods'],
    prevention: ['Coastal planning and mangrove protection', 'Cyclone shelters and robust building codes', 'Early warning communication', 'Community preparedness and evacuation drills'],
    before: ['Prepare emergency supplies and documents', 'Secure loose building materials', 'Plan evacuation routes and shelter locations', 'Listen for official weather alerts'],
    during: ['Stay indoors in a safe shelter if advised', 'Avoid windows and exposed open spaces', 'Keep emergency lights and devices ready', 'Follow evacuation instructions from authorities'],
    after: ['Avoid floodwater and fallen power lines', 'Check for injuries and property damage', 'Wait for official clearance before returning', 'Support neighbours and document losses for aid'],
    resources: ['India Meteorological Department', 'District administration', 'Cyclone shelters and state disaster offices']
  },
  wildfire: {
    name: 'Wildfires',
    image: 'https://assets.weforum.org/article/image/-L0GyMp8B2tXCG0P7XOTjPAESmjDUoMfAZ23x6EkMlg.JPG?w=768',
    imageAlt: 'Flames rise as a wildfire burns near Monokaria on the Greek island of Evia',
    imageSource: 'https://www.weforum.org/stories/nature-and-biodiversity/wildfires-around-the-world-in-pictures/',
    imageCredit: 'Photo: Nicolas Economou/Reuters via World Economic Forum',
    intro: 'Wildfires spread rapidly through dry vegetation, forests, and grasslands, especially during heatwaves and strong winds.',
    overview: 'Wildfires can destroy homes, affect air quality, burn wildlife habitats, and force large-scale evacuations.',
    keyFacts: ['Wildfires can move unpredictably with sudden wind shifts', 'Smoke can affect health far beyond the burning area', 'Dry fuel, heat, and wind create the most dangerous conditions'],
    whyItMatters: 'Timely detection, evacuation, and firebreak planning can reduce both damage and loss of life.',
    causes: ['Dry vegetation and heat', 'Lightning or accidental ignition', 'Human activity near fire-prone areas'],
    warningSigns: ['Dry conditions with strong winds', 'Visible smoke or fire fronts', 'High temperatures and reduced humidity'],
    riskFactors: ['Dry forests and grasslands', 'Communities near fire-prone land', 'Poorly managed fuel loads around settlements'],
    effects: ['Habitat loss and animal fatalities', 'Air pollution and health impacts', 'Property destruction and evacuations', 'Loss of livelihoods and utilities'],
    prevention: ['Controlled burns and land management', 'Firebreaks and safer building practices', 'Public education and fire bans', 'Monitoring with satellite and ground teams'],
    before: ['Prepare an emergency evacuation kit', 'Create defensible space around homes', 'Know routes and community alert systems', 'Follow local fire warnings and restrictions'],
    during: ['Leave early if advised to evacuate', 'Stay away from smoke and fire fronts', 'Protect airways and follow local guidance', 'Avoid roads blocked by fire or smoke'],
    after: ['Watch for hot spots and ash fallout', 'Check air quality and health advisories', 'Avoid returning too early', 'Assist local community recovery and rebuilding'],
    resources: ['Forest departments', 'State fire services', 'Local disaster management cells']
  },
  drought: {
    name: 'Droughts',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Cracked_earth_after_prolonged_drought._2020.jpg/1280px-Cracked_earth_after_prolonged_drought._2020.jpg',
    imageAlt: 'Cracked, dry ground after a prolonged drought',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Cracked_earth_after_prolonged_drought._2020.jpg',
    intro: 'Droughts are prolonged periods of low rainfall that strain water supplies, crops, and livelihoods over time.',
    overview: 'Droughts often develop slowly but can have long-lasting consequences for food security, health, and rural economies.',
    keyFacts: ['Drought risk may build for months before its effects are obvious', 'Water scarcity affects agriculture, sanitation, and household planning', 'Heat and poor soil conditions can worsen the damage'],
    whyItMatters: 'Early action—water conservation, crop planning, and monitoring—can reduce suffering before severe shortages begin.',
    causes: ['Low rainfall over extended periods', 'Climate variability and heat stress', 'Groundwater depletion and poor water management'],
    warningSigns: ['Low rainfall and depleted reservoirs', 'Crop stress and failing water supply', 'Extended heat periods and poor pasture conditions'],
    riskFactors: ['Agricultural communities and water-stressed regions', 'Rural economies dependent on rain-fed systems', 'Areas with poor irrigation and groundwater use'],
    effects: ['Crop failure and food insecurity', 'Water shortages and migration', 'Animal distress and economic losses', 'Health stress and conflict over resources'],
    prevention: ['Water harvesting and efficient irrigation', 'Drought-tolerant crops and soil management', 'Groundwater regulation and planning', 'Preparedness for vulnerable households'],
    before: ['Store water and emergency supplies', 'Plan for reduced agricultural output', 'Protect livestock and crops', 'Monitor rainfall and local alerts'],
    during: ['Conserve water and use it carefully', 'Protect crops and reduce watering waste', 'Support vulnerable neighbours and families', 'Follow local advisories on water use'],
    after: ['Assess crop losses and livelihood support needs', 'Restore damaged water systems', 'Develop recovery plans for agriculture and water security', 'Support community resilience planning'],
    resources: ['State agriculture departments', 'Water resource agencies', 'Local livelihood support programmes']
  },
  landslide: {
    name: 'Landslides',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Landslide_Attaabad.jpg/1280px-Landslide_Attaabad.jpg',
    imageAlt: 'A large landslide covering the landscape at Attabad',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Landslide_Attaabad.jpg',
    intro: 'Landslides are sudden downhill movements of rock, soil, or debris triggered by slope instability and heavy rain.',
    overview: 'Landslides are common in hilly and mountainous areas and can bury roads, homes, and entire communities in a matter of minutes.',
    keyFacts: ['Heavy rain can make slopes unstable even where there is no visible cracking', 'Landslides often follow earthquakes, storms, or human disturbance on steep slopes', 'Small slips can turn into major debris flows quickly'],
    whyItMatters: 'Slope mapping, drainage control, and early warning can reduce the risk to vulnerable settlements.',
    causes: ['Heavy rainfall and slope saturation', 'Deforestation and erosion', 'Earthquakes and blasting', 'Weak or unstable terrain'],
    warningSigns: ['Cracks in slopes or roads', 'Tilting trees or utility poles', 'Sudden water seepage or muddy flow', 'Heavy rain in steep terrain'],
    riskFactors: ['Hilly districts and mountain communities', 'Areas affected by deforestation', 'Regions near unstable slopes and roads'],
    effects: ['Blocked roads and lost connectivity', 'Homes damaged or buried', 'Death and injuries', 'Damage to water and power infrastructure'],
    prevention: ['Slope stabilisation and drainage', 'Land-use planning and forest protection', 'Mapping high-risk zones', 'Early warning and public awareness'],
    before: ['Know hazardous slopes and safe routes', 'Avoid building in vulnerable areas', 'Prepare a safe evacuation plan', 'Monitor local weather and landslide alerts'],
    during: ['Move away from the slope immediately', 'Do not travel on unstable roads', 'Avoid river channels and debris flows', 'Follow local emergency instructions'],
    after: ['Stay away from damaged slopes', 'Check for blocked roads and utilities', 'Assist injured persons and local teams', 'Avoid re-entering unstable areas until cleared'],
    resources: ['Geological survey organisations', 'District disaster management authorities', 'State public works departments']
  },
  tsunami: {
    name: 'Tsunamis',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Hilo_after_Tsunami_1960.jpg',
    imageAlt: 'Damage in Hilo, Hawaii, after the 1960 tsunami',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Hilo_after_Tsunami_1960.jpg',
    intro: 'Tsunamis are large sea waves generated by undersea earthquakes, landslides, or volcanic activity.',
    overview: 'Tsunamis travel quickly across the ocean and can flood low-lying coastal settlements with little warning once they reach shore.',
    keyFacts: ['A tsunami may come as a series of waves, not a single surge', 'The first wave may not be the largest', 'Coastal areas can be hit with little time to react if warnings are missed'],
    whyItMatters: 'Evacuation in the first minutes matters most, especially in coastal communities near earthquake zones.',
    causes: ['Undersea earthquakes', 'Volcanic eruptions', 'Underwater landslides or coastal collapse'],
    warningSigns: ['Strong earthquake near the coast', 'Sudden sea retreat or unusual wave behaviour', 'Official tsunami warnings from coastal agencies'],
    riskFactors: ['Low-lying coastal communities', 'Areas near subduction zones', 'Villages and towns with limited evacuation routes'],
    effects: ['Coastal flooding and loss of life', 'Damage to homes and infrastructure', 'Saline contamination and loss of livelihoods', 'Disruption of fishing and ports'],
    prevention: ['Coastal risk maps and tidal barriers', 'Evacuation routes and safe shelters', 'Early warning communication', 'Public drills and community awareness'],
    before: ['Know your local evacuation route to higher ground', 'Prepare emergency kits and family plans', 'Monitor official warnings and coastal alerts', 'Identify safe meeting points'],
    during: ['Move inland or to high ground immediately', 'Do not stay near the coast to watch waves', 'Avoid rivers and estuaries where waves may travel inward', 'Heed official guidance'],
    after: ['Wait for all-clear messages before returning', 'Check for injuries and unsafe buildings', 'Watch for additional waves', 'Avoid coastal and debris-filled areas'],
    resources: ['Coastal disaster management authorities', 'National weather agencies', 'Tsunami warning centres']
  },
  industrial: {
    name: 'Industrial and chemical accidents',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/2009_Catano_refinery_explosion.jpg/1280px-2009_Catano_refinery_explosion.jpg',
    imageAlt: 'Fire and smoke during the 2009 Catano refinery explosion',
    imageSource: 'https://commons.wikimedia.org/wiki/File:2009_Catano_refinery_explosion.jpg',
    intro: 'Industrial and chemical accidents involve toxic releases, fires, explosions, or hazardous spills that can threaten workers and the public.',
    overview: 'These emergencies can contaminate air, water, and nearby land, requiring rapid evacuation, medical response, and environmental containment.',
    keyFacts: ['Chemical exposure can cause immediate symptoms or long-term health effects', 'Wind direction affects evacuation plans and shelter-in-place decisions', 'Industrial sites close to homes pose a major public risk'],
    whyItMatters: 'Preparedness, emergency planning, and clear communication help reduce deaths, injuries, and environmental damage.',
    causes: ['Unsafe storage or handling of hazardous materials', 'Equipment failure and poor maintenance', 'Industrial fires, leaks, and accidents'],
    warningSigns: ['Strong chemical odours', 'Unexplained sirens or emergency alerts', 'Visible burning, smoke, or leaking containers', 'Warnings from plant operators or authorities'],
    riskFactors: ['Communities near factories, oil depots, and storage sites', 'Poor emergency response planning', 'Workers and families without proper safety knowledge'],
    effects: ['Exposure to toxic substances', 'Burns, respiratory issues, and long-term health impacts', 'Environmental contamination and water pollution', 'Evacuations and economic disruption'],
    prevention: ['Safe storage, emergency response plans, and inspection regimes', 'Hazard communication and worker training', 'Industrial zoning away from dense settlements', 'Preparedness for high-risk industrial clusters'],
    before: ['Learn emergency routes and risk communication plans', 'Keep protective masks and information ready', 'Know when to shelter in place or evacuate', 'Understand local industrial hazard maps'],
    during: ['Follow official instructions immediately', 'Shelter indoors if advised, away from windows', 'Avoid contaminated water or air', 'Keep emergency contacts and local warning channels available'],
    after: ['Wait for authorities to declare areas safe', 'Avoid returning to affected zones without approval', 'Report symptoms or exposures to healthcare services', 'Support affected families and protective cleanup efforts'],
    resources: ['State pollution control boards', 'District industrial safety offices', 'Emergency response teams and local authorities']
  }
};

const disasterOrder = ['flood', 'earthquake', 'cyclone', 'wildfire', 'drought', 'landslide', 'tsunami', 'industrial'];

const disasterCardImages = {
  flood: 'https://images.unsplash.com/photo-1558947800-8d8df0ed5c14?auto=format&fit=crop&w=800&q=80',
  earthquake: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  cyclone: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
  wildfire: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
  drought: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fc8f6?auto=format&fit=crop&w=800&q=80',
  landslide: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=800&q=80',
  tsunami: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  industrial: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80'
};

const checklistItems = [
  'Drinking water',
  'Non-perishable food',
  'First-aid supplies',
  'Flashlight',
  'Extra batteries',
  'Essential medicines',
  'Important identification documents',
  'Emergency contact list',
  'Whistle',
  'Basic hygiene supplies',
  'Portable radio',
  'Essential clothing'
];

const communityOptions = [
  { value: 'rural', label: 'Rural communities', description: 'Support vulnerable villages and remote settlements.' },
  { value: 'urban', label: 'Urban communities', description: 'Help city families and neighbourhood emergency response.' },
  { value: 'children', label: 'Children affected by disasters', description: 'Protect schooling, safe spaces, and child welfare.' },
  { value: 'women', label: 'Women and vulnerable groups', description: 'Fund protection, wellbeing, and community support.' },
  { value: 'farmers', label: 'Farmers and agricultural communities', description: 'Support crop recovery and resilient livelihoods.' },
  { value: 'homeless', label: 'Homeless and displaced families', description: 'Deliver shelter, food, and recovery support.' },
  { value: 'remote', label: 'Remote and tribal communities', description: 'Reach isolated populations affected by emergencies.' },
  { value: 'general', label: 'General disaster-affected populations', description: 'Help communities with flexible emergency response needs.' }
];

const disasterOptions = [
  { value: 'floods', label: 'Floods' },
  { value: 'earthquakes', label: 'Earthquakes' },
  { value: 'cyclones', label: 'Cyclones' },
  { value: 'wildfires', label: 'Wildfires' },
  { value: 'droughts', label: 'Droughts' },
  { value: 'landslides', label: 'Landslides' },
  { value: 'tsunamis', label: 'Tsunamis' },
  { value: 'industrial-accidents', label: 'Industrial accidents' },
  { value: 'general-disaster-relief', label: 'General disaster relief' }
];

const assistanceOptions = [
  { value: 'food-and-water', label: 'Food and clean drinking water' },
  { value: 'medical-assistance', label: 'Medical assistance' },
  { value: 'temporary-shelters', label: 'Temporary shelters' },
  { value: 'rescue-and-evacuation', label: 'Rescue and evacuation' },
  { value: 'education-and-rehabilitation', label: 'Education and rehabilitation' },
  { value: 'rebuilding-homes', label: 'Rebuilding homes and infrastructure' },
  { value: 'general-emergency-relief', label: 'General emergency relief' }
];

const organizations = [
  {
    name: 'Indian Red Cross Society',
    region: 'India',
    logo: 'IRC',
    description: 'Supports disaster relief, emergency assistance, and community preparedness across India.',
    disasters: ['floods', 'earthquakes', 'cyclones', 'wildfires', 'general-disaster-relief'],
    communities: ['rural', 'urban', 'children', 'women', 'homeless', 'general'],
    assistance: ['food-and-water', 'medical-assistance', 'temporary-shelters', 'rescue-and-evacuation', 'general-emergency-relief'],
    url: 'https://indianredcross.org/',
    verified: 'Verified official donation page',
    generalRelief: true
  },
  {
    name: 'Goonj',
    region: 'India',
    logo: 'G',
    description: 'Works to provide relief, material support, and dignity-based recovery for disaster-affected communities.',
    disasters: ['floods', 'cyclones', 'landslides', 'general-disaster-relief'],
    communities: ['rural', 'urban', 'women', 'homeless', 'remote', 'general'],
    assistance: ['food-and-water', 'temporary-shelters', 'general-emergency-relief', 'education-and-rehabilitation'],
    url: 'https://goonj.org/',
    verified: 'Verified official donation page',
    generalRelief: true
  },
  {
    name: 'Habitat for Humanity India',
    region: 'India',
    logo: 'HFH',
    description: 'Focuses on safe housing, reconstruction, and long-term community rebuilding after disasters.',
    disasters: ['earthquakes', 'cyclones', 'floods', 'landslides', 'general-disaster-relief'],
    communities: ['rural', 'urban', 'homeless', 'general'],
    assistance: ['rebuilding-homes', 'temporary-shelters', 'general-emergency-relief'],
    url: 'https://www.habitatindia.org/',
    verified: 'Verified official donation page',
    generalRelief: true
  },
  {
    name: 'International Federation of Red Cross and Red Crescent Societies',
    region: 'Global',
    logo: 'IFRC',
    description: 'Supports disaster response, humanitarian assistance, and international emergency coordination.',
    disasters: ['floods', 'earthquakes', 'cyclones', 'wildfires', 'tsunamis', 'general-disaster-relief'],
    communities: ['rural', 'urban', 'children', 'women', 'remote', 'general'],
    assistance: ['medical-assistance', 'food-and-water', 'temporary-shelters', 'rescue-and-evacuation', 'general-emergency-relief'],
    url: 'https://www.ifrc.org/',
    verified: 'Verified official donation page',
    generalRelief: true
  },
  {
    name: 'UN Crisis Relief',
    region: 'Global',
    logo: 'UN',
    description: 'Coordinates urgent humanitarian response and crisis relief for people affected by major disasters.',
    disasters: ['general-disaster-relief', 'floods', 'cyclones', 'earthquakes', 'wildfires'],
    communities: ['children', 'women', 'homeless', 'remote', 'general'],
    assistance: ['food-and-water', 'medical-assistance', 'temporary-shelters', 'education-and-rehabilitation', 'general-emergency-relief'],
    url: 'https://crisisrelief.un.org/',
    verified: 'Verified official donation page',
    generalRelief: true
  },
  {
    name: 'National Disaster Response Fund / Government of India',
    region: 'India',
    logo: 'NDRF',
    description: 'Government disaster relief funding supports national and state level emergency response and rebuilding.',
    disasters: ['general-disaster-relief', 'floods', 'cyclones', 'earthquakes', 'droughts', 'landslides', 'industrial-accidents'],
    communities: ['rural', 'urban', 'farmers', 'remote', 'general'],
    assistance: ['food-and-water', 'temporary-shelters', 'rescue-and-evacuation', 'rebuilding-homes', 'general-emergency-relief'],
    url: 'https://ndma.gov.in/',
    verified: 'Verified official donation page',
    generalRelief: true
  }
];

const state = {
  step: 0,
  community: '',
  disaster: '',
  assistance: ''
};

function renderDisasterCards() {
  const grid = document.getElementById('disaster-grid');
  if (!grid) return;

  disasterOrder.forEach((key) => {
    const profile = disasterProfiles[key];
    const card = document.createElement('article');
    card.className = 'disaster-card';
    card.innerHTML = `
      <img src="${profile.image}" alt="${profile.imageAlt}" />
      <a class="photo-credit" href="${profile.imageSource}" target="_blank" rel="noopener noreferrer">${profile.imageCredit || 'Photo: Wikimedia Commons'}</a>
      <div class="disaster-card-content">
        <h3>${profile.name}</h3>
        <p>${profile.intro}</p>
        <button class="card-button" type="button" data-disaster="${key}">Learn More</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('[data-disaster]').forEach((button) => {
    button.addEventListener('click', () => {
      openDisasterModal(button.dataset.disaster);
    });
  });
}

function getLocationLabel(location) {
  return location.region ? `${location.name}, ${location.region}` : location.name;
}

function openDisasterModal(key) {
  const modal = document.getElementById('disaster-modal');
  const modalContent = document.getElementById('modal-content');
  const profile = disasterProfiles[key];

  if (!profile || !modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-content-header">
      <div>
        <img src="${profile.image}" alt="${profile.imageAlt}" />
        <a class="photo-credit" href="${profile.imageSource}" target="_blank" rel="noopener noreferrer">${profile.imageCredit || 'Photo: Wikimedia Commons'}</a>
      </div>
      <div>
        <p class="eyebrow eyebrow-dark">Disaster awareness</p>
        <h2 id="modal-title">${profile.name}</h2>
        <p>${profile.overview}</p>
        <p><strong>Why it matters:</strong> ${profile.whyItMatters}</p>
      </div>
    </div>

    <div class="modal-section">
      <h3>Key facts</h3>
      <ul>${profile.keyFacts.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Causes</h3>
      <ul>${profile.causes.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Warning signs</h3>
      <ul>${profile.warningSigns.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Risk factors</h3>
      <ul>${profile.riskFactors.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Effects</h3>
      <ul>${profile.effects.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Prevention and mitigation</h3>
      <ul>${profile.prevention.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Before the disaster</h3>
      <ul>${profile.before.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>During the disaster</h3>
      <ul>${profile.during.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>After the disaster</h3>
      <ul>${profile.after.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <h3>Emergency resources</h3>
      <ul>${profile.resources.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('disaster-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function renderChecklist() {
  const list = document.getElementById('checklist');
  if (!list) return;

  list.innerHTML = checklistItems.map((item, index) => `
    <li>
      <input type="checkbox" id="check-${index}" data-index="${index}" />
      <label for="check-${index}">${item}</label>
    </li>
  `).join('');

  list.querySelectorAll('input').forEach((checkbox) => {
    checkbox.addEventListener('change', updateChecklistProgress);
  });

  updateChecklistProgress();
}

function updateChecklistProgress() {
  const checklist = document.querySelectorAll('#checklist input');
  const progressText = document.getElementById('checklist-progress');
  if (!checklist.length || !progressText) return;

  const checked = [...checklist].filter((input) => input.checked).length;
  const percentage = Math.round((checked / checklist.length) * 100);
  progressText.textContent = `${percentage}% ready`;

  checklist.forEach((input) => {
    const item = input.closest('li');
    if (item) {
      item.classList.toggle('checked', input.checked);
    }
  });
}

function renderSafetyGuide(selected) {
  const guide = document.getElementById('safety-guide');
  if (!guide) return;

  const profile = disasterProfiles[selected] || disasterProfiles.flood;
  guide.innerHTML = `
    <div class="guide-block">
      <h4>Before the disaster</h4>
      <ul>${profile.before.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
    <div class="guide-block">
      <h4>During the disaster</h4>
      <ul>${profile.during.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
    <div class="guide-block">
      <h4>After the disaster</h4>
      <ul>${profile.after.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

function createOptionTile(label, description, group, value) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = 'option-tile';
  tile.dataset.group = group;
  tile.dataset.value = value;
  tile.innerHTML = `
    <h4>${label}</h4>
    <p>${description || ''}</p>
  `;

  tile.addEventListener('click', () => {
    const selectedGroup = group;
    const selectedValue = value;

    if (selectedGroup === 'community') state.community = selectedValue;
    if (selectedGroup === 'disaster') state.disaster = selectedValue;
    if (selectedGroup === 'assistance') state.assistance = selectedValue;

    updateSelectionStates();
  });

  return tile;
}

function updateSelectionStates() {
  document.querySelectorAll('.option-tile').forEach((tile) => {
    const { group, value } = tile.dataset;
    const selected =
      (group === 'community' && state.community === value) ||
      (group === 'disaster' && state.disaster === value) ||
      (group === 'assistance' && state.assistance === value);
    tile.classList.toggle('selected', selected);
  });
}

function renderDonationOptions() {
  const communityContainer = document.getElementById('community-options');
  const disasterContainer = document.getElementById('disaster-options');
  const assistanceContainer = document.getElementById('assistance-options');

  if (communityContainer) {
    communityContainer.innerHTML = '';
    communityOptions.forEach((option) => {
      communityContainer.appendChild(createOptionTile(option.label, option.description, 'community', option.value));
    });
  }

  if (disasterContainer) {
    disasterContainer.innerHTML = '';
    disasterOptions.forEach((option) => {
      disasterContainer.appendChild(createOptionTile(option.label, '', 'disaster', option.value));
    });
  }

  if (assistanceContainer) {
    assistanceContainer.innerHTML = '';
    assistanceOptions.forEach((option) => {
      assistanceContainer.appendChild(createOptionTile(option.label, '', 'assistance', option.value));
    });
  }
}

function showStep(stepIndex) {
  state.step = stepIndex;
  const steps = document.querySelectorAll('.finder-step');
  const progressNodes = document.querySelectorAll('#finder-progress span');

  steps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });

  progressNodes.forEach((node, index) => {
    node.classList.toggle('is-active', index === stepIndex);
  });

  const nextButton = document.getElementById('next-step');
  const backButton = document.getElementById('back-step');

  if (backButton) {
    backButton.disabled = stepIndex === 0;
    backButton.style.opacity = stepIndex === 0 ? '0.5' : '1';
  }

  if (nextButton) {
    nextButton.textContent = stepIndex === 3 ? 'View Matches' : 'Continue';
  }
}

function getSelectedOrganizationMatches() {
  const community = state.community;
  const disaster = state.disaster;
  const assistance = state.assistance;

  if (!community || !disaster || !assistance) {
    return [];
  }

  const matched = organizations.filter((org) => {
    const matchesCommunity = org.communities.includes(community) || org.communities.includes('general');
    const matchesDisaster = org.disasters.includes(disaster) || org.disasters.includes('general-disaster-relief');
    const matchesAssistance = org.assistance.includes(assistance) || org.assistance.includes('general-emergency-relief');
    return matchesCommunity && matchesDisaster && matchesAssistance;
  });

  if (matched.length) return matched;

  return organizations.filter((org) => org.generalRelief);
}

function getLabelForValue(group, value) {
  if (group === 'community') {
    return communityOptions.find((option) => option.value === value)?.label || value;
  }

  if (group === 'disaster') {
    return disasterOptions.find((option) => option.value === value)?.label || value;
  }

  if (group === 'assistance') {
    return assistanceOptions.find((option) => option.value === value)?.label || value;
  }

  return value;
}

function renderResults() {
  const results = document.getElementById('org-results');
  if (!results) return;

  const matched = getSelectedOrganizationMatches();

  if (matched.length === 0) {
    results.innerHTML = `
      <div class="empty-results">
        <p><strong>No exact match was found for your selected preferences.</strong></p>
        <p>We recommend starting with general disaster relief organisations that support emergency response and recovery.</p>
      </div>
    `;
    return;
  }

  const selectedCommunityLabel = getLabelForValue('community', state.community);
  const selectedDisasterLabel = getLabelForValue('disaster', state.disaster);
  const selectedAssistanceLabel = getLabelForValue('assistance', state.assistance);

  results.innerHTML = `
    <div class="finder-summary">
      <div><strong>Community:</strong> ${selectedCommunityLabel}</div>
      <div><strong>Disaster:</strong> ${selectedDisasterLabel}</div>
      <div><strong>Assistance:</strong> ${selectedAssistanceLabel}</div>
    </div>
  `;

  results.innerHTML += matched.map((org) => `
    <article class="org-card">
      <div class="org-logo">${org.logo}</div>
      <div class="org-details">
        <h4>${org.name}</h4>
        <p>${org.description}</p>
        <div class="org-meta">
          <span class="meta-pill">${org.region}</span>
          <span class="meta-pill">${org.verified}</span>
        </div>
        <p><strong>Why it matches:</strong> Supports ${selectedDisasterLabel.toLowerCase()} relief and assists ${selectedCommunityLabel.toLowerCase()} needs through ${selectedAssistanceLabel.toLowerCase()}.</p>
      </div>
      <div class="org-actions">
        <a class="button button-primary" href="${org.url}" target="_blank" rel="noreferrer">Donate on Official Website</a>
      </div>
    </article>
  `).join('');
}

function handleNextStep() {
  if (state.step === 0 && !state.community) {
    return;
  }

  if (state.step === 1 && !state.disaster) {
    return;
  }

  if (state.step === 2 && !state.assistance) {
    return;
  }

  if (state.step < 3) {
    showStep(state.step + 1);
    return;
  }

  renderResults();
}

function handleBackStep() {
  if (state.step > 0) {
    showStep(state.step - 1);
  }
}

function initialiseFinder() {
  renderDonationOptions();
  showStep(0);

  const nextButton = document.getElementById('next-step');
  const backButton = document.getElementById('back-step');

  if (nextButton) {
    nextButton.addEventListener('click', handleNextStep);
  }

  if (backButton) {
    backButton.addEventListener('click', handleBackStep);
  }
}

function bindModalEvents() {
  const modal = document.getElementById('disaster-modal');
  const closeButton = document.querySelector('.modal-close');

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

const communitySearches = {
  volunteer: [
    'disaster relief volunteer opportunities',
    'disaster response volunteer organizations',
    'community emergency response volunteer training'
  ],
  campaigns: [
    'disaster awareness campaigns and events',
    'flood earthquake fire safety awareness events',
    'disaster preparedness public safety campaigns'
  ],
  education: [
    'community disaster preparedness education programs',
    'disaster preparedness training workshops',
    'school and family emergency preparedness programs'
  ]
};

function renderCommunitySearchLinks(container, searches, area) {
  const cards = searches.map((search) => {
    const card = document.createElement('article');
    card.className = 'community-result-card';

    const heading = document.createElement('h4');
    heading.textContent = search;

    const description = document.createElement('p');
    description.textContent = `Google search near ${area}. Results are not verified listings.`;

    const link = document.createElement('a');
    const url = new URL('https://www.google.com/search');
    url.searchParams.set('q', `${search} near ${area}`);
    link.href = url.toString();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Search Google';

    card.append(heading, description, link);
    return card;
  });
  container.replaceChildren(...cards);
}

function showCommunitySearches(area, locationSource, status) {
  const searchArea = area.trim();
  if (!searchArea) {
    status.textContent = 'Enter a city, neighborhood, or postal code first.';
    return false;
  }

  document.querySelectorAll('[data-community-results]').forEach((container) => {
    const searches = communitySearches[container.dataset.communityResults];
    if (searches) renderCommunitySearchLinks(container, searches, searchArea);
  });
  status.textContent = `Showing Google search links for ${searchArea} (${locationSource}). Results may not be verified; confirm details with each organization.`;
  return true;
}

function initialiseCommunityAction() {
  const button = document.getElementById('community-location-button');
  const deviceButton = document.getElementById('community-device-location-button');
  const searchButton = document.getElementById('community-search-button');
  const locationInput = document.getElementById('community-location-input');
  const status = document.getElementById('community-location-status');
  if (!button || !deviceButton || !searchButton || !locationInput || !status) return;

  searchButton.addEventListener('click', () => {
    showCommunitySearches(locationInput.value, 'manually entered location', status);
  });

  deviceButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
      status.textContent = 'Device location is not available in this browser. Enter a location or use approximate IP lookup.';
      return;
    }

    deviceButton.disabled = true;
    status.textContent = 'Requesting permission to use your device location…';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
        locationInput.value = coordinates;
        showCommunitySearches(coordinates, 'device coordinates', status);
        deviceButton.disabled = false;
      },
      (error) => {
        console.error('Could not access device location:', error.message);
        status.textContent = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Enter a location or use approximate IP lookup.'
          : 'Could not get device location. Enter a location or use approximate IP lookup.';
        deviceButton.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });

  button.addEventListener('click', async () => {
    button.disabled = true;
    deviceButton.disabled = true;
    status.textContent = 'Estimating your area from your public IP…';

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error(`Location lookup failed with status ${response.status}`);
      }

      const location = await response.json();
      if (location.error) {
        throw new Error(location.reason || 'Location lookup was rejected');
      }

      const area = [location.city, location.region, location.country_name]
        .filter((part, index, parts) => part && parts.indexOf(part) === index)
        .join(', ');
      if (!area) {
        throw new Error('The location provider did not return a usable area');
      }

      locationInput.value = area;
      showCommunitySearches(area, 'approximate IP location', status);
    } catch (error) {
      console.error('Could not find nearby community action opportunities:', error);
      status.textContent = 'Could not estimate your area from IP. Enter a location or use device location instead.';
    } finally {
      button.disabled = false;
      deviceButton.disabled = false;
    }
  });
}

function initialiseSafetyGuide() {
  const selector = document.getElementById('disaster-select');
  if (!selector) return;

  renderSafetyGuide(selector.value);
  selector.addEventListener('change', (event) => {
    renderSafetyGuide(event.target.value);
  });
}

function initialiseHazardMap() {
  const mapElement = document.getElementById('hazard-map-canvas');
  const regionsElement = document.getElementById('hazard-map-regions');
  const filtersElement = document.getElementById('hazard-map-filters');
  const filterOptionsElement = document.getElementById('hazard-map-filter-options');
  const tectonicLegendElement = document.getElementById('hazard-map-tectonic-legend');
  const statusElement = document.getElementById('hazard-map-status');
  const titleElement = document.getElementById('hazard-map-info-title');
  const copyElement = document.getElementById('hazard-map-info-copy');
  const severitySelect = document.getElementById('hazard-map-severity');
  const periodSelect = document.getElementById('hazard-map-period');
  const activeCheckbox = document.getElementById('hazard-map-active');
  const detailElement = document.getElementById('hazard-map-info-detail');
  const eventCountElement = document.getElementById('hazard-map-event-count');
  const eventSeverityElement = document.getElementById('hazard-map-event-severity');
  const eventPeriodElement = document.getElementById('hazard-map-event-period');
  const countLabelElement = document.getElementById('hazard-map-count-label');
  const severityLabelElement = document.getElementById('hazard-map-severity-label');
  const periodLabelElement = document.getElementById('hazard-map-period-label');
  const eventListHeadingElement = document.getElementById('hazard-map-event-list-heading');
  const contextElement = document.getElementById('hazard-map-info-context');
  const eventListElement = document.getElementById('hazard-map-event-list');
  if (!mapElement || !regionsElement || !filtersElement || !filterOptionsElement || !tectonicLegendElement
    || !statusElement || !titleElement
    || !copyElement || !severitySelect || !periodSelect || !activeCheckbox || !detailElement
    || !eventCountElement || !eventSeverityElement || !eventPeriodElement || !countLabelElement
    || !severityLabelElement || !periodLabelElement || !eventListHeadingElement || !contextElement
    || !eventListElement) return;

  if (!window.L || typeof hazardRegionData === 'undefined'
    || !Array.isArray(hazardRegionData.faultLines)
    || !Array.isArray(hazardRegionData.indiaPins)
    || !Array.isArray(hazardRegionData.tectonicPlateLabels)) {
    statusElement.textContent = !window.L
      ? 'The map library could not be loaded. Check your internet connection and reload the page.'
      : 'Regional map, India pin, or fault-line data could not be loaded. Reload the page to try again.';
    return;
  }

  const worldBounds = window.L.latLngBounds([[-85.05112878, -180], [85.05112878, 180]]);
  const map = window.L.map(mapElement, {
    scrollWheelZoom: false,
    minZoom: 1,
    maxZoom: 12,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1
  }).setView([22.8, 82.5], 4);
  const tiles = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    noWrap: true,
    bounds: worldBounds,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  let tileErrorShown = false;
  tiles.on('tileerror', () => {
    if (tileErrorShown) return;
    tileErrorShown = true;
    statusElement.textContent = 'Some map tiles could not be loaded. Check your internet connection; the regional overlays remain available.';
  });

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = 'hazard-filter';
  allButton.textContent = 'All disasters';
  allButton.dataset.hazard = 'all';
  allButton.setAttribute('aria-pressed', 'true');
  filtersElement.append(allButton);

  hazardRegionData.categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hazard-filter hazard-category-filter';
    button.dataset.hazard = category.id;
    button.setAttribute('aria-pressed', 'true');
    const swatch = document.createElement('span');
    swatch.className = 'hazard-color-swatch';
    swatch.style.setProperty('--hazard-color', category.color);
    const label = document.createElement('span');
    label.textContent = category.label;
    button.append(swatch, label);
    filtersElement.append(button);
  });

  let activeRegion = 'india';
  let activeMode = 'hazards';
  const selectedCategories = new Set(hazardRegionData.categories.map((category) => category.id));
  let selectedFeatureId = null;
  let selectedFaultId = null;
  const categoryById = new Map(hazardRegionData.categories.map((category) => [category.id, category]));
  const features = hazardRegionData.features;
  const indiaPins = hazardRegionData.indiaPins;
  const severitySelectValue = () => severitySelect.value;
  const periodSelectValue = () => periodSelect.value;
  const activeOnly = () => activeCheckbox.checked;

  const eventLayer = window.L.geoJSON(null, {
    style: (feature) => {
      const color = categoryById.get(feature.properties.category).color;
      const selected = feature.properties.id === selectedFeatureId;
      return {
        className: 'hazard-region-layer',
        color,
        fillColor: color,
        opacity: 0.82,
        fillOpacity: selected ? 0.43 : 0.32,
        weight: selected ? 2.2 : 1.35,
        lineJoin: 'round'
      };
    },
    onEachFeature: (feature, layer) => {
      const properties = feature.properties;
      const category = categoryById.get(properties.category);
      layer.bindTooltip(`${properties.name} · ${category.label}`, {
        sticky: true,
        className: 'hazard-map-tooltip'
      });
      layer.on({
        mouseover: (event) => {
          event.target.setStyle({ fillOpacity: 0.46, weight: 2 });
        },
        mouseout: (event) => {
          eventLayer.resetStyle(event.target);
        },
        click: (event) => {
          selectedFeatureId = properties.id;
          eventLayer.setStyle((item) => ({
            fillOpacity: item.properties.id === selectedFeatureId ? 0.43 : 0.32,
            weight: item.properties.id === selectedFeatureId ? 2.2 : 1.35
          }));
          showFeatureDetails(feature, event.latlng);
          if (!map.getBounds().contains(event.latlng)) map.panTo(event.latlng);
        }
      });
    }
  }).addTo(map);

  const indiaPinLayer = window.L.geoJSON(null, {
    pointToLayer: (feature, latlng) => {
      const category = categoryById.get(feature.properties.category);
      const icon = window.L.divIcon({
        className: 'hazard-map-pin',
        html: `<span class="hazard-map-pin-shape" style="--pin-color:${category.color}"><svg viewBox="0 0 28 38" aria-hidden="true"><path d="M14 1C6.82 1 1 6.82 1 14c0 9.05 13 23 13 23s13-13.95 13-23C27 6.82 21.18 1 14 1Z" fill="currentColor"/><circle cx="14" cy="14" r="5" fill="#fff"/></svg></span>`,
        iconSize: [30, 40],
        iconAnchor: [15, 38],
        popupAnchor: [0, -34]
      });
      return window.L.marker(latlng, {
        icon,
        title: feature.properties.name,
        alt: `${feature.properties.name} disaster event`
      });
    },
    onEachFeature: (feature, layer) => {
      const category = categoryById.get(feature.properties.category);
      layer.bindTooltip(`${feature.properties.name} · ${category.label}`, {
        sticky: true,
        className: 'hazard-map-tooltip'
      });
      layer.on('click', (event) => {
        selectedFeatureId = feature.properties.id;
        selectedFaultId = null;
        showFeatureDetails(feature, event.latlng);
      });
    }
  }).addTo(map);

  const boundaryTypeById = new Map([
    ['san-andreas-fault', 'transform'],
    ['cascadia-subduction-boundary', 'convergent'],
    ['andes-subduction-zone', 'convergent'],
    ['mid-atlantic-ridge', 'divergent'],
    ['japan-kuril-trench', 'convergent'],
    ['sunda-trench', 'convergent'],
    ['himalayan-frontal-thrust', 'convergent'],
    ['east-african-rift', 'divergent'],
    ['north-anatolian-fault', 'transform'],
    ['alpine-fault', 'transform'],
    ['east-anatolian-fault', 'transform'],
    ['dead-sea-transform', 'transform'],
    ['zagros-thrust-belt', 'convergent'],
    ['sagaing-fault', 'transform'],
    ['philippine-fault', 'transform'],
    ['aleutian-subduction-zone', 'convergent'],
    ['central-america-trench', 'convergent'],
    ['lesser-antilles-subduction-zone', 'convergent'],
    ['tonga-kermadec-trench', 'convergent'],
    ['red-sea-rift', 'divergent'],
    ['east-pacific-rise', 'divergent'],
    ['mid-indian-ridge', 'divergent'],
    ['new-madrid-seismic-zone', 'intraplate'],
    ['alpine-himalayan-belt', 'convergent']
  ]);
  const boundaryStyles = {
    convergent: { label: 'Convergent / subduction', color: '#cf4545', dashArray: null },
    divergent: { label: 'Divergent / spreading', color: '#1686a0', dashArray: '9 4' },
    transform: { label: 'Transform / strike-slip', color: '#c27a20', dashArray: '3 4' },
    intraplate: { label: 'Intraplate fault zone', color: '#7355a1', dashArray: '2 5' }
  };
  const getBoundaryStyle = (feature) =>
    boundaryStyles[boundaryTypeById.get(feature.properties.id)] || boundaryStyles.intraplate;
  const faultLayer = window.L.geoJSON(null, {
    style: (feature) => {
      const boundary = getBoundaryStyle(feature);
      return {
        className: `hazard-fault-line boundary-${boundaryTypeById.get(feature.properties.id) || 'intraplate'}`,
        color: boundary.color,
        opacity: feature.properties.id === selectedFaultId ? 1 : 0.94,
        weight: feature.properties.id === selectedFaultId ? 4 : 2.8,
        dashArray: boundary.dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      };
    },
    onEachFeature: (feature, layer) => {
      const properties = feature.properties;
      const boundary = getBoundaryStyle(feature);
      layer.bindTooltip(`${properties.name} · ${boundary.label}`, {
        sticky: true,
        className: 'hazard-map-tooltip'
      });
      layer.on({
        mouseover: (event) => event.target.setStyle({ opacity: 1, weight: 4 }),
        mouseout: (event) => faultLayer.resetStyle(event.target),
        click: (event) => {
          selectedFaultId = properties.id;
          faultLayer.setStyle((item) => {
            const itemBoundary = getBoundaryStyle(item);
            return {
              color: itemBoundary.color,
              opacity: item.properties.id === selectedFaultId ? 1 : 0.94,
              weight: item.properties.id === selectedFaultId ? 4 : 2.8,
              dashArray: itemBoundary.dashArray
            };
          });
          showFaultDetails(feature, event.latlng);
          if (!map.getBounds().contains(event.latlng)) map.panTo(event.latlng);
        }
      });
    }
  }).addTo(map);

  const tectonicLabelLayer = window.L.layerGroup().addTo(map);
  function showTectonicPlateLabels() {
    tectonicLabelLayer.clearLayers();
    hazardRegionData.tectonicPlateLabels.forEach((plate) => {
      const label = document.createElement('span');
      label.className = `tectonic-plate-label${plate.major ? ' is-major' : ''}`;
      label.textContent = plate.name;
      const icon = window.L.divIcon({
        className: 'tectonic-plate-label-icon',
        html: label.outerHTML,
        iconSize: [150, 22],
        iconAnchor: [75, 11]
      });
      tectonicLabelLayer.addLayer(window.L.marker(
        [plate.coordinates[1], plate.coordinates[0]],
        { icon, interactive: false, keyboard: false, zIndexOffset: -100 }
      ));
    });
  }

  function getMatchingEvents(properties) {
    const severity = severitySelectValue();
    const period = periodSelectValue();
    return properties.events.filter((event) => {
      const year = Number(event.date.slice(0, 4));
      const severityMatches = severity === 'all' || event.severity === severity;
      const periodMatches = period === 'all'
        || (period === '2020' && year >= 2020)
        || (period === '2010' && year >= 2010 && year <= 2019)
        || (period === 'before-2010' && year < 2010);
      return severityMatches && periodMatches && (!activeOnly() || event.active);
    });
  }

  function describePeriod(events) {
    const years = events.map((event) => Number(event.date.slice(0, 4))).sort((a, b) => a - b);
    if (!years.length) return '—';
    return years[0] === years[years.length - 1] ? `${years[0]}` : `${years[0]}–${years[years.length - 1]}`;
  }

  function createPopup(title, subtitle, summary, meta, records, recordsHeading = 'Recorded examples') {
    const container = document.createElement('div');
    container.className = 'hazard-map-popup';
    const heading = document.createElement('h3');
    heading.textContent = title;
    const category = document.createElement('p');
    category.className = 'hazard-map-popup-category';
    category.textContent = subtitle;
    const description = document.createElement('p');
    description.textContent = summary;
    container.append(heading, category, description);

    const stats = document.createElement('dl');
    stats.className = 'hazard-map-popup-stats';
    meta.forEach(([label, value]) => {
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = value;
      stats.append(term, detail);
    });
    container.append(stats);

    if (records.length) {
      const recordHeading = document.createElement('h4');
      recordHeading.textContent = recordsHeading;
      const list = document.createElement('ul');
      list.className = 'hazard-map-popup-events';
      records.forEach((record) => {
        const item = document.createElement('li');
        const name = document.createElement('strong');
        name.textContent = record.name;
        const recordMetadata = [record.date, record.severity];
        if (record.date && typeof record.active === 'boolean') {
          recordMetadata.push(record.active ? 'Active' : 'Historical');
        }
        item.append(name);
        if (recordMetadata.length) {
          const detail = document.createElement('span');
          detail.textContent = recordMetadata.join(' · ');
          item.append(detail);
        }
        if (record.description) {
          const descriptionText = document.createElement('p');
          descriptionText.textContent = record.description;
          item.append(descriptionText);
        }
        if (record.sourceUrl && record.sourceLabel) {
          const source = document.createElement('a');
          source.href = record.sourceUrl;
          source.target = '_blank';
          source.rel = 'noreferrer';
          source.textContent = `Source: ${record.sourceLabel}`;
          item.append(source);
        }
        list.append(item);
      });
      container.append(recordHeading, list);
    }

    return container;
  }

  function openMapPopup(content, latlng) {
    const mapSize = map.getSize();
    const padding = 24;
    window.L.popup({
      maxWidth: Math.max(180, Math.min(380, mapSize.x - padding * 2)),
      maxHeight: Math.max(180, mapSize.y - padding * 2),
      autoPan: true,
      autoPanPaddingTopLeft: [padding, padding],
      autoPanPaddingBottomRight: [padding, padding],
      keepInView: true
    })
      .setLatLng(latlng)
      .setContent(content)
      .openOn(map);
  }

  function showFeatureDetails(feature, latlng = map.getCenter()) {
    const properties = feature.properties;
    const category = categoryById.get(properties.category);
    const matchingEvents = getMatchingEvents(properties);
    titleElement.textContent = properties.name;
    copyElement.textContent = `${category.label} · ${activeRegion === 'india' ? 'Recorded event location' : 'Approximate regional risk envelope'}`;
    countLabelElement.textContent = 'sample events';
    severityLabelElement.textContent = 'severity';
    periodLabelElement.textContent = 'time period';
    eventListHeadingElement.textContent = 'Documented examples';
    eventCountElement.textContent = String(matchingEvents.length);
    const severities = [...new Set(matchingEvents.map((event) => event.severity))];
    eventSeverityElement.textContent = severities.length ? severities.join(', ') : '—';
    eventPeriodElement.textContent = describePeriod(matchingEvents);
    contextElement.textContent = properties.summary;
    eventListElement.replaceChildren();

    matchingEvents.forEach((event) => {
      const item = document.createElement('li');
      const eventName = document.createElement('strong');
      eventName.textContent = event.name;
      const eventMeta = document.createElement('span');
      eventMeta.textContent = `${event.date} · ${event.severity} · ${event.active ? 'Active' : 'Historical'}`;
      const eventDescription = document.createElement('p');
      eventDescription.textContent = event.description || properties.summary;
      const source = document.createElement('a');
      source.href = event.sourceUrl;
      source.target = '_blank';
      source.rel = 'noreferrer';
      source.textContent = event.sourceLabel;
      item.append(eventName, eventMeta, eventDescription, source);
      eventListElement.append(item);
    });

    const popup = createPopup(
      properties.name,
      `${category.label} · ${activeRegion === 'india' ? 'Approximate event location' : 'Regional hazard area'}`,
      properties.summary,
      [
        ['Example events', String(matchingEvents.length)],
        ['Severity', severities.length ? severities.join(', ') : '—'],
        ['Period', describePeriod(matchingEvents)]
      ],
      matchingEvents
    );
    openMapPopup(popup, latlng);
  }

  function showFaultDetails(feature, latlng = map.getCenter()) {
    const properties = feature.properties;
    const boundary = getBoundaryStyle(feature);
    titleElement.textContent = properties.name;
    copyElement.textContent = `${boundary.label} · Generalized tectonic trace`;
    countLabelElement.textContent = 'events';
    severityLabelElement.textContent = 'feature type';
    periodLabelElement.textContent = 'timescale';
    eventListHeadingElement.textContent = 'Reference';
    eventCountElement.textContent = '—';
    eventSeverityElement.textContent = 'Fault line';
    eventPeriodElement.textContent = 'Geologic';
    contextElement.textContent = properties.summary;
    eventListElement.replaceChildren();

    const item = document.createElement('li');
    const source = document.createElement('a');
    source.href = properties.sourceUrl;
    source.target = '_blank';
    source.rel = 'noreferrer';
    source.textContent = properties.sourceLabel;
    item.append(source);
    eventListElement.append(item);

    const popup = createPopup(
      properties.name,
      boundary.label,
      properties.summary,
      [
        ['Feature type', properties.featureType || boundary.label],
        ['Setting', properties.tectonicSetting || 'Tectonic plate boundary or active fault zone'],
        ['Map detail', 'Generalized line; not a parcel-level survey']
      ],
      [{
        name: properties.sourceLabel,
        sourceLabel: properties.sourceLabel,
        sourceUrl: properties.sourceUrl
      }],
      'Data reference'
    );
    openMapPopup(popup, latlng);
  }

  function updatePressedStates() {
    const allSelected = selectedCategories.size === hazardRegionData.categories.length;
    allButton.setAttribute('aria-pressed', String(allSelected));
    filtersElement.querySelectorAll('button[data-hazard]').forEach((button) => {
      if (button.dataset.hazard !== 'all') {
        button.setAttribute('aria-pressed', String(selectedCategories.has(button.dataset.hazard)));
      }
    });
    regionsElement.querySelectorAll('.hazard-filter').forEach((button) => {
      const selectedView = activeMode === 'faults' ? 'faults' : activeRegion;
      button.setAttribute('aria-pressed', String(button.dataset.mapRegion === selectedView));
    });
    filtersElement.hidden = activeMode === 'faults';
    filterOptionsElement.hidden = activeMode === 'faults';
    tectonicLegendElement.hidden = activeMode !== 'faults';
  }

  function updateMap(shouldFit = activeRegion === 'india', resetDetails = true) {
    if (activeMode === 'faults') {
      eventLayer.clearLayers();
      indiaPinLayer.clearLayers();
      faultLayer.clearLayers();
      showTectonicPlateLabels();
      faultLayer.addData({
        type: 'FeatureCollection',
        features: hazardRegionData.faultLines
      });
      if (resetDetails) {
        map.closePopup();
        selectedFeatureId = null;
        selectedFaultId = null;
        titleElement.textContent = 'Explore fault lines';
        copyElement.textContent = 'Select a fault trace to see its context and data source.';
        countLabelElement.textContent = 'events';
        severityLabelElement.textContent = 'feature type';
        periodLabelElement.textContent = 'timescale';
        eventListHeadingElement.textContent = 'Reference';
        eventCountElement.textContent = '—';
        eventSeverityElement.textContent = '—';
        eventPeriodElement.textContent = '—';
        contextElement.textContent = '';
        eventListElement.replaceChildren();
        faultLayer.setStyle((feature) => {
          const boundary = getBoundaryStyle(feature);
          return {
            color: boundary.color,
            opacity: feature.properties.id === selectedFaultId ? 1 : 0.94,
            weight: feature.properties.id === selectedFaultId ? 4 : 2.8,
            dashArray: boundary.dashArray
          };
        });
      }
      statusElement.textContent = `Showing ${hazardRegionData.faultLines.length} generalized global fault and plate-boundary traces with ${hazardRegionData.tectonicPlateLabels.length} plate labels. This is not a complete fault inventory.`;
      if (shouldFit) {
        map.fitBounds([[-60, -180], [80, 180]], {
          padding: [12, 12],
          maxZoom: 2
        });
      }
      return;
    }

    faultLayer.clearLayers();
    tectonicLabelLayer.clearLayers();
    const zoom = map.getZoom();
    const sourceFeatures = activeRegion === 'india'
      ? indiaPins
      : features.filter((feature) => feature.properties.scope === 'world');
    const matchingFeatures = sourceFeatures.filter((feature) => {
      const { properties } = feature;
      return selectedCategories.has(properties.category)
        && getMatchingEvents(properties).length > 0;
    });
    const visibleFeatures = activeRegion === 'india' ? matchingFeatures : matchingFeatures.filter((feature) => {
      const { properties } = feature;
      if (properties.scale === 'local') return zoom >= 6;
      if (properties.hasDetail && zoom >= 6) {
        const hasMatchingDetail = matchingFeatures.some((candidate) =>
          candidate.properties.parentId === properties.id && candidate.properties.scale === 'local'
        );
        if (hasMatchingDetail) return false;
      }
      return true;
    });

    if (!resetDetails && selectedFeatureId
      && !visibleFeatures.some((feature) => feature.properties.id === selectedFeatureId)) {
      resetDetails = true;
    }

    if (resetDetails) map.closePopup();
    eventLayer.clearLayers();
    indiaPinLayer.clearLayers();
    if (activeRegion === 'india') {
      indiaPinLayer.addData({
        type: 'FeatureCollection',
        features: visibleFeatures
      });
    } else {
      eventLayer.addData({
        type: 'FeatureCollection',
        features: visibleFeatures
      });
    }
    if (resetDetails) {
      selectedFeatureId = null;
      selectedFaultId = null;
      titleElement.textContent = activeRegion === 'india' ? 'Explore disaster pins' : 'Explore the regions';
      copyElement.textContent = activeRegion === 'india'
        ? 'Select an event pin to see its date, severity, context, and source.'
        : 'Select a filled region to see the documented example events and geographic context.';
      countLabelElement.textContent = 'sample events';
      severityLabelElement.textContent = 'severity';
      periodLabelElement.textContent = 'time period';
      eventListHeadingElement.textContent = 'Documented examples';
      eventCountElement.textContent = '—';
      eventSeverityElement.textContent = '—';
      eventPeriodElement.textContent = '—';
      contextElement.textContent = '';
      eventListElement.replaceChildren();
    }

    if (activeOnly() && visibleFeatures.length === 0) {
      statusElement.textContent = activeRegion === 'india'
        ? 'No active disaster pins in this curated dataset. It contains historical examples and is not connected to a live event feed.'
        : 'No active regions in this curated dataset. It contains historical examples and is not connected to a live event feed.';
    } else {
      const activeLabel = activeOnly() ? ' currently active' : '';
      statusElement.textContent = activeRegion === 'india'
        ? `Showing ${visibleFeatures.length} disaster pin${visibleFeatures.length === 1 ? '' : 's'} for India${activeLabel}. Locations and counts are curated examples, not exhaustive records.`
        : `Showing ${visibleFeatures.length} regional polygon${visibleFeatures.length === 1 ? '' : 's'} for the world${activeLabel}. Counts are curated examples, not exhaustive totals.`;
    }

    if (shouldFit && activeRegion === 'world') {
      map.fitBounds([[-60, -180], [80, 180]], {
        padding: [12, 12],
        maxZoom: 2
      });
    } else if (shouldFit && visibleFeatures.length) {
      const bounds = activeRegion === 'india' ? indiaPinLayer.getBounds() : eventLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [28, 28],
          maxZoom: activeRegion === 'world' ? 3 : 5
        });
      }
    } else if (shouldFit && !visibleFeatures.length) {
      map.setView(activeRegion === 'world' ? [18, 0] : [22.8, 82.5], activeRegion === 'world' ? 2 : 4);
    }
  }

  filtersElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-hazard]');
    if (!button || !filtersElement.contains(button)) return;
    if (button.dataset.hazard === 'all') {
      hazardRegionData.categories.forEach((category) => selectedCategories.add(category.id));
    } else {
      if (selectedCategories.size === hazardRegionData.categories.length) selectedCategories.clear();
      if (selectedCategories.has(button.dataset.hazard)) selectedCategories.delete(button.dataset.hazard);
      else selectedCategories.add(button.dataset.hazard);
    }
    updatePressedStates();
    updateMap();
  });

  regionsElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-map-region]');
    if (!button || !regionsElement.contains(button)) return;
    if (button.dataset.mapRegion === 'faults') {
      activeMode = 'faults';
    } else {
      activeMode = 'hazards';
      activeRegion = button.dataset.mapRegion;
    }
    updatePressedStates();
    updateMap(true);
  });

  severitySelect.addEventListener('change', () => updateMap());
  periodSelect.addEventListener('change', () => updateMap());
  activeCheckbox.addEventListener('change', () => updateMap());
  map.on('zoomend', () => updateMap(false, false));

  updatePressedStates();
  updateMap();
  window.setTimeout(() => map.invalidateSize(), 0);
}

function init() {
  renderDisasterCards();
  renderChecklist();
  initialiseCommunityAction();
  initialiseSafetyGuide();
  initialiseHazardMap();
  initialiseFinder();
  bindModalEvents();
}

window.addEventListener('DOMContentLoaded', init);
