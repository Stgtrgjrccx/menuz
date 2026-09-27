import { PUNE_RESTAURANT_DIRECTORY, searchPuneRestaurants, normalizePuneSearch, matchesPuneQuery } from './src/data/puneRestaurantDirectory.ts';
import { SEED_RESTAURANTS } from './src/data/seedData.ts';

// 100 Random & Iconic Pune Restaurants to test
export const TEST_QUERIES_100: { query: string; expectedSubstring: string; description: string }[] = [
  { query: 'murphins', expectedSubstring: 'murphie', description: 'Murphies Bistro & Bar (Prabhat Rd/KP)' },
  { query: 'dehati', expectedSubstring: 'dehaati', description: 'Hotel Dehaati (Prabhat Rd)' },
  { query: 'gather', expectedSubstring: 'gather', description: 'Gather Bistro & All Day Dining (Law College Rd)' },
  { query: 'shabree', expectedSubstring: 'shabree', description: 'Shabree Traditional Maharashtrian (FC Road)' },
  { query: 'roopali', expectedSubstring: 'roopali', description: 'Cafe Roopali (FC Road)' },
  { query: 'vaishali', expectedSubstring: 'vaishali', description: 'Cafe Vaishali (FC Road)' },
  { query: 'wadeshwar', expectedSubstring: 'wadeshwar', description: 'Wadeshwar (FC Road)' },
  { query: 'kata kirr', expectedSubstring: 'kata kirr', description: 'Kata Kirr Misal (Karve Nagar)' },
  { query: 'bedekar misal', expectedSubstring: 'bedekar', description: 'Bedekar Tea Stall Misal (Narayan Peth)' },
  { query: 'kayani bakery', expectedSubstring: 'kayani', description: 'Kayani Bakery (East Street Camp)' },
  { query: 'marzorin', expectedSubstring: 'marz-o-rin', description: 'Marz-O-Rin (MG Road Camp)' },
  { query: 'george restaurant', expectedSubstring: 'george', description: 'George Restaurant & Bar (Camp)' },
  { query: 'blue nile', expectedSubstring: 'blue nile', description: 'Blue Nile Irani Biryani (Camp)' },
  { query: 'dorabjee', expectedSubstring: 'dorabjee', description: 'Dorabjee & Sons Parsi (Camp)' },
  { query: 'sujata mastani', expectedSubstring: 'sujata mastani', description: 'Sujata Mastani (Sadashiv Peth)' },
  { query: 'chitale bandhu', expectedSubstring: 'chitale', description: 'Chitale Bandhu Mithaiwale (Bajirao Rd)' },
  { query: 'badshahi', expectedSubstring: 'badshahi', description: 'Badshahi Boarding House (Tilak Road)' },
  { query: 'sukanta', expectedSubstring: 'sukanta', description: 'Sukanta Thali (Deccan Gymkhana)' },
  { query: 'nisarga', expectedSubstring: 'nisarga', description: 'Nisarga Seafood (Karve Road)' },
  { query: 'mathura pure veg', expectedSubstring: 'mathura', description: 'Mathura Pure Veg (JM Road)' },
  { query: 'chafa cafe', expectedSubstring: 'chafa', description: 'Chafa Cafe & Craftery (Koregaon Park)' },
  { query: 'sante spa', expectedSubstring: 'sante spa', description: 'Sante Spa Cuisine (Koregaon Park)' },
  { query: 'french window', expectedSubstring: 'french window', description: 'The French Window Patisserie (Koregaon Park)' },
  { query: '729 grams', expectedSubstring: '729 grams', description: '729 Grams Coffee (Koregaon Park)' },
  { query: 'blue tokai', expectedSubstring: 'blue tokai', description: 'Blue Tokai Coffee Roasters (Koregaon Park)' },
  { query: 'cafe kathaa', expectedSubstring: 'kathaa', description: 'Cafe Kathaa (FC Road)' },
  { query: 'pagdandi', expectedSubstring: 'pagdandi', description: 'Pagdandi Books Chai Cafe (Baner)' },
  { query: 'cafe peter', expectedSubstring: 'peter', description: 'Cafe Peter (Aundh)' },
  { query: 'grandmamas cafe', expectedSubstring: 'grandmama', description: 'Grandmama’s Cafe (Koregaon Park)' },
  { query: 'barometer', expectedSubstring: 'barometer', description: 'Barometer All Day Dining (Kothrud)' },
  { query: 'ginkgo', expectedSubstring: 'ginkgo', description: 'Ginkgo Asian Kitchen (Kothrud)' },
  { query: 'toit', expectedSubstring: 'toit', description: 'Toit Brewpub (Kalyani Nagar)' },
  { query: 'independence brewing', expectedSubstring: 'independence brewing', description: 'Independence Brewing Company (Mundhwa)' },
  { query: 'effingut', expectedSubstring: 'effingut', description: 'Effingut Brewerkz (Koregaon Park)' },
  { query: 'doolally', expectedSubstring: 'doolally', description: 'Doolally Taproom (Koregaon Park)' },
  { query: 'social fc road', expectedSubstring: 'social', description: 'FC Road Social (Shivajinagar)' },
  { query: 'one8 commune', expectedSubstring: 'one8', description: 'One8 Commune (The Mills)' },
  { query: 'boteco', expectedSubstring: 'boteco', description: 'Boteco Restaurante Brasileiro (Koregaon Park)' },
  { query: 'cobbler & crew', expectedSubstring: 'cobbler', description: 'Cobbler & Crew (Kalyani Nagar)' },
  { query: 'arthurs theme', expectedSubstring: 'arthur', description: 'Arthur’s Theme (Koregaon Park)' },
  { query: 'prems', expectedSubstring: 'prem', description: 'Prem’s Restaurant (Koregaon Park)' },
  { query: 'terttulia', expectedSubstring: 'terttulia', description: 'Terttulia Bistro (Koregaon Park)' },
  { query: 'tsuki', expectedSubstring: 'tsuki', description: 'Tsuki Pan-Asian (Koregaon Park)' },
  { query: 'gong', expectedSubstring: 'gong', description: 'Gong Modern Asian (Balewadi High St)' },
  { query: 'paasha', expectedSubstring: 'paasha', description: 'Paasha Rooftop Lounge (JW Marriott)' },
  { query: 'alto vino', expectedSubstring: 'alto vino', description: 'Alto Vino Italian (JW Marriott)' },
  { query: 'ukiyo', expectedSubstring: 'ukiyo', description: 'Ukiyo Japanese (The Ritz-Carlton)' },
  { query: 'three kitchens', expectedSubstring: 'three kitchens', description: 'Three Kitchens (The Ritz-Carlton)' },
  { query: 'coriander kitchen', expectedSubstring: 'coriander', description: 'Coriander Kitchen (Conrad)' },
  { query: 'surves', expectedSubstring: 'surve', description: 'Surve’s Pure Non Veg (FC Road)' },
  { query: 'tiranga bhuvan', expectedSubstring: 'tiranga', description: 'Tiranga Bhuvan (Kothrud)' },
  { query: 'jagdamb', expectedSubstring: 'jagdamb', description: 'Hotel Jagdamb (Khed Shivapur/Pune)' },
  { query: 'sarjaa', expectedSubstring: 'sarjaa', description: 'Sarjaa Restaurant & Bar (Aundh)' },
  { query: 'bhairavee', expectedSubstring: 'bhairavee', description: 'Bhairavee Pure Veg (Baner)' },
  { query: 'urbo', expectedSubstring: 'urbo', description: 'Urbo Kitchen & Bar (Baner)' },
  { query: 'tarsh', expectedSubstring: 'tarsh', description: 'Tarsh Kitchen & Bar (Wakad)' },
  { query: 'mezza9', expectedSubstring: 'mezza9', description: 'Mezza9 Multi-Cuisine (Hinjewadi)' },
  { query: 'kalyan bhel', expectedSubstring: 'kalyan bhel', description: 'Kalyan Bhel (Law College Road)' },
  { query: 'fakira misal', expectedSubstring: 'fakira', description: 'Fakira Misal (Bibwewadi)' },
  { query: 'neelam pure veg', expectedSubstring: 'neelam', description: 'Neelam Pure Veg (Nigdi PCMC)' },
  { query: 'ram krishna', expectedSubstring: 'ram krishna', description: 'Hotel Ram Krishna (Camp)' },
  { query: 'garden vada pav', expectedSubstring: 'garden vada pav', description: 'Garden Vada Pav Centre (Camp)' },
  { query: 'joshi wadewale', expectedSubstring: 'joshi wadewale', description: 'Joshi Wadewale (Deccan)' },
  { query: 'goodluck cafe', expectedSubstring: 'goodluck', description: 'Cafe Goodluck (Deccan Gymkhana)' },
  { query: 'vohuman cafe', expectedSubstring: 'vohuman', description: 'Vohuman Cafe (Near Station)' },
  { query: 'cafe paashh', expectedSubstring: 'paashh', description: 'Cafe Paashh (Kalyani Nagar)' },
  { query: 'le plaisir', expectedSubstring: 'plaisir', description: 'Le Plaisir Patisserie (Prabhat Road)' },
  { query: 'malaka spice', expectedSubstring: 'malaka spice', description: 'Malaka Spice (Koregaon Park)' },
  { query: 'smoor chocolates', expectedSubstring: 'smoor', description: 'Smoor Chocolates & Cafe (KP)' },
  { query: 'aromas cafe', expectedSubstring: 'aromas', description: 'Aromas Cafe & Bistro (Koregaon Park)' },
  { query: 'we idliwale', expectedSubstring: 'we idliwale', description: 'We Idliwale Bar Room (Viman Nagar)' },
  { query: 'third wave coffee', expectedSubstring: 'third wave', description: 'Third Wave Coffee (Kalyani Nagar)' },
  { query: 'german bakery', expectedSubstring: 'german bakery', description: 'German Bakery (Koregaon Park)' },
  { query: 'baan tao', expectedSubstring: 'baan tao', description: 'Baan Tao Pan-Asian (Hyatt Pune)' },
  { query: 'the k factory', expectedSubstring: 'k factory', description: 'The K Factory (Baner)' },
  { query: '24k kraft brewzz', expectedSubstring: '24k kraft', description: '24K Kraft Brewzz (Balewadi High St)' },
  { query: 'incognito', expectedSubstring: 'incognito', description: 'Incognito Restaurant Bar & Cafe (Balewadi)' },
  { query: 'polka dots', expectedSubstring: 'polka dots', description: 'Polka Dots Restaurant (Aundh)' },
  { query: 'greens & olives', expectedSubstring: 'greens & olives', description: 'Greens & Olives (Aundh)' },
  { query: 'tales & spirits', expectedSubstring: 'tales & spirits', description: 'Tales & Spirits Bistro (SB Road)' },
  { query: 'portico pure veg', expectedSubstring: 'portico', description: 'Portico Pure Veg (Hinjewadi)' },
  { query: 'momo cafe hinjewadi', expectedSubstring: 'momo cafe', description: 'MoMo Cafe Courtyard by Marriott (Hinjewadi)' },
  { query: 'aaswad executive', expectedSubstring: 'aaswad', description: 'Aaswad Executive (Hinjewadi)' },
  { query: 'irani cafe', expectedSubstring: 'irani cafe', description: 'Irani Cafe (Viman Nagar)' },
  { query: 'the rustle nest', expectedSubstring: 'rustle nest', description: 'The Rustle Nest (Baner)' },
  { query: 'durvankur thali', expectedSubstring: 'durvankur', description: 'Durvankur Dining Hall (Sadashiv Peth)' },
  { query: 'sp biryani', expectedSubstring: 'sp\'s biryani', description: 'SP’s Biryani House (Sadashiv Peth)' },
  { query: 'hyderabad house', expectedSubstring: 'hyderabad house', description: 'Aroma’s Hyderabad House (Baner)' },
  { query: 'pk biryani', expectedSubstring: 'pk biryani', description: 'PK Biryani House (Kothrud)' },
  { query: 'kaware ice cream', expectedSubstring: 'kaware', description: 'Kaware Ice Cream (Tulshibaug)' },
  { query: 'cream stone', expectedSubstring: 'cream stone', description: 'Cream Stone Concepts (FC Road)' },
  { query: 'yolkshire', expectedSubstring: 'yolkshire', description: 'Yolkshire All Day Breakfast (Aundh)' },
  { query: 'flour works', expectedSubstring: 'flour works', description: 'The Flour Works (Kalyani Nagar)' },
  { query: 'little italy', expectedSubstring: 'little italy', description: 'Little Italy (Shivajinagar)' },
  { query: 'mainland china', expectedSubstring: 'mainland china', description: 'Mainland China (Senapati Bapat Road)' },
  { query: 'sigree global grill', expectedSubstring: 'sigree', description: 'Sigree Global Grill (Dhole Patil Road)' },
  { query: 'barbeque nation', expectedSubstring: 'barbeque nation', description: 'Barbeque Nation (Shivajinagar)' },
  { query: 'copper chimney', expectedSubstring: 'copper chimney', description: 'Copper Chimney (Phoenix Marketcity)' },
  { query: 'punjab grill', expectedSubstring: 'punjab grill', description: 'Punjab Grill (Phoenix Marketcity)' },
  { query: 'siddique kabab', expectedSubstring: 'siddique', description: 'Siddique Kebab Corner (Camp)' }
];

