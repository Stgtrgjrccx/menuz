import { Order, Restaurant, RoyalPosConfig, GenericKotReceipt } from '../types';

/**
 * RoyalPOS API Service for Menuz
 * RoyalPOS exposes a local REST API on the restaurant's LAN (Android tablet / Windows POS)
 * Endpoint:  POST http://<device_ip>:8080/api/v1/kot/save
 * Auth:      Bearer token from the RoyalPOS admin dashboard → Settings → Integrations
 * Docs:      Partner-only — request via admin@royalpos.in or the merchant's local account manager
 */

export interface RoyalPosOrderItemPayload {
  item_code: string;
  item_name: string;
  unit_price: number;
  qty: number;
  modifier_notes?: string;
  addons?: Array<{ name: string; price: number }>;
}

export interface RoyalPosSaveKotPayload {
  outlet_id: string;        // Merchant outlet code from RoyalPOS admin
  table_number: string;     // "T4", "T12" etc.
  section: string;          // "Indoor", "Patio", "Terrace"
  order_source: 'MENUZ_QR'; // Fixed value identifying Menuz as source
  server_note?: string;
  customer_name?: string;
  items: RoyalPosOrderItemPayload[];
  discount?: {
    label: string;
    type: 'percent' | 'flat';
    value: number;
  };
  gst_rate_percent: number;
  subtotal: number;
  total_after_discount: number;
  gst_amount: number;
  grand_total: number;
}

/**
 * Converts a Menuz Order into RoyalPOS's KOT JSON spec
 */
export function buildRoyalPosKotPayload(
  order: Order,
  restaurant: Restaurant,
  config: RoyalPosConfig,
  discountInfo?: { label: string; amount: number; ratePercent?: number }
): RoyalPosSaveKotPayload {
  const discountAmount = discountInfo?.amount ?? 0;
  const taxableAmount = Math.max(0, order.subtotal_amount - discountAmount);
  const gstRate = restaurant.tax_rate_percent || 5;
  const gstAmount = Number((taxableAmount * (gstRate / 100)).toFixed(2));
  const grandTotal = Number((taxableAmount + gstAmount).toFixed(2));

  // Parse table number out of label ("Table 4 (Patio)" → "4")
  const tableNum = (order.table_label || 'Table 1').replace(/[^0-9]/g, '') || '1';
  // Parse section from label ("Table 4 (Patio)" → "Patio")
  const sectionMatch = (order.table_label || '').match(/\(([^)]+)\)/);
  const section = sectionMatch ? sectionMatch[1] : 'Indoor';

  return {
    outlet_id: config.outlet_id || 'royalpos_pune_01',
    table_number: `T${tableNum}`,
    section,
    order_source: 'MENUZ_QR',
    server_note: order.customer_notes || 'Ordered via Menuz QR table scanner',
    customer_name: `Menuz Guest — ${order.table_label || 'Table 1'}`,
    items: order.items.map((item) => ({
      item_code: item.menu_item_id,
      item_name: item.item_name_snapshot,
      unit_price: item.unit_price_snapshot,
      qty: item.quantity,
      modifier_notes: (item.selected_options_snapshot || [])
        .map((o) => `${o.name}${o.price_modifier > 0 ? ` +₹${o.price_modifier}` : ''}`)
        .join(', ') || undefined,
      addons: (item.selected_options_snapshot || [])
        .filter((o) => o.price_modifier > 0)
        .map((o) => ({ name: o.name, price: o.price_modifier }))
    })),
    discount: discountInfo
      ? {
          label: discountInfo.label,
          type: discountInfo.ratePercent ? 'percent' : 'flat',
          value: discountInfo.ratePercent ?? discountInfo.amount
        }
      : undefined,
    gst_rate_percent: gstRate,
    subtotal: order.subtotal_amount,
    total_after_discount: taxableAmount,
    gst_amount: gstAmount,
    grand_total: grandTotal
  };
}

/**
 * Simulates sending an order to a RoyalPOS terminal and returns a formatted KOT receipt.
 * In production, replace the artificial delay with a real fetch() to http://<device_ip>:8080/api/v1/kot/save
 */
export async function sendOrderToRoyalPos(
  order: Order,
  restaurant: Restaurant,
  config: RoyalPosConfig,
  discountInfo?: { label: string; amount: number; ratePercent?: number }
): Promise<{ success: boolean; message: string; receipt: GenericKotReceipt }> {
  const payload = buildRoyalPosKotPayload(order, restaurant, config, discountInfo);

  // Simulated LAN round-trip (real call: POST http://<device_ip>:8080/api/v1/kot/save)
  await new Promise((resolve) => setTimeout(resolve, 380));

  const kotSeq = Math.floor(1000 + Math.random() * 9000);
  const kotNumber = `KOT-${kotSeq}`;
  const posOrderId = `RP-${Date.now().toString().slice(-6)}`;

  const receipt: GenericKotReceipt = {
    kot_number: kotNumber,
    pos_order_id: posOrderId,
    pos_provider: 'RoyalPOS',
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
    discount_amount: payload.discount ? discountInfo?.amount ?? 0 : 0,
    discount_name: discountInfo?.label,
    taxes: payload.gst_amount,
    grand_total: payload.grand_total,
    raw_payload: payload
  };

  return {
    success: true,
    message: `KOT #${kotSeq} dispatched to RoyalPOS Kitchen Station (LAN: ${config.device_ip || '192.168.1.101'}:8080)`,
    receipt
  };
}
