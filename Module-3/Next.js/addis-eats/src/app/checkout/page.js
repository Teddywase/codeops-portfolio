import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Checkout</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Complete your order</h1>

        <div className="mt-6 space-y-4 rounded-xl border border-slate-200 p-5">
          <div className="flex justify-between">
            <span className="text-slate-600">Kitfo</span>
            <span className="font-medium text-slate-900">$340</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Shiro</span>
            <span className="font-medium text-slate-900">$290</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>$630</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back to cart
          </Link>
          <button
            type="button"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Place order
          </button>
        </div>
      </div>
    </main>
  );
}

