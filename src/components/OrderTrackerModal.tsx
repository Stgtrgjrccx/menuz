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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#0D1322] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/[0.08] text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Live Kitchen Feed
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-serif text-2xl font-bold text-white">{order.order_number}</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {order.table_label || 'Your Table'} • Total: ₹{order.total_amount.toFixed(2)}
        </p>
        <span className="inline-block mt-1 text-[11px] text-amber-400 font-medium">
          Pay at Counter or Table
        </span>

        {/* Stepper */}
        <div className="space-y-5 text-left my-6 pl-4 border-l-2 border-white/[0.08] ml-3">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="relative">
                <div
                  className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                    isCompleted ? 'bg-amber-500 text-slate-950' : 'bg-white/[0.08] text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : ''}
                </div>
                <div>
                  <p
                    className={`font-serif text-sm font-bold leading-tight ${
                      isCurrent
                        ? 'text-amber-400'
                        : isCompleted
                        ? 'text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ordered items recap */}
        <div className="bg-white/[0.03] rounded-xl p-3 mb-4 text-left border border-white/[0.08]">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">Ordered Dishes:</p>
          <div className="space-y-1 text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-300">
                <span>
                  <strong className="text-amber-400 mr-1.5">{item.quantity}x</strong>
                  {item.item_name_snapshot}
                </span>
                <span className="font-medium text-white">₹{item.line_total_amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#090D16]/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white font-semibold py-2.5 rounded-xl text-xs transition-colors border border-white/[0.08]"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};
