import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurantStore } from '../store/restaurantStore';
import { Order, OrderStatus } from '../types';

const KDS_COLUMNS: Array<{ key: OrderStatus; label: string; headerColor: string; bgBadge: string }> = [
  { key: 'received', label: '1. Received', headerColor: 'border-[#F4511E] text-[#2D4A3E]', bgBadge: 'bg-[#F4511E]/15 text-[#2D4A3E] border border-[#F4511E]/30' },
  { key: 'preparing', label: '2. In Tandoor / Preparing', headerColor: 'border-blue-400 text-[#2F6FA3]', bgBadge: 'bg-blue-500/15 text-[#1F5F8B] border border-blue-500/30' },
  { key: 'ready', label: '3. Plated & Ready', headerColor: 'border-emerald-400 text-[#2F7A4F]', bgBadge: 'bg-emerald-500/15 text-[#2F7A4F] border border-emerald-500/30' },
  { key: 'served', label: '4. Served to Table', headerColor: 'border-slate-500 text-[#6E6E6E]', bgBadge: 'bg-[#EFE9DD] text-[#4A4A4A] border border-[#E3E0DA]' },
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FFFFFF] text-[#141414] p-3 sm:p-4 md:p-6 font-sans">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-black/10 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#F4511E] to-[#F4511E] rounded-2xl text-black font-black shadow-md">
            <ChefHat className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#2D4A3E] block font-bold">
              Kitchen Display System (KDS)
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#141414]">{restaurant.name} Station</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/manage/${restaurant.slug || 'saffron-house'}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#F4511E]/15 hover:bg-[#F4511E]/25 text-[#2D4A3E] border border-[#F4511E]/30 hover:border-[#F4511E]/60 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>Floor Ops Hub</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="bg-[#F5F1E8] px-3 py-1.5 rounded-lg border border-black/10 text-[#6E6E6E]">
              Active: {orders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length}
            </span>
            <span className="text-[#2F7A4F] flex items-center space-x-1.5 bg-[#F5F1E8] px-3 py-1.5 rounded-lg border border-black/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live KDS</span>
            </span>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KDS_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-[#F5F1E8]/80 rounded-2xl p-4 border border-black/10 flex flex-col min-h-[78vh] backdrop-blur-sm"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-black/[0.08]">
                <span className="font-sans font-bold text-xs tracking-wider text-[#3A3A3A] uppercase">
                  {col.label}
                </span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold font-mono ${col.bgBadge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-[#7A7A7A] font-mono">
                    No tickets in this stage
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const elapsed = getElapsedMinutes(order.created_at);
                    const isUrgent = elapsed > 15 && order.status !== 'served';

                    return (
                      <div
                        key={order.id}
                        className={`bg-[#F5F1E8] rounded-xl p-3.5 border transition-all shadow-md ${
                          isUrgent ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-black/10 hover:border-[#F4511E]/30'
                        }`}
                      >
                        {/* Order Meta */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-sm font-bold text-[#2D4A3E]">
                              {order.order_number}
                            </span>
                            <span className="block text-xs font-semibold text-[#141414] mt-0.5">
                              {order.table_label || 'Dining Table'}
                            </span>
                          </div>

                          <div
                            className={`flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded-md ${
                              isUrgent ? 'bg-rose-950/80 text-[#C23A1C] border border-rose-800/60' : 'bg-black/[0.04] text-[#4A4A4A] border border-black/[0.06]'
                            }`}
                          >
                            <Clock className="w-3 h-3 text-[#6E6E6E]" />
                            <span>{elapsed}m</span>
                          </div>
                        </div>

                        {/* Dish breakdown */}
                        <div className="py-2.5 my-2 border-t border-b border-black/[0.08] space-y-2 text-xs">
                          {order.items.map((item) => (
                            <div key={item.id} className="text-[#3A3A3A]">
                              <div className="flex items-start justify-between">
                                <span className="font-medium">
                                  <strong className="text-[#2D4A3E] font-bold mr-1.5">
                                    {item.quantity}x
                                  </strong>
                                  {item.item_name_snapshot}
                                </span>
                              </div>
                              {item.selected_options_snapshot?.map((opt, i) => (
                                <span
                                  key={i}
                                  className="inline-block text-[10px] bg-[#FFFFFF]/[0.05] text-[#2D4A3E]/90 px-1.5 py-0.5 rounded mt-0.5 mr-1 border border-black/[0.05]"
                                >
                                  {opt.name}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Customer note */}
                        {order.customer_notes && (
                          <div className="bg-[#F4511E]/30 p-2 rounded-lg text-[11px] text-[#2D4A3E] border border-[#F4511E]/40 mb-3">
                            <strong className="block text-[10px] text-[#2D4A3E] uppercase tracking-wider font-bold">
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
                            className="w-full mt-2 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <span>Advance Ticket</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center space-x-1 text-xs text-[#2F7A4F] py-1 font-mono">
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
