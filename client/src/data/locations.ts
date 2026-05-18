// Sullivan's Crossing – Confirmed Nova Scotia Filming Locations
// Sources: novascotia.com, atlasofwonders.com, IMDB, CBC, Playback Online, Screen Nova Scotia

export type Category =
  | "Core Set / Campground"
  | "Core Set / Town"
  | "Core Set / Residential"
  | "Core Set / Cabin"
  | "Dining & Gathering"
  | "Landmark / Hotel"
  | "Landmark / Cultural"
  | "Landmark / Infrastructure"
  | "Coastal / Landmark"
  | "Coastal / Village"
  | "Coastal / Town"
  | "Nature / Park"
  | "Nature / Beach"
  | "Nature / Waterfall"
  | "Street / Urban"
  | "Activity / Farm"
  | "Activity / Entertainment"
  | "Institutional"
  | "Urban / Commercial"
  | "Production / Soundstage";

export type Season =
  | "All Seasons"
  | "Season 1"
  | "Season 2"
  | "Season 3"
  | "Season 4"
  | "Seasons 1 & 2"
  | "Seasons 2 & 3"
  | "Multiple Seasons"
  | "Season 2+";

export interface Location {
  id: number;
  name: string;
  showName: string;
  description: string;
  season: Season;
  category: Category;
  address: string;
  lat: number;
  lon: number;
  visitorTip: string;
  publicAccess: boolean;
  mapsUrl?: string;
}

