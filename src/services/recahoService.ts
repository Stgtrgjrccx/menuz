import { Order, Restaurant, RecahoConfig, GenericKotReceipt } from '../types';

/**
 * Recaho POS API Service for Menuz
 * Recaho uses a cloud-hosted REST API (API-first architecture)
 * Endpoint:  POST https://api.recaho.com/v2/orders/create
 * Auth:      Headers: X-Api-Key: <api_key>, X-Outlet-Token: <outlet_token>
 * Docs:      Partner-only — contact sales@recaho.com or request via Book a Demo
 */

export interface RecahoOrderItemPayload {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  variant_notes?: string;
  add_ons: Array<{ name: string; price: number }>;
}

export interface RecahoCreateOrderPayload {
  outlet_token: string;          // Per-outlet token from Recaho partner dashboard
  order_type: 'DINE_IN';
  table_id: string;              // Recaho internal table ID (mapped from table label)
  table_label: string;           // Human-readable label
  source: 'THIRD_PARTY';
  source_name: 'MENUZ';
  customer_note?: string;
  items: RecahoOrderItemPayload[];
  pricing: {
    item_total: number;
    discount_amount: number;
    discount_reason?: string;
    gst_percent: number;
    gst_amount: number;
    grand_total: number;
  };
  trigger_kot: true;             // Tells Recaho to immediately fire a KOT to the kitchen printer
}

/**
 * Converts a Menuz Order into Recaho's create_order JSON spec
 */
export function buildRecahoOrderPayload(
  order: Order,
  restaurant: Restaurant,
  config: RecahoConfig,
  discountInfo?: { reason: string; amount: number; ratePercent?: number }
): RecahoCreateOrderPayload {
  const discountAmount = discountInfo?.amount ?? 0;
  const taxableAmount = Math.max(0, order.subtotal_amount - discountAmount);
  const gstRate = restaurant.tax_rate_percent || 5;
  const gstAmount = Number((taxableAmount * (gstRate / 100)).toFixed(2));
  const grandTotal = Number((taxableAmount + gstAmount).toFixed(2));

  // Map table label to Recaho internal table ID
  const tableNum = (order.table_label || 'Table 1').replace(/[^0-9]/g, '') || '1';
  const recahoTableId = `${config.outlet_token}_table_${tableNum}`;

  return {
    outlet_token: config.outlet_token || 'recaho_outlet_mock_01',
    order_type: 'DINE_IN',
    table_id: recahoTableId,
    table_label: order.table_label || 'Table 1',
    source: 'THIRD_PARTY',
    source_name: 'MENUZ',
    customer_note: order.customer_notes || 'Ordered via Menuz QR',
    items: order.items.map((item) => ({
      product_id: item.menu_item_id,
      product_name: item.item_name_snapshot,
      price: item.unit_price_snapshot,
      quantity: item.quantity,
      variant_notes: (item.selected_options_snapshot || [])
        .filter((o) => o.price_modifier === 0)
        .map((o) => o.name)
        .join(', ') || undefined,
      add_ons: (item.selected_options_snapshot || [])
        .filter((o) => o.price_modifier > 0)
        .map((o) => ({ name: o.name, price: o.price_modifier }))
    })),
    pricing: {
      item_total: order.subtotal_amount,
      discount_amount: discountAmount,
      discount_reason: discountInfo?.reason,
      gst_percent: gstRate,
      gst_amount: gstAmount,
      grand_total: grandTotal
    },
    trigger_kot: true
  };
}

/**
 * Simulates sending an order to Recaho and returns a formatted KOT receipt.
 * In production, replace with: fetch('https://api.recaho.com/v2/orders/create', { ... })
 */
export async function sendOrderToRecaho(
  order: Order,
  restaurant: Restaurant,
  config: RecahoConfig,
  discountInfo?: { reason: string; amount: number; ratePercent?: number }
): Promise<{ success: boolean; message: string; receipt: GenericKotReceipt }> {
  const payload = buildRecahoOrderPayload(order, restaurant, config, discountInfo);

  // Simulated cloud API round-trip
  await new Promise((resolve) => setTimeout(resolve, 520));

  const kotSeq = Math.floor(1000 + Math.random() * 9000);
  const kotNumber = `KOT-${kotSeq}`;
  const posOrderId = `RCH-${Date.now().toString().slice(-6)}`;

  const receipt: GenericKotReceipt = {
    kot_number: kotNumber,
    pos_order_id: posOrderId,
    pos_provider: 'Recaho',
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
    discount_amount: payload.pricing.discount_amount,
    discount_name: discountInfo?.reason,
    taxes: payload.pricing.gst_amount,
    grand_total: payload.pricing.grand_total,
    raw_payload: payload
  };

  return {
    success: true,
    message: `KOT #${kotSeq} synced to Recaho cloud kitchen station (api.recaho.com)`,
    receipt
  };
}
