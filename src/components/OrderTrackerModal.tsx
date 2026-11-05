import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, Check, AlertCircle } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { OrderStatus } from '../types';

interface OrderTrackerModalProps {
  orderId: string;
  onClose: () => void;
}

const STATUS_STEPS: Array<{ key: OrderStatus; label: string; description: string }> = [
  { key: 'received', label: 'Order Received', description: 'Transmitted to tandoor & master curry chef' },
  { key: 'preparing', label: 'Kitchen Preparing', description: 'Ingredients roasting fresh over silver oak charcoal' },
  { key: 'ready', label: 'Plated & Ready', description: 'Garnished with mountain butter and herbs' },
  { key: 'served', label: 'Served to Table', description: 'Delivered to your table. Enjoy your feast!' }
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ orderId, onClose }) => {
  const orders = useRestaurantStore((state) => state.orders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) return null;

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#131315] text-[#e5e1e4] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5e1e4] bg-[#201f21] px-2.5 py-0.5 rounded-full border border-white/10">
            Live Kitchen Feed
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#ab8980] hover:bg-[#1b1b1d]/80 hover:text-[#e5e1e4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#e5e1e4]">{order.order_number}</h3>
        <p className="text-xs text-[#ab8980] font-medium mt-0.5">
          {order.table_label || 'Your Table'} • Total: ₹{order.total_amount.toFixed(2)}
        </p>
        <span className="inline-block mt-1 text-[11px] text-[#ffb955] font-bold">
          Pay at Counter or Table
        </span>

        {/* Stepper */}
        <div className="space-y-5 text-left my-6 pl-4 border-l-2 border-white/10 ml-3">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="relative">
                <div
                  className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all shadow-xs ${
                    isCompleted ? 'bg-[#ff5722] text-white' : 'bg-[#1b1b1d] border border-white/10 text-[#ab8980]/50'
                  }`}
                >
                  {isCompleted ? '✓' : ''}
                </div>
                <div>
                  <p
                    className={`font-serif text-sm font-bold leading-tight ${
                      isCurrent
                        ? 'text-[#ffb955]'
                        : isCompleted
                        ? 'text-[#e5e1e4]'
                        : 'text-[#ab8980]/50'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-[#ab8980] mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ordered items recap */}
        <div className="bg-[#1b1b1d] rounded-2xl p-3.5 mb-4 text-left border border-white/10 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-[#ab8980] mb-1.5">Ordered Dishes:</p>
          <div className="space-y-1 text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-[#e5e1e4]">
                <span>
                  <strong className="text-[#ffb955] mr-1.5">{item.quantity}x</strong>
                  {item.item_name_snapshot}
                </span>
                <span className="font-bold text-[#e5e1e4]">₹{item.line_total_amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#1b1b1d] hover:bg-[#201f21] text-[#e5e1e4] font-semibold py-2.5 rounded-xl text-xs transition-colors border border-white/10 shadow-xs cursor-pointer"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};