export const locations: Location[] = [
  // ─── CORE SET / CAMPGROUND ───────────────────────────────────────────────────
  {
    id: 1,
    name: "Harold T. Barrett Fun Forest Camp",
    showName: "Sullivan's Crossing Campground",
    description:
      "The primary filming location for the Sullivan's Crossing campground. This Scouts Canada–operated facility on Beaver Bank Lake (est. 2000) sits on a 5-acre property ~25 km north of Halifax. The camp's forested lakeside setting perfectly captures the spirit of Sully's beloved campground.",
    season: "All Seasons",
    category: "Core Set / Campground",
    address: "1901 Beaver Bank Rd, Beaver Bank, NS",
    lat: 44.8595,
    lon: -63.6632,
    visitorTip: "Private property – not open to the public, but the entrance gate and sign are visible from Beaver Bank Road. Many fans drive by for a photo!",
    publicAccess: false,
    mapsUrl: "https://maps.app.goo.gl/RgHdh8UMmWMEizMK6",
  },
  {
    id: 2,
    name: "Beaver Bank Road – Timberlake Town Set",
    showName: "Timberlake Town Exterior",
    description:
      "A purpose-built film set constructed in 2021 featuring approximately 10 buildings including a church, diner, and mansion used for all Timberlake exterior town scenes. The set was built specifically for the show's first season and has been used throughout all subsequent seasons.",
    season: "All Seasons",
    category: "Core Set / Town",
    address: "Beaver Bank Rd, Beaver Bank, NS",
    lat: 44.8019,
    lon: -63.6881,
    visitorTip: "The set is on private land near Beaver Bank Road. Fans have spotted it from the road – look for the distinctive buildings as you drive through.",
    publicAccess: false,
  },
  {
    id: 3,
    name: "Sully's House (9 Omega Court, Hubley)",
    showName: "Sully's House",
    description:
      "The gorgeous lakefront home used as Sully's house is located on Five Islands Lake in Hubley, ~15 km west of downtown Halifax. A four-bedroom, two-storey property that was valued at $750,000 in 2020 according to local real estate agents.",
    season: "All Seasons",
    category: "Core Set / Residential",
    address: "9 Omega Ct, Hubley, NS",
    lat: 44.6400,
    lon: -63.7900,
    visitorTip: "Private residence – please respect the owners' privacy and do not approach the property.",
    publicAccess: false,
    mapsUrl: "https://maps.app.goo.gl/UMFpcbJFaDByG8f78",
  },

  // ─── HALIFAX CITY ────────────────────────────────────────────────────────────
  {
    id: 4,
    name: "Hali Deli",
    showName: "Shandon's Diner (Seasons 1 & 2)",
    description:
      "This cozy Jewish-style delicatessen on Agricola Street in Halifax's North End served as Shandon's Diner for the first two seasons. Both interior and exterior scenes were filmed here. Features retro old-world decor, a beautifully detailed ceiling, and hearty comfort food.",
    season: "Seasons 1 & 2",
    category: "Dining & Gathering",
    address: "2389 Agricola St, Halifax, NS B3K 4B8",
    lat: 44.6572,
    lon: -63.5960,
    visitorTip: "Open to the public! Try the smoked meat sandwiches, latkes, fish and chips, and all-day breakfast. Sit in the same booths as Maggie and the gang!",
    publicAccess: true,
    mapsUrl: "https://maps.app.goo.gl/PSNSBtqZ83CCNh3w6",
  },
  {
    id: 5,
    name: "The Brown Hound Public House",
    showName: "Local Pub (Season 1, Ep. 5 'Pressure Drop')",
    description:
      "This British-style pub on Agricola Street, directly across from Hali Deli, appeared in Season 1, Episode 5 ('Pressure Drop'). It's a real neighbourhood pub beloved by locals.",
    season: "Season 1",
    category: "Dining & Gathering",
    address: "2394 Agricola St, Halifax, NS B3K 4B9",
    lat: 44.6574,
    lon: -63.5958,
    visitorTip: "Open to the public – a classic British pub experience right across from Hali Deli. Perfect for a fan double-stop!",
    publicAccess: true,
    mapsUrl: "https://maps.app.goo.gl/PSNSBtqZ83CCNh3w6",
  },
  {
    id: 6,
    name: "Prince George Hotel",
    showName: "Awards Ceremony Gala (Season 1, Ep. 1)",
    description:
      "The grand ballroom of this 203-room downtown Halifax hotel was used for the awards ceremony gala scene in the very first episode of Season 1, when Maggie is dramatically removed from the event. Located in the heart of downtown Halifax.",
    season: "Season 1",
    category: "Landmark / Hotel",
    address: "1725 Market St, Halifax, NS B3J 3N9",
    lat: 44.6475,
    lon: -63.5763,
    visitorTip: "Stay here for the ultimate Sullivan's Crossing fan experience! Walking distance to the Halifax Waterfront, Public Gardens, and Neptune Theatre.",
    publicAccess: true,
  },
  {
    id: 7,
    name: "The Mercantile Social",
    showName: "Boston Restaurant (Season 1, Ep. 6 'Boiling Point')",
    description:
      "This stylish kitchen and bar in downtown Halifax doubled as the Boston restaurant featured in Season 1, Episode 6 ('Boiling Point'). The upscale setting was used to represent Maggie's Boston life.",
    season: "Season 1",
    category: "Dining & Gathering",
    address: "1869 Upper Water St, Halifax, NS",
    lat: 44.6467,
    lon: -63.5701,
    visitorTip: "Open to the public – enjoy the same stylish atmosphere seen on screen, right on the Halifax waterfront.",
    publicAccess: true,
    mapsUrl: "https://maps.app.goo.gl/PSNSBtqZ83CCNh3w6",
  },
  {
    id: 8,
    name: "Art Gallery of Nova Scotia",
    showName: "Hot Dog Scene (Season 1, Ep. 6 'Boiling Point')",
    description:
      "The exterior of the Art Gallery of Nova Scotia, located just two blocks from The Mercantile Social, was used for the memorable hot dog scene in Season 1, Episode 6. Atlantic Canada's largest art museum.",
    season: "Season 1",
    category: "Landmark / Cultural",
    address: "1723 Hollis St, Halifax, NS B3J 1V9",
    lat: 44.6468,
    lon: -63.5715,
    visitorTip: "Atlantic Canada's largest art museum – well worth a visit beyond the show connection! Free admission on certain days.",
    publicAccess: true,
  },
  {
    id: 9,
    name: "Doyle Street & George Street",
    showName: "Bob's Scene & Law Office (Season 1, Ep. 6)",
    description:
      "The scene with Bob was filmed on Doyle Street in Downtown Halifax. The law office building is located at 5151 George Street, just around the corner in the heart of the downtown legal district.",
    season: "Season 1",
    category: "Street / Urban",
    address: "Doyle St / 5151 George St, Halifax, NS",
    lat: 44.6490,
    lon: -63.5740,
    visitorTip: "Stroll through downtown Halifax and spot these familiar streets – both are within easy walking distance of each other.",
    publicAccess: true,
  },
  {
    id: 10,
    name: "Syncline House, Point Pleasant Park",
    showName: "Key Scene (Season 1, Ep. 6 'Boiling Point')",
    description:
      "A visually striking contemporary residence in Halifax's Point Pleasant Park, designed by Omar Gandhi Architects in 2017. Used for a pivotal scene at the end of Season 1, Episode 6. The home's minimalist Lego-block design makes it instantly recognisable.",
    season: "Season 1",
    category: "Core Set / Residential",
    address: "Francklyn St, Point Pleasant Park, Halifax, NS",
    lat: 44.6200,
    lon: -63.5700,
    visitorTip: "Point Pleasant Park is a beautiful public park – the Syncline House is visible from Francklyn St (second house on the right after turning from Point Pleasant Dr).",
    publicAccess: false,
  },
  {
    id: 11,
    name: "Rafe's House (5677 Woodill Street)",
    showName: "Rafe's House (Season 2+)",
    description:
      "Rafe's house exterior is a heritage home built in 1893, located at 5677 Woodill Street in Halifax's North End, just off Agricola Street and close to Hali Deli. The Victorian-era home perfectly suits Rafe's character.",
    season: "Season 2+",
    category: "Core Set / Residential",
    address: "5677 Woodill St, Halifax, NS",
    lat: 44.6580,
    lon: -63.5940,
    visitorTip: "Private residence – please respect the owners' privacy. The exterior is visible from the street.",
    publicAccess: false,
  },
  {
    id: 12,
    name: "Agricola Street Brasserie",
    showName: "Restaurant Scene (Season 2, Ep. 4)",
    description:
      "This French-inspired bistro in Halifax's North End appeared as a restaurant in Season 2, Episode 4. Known for its warm atmosphere and excellent French cuisine.",
    season: "Season 2",
    category: "Dining & Gathering",
    address: "2367 Agricola St, Halifax, NS",
    lat: 44.6568,
    lon: -63.5965,
    visitorTip: "Open to the public – enjoy French-inspired cuisine in a cozy North End setting. A short walk from Hali Deli.",
    publicAccess: true,
  },
  {
    id: 13,
    name: "Angus L. Macdonald Bridge",
    showName: "Bridge Scene (Season 4, Ep. 5 'Abandoning')",
    description:
      "The iconic Angus L. Macdonald suspension bridge linking Halifax and Dartmouth featured in Season 4, Episode 5 ('Abandoning'). One of Halifax's most recognisable landmarks, it spans the Halifax Harbour.",
    season: "Season 4",
    category: "Landmark / Infrastructure",
    address: "Macdonald Bridge, Halifax/Dartmouth, NS",
    lat: 44.6637,
    lon: -63.5846,
    visitorTip: "Walk or cycle across the bridge for stunning views of Halifax Harbour – a free and iconic experience!",
    publicAccess: true,
  },
  {
    id: 14,
    name: "Bayers Road Centre",
    showName: "Nova Scotia Board of Physicians HQ (Season 4)",
    description:
      "The Bayers Road Centre in Halifax served as the exterior of the Nova Scotia Board of Physicians headquarters in Season 4. The commercial centre's modern facade was used for institutional scenes.",
    season: "Season 4",
    category: "Urban / Commercial",
    address: "Bayers Rd, Halifax, NS",
    lat: 44.6530,
    lon: -63.6200,
    visitorTip: "A recognisable Halifax commercial centre – the exterior is visible from Bayers Road.",
    publicAccess: true,
  },
  {
    id: 15,
    name: "Halifax Waterfront",
    showName: "Waterfront Scenes (Multiple Seasons)",
    description:
      "The nearly four-kilometre boardwalk on the Halifax Waterfront features in scenic shots throughout the series. One of Canada's most celebrated urban waterfronts, it stretches from Purdy's Wharf to Pier 21.",
    season: "Multiple Seasons",
    category: "Coastal / Village",
    address: "Halifax Waterfront Boardwalk, Halifax, NS",
    lat: 44.6476,
    lon: -63.5680,
    visitorTip: "A must-do! Walk the full boardwalk, visit the Historic Properties, and take a harbour tour with J. Farwell Sailing Co. (also seen in the show).",
    publicAccess: true,
  },

  // ─── DARTMOUTH ───────────────────────────────────────────────────────────────
  {
    id: 16,
    name: "Shubie Park",
    showName: "Scenic Park Scenes (Multiple Seasons)",
    description:
      "This 16-hectare urban park in Dartmouth, maintained by Halifax Regional Municipality, features prominently in scenic shots throughout the series. Includes trails along the historic Shubenacadie Canal, a campground, and lake access.",
    season: "Multiple Seasons",
    category: "Nature / Park",
    address: "Shubie Park, Dartmouth, NS",
    lat: 44.7050,
    lon: -63.5350,
    visitorTip: "Paddle the Shubenacadie Canal or hike the trails – a beautiful spot year-round. The campground here is open in summer for an immersive fan stay.",
    publicAccess: true,
  },
  {
    id: 17,
    name: "Portland Street, Dartmouth",
    showName: "Street Scenes (Season 2, Ep. 5 'Secrets')",
    description:
      "Portland Street in Dartmouth was used for the street scene with Maggie and Sydney and the coffee scene with Rafe and Rob in Season 2, Episode 5 ('Secrets'). Dartmouth's vibrant main street.",
    season: "Season 2",
    category: "Street / Urban",
    address: "Portland St, Dartmouth, NS",
    lat: 44.6680,
    lon: -63.5680,
    visitorTip: "Dartmouth's main street – explore the local shops, cafés, and restaurants. Easily accessible by ferry from Halifax.",
    publicAccess: true,
  },
  {
    id: 18,
    name: "Timber Lounge Axe Throwing",
    showName: "Axe Throwing Scene (Season 2, Ep. 6 'Revelations')",
    description:
      "This axe throwing venue in Dartmouth appeared in Season 2, Episode 6 ('Revelations'). Atlantic Canada's premier axe throwing facility, inspired by traditional lumberjack heritage.",
    season: "Season 2",
    category: "Activity / Entertainment",
    address: "16 Portland St, Dartmouth, NS B2Y 1G9",
    lat: 44.6690,
    lon: -63.5670,
    visitorTip: "Open to the public – try axe throwing yourself! A super fun fan activity. Book in advance on weekends.",
    publicAccess: true,
  },
  {
    id: 19,
    name: "NSCC Ivany Campus",
    showName: "Hospital – Surgery Scenes (Multiple Seasons)",
    description:
      "The NSCC Ivany Campus in Woodside, Dartmouth was used as the hospital where Maggie performs surgery on Edna and other medical scenes throughout the series. Confirmed by a fan who identified it in April 2026.",
    season: "Multiple Seasons",
    category: "Institutional",
    address: "80 Mawio'mi Place, Dartmouth, NS B2Y 0A5",
    lat: 44.6750,
    lon: -63.5300,
    visitorTip: "An active educational campus – the exterior architecture is visible from the road.",
    publicAccess: false,
  },

  // ─── EASTERN PASSAGE / FISHERMAN'S COVE ─────────────────────────────────────
  {
    id: 20,
    name: "Fisherman's Cove / Government Wharf Road",
    showName: "Waterfront & Wharf Scenes (Seasons 1 & 2)",
    description:
      "This historic fishing village in Eastern Passage featured in multiple scenes: Sydney and Rafe's motorbike walk (Season 1), a community gathering backdrop, and characters exploring colourful waterfront shops (Season 2). Brightly coloured buildings line the boardwalk.",
    season: "Seasons 1 & 2",
    category: "Coastal / Village",
    address: "Government Wharf Rd, Eastern Passage, NS",
    lat: 44.6290,
    lon: -63.4950,
    visitorTip: "Stroll the boardwalk, visit boutiques and local art galleries, and enjoy views of Halifax Harbour and McNabs Island. A charming half-day trip from Halifax.",
    publicAccess: true,
  },
  {
    id: 21,
    name: "Boondocks Restaurant",
    showName: "Community Gathering & Poker Game (Season 1, Ep. 7)",
    description:
      "This waterfront restaurant at Fisherman's Cove appeared as a backdrop for a community gathering and the poker game scene in Season 1, Episode 7 ('Second Chances') – including the scene where Cal gets punched by Andrew. Also used for Season 2 scenes.",
    season: "Seasons 1 & 2",
    category: "Dining & Gathering",
    address: "6 Government Wharf Rd, Eastern Passage, NS B3G 1M7",
    lat: 44.6285,
    lon: -63.4945,
    visitorTip: "Open to the public – enjoy fresh seafood with stunning harbour views. Sit on the waterfront deck for the best experience!",
    publicAccess: true,
  },

  // ─── PROVINCIAL PARKS ────────────────────────────────────────────────────────
  {
    id: 22,
    name: "Oakfield Provincial Park",
    showName: "Campground Scenes (Multiple Seasons)",
    description:
      "Scenes for the Sullivan's Crossing campground were filmed at this popular summer park on Grand Lake, ~30 km north of Halifax. Features a supervised freshwater beach, kayaking, and canoeing. Active filming was confirmed by locals in September 2024.",
    season: "Multiple Seasons",
    category: "Nature / Park",
    address: "366 Oakfield Park Rd, Grand Lake, NS B2T 1B3",
    lat: 44.9182,
    lon: -63.5944,
    visitorTip: "Open summers – swim in Grand Lake or bring a canoe/kayak for an immersive fan experience. One of the best ways to feel like you're at Sully's campground!",
    publicAccess: true,
  },
  {
    id: 23,
    name: "Laurie Provincial Park",
    showName: "Campground Scenes (Multiple Seasons)",
    description:
      "This peaceful lakeside park near Grand Lake, adjacent to Oakfield Provincial Park, also contributed campground scenes to the show. Known for its clean, spacious campsites and calm lake waters.",
    season: "Multiple Seasons",
    category: "Nature / Park",
    address: "4949 Hwy 2, Grand Lake, NS B0N 1Z0",
    lat: 44.9300,
    lon: -63.5800,
    visitorTip: "Open summers – a quieter alternative to Oakfield Park, with the same Grand Lake access. Perfect for a peaceful fan pilgrimage.",
    publicAccess: true,
  },
  {
    id: 24,
    name: "Lawrencetown Beach Provincial Park",
    showName: "Coastal Driving Scenes (Multiple Seasons)",
    description:
      "This long stretch of coastal land and beach ~30 minutes from Halifax appeared in sweeping coastal driving shots and establishing scenes throughout the series. Known for its rocky shoreline, rolling waves, and mix of families and surfers.",
    season: "Multiple Seasons",
    category: "Nature / Beach",
    address: "Lawrencetown Beach, NS (Route 207)",
    lat: 44.6442,
    lon: -63.3409,
    visitorTip: "A popular surf beach – great for swimming, surfing, and coastal walks. Rent a surfboard and channel your inner Nova Scotian!",
    publicAccess: true,
  },

  // ─── SOUTH SHORE ─────────────────────────────────────────────────────────────
  {
    id: 25,
    name: "Peggy's Cove Lighthouse",
    showName: "Opening Credits & Scenic Shots (All Seasons)",
    description:
      "One of Canada's most photographed lighthouses, featured in the opening credits, numerous establishing shots, and the motorbike scene with Sydney and Rafe (Season 1). Built in 1915, it stands watch over the fishing village of Peggy's Cove atop dramatic granite outcroppings.",
    season: "All Seasons",
    category: "Coastal / Landmark",
    address: "Peggy's Cove, NS B3Z 3S1",
    lat: 44.4919,
    lon: -63.9189,
    visitorTip: "A must-visit! Try the gingerbread at Sou'Wester Gift Shop & Restaurant. IMPORTANT: Stay off the black rocks – they are extremely slippery and dangerous.",
    publicAccess: true,
  },
  {
    id: 26,
    name: "Terence Bay Lighthouse",
    showName: "Cabin Sequence & Establishing Shots (Season 2+)",
    description:
      "The secluded cabin sequence with Sully and Frank in Season 2, Episode 3 ('Confessions') was filmed near this lighthouse. It also appears very often as an establishing shot throughout the series, representing the rugged Nova Scotia coastline.",
    season: "Season 2+",
    category: "Coastal / Landmark",
    address: "Terence Bay, NS",
    lat: 44.4602,
    lon: -63.7058,
    visitorTip: "A scenic coastal drive to a working lighthouse – beautiful for photography, especially at sunset.",
    publicAccess: true,
  },
  {
    id: 27,
    name: "Mahone Bay",
    showName: "Timberlake Establishing Shots (All Seasons)",
    description:
      "This charming South Shore town, famous for its iconic trio of historic churches overlooking the harbour, is one of the most recurring establishing shots used to represent Timberlake throughout all seasons. The three churches reflected in the calm harbour waters are instantly recognisable.",
    season: "All Seasons",
    category: "Coastal / Town",
    address: "Mahone Bay, NS",
    lat: 44.4489,
    lon: -64.3819,
    visitorTip: "Stroll the charming main street, pop into boutiques, galleries, and cafés. The three churches are best photographed from the waterfront in the morning light.",
    publicAccess: true,
  },
  {
    id: 28,
    name: "Lunenburg (Old Town)",
    showName: "Small-Town Scenes (Season 3, Ep. 3)",
    description:
      "This UNESCO World Heritage Site featured in Season 3, Episode 3 ('The Ties That Bind') with a scene between Jacob and Lola. Its vibrant waterfront and historic buildings inspired the show's small-town feel throughout the series.",
    season: "Season 3",
    category: "Coastal / Town",
    address: "Old Town Lunenburg, NS",
    lat: 44.3783,
    lon: -64.3108,
    visitorTip: "A UNESCO World Heritage Site – explore the colourful steep streets, galleries, and harbour. Don't miss the Fisheries Museum of the Atlantic!",
    publicAccess: true,
  },
  {
    id: 29,
    name: "Indian Falls (Newburne)",
    showName: "Waterfall Scenes (Season 1, Eps. 7 & 8)",
    description:
      "This lovely 10–15 ft waterfall on the North Branch LaHave River near Newburne in Lunenburg County appeared in Season 1, Episodes 7 ('Second Chances') and 8 ('Aftershock'). A beautiful natural swimming hole in summer.",
    season: "Season 1",
    category: "Nature / Waterfall",
    address: "1585 Newburne Rd, Newburne, NS B0R 1A0",
    lat: 44.5200,
    lon: -64.7500,
    visitorTip: "A beautiful short hike to a scenic waterfall – open May to December. Popular for swimming in summer. Off Hwy 103 Exit 11.",
    publicAccess: true,
  },

  // ─── HUBBARDS AREA (SEASON 3 FOCUS) ─────────────────────────────────────────
  {
    id: 30,
    name: "Hubbards Beach – Wyndy Crest (Rob's House)",
    showName: "Rob's House (Season 3)",
    description:
      "The Wyndy Crest rental property at Hubbards Beach Campground on St. Margaret's Bay appears as Rob's house in Season 3. Features an oceanfront dock. Many other key scenes were also filmed on the grounds and surrounding beach.",
    season: "Season 3",
    category: "Core Set / Residential",
    address: "226 Shore Club Rd, Hubbards, NS B0J 1T0",
    lat: 44.6350,
    lon: -64.0500,
    visitorTip: "Stay here! Wyndy Crest is available to rent from ~$455/night. The ultimate Sullivan's Crossing fan experience – sleep in Rob's house!",
    publicAccess: true,
  },
  {
    id: 31,
    name: "Hubbards Beach – Silver Birches (Cal's Cabin)",
    showName: "Cal's Cabin (Season 3)",
    description:
      "The Silver Birches cabin at Hubbards Beach Campground on Dauphinees Lake served as Cal's cabin in Season 3. These charming cabins were built between 1927 and 1955 and accommodate up to 6 guests.",
    season: "Season 3",
    category: "Core Set / Cabin",
    address: "226 Shore Club Rd, Hubbards, NS B0J 1T0",
    lat: 44.6355,
    lon: -64.0510,
    visitorTip: "Book the Silver Birches cabin for an authentic Cal's cabin experience – from ~$305/night. A truly immersive fan stay!",
    publicAccess: true,
  },
  {
    id: 32,
    name: "Hubbards Beach – New Shandon's Diner Building",
    showName: "New Shandon's Diner (Season 3)",
    description:
      "In Season 3, the new Shandon's Diner is set in a building on Schwartz Lake, which is part of the Hubbards Beach Campground complex. The lakeside setting gives the diner a fresh, scenic look compared to the Halifax original.",
    season: "Season 3",
    category: "Dining & Gathering",
    address: "226 Shore Club Rd, Hubbards, NS B0J 1T0",
    lat: 44.6360,
    lon: -64.0520,
    visitorTip: "Part of the Hubbards Beach Campground complex – visit the grounds to see the building used as the new diner.",
    publicAccess: true,
  },
  {
    id: 33,
    name: "Tuna Blue Inn and Restaurant",
    showName: "Inn & Restaurant Scene (Season 3, Ep. 5 'Misunderstandings')",
    description:
      "This charming two-storey waterfront building on the edge of Hubbards Cove appeared in Season 3, Episode 5 ('Misunderstandings'). Features a marina, beer garden, and lobster feast pergola.",
    season: "Season 3",
    category: "Dining & Gathering",
    address: "167 Shore Club Rd, Hubbards, NS B0J 1T0",
    lat: 44.6330,
    lon: -64.0480,
    visitorTip: "Open to the public – enjoy stunning cove views over dinner and drinks. The lobster feast is a must-try!",
    publicAccess: true,
  },

  // ─── HANTS COUNTY ────────────────────────────────────────────────────────────
  {
    id: 34,
    name: "Hatfield Farm Cowboy Adventures",
    showName: "Campsite Party / Rodeo (Season 1, Ep. 3 'Detours')",
    description:
      "Sully's campsite season opening party in Season 1, Episode 3 ('Detours') was filmed at the Hatfield Farm lodge in Hammonds Plains. The rodeo-themed event space features prominently. A family favourite just outside Halifax.",
    season: "Season 1",
    category: "Activity / Farm",
    address: "1840 Hammonds Plains Rd, Hammonds Plains, NS B4B 1P4",
    lat: 44.7200,
    lon: -63.8100,
    visitorTip: "Open to the public! Enjoy wagon rides, pony rides, animal petting, and a playground. A great family outing inspired by the show.",
    publicAccess: true,
  },
  {
    id: 35,
    name: "Mount Uniacke Fire Station",
    showName: "Fire Station (Seasons 2 & 3)",
    description:
      "The fire station in Seasons 2 and 3 is located in Mount Uniacke, NS. Confirmed by local community members who witnessed filming on location.",
    season: "Seasons 2 & 3",
    category: "Institutional",
    address: "Mount Uniacke, NS",
    lat: 44.9100,
    lon: -63.8700,
    visitorTip: "A small community fire station – viewable from the road. Mount Uniacke is also home to the historic Uniacke Estate Museum Park.",
    publicAccess: false,
  },
  {
    id: 36,
    name: "Ettinger Falls (Three Mile Plains)",
    showName: "Rescue Scene (Season 3, Ep. 2 'Out of the Blue')",
    description:
      "The dramatic rescue scene in Season 3, Episode 2 ('Out of the Blue') was filmed at Ettinger Falls on Falls Brook in Three Mile Plains, Hants County. The falls drop ~15–20 ft into a natural pool that is popular for swimming in summer.",
    season: "Season 3",
    category: "Nature / Waterfall",
    address: "Three Mile Plains, Hants County, NS",
    lat: 45.0200,
    lon: -64.0800,
    visitorTip: "A hidden gem waterfall – popular for swimming and cliff jumping in summer. A scenic detour on any South Shore road trip.",
    publicAccess: true,
  },

  // ─── SEASON 4 / PRODUCTION ───────────────────────────────────────────────────
  {
    id: 37,
    name: "Screen Nova Scotia Soundstage (Mount Uniacke)",
    showName: "Primary Interior Production Facility (Season 4)",
    description:
      "Sullivan's Crossing Season 4 was the inaugural production at this brand-new 20-acre soundstage facility in Mount Uniacke, purchased by Screen Nova Scotia in March 2025 for $5 million. The facility includes two clear-span soundstages and was renovated with a further $2.2 million investment. Season 4 premiered in Canada on CTV/Crave in 2026.",
    season: "Season 4",
    category: "Production / Soundstage",
    address: "68/70 Highway 1, Mount Uniacke, NS B0N 1Z0",
    lat: 44.9050,
    lon: -63.8450,
    visitorTip: "A professional production facility – not open to the public. The new home of Sullivan's Crossing interior filming for Season 4 and beyond.",
    publicAccess: false,
  },
];

