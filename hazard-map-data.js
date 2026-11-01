const hazardRegionData = {
  categories: [
    { id: 'earthquake', label: 'Earthquakes', color: '#e04444' },
    { id: 'flood', label: 'Floods', color: '#328bd1' },
    { id: 'wildfire', label: 'Wildfires', color: '#ef8b32' },
    { id: 'cyclone', label: 'Cyclones / hurricanes', color: '#9560c7' },
    { id: 'volcano', label: 'Volcanic eruptions', color: '#8f1d2c' },
    { id: 'drought', label: 'Droughts', color: '#e1bd38' },
    { id: 'landslide', label: 'Landslides', color: '#94613e' },
    { id: 'tsunami', label: 'Tsunamis', color: '#2b9c9b' }
  ],
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'japan-subduction-arc',
        name: 'Japan Trench & Honshu subduction arc',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        hasDetail: true,
        summary: 'Approximate subduction-zone envelope east of Honshu, where major offshore earthquakes have generated damaging shaking and tsunami waves.',
        events: [
          { name: 'Tōhoku earthquake', date: '2011-03-11', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20110311054624120_30/impact' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[138.6, 32.8], [140.2, 33.8], [141.4, 35.1], [142.5, 37.2], [143.5, 39.4], [144.8, 41.8], [146.6, 42.8], [146.2, 40.2], [144.8, 37.8], [143.3, 35.5], [141.8, 33.7], [140.2, 32.4], [138.6, 32.8]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'tohoku-detail',
        name: 'Tohoku Pacific coast',
        category: 'earthquake',
        scope: 'world',
        scale: 'local',
        parentId: 'japan-subduction-arc',
        summary: 'More focused envelope for the Tōhoku offshore rupture and adjacent Pacific coast.',
        events: [
          { name: 'Tōhoku earthquake', date: '2011-03-11', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20110311054624120_30/impact' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.5, 35.3], [141.5, 35.8], [142.5, 37.2], [143.4, 39.1], [144.1, 40.8], [143.4, 41.1], [142.2, 39.4], [141.2, 37.6], [140.5, 35.3]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'noto-peninsula-earthquake',
        name: 'Noto Peninsula seismic region',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate area around the Noto Peninsula affected by the 2024 earthquake; the polygon is not an official shaking-intensity boundary.',
        events: [
          { name: 'Noto Peninsula earthquake', date: '2024-01-01', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us6000m0xl/executive' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[135.8, 36.3], [136.4, 36.4], [137.3, 36.8], [137.5, 37.4], [137.0, 37.8], [136.3, 37.6], [135.8, 37.0], [135.8, 36.3]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mekong-floodplain',
        name: 'Lower Mekong floodplain',
        category: 'flood',
        scope: 'world',
        scale: 'regional',
        hasDetail: true,
        summary: 'Low-lying delta and floodplain areas along the lower Mekong; the outline is an approximate regional envelope, not an inundation footprint.',
        events: [
          { name: 'Mekong basin floods', date: '2011-08-01', severity: 'High', active: false, sourceLabel: 'Mekong River Commission', sourceUrl: 'https://www.mrcmekong.org/' },
          { name: 'Mekong basin floods', date: '2020-10-01', severity: 'Moderate', active: false, sourceLabel: 'ReliefWeb reports', sourceUrl: 'https://reliefweb.int/' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[102.1, 8.5], [103.3, 9.0], [104.2, 9.8], [105.5, 10.1], [106.8, 10.4], [107.2, 11.2], [106.2, 11.8], [104.8, 11.4], [103.4, 10.9], [102.5, 9.9], [102.1, 8.5]]],
          [[[99.0, 13.0], [100.1, 13.2], [101.4, 14.0], [102.0, 15.1], [101.3, 16.0], [100.3, 15.4], [99.3, 14.6], [99.0, 13.0]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'caribbean-hurricane-belt',
        name: 'Caribbean hurricane belt',
        category: 'cyclone',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate seasonal tropical-cyclone corridor across the Caribbean Sea and adjacent island arcs; not a forecast track or an active warning.',
        events: [
          { name: 'Hurricane Irma', date: '2017-09-06', severity: 'Severe', active: false, sourceLabel: 'US National Hurricane Center report', sourceUrl: 'https://www.nhc.noaa.gov/data/tcr/AL112017_Irma.pdf' },
          { name: 'Hurricane Maria', date: '2017-09-19', severity: 'Severe', active: false, sourceLabel: 'US National Hurricane Center report', sourceUrl: 'https://www.nhc.noaa.gov/data/tcr/AL152017_Maria.pdf' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-88.8, 20.8], [-84.0, 22.4], [-78.0, 22.2], [-72.0, 21.3], [-65.0, 19.8], [-60.4, 16.2], [-61.6, 12.8], [-66.7, 12.0], [-72.5, 14.0], [-77.2, 16.2], [-82.8, 17.0], [-86.8, 18.4], [-88.8, 20.8]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'southeast-australia-fire',
        name: 'Southeast Australia fire-weather region',
        category: 'wildfire',
        scope: 'world',
        scale: 'regional',
        hasDetail: true,
        summary: 'Approximate fire-prone forest and ranges across parts of southeastern Australia. Boundaries are not current fire perimeters.',
        events: [
          { name: '2019–2020 Australian bushfire season', date: '2019-09-01', severity: 'Severe', active: false, sourceLabel: 'Royal Commission report', sourceUrl: 'https://naturaldisaster.royalcommission.gov.au/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.5, -34.4], [142.0, -36.2], [143.1, -38.4], [145.2, -39.1], [147.4, -38.4], [149.5, -36.8], [151.7, -34.4], [153.5, -31.3], [152.6, -29.8], [150.4, -31.1], [148.5, -33.2], [146.4, -34.1], [144.3, -33.7], [142.1, -33.2], [140.5, -34.4]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'blue-mountains-fire-detail',
        name: 'Blue Mountains & adjacent ranges',
        category: 'wildfire',
        scope: 'world',
        scale: 'local',
        parentId: 'southeast-australia-fire',
        summary: 'More focused regional envelope for forested ranges west of Sydney; not a current fire perimeter.',
        events: [
          { name: '2019–2020 Australian bushfire season', date: '2019-09-01', severity: 'Severe', active: false, sourceLabel: 'Royal Commission report', sourceUrl: 'https://naturaldisaster.royalcommission.gov.au/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[149.1, -32.1], [150.2, -32.3], [151.1, -33.1], [151.3, -34.0], [150.6, -34.4], [149.6, -33.9], [148.9, -33.0], [149.1, -32.1]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'indonesia-volcanic-arc',
        name: 'Sunda volcanic arc',
        category: 'volcano',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate volcanic arc across western Indonesia. This represents long-term volcanic hazard, not a current eruption alert.',
        events: [
          { name: 'Anak Krakatau eruption and tsunami', date: '2018-12-22', severity: 'Severe', active: false, sourceLabel: 'NASA Earth Observatory', sourceUrl: 'https://earthobservatory.nasa.gov/images/144098/anak-krakatau-eruption-and-tsunami' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[94.5, 5.8], [96.0, 5.1], [98.0, 2.8], [100.0, 0.3], [102.0, -2.0], [104.2, -4.7], [103.0, -5.7], [101.0, -3.4], [99.1, -1.0], [97.2, 1.4], [95.3, 3.8], [94.5, 5.8]]],
          [[[105.2, -5.4], [106.5, -6.0], [108.0, -6.7], [110.0, -7.7], [112.2, -8.3], [114.2, -8.1], [114.4, -7.2], [112.2, -6.6], [110.1, -6.1], [108.0, -5.4], [106.3, -5.0], [105.2, -5.4]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'sahel-drought-zone',
        name: 'Western and central Sahel',
        category: 'drought',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate semi-arid Sahel belt where drought and rainfall variability affect water and food security; not a current drought extent.',
        events: [
          { name: 'Sahel food and drought crisis', date: '2012-01-01', severity: 'Severe', active: false, sourceLabel: 'World Food Programme', sourceUrl: 'https://www.wfp.org/emergencies/sahel-emergency' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-17.0, 14.2], [-15.0, 16.5], [-10.0, 17.5], [-4.0, 17.8], [2.0, 17.2], [8.0, 16.9], [14.0, 16.4], [19.0, 15.8], [23.0, 14.4], [22.0, 12.2], [16.0, 12.6], [10.0, 13.1], [4.0, 13.5], [-2.0, 13.0], [-8.0, 13.2], [-13.5, 13.1], [-17.0, 14.2]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'himalaya-landslide-belt',
        name: 'Central and eastern Himalayan slopes',
        category: 'landslide',
        scope: 'world',
        scale: 'regional',
        hasDetail: true,
        summary: 'Approximate steep-slope belt along parts of the Himalaya, where intense rain, terrain, and geological conditions can trigger landslides.',
        events: [
          { name: 'Sikkim glacial lake outburst flood and associated landslides', date: '2023-10-04', severity: 'Severe', active: false, sourceLabel: 'ReliefWeb situation reports', sourceUrl: 'https://reliefweb.int/disaster/fl-2023-000176-ind' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[77.0, 27.1], [79.0, 27.6], [81.0, 27.8], [83.0, 27.5], [85.0, 27.8], [87.0, 27.4], [89.0, 27.8], [91.0, 27.5], [93.0, 27.7], [95.0, 28.4], [94.0, 29.5], [91.5, 29.4], [89.0, 29.2], [86.5, 29.1], [84.0, 29.0], [81.5, 28.9], [79.0, 28.4], [77.0, 27.1]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-ganga-floodplain',
        name: 'Ganga–Brahmaputra floodplain',
        category: 'flood',
        scope: 'india',
        scale: 'regional',
        hasDetail: true,
        summary: 'Approximate low-lying river plain across northern and eastern India; not a flood forecast or official inundation boundary.',
        events: [
          { name: 'Sikkim glacial lake outburst flood', date: '2023-10-04', severity: 'Severe', active: false, sourceLabel: 'ReliefWeb situation reports', sourceUrl: 'https://reliefweb.int/disaster/fl-2023-000176-ind' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[77.2, 28.1], [79.5, 27.8], [82.0, 26.9], [84.5, 26.1], [86.7, 25.7], [88.1, 24.9], [87.3, 23.8], [84.5, 24.2], [82.0, 25.0], [79.4, 25.8], [77.2, 26.8], [77.2, 28.1]]],
          [[[88.2, 26.0], [90.0, 25.6], [92.0, 25.0], [94.1, 24.6], [94.4, 25.4], [92.6, 26.3], [90.5, 26.8], [88.7, 26.9], [88.2, 26.0]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'odisha-cyclone-coast',
        name: 'Odisha and north Andhra coast',
        category: 'cyclone',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate coastal exposure zone along the northwestern Bay of Bengal; not a forecast track or evacuation boundary.',
        events: [
          { name: 'Odisha Super Cyclone', date: '1999-10-29', severity: 'Severe', active: false, sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' },
          { name: 'Cyclone Fani', date: '2019-05-03', severity: 'Severe', active: false, sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[82.0, 16.0], [83.4, 16.8], [84.8, 17.7], [86.4, 18.5], [87.4, 19.5], [87.2, 20.8], [86.0, 21.2], [84.9, 20.2], [83.7, 19.0], [82.8, 17.7], [82.0, 16.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'kutch-earthquake-zone',
        name: 'Kutch seismic region',
        category: 'earthquake',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate seismic-risk area in western Gujarat; this envelope is not a fault trace or building-level hazard map.',
        events: [
          { name: 'Bhuj earthquake', date: '2001-01-26', severity: 'Severe', active: false, sourceLabel: 'USGS event archive', sourceUrl: 'https://earthquake.usgs.gov/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[68.0, 22.1], [69.0, 22.0], [70.2, 22.3], [71.6, 22.6], [72.1, 23.6], [71.8, 24.8], [70.8, 24.9], [69.6, 24.2], [68.6, 23.4], [68.0, 22.1]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'western-ghats-landslide-zone',
        name: 'Western Ghats monsoon slopes',
        category: 'landslide',
        scope: 'india',
        scale: 'regional',
        hasDetail: true,
        summary: 'Approximate steep, high-rainfall slope belt along the Western Ghats; not a site-specific landslide susceptibility model.',
        events: [
          { name: 'Wayanad landslides', date: '2024-07-30', severity: 'Severe', active: false, sourceLabel: 'Kerala State Disaster Management Authority', sourceUrl: 'https://sdma.kerala.gov.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[73.5, 15.8], [74.0, 14.0], [74.2, 12.5], [74.7, 10.8], [75.2, 9.4], [76.0, 8.5], [76.8, 9.0], [76.4, 10.8], [75.8, 12.5], [75.4, 14.1], [74.8, 15.8], [74.2, 16.4], [73.5, 15.8]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'wayanad-landslide-detail',
        name: 'Wayanad highland slopes',
        category: 'landslide',
        scope: 'india',
        scale: 'local',
        parentId: 'western-ghats-landslide-zone',
        summary: 'More focused approximate highland envelope in northern Kerala; the polygon is not an official landslide footprint.',
        events: [
          { name: 'Wayanad landslides', date: '2024-07-30', severity: 'Severe', active: false, sourceLabel: 'Kerala State Disaster Management Authority', sourceUrl: 'https://sdma.kerala.gov.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[75.7, 11.4], [76.0, 11.4], [76.4, 11.7], [76.5, 12.1], [76.2, 12.2], [75.9, 12.0], [75.7, 11.7], [75.7, 11.4]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'assam-brahmaputra-detail',
        name: 'Upper Brahmaputra floodplain, Assam',
        category: 'flood',
        scope: 'india',
        scale: 'local',
        parentId: 'india-ganga-floodplain',
        summary: 'More focused approximate floodplain envelope in Assam; not an active flood boundary.',
        events: [
          { name: 'Assam monsoon floods', date: '2022-06-15', severity: 'High', active: false, sourceLabel: 'Assam State Disaster Management Authority', sourceUrl: 'https://asdma.assam.gov.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[90.0, 26.0], [91.0, 26.2], [92.0, 26.4], [93.0, 26.6], [94.1, 26.5], [94.3, 27.1], [93.0, 27.3], [91.8, 27.1], [90.6, 26.8], [90.0, 26.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-drought-zone',
        name: 'Northwest India dryland region',
        category: 'drought',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate arid and semi-arid belt in northwest India; drought conditions vary by season and are not represented as current.',
        events: [
          { name: 'Northwest India drought episode', date: '2015-06-01', severity: 'High', active: false, sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[69.0, 24.0], [71.0, 24.2], [73.5, 25.0], [75.8, 26.0], [77.2, 27.4], [76.3, 28.8], [74.0, 28.2], [72.0, 27.1], [70.0, 26.2], [69.0, 24.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'andaman-tsunami-zone',
        name: 'Andaman–Nicobar and southeast tsunami exposure',
        category: 'tsunami',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate coastal exposure areas along the Andaman–Nicobar chain and southeast India; not an inundation or evacuation boundary.',
        events: [
          { name: 'Indian Ocean earthquake and tsunami', date: '2004-12-26', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20041226005853450_30/impact' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[91.2, 13.8], [92.5, 13.4], [93.0, 12.2], [93.1, 10.6], [92.8, 8.2], [92.1, 7.0], [91.4, 8.5], [91.3, 10.4], [91.0, 12.0], [91.2, 13.8]]],
          [[[79.2, 8.0], [80.3, 8.4], [81.0, 9.8], [81.6, 11.8], [81.9, 13.5], [81.4, 14.0], [80.8, 12.0], [80.1, 10.2], [79.2, 8.0]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'barren-island-volcano',
        name: 'Barren Island volcanic region',
        category: 'volcano',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate area around India’s active Barren Island volcano; this is a long-term awareness envelope, not an eruption alert.',
        events: [
          { name: 'Barren Island eruption', date: '1991-01-01', severity: 'High', active: false, sourceLabel: 'Smithsonian Global Volcanism Program', sourceUrl: 'https://volcano.si.edu/volcano.cfm?vn=260010' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[93.7, 12.2], [94.0, 12.1], [94.2, 12.3], [94.1, 12.6], [93.8, 12.6], [93.7, 12.2]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'uttarakhand-wildfire-zone',
        name: 'Uttarakhand forest fire region',
        category: 'wildfire',
        scope: 'india',
        scale: 'regional',
        summary: 'Approximate forested slope envelope in Uttarakhand; boundaries do not represent current fire perimeters.',
        events: [
          { name: 'Uttarakhand forest fires', date: '2021-04-01', severity: 'High', active: false, sourceLabel: 'Forest Survey of India', sourceUrl: 'https://fsi.nic.in/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[78.0, 29.0], [78.8, 29.0], [79.8, 29.3], [80.5, 29.8], [80.4, 30.5], [79.7, 30.8], [78.8, 30.5], [78.1, 29.9], [78.0, 29.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'japan-tsunami-coast',
        name: 'Northeast Japan tsunami exposure coast',
        category: 'tsunami',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Pacific-facing coast exposed to tsunami generated by major offshore earthquakes; not an inundation map.',
        events: [
          { name: 'Tōhoku earthquake and tsunami', date: '2011-03-11', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20110311054624120_30/impact' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[140.8, 35.4], [141.7, 36.2], [142.7, 37.5], [143.5, 39.2], [144.3, 40.7], [145.0, 41.5], [144.4, 42.0], [143.0, 40.6], [142.0, 38.8], [141.2, 37.0], [140.8, 35.4]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'cascadia-earthquake-zone',
        name: 'Cascadia subduction region',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Pacific Northwest subduction region, associated with major offshore earthquakes and strong shaking potential; not a forecast or shaking-intensity boundary.',
        events: [
          { name: 'Cascadia megathrust earthquake (historical)', date: '1700-01-26', severity: 'Severe', active: false, sourceLabel: 'USGS Cascadia overview', sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards/science/cascadia-subduction-zone' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-130.0, 40.0], [-127.0, 40.8], [-124.0, 42.0], [-123.3, 44.0], [-123.0, 46.0], [-123.5, 48.5], [-125.2, 49.8], [-127.2, 48.2], [-128.4, 45.5], [-129.2, 42.5], [-130.0, 40.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'california-wildfire-region',
        name: 'California fire-prone ranges',
        category: 'wildfire',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate forest and chaparral regions affected by major California fire seasons; this does not show current fire perimeters.',
        events: [
          { name: '2020 California wildfire season', date: '2020-08-01', severity: 'Severe', active: false, sourceLabel: 'CAL FIRE incident archive', sourceUrl: 'https://www.fire.ca.gov/incidents/2020/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-124.5, 39.0], [-122.8, 40.0], [-121.0, 40.2], [-120.0, 38.8], [-119.2, 37.3], [-118.0, 35.5], [-118.2, 34.0], [-120.0, 33.0], [-121.8, 34.0], [-123.0, 36.0], [-124.5, 39.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'central-america-cyclone-zone',
        name: 'Central America hurricane-affected region',
        category: 'cyclone',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate inland and coastal region affected by intense Caribbean-origin storms; not a forecast cone or current warning.',
        events: [
          { name: 'Hurricanes Eta and Iota', date: '2020-11-03', severity: 'Severe', active: false, sourceLabel: 'NOAA National Hurricane Center', sourceUrl: 'https://www.nhc.noaa.gov/data/tcr/AL312020_Eta.pdf' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-91.5, 17.8], [-88.0, 18.5], [-84.0, 17.0], [-82.0, 14.8], [-83.0, 11.0], [-86.0, 8.0], [-89.5, 9.0], [-92.5, 12.0], [-91.5, 17.8]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'bangladesh-floodplain',
        name: 'Bangladesh and Ganges–Brahmaputra delta',
        category: 'flood',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate low-lying delta and river floodplain in Bangladesh; the outline is not an event inundation map.',
        events: [
          { name: 'Bangladesh floods', date: '2022-06-15', severity: 'Severe', active: false, sourceLabel: 'UNICEF Bangladesh situation report', sourceUrl: 'https://www.unicef.org/press-releases/over-13-million-children-affected-devastating-floods-bangladesh' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[88.0, 24.7], [89.2, 25.2], [90.5, 25.0], [92.0, 24.2], [92.5, 22.8], [91.6, 21.3], [90.4, 21.5], [89.2, 22.0], [88.1, 23.0], [88.0, 24.7]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'amazon-drought-region',
        name: 'Central Amazon drought region',
        category: 'drought',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate central Amazon basin region affected by severe low-water and drought conditions; not a live drought-intensity product.',
        events: [
          { name: 'Amazon drought and low-water crisis', date: '2023-07-01', severity: 'Severe', active: false, sourceLabel: 'World Meteorological Organization', sourceUrl: 'https://wmo.int/media/news/amazon-drought-and-low-water-crisis' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-70.5, -7.0], [-68.0, -4.0], [-64.0, -2.0], [-59.0, -1.5], [-54.0, -3.0], [-52.0, -6.0], [-55.0, -9.0], [-60.0, -10.0], [-65.0, -9.5], [-69.0, -8.5], [-70.5, -7.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'horn-africa-drought-zone',
        name: 'Horn of Africa drought-affected region',
        category: 'drought',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate region of the Horn of Africa affected by successive poor rainy seasons; conditions vary locally and this is not a current drought alert.',
        events: [
          { name: 'Horn of Africa drought emergency', date: '2020-10-01', severity: 'Severe', active: false, sourceLabel: 'World Food Programme', sourceUrl: 'https://www.wfp.org/emergencies/horn-africa-emergency' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[34.0, 5.0], [36.0, 10.0], [40.0, 12.5], [44.0, 12.0], [48.5, 9.0], [49.0, 5.5], [45.0, 2.0], [40.0, -1.0], [36.0, 1.0], [34.0, 5.0]]],
          [[[39.0, -4.5], [42.0, -4.8], [44.5, -2.0], [43.0, 0.0], [40.5, -0.5], [39.0, -4.5]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'andes-volcanic-region',
        name: 'Central Andes volcanic region',
        category: 'volcano',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate southern Peru and northern Chile volcanic arc; indicates a long-term volcanic hazard region, not a current eruption alert.',
        events: [
          { name: 'Sabancaya eruption period', date: '2016-11-01', severity: 'High', active: false, sourceLabel: 'Smithsonian Global Volcanism Program', sourceUrl: 'https://volcano.si.edu/volcano.cfm?vn=354006' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.5, -15.0], [-72.8, -17.5], [-71.5, -20.0], [-70.5, -23.0], [-69.0, -26.0], [-68.0, -29.0], [-69.5, -30.0], [-71.2, -27.0], [-72.4, -24.0], [-73.8, -21.0], [-75.0, -18.0], [-74.5, -15.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'turkey-earthquake-region',
        name: 'Southern Türkiye and northern Syria earthquake region',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate area affected by the 2023 Kahramanmaraş earthquake sequence; not an official shaking-intensity or damage boundary.',
        events: [
          { name: 'Türkiye–Syria earthquakes', date: '2023-02-06', severity: 'Severe', active: false, sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us6000jllz/executive' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[35.0, 35.0], [36.0, 36.0], [37.5, 36.0], [38.8, 37.0], [39.5, 38.5], [38.0, 39.5], [36.0, 39.0], [35.0, 37.5], [35.0, 35.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'central-europe-flood-region',
        name: 'Western Central Europe flood region',
        category: 'flood',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate river valleys affected by the July 2021 western European floods; the boundary is not an inundation footprint.',
        events: [
          { name: 'Western Europe floods', date: '2021-07-14', severity: 'Severe', active: false, sourceLabel: 'European Commission Joint Research Centre', sourceUrl: 'https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/deadly-floods-western-europe-2021-2021-07-16_en' }
        ]
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[[5.2, 49.0], [6.0, 50.0], [7.5, 50.8], [8.2, 51.2], [7.8, 51.8], [6.8, 51.5], [5.8, 50.8], [5.2, 49.0]]],
          [[[6.0, 47.0], [7.0, 47.4], [8.0, 48.2], [7.5, 49.0], [6.5, 48.7], [6.0, 47.0]]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'canada-wildfire-region',
        name: 'Western Canada boreal fire region',
        category: 'wildfire',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate boreal forest region affected by Canada’s exceptional 2023 wildfire season; not a current fire perimeter.',
        events: [
          { name: 'Canada 2023 wildfire season', date: '2023-05-01', severity: 'Severe', active: false, sourceLabel: 'Natural Resources Canada', sourceUrl: 'https://natural-resources.canada.ca/forest-forestry/wildland-fires-insects-disturbances/wildland-fires/canada-reporting-system/13153' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-136.0, 60.0], [-132.0, 57.0], [-127.0, 55.0], [-122.0, 53.0], [-117.0, 52.0], [-112.0, 54.0], [-110.0, 57.0], [-114.0, 60.0], [-120.0, 62.0], [-128.0, 62.0], [-136.0, 60.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'brazil-pantanal-wildfire',
        name: 'Pantanal fire-affected region',
        category: 'wildfire',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Pantanal wetland region affected by severe fires during drought conditions; the boundary is not a fire perimeter.',
        events: [
          { name: 'Pantanal wildfires', date: '2020-07-01', severity: 'Severe', active: false, description: 'Exceptional drought and fire activity affected extensive areas of the Pantanal biome.', sourceLabel: 'NASA Earth Observatory', sourceUrl: 'https://earthobservatory.nasa.gov/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-59.8, -15.0], [-57.0, -16.0], [-55.0, -18.0], [-56.0, -21.0], [-58.5, -21.5], [-60.5, -19.0], [-59.8, -15.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mozambique-cyclone-idai',
        name: 'Central Mozambique cyclone-impact region',
        category: 'cyclone',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate inland impact region of Cyclone Idai, including areas around the lower Pungwe and Buzi basins.',
        events: [
          { name: 'Cyclone Idai', date: '2019-03-14', severity: 'Severe', active: false, description: 'The storm brought destructive winds and catastrophic flooding to Mozambique and neighbouring countries.', sourceLabel: 'World Meteorological Organization', sourceUrl: 'https://wmo.int/media/news/cyclone-idai-deadly-and-destructive-tropical-cyclone' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[32.0, -17.0], [34.0, -16.5], [36.0, -18.0], [36.5, -20.5], [35.0, -22.5], [33.0, -22.0], [32.0, -19.5], [32.0, -17.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'philippines-typhoon-haiyan',
        name: 'Eastern Philippines typhoon-impact region',
        category: 'cyclone',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Eastern Visayas region affected by Super Typhoon Haiyan; not a storm track or forecast.',
        events: [
          { name: 'Super Typhoon Haiyan (Yolanda)', date: '2013-11-08', severity: 'Severe', active: false, description: 'The exceptionally intense tropical cyclone caused destructive winds and storm surge across parts of the central Philippines.', sourceLabel: 'NOAA National Hurricane Center', sourceUrl: 'https://www.nhc.noaa.gov/data/tcr/wp312013_Haiyan.pdf' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[123.0, 12.0], [124.5, 11.0], [126.0, 10.0], [127.0, 10.5], [127.0, 12.5], [125.5, 13.5], [124.0, 13.5], [123.0, 12.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'yemen-floods',
        name: 'Yemen flood-affected highlands',
        category: 'flood',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate highland and western drainage regions repeatedly affected by intense seasonal rainfall and flash floods.',
        events: [
          { name: 'Yemen flash floods', date: '2020-04-01', severity: 'High', active: false, description: 'Heavy seasonal rainfall triggered flash flooding and landslides, damaging homes and infrastructure.', sourceLabel: 'UN Office for the Coordination of Humanitarian Affairs', sourceUrl: 'https://www.unocha.org/yemen' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[42.0, 16.0], [44.0, 15.0], [46.0, 14.0], [48.0, 14.5], [49.0, 16.5], [47.0, 18.0], [44.0, 17.5], [42.0, 16.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mediterranean-drought',
        name: 'Western Mediterranean drought-affected region',
        category: 'drought',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Iberian Peninsula region affected by prolonged rainfall deficits and water stress; not a current drought index.',
        events: [
          { name: 'Iberian drought conditions', date: '2022-01-01', severity: 'High', active: false, description: 'Persistent precipitation deficits contributed to low reservoirs, water restrictions, and agricultural impacts in parts of Spain and Portugal.', sourceLabel: 'European Commission Joint Research Centre', sourceUrl: 'https://joint-research-centre.ec.europa.eu/jrc-news-and-updates_en' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-9.5, 43.5], [-7.0, 42.0], [-3.0, 43.0], [0.0, 41.5], [2.0, 39.0], [1.0, 36.0], [-2.0, 36.0], [-6.0, 37.0], [-9.0, 39.0], [-9.5, 43.5]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'central-america-landslides',
        name: 'Central American Pacific slope landslide region',
        category: 'landslide',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate steep Pacific-facing terrain in Central America where intense rainfall can trigger landslides.',
        events: [
          { name: 'Central America storm-related landslides', date: '2020-11-05', severity: 'Severe', active: false, description: 'Extreme rainfall associated with hurricanes Eta and Iota triggered destructive landslides and flooding across the region.', sourceLabel: 'UN Office for the Coordination of Humanitarian Affairs', sourceUrl: 'https://reliefweb.int/' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-89.0, 16.0], [-87.0, 15.5], [-85.0, 14.5], [-83.0, 13.5], [-82.0, 11.5], [-84.0, 9.0], [-86.0, 9.5], [-88.0, 12.0], [-89.0, 16.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'kamchatka-volcanic-region',
        name: 'Kamchatka volcanic arc',
        category: 'volcano',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate volcanic arc of the Kamchatka Peninsula, one of the world’s most active volcanic regions; not an eruption alert.',
        events: [
          { name: 'Klyuchevskoy volcanic activity', date: '2023-10-01', severity: 'High', active: false, description: 'Klyuchevskoy and neighbouring volcanoes have recurring eruptive activity; this regional polygon indicates long-term hazard context.', sourceLabel: 'Smithsonian Global Volcanism Program', sourceUrl: 'https://volcano.si.edu/region.cfm?rnum=08' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[155.0, 61.0], [158.0, 59.0], [161.0, 56.0], [163.0, 53.0], [161.0, 51.0], [158.0, 53.0], [156.0, 56.0], [155.0, 61.0]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'central-america-volcanic-arc',
        name: 'Central America volcanic arc',
        category: 'volcano',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate volcanic belt from Guatemala through Nicaragua and Costa Rica; represents long-term volcanic hazard, not current activity.',
        events: [
          { name: 'Fuego volcanic eruptions', date: '2018-06-03', severity: 'Severe', active: false, description: 'The 2018 Fuego eruption produced pyroclastic flows and ashfall, severely affecting communities in Guatemala.', sourceLabel: 'Smithsonian Global Volcanism Program', sourceUrl: 'https://volcano.si.edu/volcano.cfm?vn=342090' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-92.0, 15.5], [-90.0, 14.0], [-88.0, 13.0], [-86.0, 12.5], [-84.0, 10.5], [-82.5, 8.0], [-84.0, 7.5], [-86.0, 9.5], [-88.5, 11.0], [-90.5, 13.0], [-92.0, 15.5]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'haiti-2010-earthquake',
        name: 'Haiti earthquake impact region',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate region around the 2010 Haiti earthquake near Port-au-Prince; this polygon is not an official shaking-intensity boundary.',
        events: [
          { name: 'Haiti earthquake', date: '2010-01-12', severity: 'Severe', active: false, description: 'A destructive magnitude 7.0 earthquake struck near Port-au-Prince, causing widespread damage and loss of life.', sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/usp000h60h/executive' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-74.8, 17.4], [-71.3, 17.4], [-71.3, 20.0], [-74.8, 20.0], [-74.8, 17.4]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'nepal-2015-earthquake',
        name: 'Gorkha earthquake impact region',
        category: 'earthquake',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate region affected by the 2015 Gorkha earthquake in central Nepal; not an official shaking-intensity boundary.',
        events: [
          { name: 'Gorkha earthquake', date: '2015-04-25', severity: 'Severe', active: false, description: 'The magnitude 7.8 earthquake caused severe damage across central Nepal and triggered landslides in the Himalaya.', sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/us20002926/executive' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[83.2, 26.3], [87.7, 26.3], [88.1, 29.5], [84.0, 30.0], [83.2, 26.3]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'pakistan-2022-floods',
        name: 'Pakistan 2022 flood-affected region',
        category: 'flood',
        scope: 'world',
        scale: 'regional',
        summary: 'Generalized region across Pakistan affected by the 2022 monsoon floods; the outline is not an inundation footprint.',
        events: [
          { name: 'Pakistan monsoon floods', date: '2022-06-14', severity: 'Severe', active: false, description: 'Exceptional monsoon rainfall and flooding affected millions of people and caused extensive damage to homes, crops, and infrastructure.', sourceLabel: 'World Bank assessment', sourceUrl: 'https://www.worldbank.org/en/news/press-release/2022/10/28/pakistan-floods-cost-over-usd-30-billion-and-reconstruction-needs-exceed-usd-16-billion-new-assessment' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[62.5, 23.5], [66.0, 23.0], [70.8, 25.0], [72.4, 29.5], [69.0, 34.0], [65.0, 33.2], [62.5, 28.5], [62.5, 23.5]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'maui-2023-wildfires',
        name: 'Maui wildfire impact region',
        category: 'wildfire',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate region around the 2023 Maui wildfires, including the Lahaina area; not a current fire perimeter.',
        events: [
          { name: 'Maui wildfires', date: '2023-08-08', severity: 'Severe', active: false, description: 'Wildfires devastated Lahaina and other parts of Maui, destroying homes and prompting a major emergency response.', sourceLabel: 'FEMA disaster record', sourceUrl: 'https://www.fema.gov/disaster/4724' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-157.3, 20.5], [-155.9, 20.5], [-155.9, 21.2], [-157.2, 21.2], [-157.3, 20.5]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'gulf-coast-hurricane-katrina',
        name: 'Gulf Coast Hurricane Katrina impact region',
        category: 'cyclone',
        scope: 'world',
        scale: 'regional',
        summary: 'Approximate Gulf Coast region affected by Hurricane Katrina; this is a historical impact area, not a forecast track or warning.',
        events: [
          { name: 'Hurricane Katrina', date: '2005-08-29', severity: 'Severe', active: false, description: 'Storm surge, extreme winds, and levee failures caused catastrophic flooding and damage along the U.S. Gulf Coast.', sourceLabel: 'U.S. National Hurricane Center report', sourceUrl: 'https://www.nhc.noaa.gov/data/tcr/AL122005_Katrina.pdf' }
        ]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-93.5, 28.0], [-89.0, 27.5], [-88.0, 30.5], [-90.0, 31.7], [-93.0, 30.8], [-93.5, 28.0]]]
      }
    }
  ],
  indiaPins: [
    {
      type: 'Feature',
      properties: {
        id: 'india-bhuj-earthquake',
        name: 'Bhuj earthquake',
        category: 'earthquake',
        summary: 'The 2001 Gujarat earthquake caused severe shaking and widespread damage across Kutch and surrounding districts. Pin marks the approximate event area, not an official intensity boundary.',
        events: [
          { name: 'Bhuj earthquake', date: '2001-01-26', severity: 'Severe', active: false, description: 'A major intraplate earthquake in Gujarat; strong shaking caused extensive building damage and loss of life.', sourceLabel: 'USGS earthquake hazards program', sourceUrl: 'https://earthquake.usgs.gov/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [70.2, 23.4] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-kashmir-earthquake',
        name: 'Kashmir earthquake region',
        category: 'earthquake',
        summary: 'Approximate location of the 2005 Kashmir earthquake impact area near the India–Pakistan border.',
        events: [
          { name: 'Kashmir earthquake', date: '2005-10-08', severity: 'Severe', active: false, description: 'A destructive magnitude 7.6 earthquake struck the Kashmir region, causing widespread damage across mountainous communities.', sourceLabel: 'USGS earthquake hazards program', sourceUrl: 'https://earthquake.usgs.gov/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [73.6, 34.5] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-sikkim-earthquake',
        name: 'Sikkim earthquake region',
        category: 'earthquake',
        summary: 'Approximate location of the 2011 Himalayan earthquake and impacts across Sikkim and neighbouring areas.',
        events: [
          { name: 'Sikkim earthquake', date: '2011-09-18', severity: 'High', active: false, description: 'A strong Himalayan earthquake triggered landslides and damaged buildings and infrastructure in Sikkim and nearby regions.', sourceLabel: 'USGS earthquake hazards program', sourceUrl: 'https://earthquake.usgs.gov/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [88.1, 27.7] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-assam-floods',
        name: 'Assam monsoon floods',
        category: 'flood',
        summary: 'Recurring Brahmaputra basin flooding affects communities, agriculture, and infrastructure in Assam.',
        events: [
          { name: 'Assam monsoon floods', date: '2022-06-15', severity: 'High', active: false, description: 'Monsoon rainfall and high river levels inundated large areas of Assam and displaced residents.', sourceLabel: 'Assam State Disaster Management Authority', sourceUrl: 'https://asdma.assam.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [92.9, 26.2] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-kerala-floods',
        name: 'Kerala floods',
        category: 'flood',
        summary: 'The 2018 Kerala floods followed exceptionally heavy monsoon rain and affected multiple districts.',
        events: [
          { name: 'Kerala floods', date: '2018-08-08', severity: 'Severe', active: false, description: 'Prolonged intense rainfall, reservoir releases, and landslides contributed to widespread flooding and evacuation needs.', sourceLabel: 'Kerala State Disaster Management Authority', sourceUrl: 'https://sdma.kerala.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [76.3, 10.5] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-chennai-floods',
        name: 'Chennai urban floods',
        category: 'flood',
        summary: 'The 2015 floods affected Chennai and parts of Tamil Nadu after exceptional rainfall.',
        events: [
          { name: 'Chennai floods', date: '2015-11-16', severity: 'Severe', active: false, description: 'Extreme rainfall and overflowing waterways caused extensive urban inundation, disruption, and displacement.', sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [80.3, 13.1] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-odisha-fani',
        name: 'Cyclone Fani landfall region',
        category: 'cyclone',
        summary: 'Approximate landfall and impact area of Cyclone Fani along the Odisha coast.',
        events: [
          { name: 'Cyclone Fani', date: '2019-05-03', severity: 'Severe', active: false, description: 'A very severe cyclonic storm made landfall near Puri, bringing destructive winds, storm surge, and heavy rainfall.', sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [85.8, 19.8] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-odisha-super-cyclone',
        name: 'Odisha Super Cyclone landfall region',
        category: 'cyclone',
        summary: 'Approximate landfall area of the 1999 Odisha Super Cyclone.',
        events: [
          { name: 'Odisha Super Cyclone', date: '1999-10-29', severity: 'Severe', active: false, description: 'The exceptionally intense cyclone brought destructive winds, storm surge, and flooding to the Odisha coast.', sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [86.0, 20.4] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-wayanad-landslides',
        name: 'Wayanad landslides',
        category: 'landslide',
        summary: 'Approximate location of the July 2024 landslides in the Wayanad highlands of Kerala.',
        events: [
          { name: 'Wayanad landslides', date: '2024-07-30', severity: 'Severe', active: false, description: 'Extreme rainfall triggered destructive landslides in hilly communities, damaging homes and transport links.', sourceLabel: 'Kerala State Disaster Management Authority', sourceUrl: 'https://sdma.kerala.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [76.1, 11.6] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-uttarakhand-floods',
        name: 'Uttarakhand flood and landslide region',
        category: 'landslide',
        summary: 'Approximate region affected by the June 2013 Uttarakhand floods and associated landslides.',
        events: [
          { name: 'Uttarakhand floods and landslides', date: '2013-06-16', severity: 'Severe', active: false, description: 'Extreme rainfall and river flooding triggered landslides and extensive damage across mountain valleys.', sourceLabel: 'National Disaster Management Authority', sourceUrl: 'https://ndma.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [79.5, 30.7] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-uttarakhand-wildfire',
        name: 'Uttarakhand forest fire region',
        category: 'wildfire',
        summary: 'Approximate forested Himalayan foothill region affected by seasonal forest fires.',
        events: [
          { name: 'Uttarakhand forest fires', date: '2021-04-01', severity: 'High', active: false, description: 'A severe pre-monsoon fire season affected forest areas and communities in Uttarakhand; this pin is not a fire perimeter.', sourceLabel: 'Forest Survey of India', sourceUrl: 'https://fsi.nic.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [79.3, 30.1] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-rajasthan-drought',
        name: 'Rajasthan drought-affected region',
        category: 'drought',
        summary: 'Approximate arid region in western Rajasthan that experiences recurrent rainfall deficits and water stress.',
        events: [
          { name: 'Northwest India drought episode', date: '2015-06-01', severity: 'High', active: false, description: 'Below-normal monsoon rainfall contributed to agricultural and water stress across parts of northwest India.', sourceLabel: 'India Meteorological Department', sourceUrl: 'https://mausam.imd.gov.in/' }
        ]
      },
      geometry: { type: 'Point', coordinates: [71.9, 26.9] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-2004-tsunami',
        name: 'Indian Ocean tsunami impact region',
        category: 'tsunami',
        summary: 'Approximate offshore source and coastal impact region for the 2004 Indian Ocean earthquake and tsunami.',
        events: [
          { name: 'Indian Ocean earthquake and tsunami', date: '2004-12-26', severity: 'Severe', active: false, description: 'A major undersea earthquake generated tsunami waves that devastated coastlines around the Indian Ocean, including India’s east coast and Andaman and Nicobar Islands.', sourceLabel: 'USGS event summary', sourceUrl: 'https://earthquake.usgs.gov/earthquakes/eventpage/official20041226005853450_30/impact' }
        ]
      },
      geometry: { type: 'Point', coordinates: [92.8, 6.5] }
    },
    {
      type: 'Feature',
      properties: {
        id: 'india-barren-island',
        name: 'Barren Island volcanic region',
        category: 'volcano',
        summary: 'Approximate location of Barren Island, India’s historically active volcano in the Andaman Sea.',
        events: [
          { name: 'Barren Island eruption', date: '1991-01-01', severity: 'High', active: false, description: 'Barren Island has had documented eruptions; this historical example is not a current eruption alert.', sourceLabel: 'Smithsonian Global Volcanism Program', sourceUrl: 'https://volcano.si.edu/volcano.cfm?vn=260010' }
        ]
      },
      geometry: { type: 'Point', coordinates: [93.9, 12.3] }
    }
  ],
  faultLines: [
    {
      type: 'Feature',
      properties: {
        id: 'san-andreas-fault',
        name: 'San Andreas Fault system',
        summary: 'Approximate trace of the major strike-slip fault system through California. This generalized line is for education, not site-specific hazard assessment.',
        sourceLabel: 'USGS California earthquake hazards',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards/science/california-earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-124.2, 40.5], [-123.8, 40.1], [-123.4, 39.6], [-123.1, 39.0], [-122.9, 38.5], [-122.7, 38.0], [-122.4, 37.5], [-122.2, 37.0], [-121.8, 36.7], [-121.4, 36.4], [-121.0, 36.2], [-120.6, 36.0], [-120.2, 35.8], [-119.8, 35.4], [-119.4, 35.1], [-119.0, 34.8], [-118.6, 34.5], [-118.2, 34.0], [-117.8, 33.7], [-117.4, 33.3], [-117.0, 33.0], [-116.5, 32.7], [-116.0, 32.5]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'cascadia-subduction-boundary',
        name: 'Cascadia Subduction Zone',
        summary: 'Approximate offshore boundary where the Juan de Fuca plate subducts beneath North America. The line is generalized and is not a rupture forecast.',
        sourceLabel: 'USGS Cascadia overview',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards/science/cascadia-subduction-zone'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-130.0, 40.5], [-129.4, 41.3], [-128.8, 42.0], [-128.2, 42.8], [-127.6, 43.5], [-127.0, 44.2], [-126.4, 45.0], [-126.0, 45.8], [-125.8, 46.6], [-125.6, 47.4], [-125.3, 48.1], [-125.0, 48.8]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'andes-subduction-zone',
        name: 'Peru–Chile Trench',
        summary: 'Generalized subduction boundary offshore western South America, where the Nazca plate descends beneath the South American plate.',
        sourceLabel: 'NOAA National Centers for Environmental Information',
        sourceUrl: 'https://www.ncei.noaa.gov/products/world-ocean-database'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-81.0, 7.0], [-80.0, 0.0], [-79.5, -8.0], [-78.5, -16.0], [-77.0, -24.0], [-75.5, -32.0], [-74.0, -40.0], [-73.0, -48.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mid-atlantic-ridge',
        name: 'Mid-Atlantic Ridge',
        summary: 'Generalized divergent plate boundary running through the Atlantic Ocean. The mapped line is an educational approximation, not a detailed fault inventory.',
        sourceLabel: 'NOAA National Centers for Environmental Information',
        sourceUrl: 'https://www.ncei.noaa.gov/products/world-ocean-database'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-31.0, 65.0], [-30.0, 55.0], [-29.0, 45.0], [-28.0, 35.0], [-25.0, 25.0], [-23.0, 15.0], [-20.0, 5.0], [-17.0, -5.0], [-14.0, -15.0], [-12.0, -25.0], [-10.0, -35.0], [-8.0, -45.0], [-5.0, -55.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'japan-kuril-trench',
        name: 'Japan and Kuril–Kamchatka trench',
        summary: 'Generalized offshore subduction boundary along northeastern Japan and the Kuril–Kamchatka arc.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[141.0, 31.0], [142.0, 32.5], [143.0, 34.0], [144.0, 35.5], [145.0, 37.0], [146.0, 38.5], [147.5, 40.0], [149.0, 41.5], [150.5, 43.0], [152.0, 44.5], [153.5, 46.0], [155.0, 47.5], [156.5, 49.0], [158.0, 50.5], [159.5, 52.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'sunda-trench',
        name: 'Sunda megathrust',
        summary: 'Generalized subduction boundary south and west of Sumatra and Java, source of major Indian Ocean earthquakes.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[92.0, 6.0], [93.0, 4.5], [94.0, 3.0], [95.5, 1.5], [97.0, 0.0], [98.5, -1.5], [100.0, -3.0], [101.5, -4.5], [103.0, -6.0], [105.0, -7.5], [107.0, -9.0], [109.5, -9.5], [112.0, -10.0], [114.5, -10.0], [117.0, -10.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'himalayan-frontal-thrust',
        name: 'Himalayan Frontal Thrust zone',
        summary: 'Generalized trace of the active Himalayan front, where convergence between the Indian and Eurasian plates deforms the mountain belt.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[73.0, 34.0], [74.5, 33.5], [76.0, 33.0], [77.5, 32.2], [79.0, 31.5], [80.5, 30.7], [82.0, 30.0], [83.5, 29.2], [85.0, 28.5], [86.5, 28.0], [88.0, 27.5], [89.5, 27.2], [91.0, 27.0], [92.5, 27.2], [94.0, 27.5]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'east-african-rift',
        name: 'East African Rift system',
        summary: 'Generalized continental rift zone extending through eastern Africa, with active faulting and volcanism.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[36.0, 12.0], [37.0, 8.0], [37.5, 4.0], [38.0, 0.0], [36.5, -4.0], [35.5, -8.0], [35.0, -12.0]],
          [[40.0, 12.0], [41.0, 8.0], [41.5, 4.0], [41.0, 0.0], [39.5, -4.0], [38.5, -8.0], [38.0, -12.0]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'north-anatolian-fault',
        name: 'North Anatolian Fault',
        summary: 'Generalized major strike-slip fault crossing northern Türkiye. This broad trace is not a parcel-level hazard map.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[27.0, 40.5], [29.0, 40.8], [31.0, 40.7], [33.0, 40.5], [35.0, 40.0], [37.0, 40.0], [39.0, 40.5], [41.0, 41.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'alpine-fault',
        name: 'Alpine Fault, New Zealand',
        summary: 'Generalized trace of the major plate-boundary fault along New Zealand’s South Island.',
        sourceLabel: 'GNS Science active faults',
        sourceUrl: 'https://www.gns.cri.nz/research-projects/active-faults-database/'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[168.0, -44.0], [168.2, -43.7], [168.4, -43.3], [168.6, -42.9], [168.8, -42.5], [169.0, -42.1], [169.2, -41.7], [169.4, -41.3], [169.7, -40.9], [170.0, -40.5]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'east-anatolian-fault',
        name: 'East Anatolian Fault',
        featureType: 'Strike-slip fault',
        tectonicSetting: 'Anatolian and Arabian plate boundary',
        summary: 'Generalized trace through southeastern Türkiye, extending from the East Anatolian region toward the Maraş triple junction. Line placement is schematic and not a detailed fault survey.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[38.5, 39.0], [38.0, 38.5], [37.5, 38.0], [37.0, 37.5], [36.5, 37.0], [36.0, 36.5], [36.0, 36.0], [36.5, 35.5], [37.0, 35.0], [37.5, 34.8]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'dead-sea-transform',
        name: 'Dead Sea Transform',
        featureType: 'Strike-slip fault system',
        tectonicSetting: 'Arabian and African plate boundary',
        summary: 'Generalized fault system extending from the Gulf of Aqaba through the Dead Sea and Jordan Valley toward southern Türkiye.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[34.9, 29.5], [35.0, 30.0], [35.2, 30.5], [35.4, 31.0], [35.5, 31.5], [35.6, 32.0], [35.7, 32.5], [35.8, 33.0], [36.0, 33.5], [36.5, 34.0], [37.0, 34.5], [37.5, 35.0], [38.0, 35.5]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'zagros-thrust-belt',
        name: 'Zagros Fold and Thrust Belt',
        featureType: 'Fold-and-thrust belt',
        tectonicSetting: 'Arabian and Eurasian plate convergence',
        summary: 'Generalized tectonically active belt along western Iran, where convergence has produced major earthquakes.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[45.0, 38.0], [46.0, 36.5], [47.0, 35.0], [48.0, 33.5], [49.0, 32.0], [50.0, 30.5], [51.0, 29.0], [52.0, 28.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'sagaing-fault',
        name: 'Sagaing Fault',
        featureType: 'Strike-slip fault',
        tectonicSetting: 'Indian and Sunda plate boundary region',
        summary: 'Generalized north–south strike-slip fault through central Myanmar, a major source of regional earthquake hazard.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[96.0, 25.5], [95.8, 24.0], [95.6, 22.5], [95.5, 21.0], [95.4, 19.5], [95.3, 18.0], [95.2, 16.5], [95.1, 15.0], [95.0, 13.5], [94.8, 12.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'philippine-fault',
        name: 'Philippine Fault Zone',
        featureType: 'Strike-slip fault system',
        tectonicSetting: 'Philippine Sea and Sunda plate boundary region',
        summary: 'Generalized segmented fault system running through the Philippine archipelago; individual mapped strands and locations vary by source.',
        sourceLabel: 'PHIVOLCS active faults and trenches',
        sourceUrl: 'https://www.phivolcs.dost.gov.ph/'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[124.0, 19.5], [124.2, 17.0], [124.5, 14.5], [125.0, 12.0], [125.2, 9.5], [125.0, 7.0]],
          [[123.5, 12.0], [123.8, 10.0], [124.0, 8.0], [124.2, 6.0], [124.0, 4.5]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'aleutian-subduction-zone',
        name: 'Aleutian–Alaska subduction zone',
        featureType: 'Subduction boundary',
        tectonicSetting: 'Pacific and North American plate boundary',
        summary: 'Generalized arcuate subduction boundary from the Alaska Peninsula along the Aleutian Islands.',
        sourceLabel: 'USGS Alaska earthquake hazards',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards/science/alaska-earthquake-hazards'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[-151.0, 54.0], [-155.0, 53.0], [-160.0, 52.0], [-165.0, 51.0], [-170.0, 51.0], [-175.0, 52.0], [-179.0, 52.3]],
          [[179.0, 52.5], [174.0, 53.0], [169.0, 53.5], [164.0, 54.0], [160.0, 55.0]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'central-america-trench',
        name: 'Middle America Trench',
        featureType: 'Subduction boundary',
        tectonicSetting: 'Cocos and Caribbean / North American plate boundary',
        summary: 'Generalized subduction boundary offshore Mexico and Central America, associated with major regional earthquakes and tsunami potential.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-105.0, 16.0], [-102.0, 15.5], [-99.0, 15.0], [-96.0, 14.5], [-93.0, 13.5], [-90.0, 12.5], [-87.0, 11.5], [-84.0, 10.5], [-81.0, 9.0], [-78.0, 8.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'lesser-antilles-subduction-zone',
        name: 'Lesser Antilles subduction zone',
        featureType: 'Subduction boundary',
        tectonicSetting: 'North American and Caribbean plate boundary',
        summary: 'Generalized curved subduction boundary east of the Lesser Antilles island arc.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-60.0, 10.0], [-60.5, 12.0], [-61.0, 14.0], [-61.0, 16.0], [-61.0, 18.0], [-60.5, 20.0], [-59.5, 22.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'tonga-kermadec-trench',
        name: 'Tonga–Kermadec Trench',
        featureType: 'Subduction boundary',
        tectonicSetting: 'Pacific and Australian plate boundary',
        summary: 'Generalized subduction trench northeast of New Zealand, part of a highly active plate boundary system.',
        sourceLabel: 'NOAA National Centers for Environmental Information',
        sourceUrl: 'https://www.ncei.noaa.gov/products/world-ocean-database'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[-176.0, -15.0], [-178.0, -20.0], [-179.5, -23.0]],
          [[179.5, -23.0], [178.5, -26.0], [177.0, -30.0], [176.0, -35.0], [176.0, -40.0]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'red-sea-rift',
        name: 'Red Sea Rift',
        featureType: 'Divergent plate boundary',
        tectonicSetting: 'African and Arabian plate separation',
        summary: 'Generalized spreading boundary along the Red Sea and Gulf of Aden, where the African and Arabian plates are diverging.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[32.5, 28.0], [33.5, 25.0], [35.0, 22.0], [37.0, 19.0], [40.0, 15.0], [44.0, 12.0], [48.0, 12.0], [51.0, 12.5]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'east-pacific-rise',
        name: 'East Pacific Rise',
        featureType: 'Divergent plate boundary',
        tectonicSetting: 'Pacific and Nazca / Cocos plate boundary',
        summary: 'Generalized mid-ocean spreading ridge in the eastern Pacific. The route is schematic and simplifies complex transform offsets.',
        sourceLabel: 'NOAA National Centers for Environmental Information',
        sourceUrl: 'https://www.ncei.noaa.gov/products/world-ocean-database'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-105.0, 32.0], [-110.0, 25.0], [-112.0, 17.0], [-110.0, 10.0], [-108.0, 2.0], [-107.0, -6.0], [-110.0, -15.0], [-112.0, -24.0], [-113.0, -33.0], [-115.0, -42.0], [-118.0, -52.0]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mid-indian-ridge',
        name: 'Central and Southwest Indian Ridge',
        featureType: 'Divergent plate boundary',
        tectonicSetting: 'African, Antarctic, and Indo-Australian plate boundaries',
        summary: 'Generalized spreading-ridge segments across the central and southwest Indian Ocean.',
        sourceLabel: 'NOAA National Centers for Environmental Information',
        sourceUrl: 'https://www.ncei.noaa.gov/products/world-ocean-database'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[68.0, 5.0], [65.0, 0.0], [62.0, -5.0], [59.0, -10.0], [56.0, -15.0], [53.0, -20.0]],
          [[53.0, -20.0], [49.0, -25.0], [45.0, -30.0], [41.0, -35.0], [37.0, -40.0], [33.0, -45.0]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'new-madrid-seismic-zone',
        name: 'New Madrid Seismic Zone',
        featureType: 'Intraplate fault zone',
        tectonicSetting: 'Reactivated faults within the North American plate',
        summary: 'Generalized central United States seismic zone associated with historic damaging earthquakes; not a single surface fault trace.',
        sourceLabel: 'USGS New Madrid Seismic Zone',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards/science/new-madrid-seismic-zone'
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [[-90.5, 36.8], [-90.0, 36.3], [-89.8, 35.8], [-90.0, 35.3], [-90.2, 34.8]],
          [[-89.5, 37.0], [-89.2, 36.5], [-89.0, 36.0], [-89.2, 35.5], [-89.5, 35.0]]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'alpine-himalayan-belt',
        name: 'Alpide (Alpine–Himalayan) seismic belt',
        featureType: 'Convergent plate-boundary system',
        tectonicSetting: 'African, Arabian, and Indian plates converging with Eurasia',
        summary: 'Generalized broad seismic belt from the Mediterranean through the Middle East and Himalaya. It represents multiple systems, not one continuous fault.',
        sourceLabel: 'USGS earthquake hazards program',
        sourceUrl: 'https://www.usgs.gov/programs/earthquake-hazards'
      },
      geometry: {
        type: 'LineString',
        coordinates: [[-5.0, 36.0], [0.0, 38.0], [8.0, 40.0], [15.0, 39.0], [22.0, 38.0], [29.0, 38.0], [36.0, 37.0], [43.0, 36.0], [50.0, 35.0], [57.0, 34.0], [64.0, 33.0], [71.0, 32.0], [78.0, 31.0], [85.0, 30.0], [92.0, 29.0], [99.0, 28.0]]
      }
    }
  ],
  tectonicPlateLabels: [
    { name: 'PACIFIC PLATE', coordinates: [-148, 8], major: true },
    { name: 'PACIFIC PLATE', coordinates: [158, 8], major: true },
    { name: 'NORTH AMERICAN PLATE', coordinates: [-103, 47], major: true },
    { name: 'SOUTH AMERICAN PLATE', coordinates: [-62, -18], major: true },
    { name: 'AFRICAN PLATE', coordinates: [19, 0], major: true },
    { name: 'EURASIAN PLATE', coordinates: [74, 52], major: true },
    { name: 'INDIAN PLATE', coordinates: [78, 16], major: true },
    { name: 'AUSTRALIAN PLATE', coordinates: [130, -27], major: true },
    { name: 'ANTARCTIC PLATE', coordinates: [20, -64], major: true },
    { name: 'NAZCA PLATE', coordinates: [-85, -22], major: false },
    { name: 'COCOS PLATE', coordinates: [-105, 10], major: false },
    { name: 'CARIBBEAN PLATE', coordinates: [-73, 15], major: false },
    { name: 'ARABIAN PLATE', coordinates: [47, 22], major: false },
    { name: 'PHILIPPINE SEA PLATE', coordinates: [145, 22], major: false },
    { name: 'JUAN DE FUCA PLATE', coordinates: [-130, 45], major: false },
    { name: 'SOMALI PLATE', coordinates: [47, -10], major: false },
    { name: 'SCOTIA PLATE', coordinates: [-33, -56], major: false }
  ]
};
