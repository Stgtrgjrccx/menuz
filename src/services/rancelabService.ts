import { Order, Restaurant, RancelabConfig, GenericKotReceipt } from '../types';

/**
 * RanceLab POS API Service for Menuz
 * RanceLab provides a JSON-based API gateway via their Integrations & Apps Panel
 * Endpoint:  POST https://api.rancelab.com/v1/integration/order/push
 * Auth:      Headers: X-Partner-Key: <partner_key>, X-Branch-Code: <branch_code>
 * Docs:      Authorized partners only — contact sales@rancelab.com or +91 98319 26662
 * Note:      RanceLab has 200k+ customers across 50 countries (30+ years in business)
 *            Known for offline-first billing, GST compliance, and vernacular language support
 */

export interface RancelabOrderItemPayload {
  code: string;             // RanceLab internal item code
  description: string;
  rate: number;             // Unit price
  qty: number;
  modifiers: Array<{
    modifier_name: string;
    modifier_rate: number;
  }>;
  kitchen_note?: string;
}

export interface RancelabPushOrderPayload {
  branch_code: string;      // Unique branch/outlet identifier from RanceLab admin
  order_reference: string;  // Menuz order number (for reconciliation)
  order_type: 'DINE_IN';
  table_no: string;
  table_section?: string;
  waiter_id: 'MENUZ_QR';   // Fixed token identifying orders from Menuz
  items: RancelabOrderItemPayload[];
  billing: {
    gross_amount: number;
    discount_value: number;
    discount_label?: string;
    gst_slab: number;       // 5 | 12 | 18 | 28 per GST rules
    gst_amount: number;
    net_payable: number;
  };
  metadata: {
    source: 'menuz';
    integration_version: '1.0';
    push_timestamp: string; // ISO 8601
  };
}

/**
 * Converts a Menuz Order into RanceLab's push_order JSON spec
 */
export function buildRancelabOrderPayload(
  order: Order,
  restaurant: Restaurant,
  config: RancelabConfig,
  discountInfo?: { label: string; amount: number; ratePercent?: number }
): RancelabPushOrderPayload {
  const discountAmount = discountInfo?.amount ?? 0;
  const taxableAmount = Math.max(0, order.subtotal_amount - discountAmount);
  // RanceLab uses India's actual GST slabs: 5% (restaurant AC), 12%, 18%, 28%
  const gstSlab = restaurant.tax_rate_percent || 5;
  const gstAmount = Number((taxableAmount * (gstSlab / 100)).toFixed(2));
  const netPayable = Number((taxableAmount + gstAmount).toFixed(2));

  const tableNum = (order.table_label || 'Table 1').replace(/[^0-9]/g, '') || '1';
  const sectionMatch = (order.table_label || '').match(/\(([^)]+)\)/);
  const section = sectionMatch ? sectionMatch[1] : undefined;

  return {
    branch_code: config.branch_code || 'rl_pune_branch_01',
    order_reference: order.order_number || `MNZ-${Date.now().toString().slice(-6)}`,
    order_type: 'DINE_IN',
    table_no: tableNum,
    table_section: section,
    waiter_id: 'MENUZ_QR',
    items: order.items.map((item) => ({
      code: item.menu_item_id,
      description: item.item_name_snapshot,
      rate: item.unit_price_snapshot,
      qty: item.quantity,
      modifiers: (item.selected_options_snapshot || []).map((o) => ({
        modifier_name: o.name,
        modifier_rate: o.price_modifier
      })),
      kitchen_note: order.customer_notes || undefined
    })),
    billing: {
      gross_amount: order.subtotal_amount,
      discount_value: discountAmount,
      discount_label: discountInfo?.label,
      gst_slab: gstSlab,
      gst_amount: gstAmount,
      net_payable: netPayable
    },
    metadata: {
      source: 'menuz',
      integration_version: '1.0',
      push_timestamp: new Date().toISOString()
    }
  };
}

/**
 * Simulates pushing an order to RanceLab and returns a formatted KOT receipt.
 * In production, replace with: fetch('https://api.rancelab.com/v1/integration/order/push', { ... })
 */
export async function sendOrderToRancelab(
  order: Order,
  restaurant: Restaurant,
  config: RancelabConfig,
  discountInfo?: { label: string; amount: number; ratePercent?: number }
): Promise<{ success: boolean; message: string; receipt: GenericKotReceipt }> {
  const payload = buildRancelabOrderPayload(order, restaurant, config, discountInfo);

  // Simulated API round-trip
  await new Promise((resolve) => setTimeout(resolve, 460));

  const kotSeq = Math.floor(1000 + Math.random() * 9000);
  const kotNumber = `KOT-${kotSeq}`;
  const posOrderId = `RL-${Date.now().toString().slice(-6)}`;

  const receipt: GenericKotReceipt = {
    kot_number: kotNumber,
    pos_order_id: posOrderId,
    pos_provider: 'RanceLab',
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
    discount_amount: payload.billing.discount_value,
    discount_name: discountInfo?.label,
    taxes: payload.billing.gst_amount,
    grand_total: payload.billing.net_payable,
    raw_payload: payload
  };

  return {
    success: true,
    message: `KOT #${kotSeq} pushed to RanceLab Precision Billing Suite (api.rancelab.com)`,
    receipt
  };
}