export const categories: { name: Category; color: string; icon: string }[] = [
  { name: "Core Set / Campground", color: "#2d7d7d", icon: "⛺" },
  { name: "Core Set / Town", color: "#2d7d7d", icon: "🏘️" },
  { name: "Core Set / Residential", color: "#2d7d7d", icon: "🏠" },
  { name: "Core Set / Cabin", color: "#2d7d7d", icon: "🪵" },
  { name: "Dining & Gathering", color: "#c8860a", icon: "🍽️" },
  { name: "Landmark / Hotel", color: "#1a2e3b", icon: "🏨" },
  { name: "Landmark / Cultural", color: "#1a2e3b", icon: "🎨" },
  { name: "Landmark / Infrastructure", color: "#1a2e3b", icon: "🌉" },
  { name: "Coastal / Landmark", color: "#4a90a4", icon: "🏮" },
  { name: "Coastal / Village", color: "#4a90a4", icon: "⚓" },
  { name: "Coastal / Town", color: "#4a90a4", icon: "🏙️" },
  { name: "Nature / Park", color: "#4a7c59", icon: "🌲" },
  { name: "Nature / Beach", color: "#4a7c59", icon: "🏖️" },
  { name: "Nature / Waterfall", color: "#4a7c59", icon: "💧" },
  { name: "Street / Urban", color: "#6b5b45", icon: "🛤️" },
  { name: "Activity / Farm", color: "#8b6914", icon: "🐎" },
  { name: "Activity / Entertainment", color: "#8b6914", icon: "🪓" },
  { name: "Institutional", color: "#5a5a7a", icon: "🏛️" },
  { name: "Urban / Commercial", color: "#5a5a7a", icon: "🏢" },
  { name: "Production / Soundstage", color: "#7a3a5a", icon: "🎬" },
];