function filterRestaurants(list: any[], search: string) {
  const q = search.toLowerCase().trim();
  const cleanQ = q.replace(/['’]/g, '');
  return list
    .filter((r) => matchesPuneQuery(r, search))
    .sort((a, b) => {
      const aExact =
        a.name.toLowerCase().includes(q) ||
        a.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
        a.aliases?.some((al: string) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
      const bExact =
        b.name.toLowerCase().includes(q) ||
        b.name.toLowerCase().replace(/['’]/g, '').includes(cleanQ) ||
        b.aliases?.some((al: string) => al.toLowerCase().includes(q) || al.toLowerCase().replace(/['’]/g, '').includes(cleanQ));
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return (b.rating || 4) - (a.rating || 4);
    });
}

async function runBenchmark() {
  console.log('=== RUNNING 100 RANDOM PUNE RESTAURANTS BENCHMARK ===\n');
  let passed = 0;
  let failed = 0;
  const failedList: any[] = [];

  for (let i = 0; i < TEST_QUERIES_100.length; i++) {
    const test = TEST_QUERIES_100[i];
    const results = filterRestaurants(SEED_RESTAURANTS, test.query);
    const matched = results.some((r) =>
      r.name.toLowerCase().includes(test.expectedSubstring.toLowerCase()) ||
      (r.aliases && r.aliases.some((a: string) => a.toLowerCase().includes(test.expectedSubstring.toLowerCase())))
    );

    if (matched) {
      passed++;
      console.log(`[PASS ${i + 1}/100] Query: "${test.query}" -> Found: "${results[0]?.name}"`);
    } else {
      failed++;
      failedList.push(test);
      console.error(`[FAIL ${i + 1}/100] Query: "${test.query}" -> Expected: "${test.expectedSubstring}" (${test.description})`);
    }
  }

  const scorePercent = ((passed / TEST_QUERIES_100.length) * 100).toFixed(1);
  console.log('\n======================================================');
  console.log(`SCORE: ${passed}/100 (${scorePercent}%)`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('======================================================');

  if (failed > 0) {
    console.log('\nMissing / Failed Queries to Research and Add:');
    failedList.forEach((f, idx) => {
      console.log(`${idx + 1}. Query: "${f.query}", Expected: "${f.expectedSubstring}", Description: "${f.description}"`);
    });
    process.exit(1);
  } else {
    console.log('\n🏆 PERFECT 100% SCORE ACHIEVED!');
    process.exit(0);
  }
}

runBenchmark();
