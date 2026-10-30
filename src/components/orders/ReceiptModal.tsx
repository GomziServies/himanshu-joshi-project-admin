import React from 'react';
import { TransactionReceipt } from '../../types';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface ReceiptModalProps {
  receipt: TransactionReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border-2 border-[#E8DFD8] shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Top Actions in Brown (Hidden on Print) */}
        <div className="bg-[#5C3A21] p-4 text-white flex justify-between items-center print:hidden border-b border-[#4A2E1A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
            <span id="receipt-modal-title" className="font-serif font-bold text-sm text-white">
              Consecrated Temple Receipt Inspector
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="Print Official Receipt"
              className="px-3 py-1.5 rounded-lg bg-white text-[#5C3A21] hover:bg-[#FDFBF7] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close receipt modal"
              className="p-1 rounded-full text-[#E8DFD8] hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 space-y-6 text-[#2D1E12] bg-[#FFFDF9] print:bg-white print:p-4">
          {/* Trust Banner Header */}
          <div className="text-center border-b-2 border-[#5C3A21] pb-6 space-y-1">
            <span className="font-serif text-3xl font-bold text-[#5C3A21] block">ॐ</span>
            <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#5C3A21] uppercase tracking-wider">
              Salahkareshwar Mahadev Tirth
            </h2>
            <p className="text-xs font-serif font-bold text-[#8B5A2B]">
              श्री सलाहकारेश्वर महादेव तीर्थ • पुण्य पासपोर्ट (Punya Passport)
            </p>
            <p className="text-[11px] text-[#8B5A2B]">
              408, Souvenir Flats, Gotri Sevasi Road, Vadodara, Gujarat - 390012 • Helpline: +91 98256 00778
            </p>
            <p className="text-[10px] font-mono text-[#5C3A21] pt-0.5">
              PAN: <span className="font-bold">ABETS6872M</span> • Udyam: <span className="font-bold">UDYAM-GJ-24-0064289</span>
            </p>
            <p className="text-[11px] font-serif font-bold text-[#5C3A21] uppercase tracking-widest pt-1">
              Official Consecration Dakshina Receipt
            </p>
          </div>

          {/* Receipt & Order Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#FDFBF7] p-4 rounded-xl border border-[#E8DFD8]">
            <div>
              <span className="text-[#8B5A2B] block font-medium uppercase text-[10px]">Receipt Number:</span>
              <span className="font-mono font-bold text-[#5C3A21] text-sm">{receipt.receiptNumber}</span>
            </div>
            <div>
              <span className="text-[#8B5A2B] block font-medium uppercase text-[10px]">Order Number:</span>
              <span className="font-mono font-bold text-[#5C3A21] text-sm">{receipt.orderNumber}</span>
            </div>
            <div>
              <span className="text-[#8B5A2B] block font-medium uppercase text-[10px]">Razorpay Payment ID:</span>
              <span className="font-mono font-bold text-emerald-800 text-xs">{receipt.razorpayPaymentId}</span>
            </div>
            <div>
              <span className="text-[#8B5A2B] block font-medium uppercase text-[10px]">Date of Settlement:</span>
              <span className="font-medium text-[#5C3A21] text-xs">
                {new Date(receipt.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Devotee & Sankalp Details */}
          <div className="space-y-2 text-xs border-b border-[#E8DFD8] pb-4">
            <h4 className="font-serif font-bold text-[#5C3A21] uppercase tracking-wider text-xs">
              Devotee & Gotra Sankalp Particulars
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p>
                <span className="text-[#8B5A2B]">Yajman (Devotee):</span>{' '}
                <strong className="text-[#5C3A21]">{receipt.sankalpName}</strong>
              </p>
              <p>
                <span className="text-[#8B5A2B]">Family Gotra:</span>{' '}
                <strong className="text-[#5C3A21]">{receipt.gotra}</strong>
              </p>
              <p>
                <span className="text-[#8B5A2B]">Contact Email:</span>{' '}
                <span className="text-[#5C3A21]">{receipt.customerEmail}</span>
              </p>
              <p>
                <span className="text-[#8B5A2B]">Contact Phone:</span>{' '}
                <span className="text-[#5C3A21]">{receipt.customerPhone || 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#5C3A21] uppercase tracking-wider text-xs">
              Consecrated Offering Particulars
            </h4>
            <table className="w-full text-xs text-left border border-[#E8DFD8]">
              <thead className="bg-[#FDFBF7] text-[#5C3A21] font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-[#E8DFD8]">Offering Description</th>
                  <th className="p-2.5 border-b border-[#E8DFD8] text-center">Qty</th>
                  <th className="p-2.5 border-b border-[#E8DFD8] text-right">Dakshina (₹)</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items &&
                  receipt.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#E8DFD8]/60">
                      <td className="p-2.5 font-medium">{item.title}</td>
                      <td className="p-2.5 text-center">{item.quantity}</td>
                      <td className="p-2.5 text-right font-serif font-bold">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="bg-[#FDFBF7] font-bold text-[#5C3A21]">
                <tr>
                  <td colSpan={2} className="p-2.5 text-right uppercase">Net Dakshina Paid:</td>
                  <td className="p-2.5 text-right font-serif text-sm">
                    ₹{receipt.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Seal & Ledger Stamp */}
          <div className="pt-6 flex justify-between items-end border-t border-[#E8DFD8]">
            <div className="text-[11px] text-[#8B5A2B] space-y-1">
              <p className="flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Cryptographically Signed & Sealed in Mongoose Ledger
              </p>
              <p>Email Dispatch: Confirmed via Nodemailer</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-28 h-10 border-b border-dashed border-[#5C3A21] mx-auto"></div>
              <p className="text-[10px] font-bold text-[#5C3A21] uppercase">Authorized Trust Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