export const categoryGroups = [
  {
    label: "Core Set",
    color: "#2d7d7d",
    markerColor: "#2d7d7d",
    categories: ["Core Set / Campground", "Core Set / Town", "Core Set / Residential", "Core Set / Cabin"],
  },
  {
    label: "Dining & Gathering",
    color: "#c8860a",
    markerColor: "#c8860a",
    categories: ["Dining & Gathering"],
  },
  {
    label: "Landmarks",
    color: "#1a2e3b",
    markerColor: "#1a2e3b",
    categories: ["Landmark / Hotel", "Landmark / Cultural", "Landmark / Infrastructure"],
  },
  {
    label: "Coastal",
    color: "#4a90a4",
    markerColor: "#4a90a4",
    categories: ["Coastal / Landmark", "Coastal / Village", "Coastal / Town"],
  },
  {
    label: "Nature",
    color: "#4a7c59",
    markerColor: "#4a7c59",
    categories: ["Nature / Park", "Nature / Beach", "Nature / Waterfall"],
  },
  {
    label: "Streets & Activities",
    color: "#8b6914",
    markerColor: "#8b6914",
    categories: ["Street / Urban", "Activity / Farm", "Activity / Entertainment"],
  },
  {
    label: "Institutional",
    color: "#5a5a7a",
    markerColor: "#5a5a7a",
    categories: ["Institutional", "Urban / Commercial"],
  },
  {
    label: "Production",
    color: "#7a3a5a",
    markerColor: "#7a3a5a",
    categories: ["Production / Soundstage"],
  },
];

export const seasonColors: Record<string, string> = {
  "All Seasons": "#1a2e3b",
  "Season 1": "#2d7d7d",
  "Season 2": "#c8860a",
  "Season 3": "#4a7c59",
  "Season 4": "#7a3a5a",
  "Seasons 1 & 2": "#4a90a4",
  "Seasons 2 & 3": "#8b6914",
  "Multiple Seasons": "#5a5a7a",
  "Season 2+": "#6b5b45",
};

export function getMarkerColor(location: Location): string {
  for (const group of categoryGroups) {
    if (group.categories.includes(location.category)) {
      return group.markerColor;
    }
  }
  return "#1a2e3b";
}
