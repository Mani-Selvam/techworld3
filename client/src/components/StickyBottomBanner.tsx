import { useState } from "react";
import RegistrationPopup from "./RegistrationPopup";

export default function StickyBottomBanner() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const payAmountPaise = Number(
        import.meta.env.VITE_RAZORPAY_PAY_AMOUNT_PAISE || "19900",
    );
    const oldPayAmountPaise = Number(
        import.meta.env.VITE_RAZORPAY_PAY_OLD_AMOUNT_PAISE || "99900",
    );
    const safePayAmountPaise = Number.isFinite(payAmountPaise)
        ? payAmountPaise
        : 19900;
    const safeOldPayAmountPaise = Number.isFinite(oldPayAmountPaise)
        ? oldPayAmountPaise
        : 99900;
    const payAmountText =
        safePayAmountPaise % 100 === 0
            ? `₹${safePayAmountPaise / 100}`
            : `₹${(safePayAmountPaise / 100).toFixed(2)}`;
    const oldPayAmountText =
        safeOldPayAmountPaise % 100 === 0
            ? `₹${safeOldPayAmountPaise / 100}`
            : `₹${(safeOldPayAmountPaise / 100).toFixed(2)}`;

    const savingsAmount = Math.round(
        (safeOldPayAmountPaise - safePayAmountPaise) / 100,
    );
    const savingsPct = Math.round(
        ((safeOldPayAmountPaise - safePayAmountPaise) / safeOldPayAmountPaise) *
            100,
    );

    const openRegistrationForm = () => setIsPopupOpen(true);
    const closeRegistrationForm = () => setIsPopupOpen(false);

    return (
        <>
            {/* ── Keyframe injection ── */}
            <style>{`
                @keyframes price-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.65; transform: scale(0.96); }
                }
                @keyframes savings-flash {
                    0%, 90%, 100% { background-color: rgba(255,255,255,0.15); color: #fff; }
                    45%           { background-color: #22c55e;               color: #fff; }
                }
                @keyframes old-price-shake {
                    0%, 100% { transform: translateX(0); }
                    20%      { transform: translateX(-2px); }
                    40%      { transform: translateX(2px); }
                    60%      { transform: translateX(-2px); }
                    80%      { transform: translateX(2px); }
                }
                .new-price-blink {
                    animation: price-pulse 1.1s ease-in-out infinite;
                }
                .savings-badge-flash {
                    animation: savings-flash 2.2s ease-in-out infinite;
                }
                .old-price-shake {
                    animation: old-price-shake 3s ease-in-out infinite;
                }
            `}</style>

            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="mx-auto max-w-7xl px-3 pb-3 sm:px-4 sm:pb-4">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/15 via-transparent to-orange-500/15" />
                        <div className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 blur-xl opacity-60" />

                        <div className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
                            {/* ── Left: label ── */}
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                                </span>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-400 font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                                            High Demand
                                        </span>
                                        <span className="hidden sm:inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                                            Limited offer
                                        </span>
                                    </div>
                                    <p className="hidden sm:block text-white/70 text-xs truncate">
                                        Secure your seat before slots close
                                    </p>
                                </div>
                            </div>

                            {/* ── Right: CTA button ── */}
                            <button
                                onClick={openRegistrationForm}
                                data-testid="button-buy-tickets-sticky"
                                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)] transition-all duration-300 hover:from-orange-400 hover:to-orange-600 hover:shadow-[0_14px_35px_rgba(249,115,22,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60">
                                {/* "Pay" label */}
                                <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                                    Pay
                                </span>

                                {/* Old price — strikethrough + periodic shake */}
                                <span
                                    className="old-price-shake relative text-xs font-semibold text-white/50 line-through"
                                    title={`Original price: ${oldPayAmountText}`}>
                                    {oldPayAmountText}
                                </span>

                                {/* Arrow indicator */}
                                <span className="text-white/60 text-sm leading-none select-none">
                                    →
                                </span>

                                {/* New price — pulsing blink */}
                                <span className="new-price-blink flex items-baseline gap-0.5">
                                    <span className="text-[11px] font-bold text-white/80 leading-none">
                                        only
                                    </span>
                                    <span className="text-lg font-extrabold leading-none tracking-tight text-white drop-shadow-sm">
                                        {payAmountText}
                                    </span>
                                </span>

                                {/* Savings badge — colour-flashing */}
                                <span className="savings-badge-flash hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors">
                                    Save {savingsPct}%&nbsp;(₹{savingsAmount})
                                </span>

                                {/* Hover overlay */}
                                <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="absolute inset-0 rounded-full bg-white/10" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <RegistrationPopup
                isOpen={isPopupOpen}
                onClose={closeRegistrationForm}
                mode="pay_only"
                payAmountPaise={safePayAmountPaise}
            />
        </>
    );
}
