import assert from 'assert';
import { isValidRestaurantRecord, normalizeRestaurantRecord, isDishNameAsRestaurant } from '../store/restaurantStore';

export function runDataPreservationTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function check(desc: string, fn: () => void) {
    try {
      fn();
      passed++;
    } catch (err: any) {
      console.error(`❌ Test failed: ${desc}`, err.message);
      failed++;
    }
  }

  // TEST 1: Missing optional fields must NOT cause restaurant deletion
  check('Restaurant without location & cuisine remains valid', () => {
    const customWithoutLocation = {
      id: 'rest_custom_test_001',
      name: 'Chutney Bistro',
      location: undefined,
      cuisine: undefined
    };
    assert.strictEqual(isValidRestaurantRecord(customWithoutLocation), true);
    const norm = normalizeRestaurantRecord(customWithoutLocation);
    assert.strictEqual(norm.location, '');
    assert.strictEqual(norm.cuisine, '');
    assert.strictEqual(norm.slug, 'chutney-bistro');
  });

  // TEST 2: Restaurant with empty strings for optional fields
  check('Restaurant with empty strings for optional fields is valid', () => {
    const customWithEmptyFields = {
      id: 'rest_custom_test_002',
      name: 'Spice Symphony',
      location: '',
      cuisine: ''
    };
    assert.strictEqual(isValidRestaurantRecord(customWithEmptyFields), true);
  });

  // TEST 3: Genuine restaurant named with food keywords is not flagged as dish
  check('Restaurant named with food keywords is preserved', () => {
    const biryaniVenue = {
      id: 'rest_venue_biryani_king',
      name: 'Biryani King Pune',
      location: 'Camp, Pune',
      cuisine: 'Biryani, Mughlai'
    };
    assert.strictEqual(isValidRestaurantRecord(biryaniVenue), true);
    assert.strictEqual(isDishNameAsRestaurant(biryaniVenue), false);
  });

  // TEST 4: Dish items masquerading as restaurants are rejected
  check('Dish with price and category_id is rejected from restaurant store', () => {
    const rawDishObject = {
      id: 'item-butter-chicken-101',
      name: 'Butter Chicken',
      price: 450,
      category_id: 'cat-mains'
    };
    assert.strictEqual(isValidRestaurantRecord(rawDishObject), false);
    assert.strictEqual(isDishNameAsRestaurant(rawDishObject), true);
  });

  // TEST 5: Category items are rejected from restaurant store
  check('Menu category is rejected from restaurant store', () => {
    const categoryObject = {
      id: 'cat_beverages',
      name: 'Beverages',
      sort_order: 1
    };
    assert.strictEqual(isValidRestaurantRecord(categoryObject), false);
  });

  // TEST 6: Filtering does not prune custom restaurants missing optional fields
  check('Sanitization preserves custom restaurants missing fields while pruning dishes', () => {
    const testCustomVenue = {
      id: 'rest_real_custom_pune',
      name: 'Kalyan Heritage Cafe',
      location: '',
      cuisine: ''
    };
    const rawDishObject = {
      id: 'item-dal-makhani-102',
      name: 'Dal Makhani',
      price: 320,
      category_id: 'cat-mains'
    };

    const rawArray = [testCustomVenue, rawDishObject];
    const cleaned = rawArray.filter(isValidRestaurantRecord).map(normalizeRestaurantRecord);
    assert.strictEqual(cleaned.length, 1);
    assert.strictEqual(cleaned[0].id, 'rest_real_custom_pune');
  });

  // TEST 7: Malformed inputs safely return false without throwing
  check('Malformed inputs safely return false without throwing', () => {
    assert.strictEqual(isValidRestaurantRecord(null), false);
    assert.strictEqual(isValidRestaurantRecord(undefined), false);
    assert.strictEqual(isValidRestaurantRecord(''), false);
    assert.strictEqual(isValidRestaurantRecord({ id: '', name: '' }), false);
    assert.strictEqual(isValidRestaurantRecord({ id: 'valid_id', name: '' }), false);
  });

  return { passed, failed };
}

// Auto-run when executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('dataPreservation.test')) {
  const result = runDataPreservationTests();
  console.log(`Data Preservation Tests: ${result.passed} passed, ${result.failed} failed.`);
  if (result.failed > 0) process.exit(1);
}
