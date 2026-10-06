import Link from "next/link";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Cart</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Your order</h1>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-900">Kitfo</p>
              <p className="text-sm text-slate-500">1 plate</p>
            </div>
            <p className="font-semibold text-slate-900">$340</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-900">Shiro</p>
              <p className="text-sm text-slate-500">1 bowl</p>
            </div>
            <p className="font-semibold text-slate-900">$290</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-lg font-medium text-slate-700">Total</span>
          <span className="text-2xl font-bold text-slate-900">$630</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Keep shopping
          </Link>
          <Link
            href="/checkout"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}

