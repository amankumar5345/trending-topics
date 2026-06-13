export interface LocationConfig {
  subreddits: string[];
  fallbackSubreddits?: string[];
  keywords: string[];
}

// Subreddit names verified to work with meme-api.com (image-heavy communities)
// ❌ = 400/403 from meme-api.com → use state fallback + keyword filter

export const STATES: Record<string, LocationConfig> = {
  "Andhra Pradesh": {
    subreddits: ["andhra"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["andhra", "vijayawada", "vizag", "visakhapatnam", "tirupati", "guntur"],
  },
  "Arunachal Pradesh": {
    subreddits: ["IndianDankMemes"],
    keywords: ["arunachal", "itanagar", "tawang"],
  },
  "Assam": {
    subreddits: ["assam", "guwahati"],
    keywords: ["assam", "guwahati", "dibrugarh", "silchar"],
  },
  "Bihar": {
    subreddits: ["Bihar", "patna"],
    keywords: ["bihar", "patna", "gaya", "muzaffarpur", "bhagalpur"],
  },
  "Chhattisgarh": {
    subreddits: ["IndianDankMemes"],
    keywords: ["chhattisgarh", "raipur", "bilaspur", "durg", "bhilai"],
  },
  "Goa": {
    subreddits: ["Goa", "goa"],
    keywords: ["goa", "panaji", "margao", "vasco"],
  },
  "Gujarat": {
    subreddits: ["gujarat", "surat"],
    keywords: ["gujarat", "ahmedabad", "surat", "vadodara", "rajkot", "gandhinagar"],
  },
  "Haryana": {
    subreddits: ["gurgaon", "noida"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["haryana", "gurugram", "gurgaon", "faridabad", "ambala", "panipat", "rohtak"],
  },
  "Himachal Pradesh": {
    subreddits: ["himachalpradesh"],
    keywords: ["himachal", "shimla", "manali", "dharamshala", "kullu"],
  },
  "Jharkhand": {
    subreddits: ["jharkhand", "rourkela"],
    keywords: ["jharkhand", "ranchi", "jamshedpur", "dhanbad", "deoghar", "bokaro", "hazaribagh"],
  },
  "Karnataka": {
    subreddits: ["bangalore", "karnataka"],
    keywords: ["karnataka", "bangalore", "bengaluru", "mysuru", "hubli", "mangalore"],
  },
  "Kerala": {
    subreddits: ["Kerala", "kerala", "kochi"],
    keywords: ["kerala", "kochi", "cochin", "thiruvananthapuram", "trivandrum", "kozhikode", "thrissur"],
  },
  "Madhya Pradesh": {
    subreddits: ["bhopal", "indore"],
    keywords: ["madhya pradesh", "bhopal", "indore", "gwalior", "jabalpur", "ujjain"],
  },
  "Maharashtra": {
    subreddits: ["maharashtra", "pune"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["maharashtra", "mumbai", "pune", "nashik", "aurangabad", "thane", "solapur"],
  },
  "Manipur": {
    subreddits: ["IndianDankMemes"],
    keywords: ["manipur", "imphal", "churachandpur"],
  },
  "Meghalaya": {
    subreddits: ["IndianDankMemes"],
    keywords: ["meghalaya", "shillong", "cherrapunji"],
  },
  "Mizoram": {
    subreddits: ["IndianDankMemes"],
    keywords: ["mizoram", "aizawl"],
  },
  "Nagaland": {
    subreddits: ["IndianDankMemes"],
    keywords: ["nagaland", "kohima", "dimapur"],
  },
  "Odisha": {
    subreddits: ["Odisha", "odisha", "bhubaneswar"],
    keywords: ["odisha", "orissa", "bhubaneswar", "cuttack", "rourkela", "puri", "sambalpur"],
  },
  "Punjab": {
    subreddits: ["Punjab", "chandigarh", "amritsar"],
    keywords: ["punjab", "amritsar", "ludhiana", "chandigarh", "jalandhar", "patiala"],
  },
  "Rajasthan": {
    subreddits: ["rajasthan", "jaipur"],
    keywords: ["rajasthan", "jaipur", "jodhpur", "udaipur", "ajmer", "bikaner", "kota"],
  },
  "Sikkim": {
    subreddits: ["IndianDankMemes"],
    keywords: ["sikkim", "gangtok"],
  },
  "Tamil Nadu": {
    subreddits: ["TamilNadu", "coimbatore"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["tamil", "tamilnadu", "chennai", "madras", "coimbatore", "madurai", "salem"],
  },
  "Telangana": {
    subreddits: ["telangana", "hyderabad"],
    keywords: ["telangana", "hyderabad", "warangal", "nizamabad", "karimnagar"],
  },
  "Tripura": {
    subreddits: ["IndianDankMemes"],
    keywords: ["tripura", "agartala"],
  },
  "Uttar Pradesh": {
    subreddits: ["lucknow", "noida", "varanasi"],
    keywords: ["uttar pradesh", "lucknow", "agra", "varanasi", "kanpur", "prayagraj", "noida", "ghaziabad"],
  },
  "Uttarakhand": {
    subreddits: ["uttarakhand", "dehradun"],
    keywords: ["uttarakhand", "dehradun", "haridwar", "rishikesh", "nainital", "mussoorie"],
  },
  "West Bengal": {
    subreddits: ["WestBengal", "westbengal", "kolkata"],
    keywords: ["west bengal", "kolkata", "calcutta", "howrah", "siliguri", "durgapur"],
  },
  "Delhi": {
    subreddits: ["noida", "gurgaon"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["delhi", "new delhi", "ncr", "dwarka", "rohini", "connaught place"],
  },
  "Jammu & Kashmir": {
    subreddits: ["IndianDankMemes"],
    keywords: ["kashmir", "jammu", "srinagar", "leh"],
  },
  "Ladakh": {
    subreddits: ["IndianDankMemes"],
    keywords: ["ladakh", "leh", "kargil", "pangong"],
  },
  "Chandigarh": {
    subreddits: ["chandigarh"],
    keywords: ["chandigarh", "tricity", "sector 17", "sector 22", "panchkula", "mohali"],
  },
  "Puducherry": {
    subreddits: ["IndianDankMemes"],
    keywords: ["puducherry", "pondicherry"],
  },
  "Northeast India": {
    subreddits: ["assam", "guwahati"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["northeast", "seven sisters", "assam", "meghalaya", "manipur", "nagaland", "mizoram", "tripura", "arunachal"],
  },
};

export const CITIES: Record<string, LocationConfig> = {
  "Mumbai": {
    // r/mumbai returns 400 from meme-api.com — fallback to maharashtra + keywords
    subreddits: ["maharashtra", "pune"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["mumbai", "bombay", "bandra", "andheri", "dadar", "borivali"],
  },
  "Delhi": {
    // r/delhi returns 400 — fallback to NCR subs + keywords
    subreddits: ["noida", "gurgaon"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["delhi", "new delhi", "ncr", "connaught place", "cp delhi"],
  },
  "Bangalore": {
    subreddits: ["bangalore"],
    keywords: ["bangalore", "bengaluru", "indiranagar", "koramangala", "whitefield"],
  },
  "Chennai": {
    // r/Chennai returns 400 — fallback to TamilNadu + keywords
    subreddits: ["TamilNadu"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["chennai", "madras", "t nagar", "anna nagar", "velachery", "adyar"],
  },
  "Kolkata": {
    subreddits: ["kolkata", "WestBengal"],
    keywords: ["kolkata", "calcutta", "salt lake", "howrah", "park street"],
  },
  "Hyderabad": {
    subreddits: ["hyderabad", "telangana"],
    keywords: ["hyderabad", "hyd", "hitech city", "banjara hills", "gachibowli"],
  },
  "Pune": {
    subreddits: ["pune", "maharashtra"],
    keywords: ["pune", "poona", "baner", "kothrud", "hinjewadi", "wakad"],
  },
  "Ahmedabad": {
    subreddits: ["gujarat", "surat"],
    keywords: ["ahmedabad", "amdavad", "sg highway", "navrangpura"],
  },
  "Jaipur": {
    subreddits: ["jaipur", "rajasthan"],
    keywords: ["jaipur", "pink city", "malviya nagar", "vaishali nagar"],
  },
  "Lucknow": {
    subreddits: ["lucknow"],
    keywords: ["lucknow", "hazratganj", "gomtinagar", "aliganj"],
  },
  "Chandigarh": {
    subreddits: ["chandigarh"],
    keywords: ["chandigarh", "tricity", "sector 17", "sector 22"],
  },
  "Bhopal": {
    subreddits: ["bhopal"],
    keywords: ["bhopal", "mp nagar", "arera colony"],
  },
  "Indore": {
    subreddits: ["indore"],
    keywords: ["indore", "vijay nagar", "palasia"],
  },
  "Nagpur": {
    // r/nagpur returns 400 — use maharashtra + keywords
    subreddits: ["maharashtra"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["nagpur", "orange city", "dharampeth", "sitabuldi"],
  },
  "Surat": {
    subreddits: ["surat", "gujarat"],
    keywords: ["surat", "adajan", "athwalines", "vesu"],
  },
  "Patna": {
    subreddits: ["patna", "Bihar"],
    keywords: ["patna", "bailey road", "boring road", "kankarbagh"],
  },
  "Bhubaneswar": {
    subreddits: ["bhubaneswar", "Odisha"],
    keywords: ["bhubaneswar", "bbsr", "unit 4", "saheed nagar", "nayapalli"],
  },
  "Guwahati": {
    subreddits: ["guwahati", "assam"],
    keywords: ["guwahati", "dispur", "pan bazaar", "fancy bazaar"],
  },
  "Kochi": {
    subreddits: ["kochi", "Kerala"],
    keywords: ["kochi", "cochin", "ernakulam", "fort kochi", "edapally"],
  },
  "Noida": {
    subreddits: ["noida", "gurgaon"],
    keywords: ["noida", "greater noida", "sector 18", "sector 62"],
  },
  "Gurgaon": {
    subreddits: ["gurgaon", "noida"],
    keywords: ["gurgaon", "gurugram", "cyber city", "dlf", "sohna road"],
  },
  "Visakhapatnam": {
    subreddits: ["visakhapatnam"],
    fallbackSubreddits: ["andhra"],
    keywords: ["visakhapatnam", "vizag", "rushikonda", "gajuwaka"],
  },
  "Rourkela": {
    subreddits: ["rourkela"],
    fallbackSubreddits: ["Odisha", "jharkhand"],
    keywords: ["rourkela", "steel city", "nit rourkela", "uditnagar"],
  },
  "Deoghar": {
    subreddits: ["deoghar"],
    fallbackSubreddits: ["jharkhand"],
    keywords: ["deoghar", "baidyanath", "baidyanathdham", "jasidih"],
  },
  "Dehradun": {
    subreddits: ["dehradun", "uttarakhand"],
    keywords: ["dehradun", "doon", "rajpur road", "paltan bazaar"],
  },
  "Jamshedpur": {
    subreddits: ["jamshedpur", "jharkhand"],
    keywords: ["jamshedpur", "tata nagar", "sakchi", "bistupur"],
  },
  "Amritsar": {
    subreddits: ["amritsar", "Punjab"],
    keywords: ["amritsar", "golden temple", "hall bazaar"],
  },
  "Varanasi": {
    subreddits: ["varanasi"],
    fallbackSubreddits: ["lucknow"],
    keywords: ["varanasi", "banaras", "ghats", "bhu", "kashi"],
  },
  "Kota": {
    subreddits: ["kota", "rajasthan"],
    keywords: ["kota", "resonance", "allen kota", "iit coaching"],
  },
  "Coimbatore": {
    // r/coimbatore returns 400
    subreddits: ["TamilNadu"],
    fallbackSubreddits: ["IndianDankMemes"],
    keywords: ["coimbatore", "kovai"],
  },
};
