import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Order, OrderStatus } from '../types';

const KDS_COLUMNS: Array<{ key: OrderStatus; label: string; headerColor: string; bgBadge: string }> = [
  { key: 'received', label: '1. Received', headerColor: 'border-amber-400 text-amber-900', bgBadge: 'bg-amber-100 text-amber-800' },
  { key: 'preparing', label: '2. In Tandoor / Preparing', headerColor: 'border-blue-500 text-blue-900', bgBadge: 'bg-blue-100 text-blue-800' },
  { key: 'ready', label: '3. Plated & Ready', headerColor: 'border-green-500 text-green-900', bgBadge: 'bg-green-100 text-green-800' },
  { key: 'served', label: '4. Served to Table', headerColor: 'border-gray-400 text-gray-800', bgBadge: 'bg-gray-100 text-gray-800' },
];

export const KitchenKDS: React.FC = () => {
  const orders = useRestaurantStore((state) => state.orders);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const advanceOrderStatus = useRestaurantStore((state) => state.advanceOrderStatus);
  const [, setTicker] = useState(0);

  // Re-render elapsed timers every 15s
  useEffect(() => {
    const timer = setInterval(() => setTicker((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedMinutes = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.max(0, Math.floor(diff / 60000));
  };

  return (
    <div className="min-h-screen bg-charcoal-900 text-white p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-charcoal-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-saffron-600 rounded-2xl text-white shadow-subtle">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-saffron-400 block">
              Kitchen Display System (KDS)
            </span>
            <h1 className="font-serif text-2xl font-bold text-white">{restaurant.name} Station</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="bg-charcoal-800 px-3 py-1.5 rounded-lg border border-charcoal-700 text-gray-300">
            Active Orders: {orders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length}
          </span>
          <span className="text-green-400 flex items-center space-x-1.5 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-charcoal-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Realtime Live</span>
          </span>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KDS_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-charcoal-800/60 rounded-3xl p-4 border border-charcoal-700/80 flex flex-col min-h-[78vh]"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-charcoal-700">
                <span className="font-serif font-bold text-sm tracking-wide text-gray-200 uppercase">
                  {col.label}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${col.bgBadge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-gray-500 font-mono">
                    No tickets in this stage
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const elapsed = getElapsedMinutes(order.created_at);
                    const isUrgent = elapsed > 15 && order.status !== 'served';

                    return (
                      <div
                        key={order.id}
                        className={`bg-charcoal-800 rounded-2xl p-4 border transition-all shadow-md ${
                          isUrgent ? 'border-red-500/80' : 'border-charcoal-700 hover:border-charcoal-600'
                        }`}
                      >
                        {/* Order Meta */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-base font-bold text-saffron-400">
                              {order.order_number}
                            </span>
                            <span className="block text-xs font-serif font-bold text-white mt-0.5">
                              {order.table_label || 'Dining Table'}
                            </span>
                          </div>

                          <div
                            className={`flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded-md ${
                              isUrgent ? 'bg-red-900/60 text-red-200' : 'bg-charcoal-700 text-gray-300'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{elapsed}m</span>
                          </div>
                        </div>

                        {/* Dish breakdown */}
                        <div className="py-2.5 my-2 border-t border-b border-charcoal-700/80 space-y-2 text-xs">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-gray-200">
                              <div className="flex items-start justify-between">
                                <span className="font-medium">
                                  <strong className="text-saffron-400 font-bold mr-1.5">
                                    {item.quantity}x
                                  </strong>
                                  {item.item_name_snapshot}
                                </span>
                              </div>
                              {item.selected_options_snapshot?.map((opt, i) => (
                                <span
                                  key={i}
                                  className="inline-block text-[10px] bg-charcoal-900 text-saffron-300 px-1.5 py-0.5 rounded mt-0.5 mr-1"
                                >
                                  {opt.name}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Customer note */}
                        {order.customer_notes && (
                          <div className="bg-charcoal-900 p-2 rounded-xl text-[11px] text-amber-300 border border-amber-900/50 mb-3">
                            <strong className="block text-[10px] text-amber-400 uppercase tracking-wider">
                              Kitchen Request:
                            </strong>
                            {order.customer_notes}
                          </div>
                        )}

                        {/* Status advance button */}
                        {order.status !== 'served' ? (
                          <button
                            type="button"
                            onClick={() => advanceOrderStatus(order.id)}
                            className="w-full mt-2 bg-saffron-600 hover:bg-saffron-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                          >
                            <span>Advance Ticket</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center space-x-1 text-xs text-green-400 py-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Fulfilled</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
