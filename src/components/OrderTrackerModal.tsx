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
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-float text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700 bg-saffron-100 px-2 py-0.5 rounded-full">
            Live Kitchen Feed
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-700 hover:bg-ivory-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-2xl font-bold text-charcoal-900">{order.order_number}</h3>
        <p className="text-xs text-charcoal-700 font-medium mt-0.5">
          {order.table_label || 'Your Table'} • Total: ₹{order.total_amount.toFixed(2)}
        </p>
        <span className="inline-block mt-1 text-[11px] text-saffron-700 font-medium">
          Pay at Counter or Table
        </span>

        {/* Stepper */}
        <div className="space-y-5 text-left my-6 pl-4 border-l-2 border-ivory-200 ml-3">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="relative">
                <div
                  className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white font-bold transition-all ${
                    isCompleted ? 'bg-saffron-600' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : ''}
                </div>
                <div>
                  <p
                    className={`font-serif text-sm font-bold leading-tight ${
                      isCurrent
                        ? 'text-saffron-700'
                        : isCompleted
                        ? 'text-charcoal-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-charcoal-700/70 mt-0.5 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ordered items recap */}
        <div className="bg-ivory-50 rounded-xl p-3 mb-4 text-left border border-ivory-200">
          <p className="text-[10px] uppercase font-bold text-charcoal-700/60 mb-1">Ordered Dishes:</p>
          <div className="space-y-1 text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-charcoal-800">
                <span>
                  <strong className="text-saffron-700 mr-1.5">{item.quantity}x</strong>
                  {item.item_name_snapshot}
                </span>
                <span className="font-medium text-charcoal-900">₹{item.line_total_amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-semibold py-2.5 rounded-xl text-xs transition-colors"
        >
          Back to Saffron House Menu
        </button>
      </div>
    </div>
  );
};
