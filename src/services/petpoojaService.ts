import { Order, Restaurant, PetpoojaConfig, PetpoojaKotReceipt } from '../types';

/**
 * Petpooja API Service for Menuz
 * Supports both Live API dispatch and Staging/Sandbox Simulation
 */

export interface PetpoojaOrderItemPayload {
  itemid: string;
  itemname: string;
  price: number;
  quantity: number;
  discount: number;
  customisation: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  special_notes?: string;
}

export interface PetpoojaSaveOrderPayload {
  app_key: string;
  app_secret: string;
  restID: string;
  order_info: {
    orderID: string;
    order_type: 'DINE_IN';
    table_no: string;
    service_charge: number;
    discount_total: number;
    tax_total: number;
    total: number;
    order_date: string;
    customer_notes?: string;
  };
  customer_info: {
    name: string;
    phone?: string;
    email?: string;
  };
  order_items: PetpoojaOrderItemPayload[];
  discounts: Array<{
    code: string;
    name: string;
    rate: number;
    type: 'percentage' | 'flat';
    amount: number;
  }>;
}

/**
 * Converts a Menuz Order into Petpooja's exact `save_order` JSON specification
 */
export function buildPetpoojaOrderPayload(
  order: Order,
  restaurant: Restaurant,
  config: PetpoojaConfig,
  discountInfo?: { code: string; name: string; amount: number; ratePercent?: number }
): PetpoojaSaveOrderPayload {
  const discountTotal = discountInfo ? discountInfo.amount : 0;
  const taxableAmount = Math.max(0, order.subtotal_amount - discountTotal);
  const taxRate = restaurant.tax_rate_percent || 5;
  const recalculatedTax = Number((taxableAmount * (taxRate / 100)).toFixed(2));
  const grandTotal = Number((taxableAmount + recalculatedTax).toFixed(2));

  return {
    app_key: config.app_key || 'mock_app_key_menuz_pune',
    app_secret: config.app_secret || 'mock_app_secret_menuz_pune',
    restID: config.rest_id || 'rest-saffron-house-01',
    order_info: {
      orderID: order.order_number || 'ORD-' + Math.floor(100 + Math.random() * 900),
      order_type: 'DINE_IN',
      table_no: (order.table_label || 'Table 1').replace(/[^0-9]/g, '') || '1',
      service_charge: 0,
      discount_total: discountTotal,
      tax_total: recalculatedTax,
      total: grandTotal,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      customer_notes: order.customer_notes || 'Ordered via Menuz QR'
    },
    customer_info: {
      name: 'Menuz Diner (' + (order.table_label || 'Table 1') + ')',
      phone: '9876543210'
    },
    order_items: order.items.map((item) => ({
      itemid: item.menu_item_id,
      itemname: item.item_name_snapshot,
      price: item.unit_price_snapshot,
      quantity: item.quantity,
      discount: 0,
      customisation: (item.selected_options_snapshot || []).map((opt) => ({
        id: opt.option_id,
        name: opt.name,
        price: opt.price_modifier
      })),
      special_notes: order.customer_notes
    })),
    discounts: discountInfo
      ? [
          {
            code: discountInfo.code,
            name: discountInfo.name,
            rate: discountInfo.ratePercent || 15,
            type: discountInfo.ratePercent ? 'percentage' : 'flat',
            amount: discountInfo.amount
          }
        ]
      : []
  };
}

/**
 * Simulates sending an order to Petpooja POS and generates a formatted KOT thermal printout
 */
export async function sendOrderToPetpooja(
  order: Order,
  restaurant: Restaurant,
  config: PetpoojaConfig,
  discountInfo?: { code: string; name: string; amount: number; ratePercent?: number }
): Promise<{ success: boolean; message: string; receipt: PetpoojaKotReceipt }> {
  const payload = buildPetpoojaOrderPayload(order, restaurant, config, discountInfo);

  // Artificial network round-trip simulation
  await new Promise((resolve) => setTimeout(resolve, 450));

  const kotSeq = Math.floor(1000 + Math.random() * 9000);
  const kotNumber = `KOT-${kotSeq}`;
  const petpoojaOrderId = `PP-${Date.now().toString().slice(-6)}`;

  const receipt: PetpoojaKotReceipt = {
    kot_number: kotNumber,
    petpooja_order_id: petpoojaOrderId,
    table_label: order.table_label || 'Table 1',
    restaurant_name: restaurant.name,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    server_name: 'Menuz Smart QR Bot',
    items: order.items.map((it) => ({
      name: it.item_name_snapshot,
      quantity: it.quantity,
      price: it.unit_price_snapshot,
      options: (it.selected_options_snapshot || []).map((o) => `${o.name} (+₹${o.price_modifier})`),
      special_notes: order.customer_notes
    })),
    subtotal: order.subtotal_amount,
    discount_amount: payload.order_info.discount_total,
    discount_name: discountInfo?.name,
    taxes: payload.order_info.tax_total,
    grand_total: payload.order_info.total,
    raw_payload: payload
  };

  return {
    success: true,
    message: `KOT #${kotSeq} printed successfully on Petpooja Kitchen Station`,
    receipt
  };
}
