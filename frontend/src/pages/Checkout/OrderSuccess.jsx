import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Phone,
  Mail,
  Truck,
  CreditCard
} from 'lucide-react';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  const pollingRef = useRef(null);

  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  // 🚨 If no order ID, exit
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  // ✅ Poll backend (single source of truth)
  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/payments/order/${orderId}/payment-status`
        );
        const data = await res.json();

        console.log('🔁 Poll response:', data);

        setOrderDetails(data);
        setPaymentStatus(data.payment_status || 'pending');
        setLoading(false);

        // ✅ STOP polling once PAID or FAILED
        if (data.payment_status === 'PAID' || data.payment_status === 'FAILED') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error('Polling error:', err);
        setLoading(false);
      }
    };

    fetchStatus();

    pollingRef.current = setInterval(fetchStatus, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [orderId]);

  // ⏳ Countdown only while pending
  useEffect(() => {
    if (paymentStatus !== 'PENDING') return;

    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-400" />
        <p className="mt-4 text-gray-600">Loading order details…</p>
      </div>
    );
  }

  // ✅ SUCCESS
  if (paymentStatus === 'PAID') {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
          <p className="text-gray-600">
            Your order has been confirmed and is being processed.
          </p>

          <div className="bg-white border rounded-xl p-6 text-left">
            <p className="font-bold">Order #{orderDetails.order_id}</p>
            <p>Total: KES {orderDetails.total}</p>

            {orderDetails.mpesa_receipt && (
              <div className="mt-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-mono">
                  {orderDetails.mpesa_receipt}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ⏳ PENDING
  if (paymentStatus === 'PENDING') {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-yellow-100 rounded-full p-6">
            <Clock className="w-16 h-16 text-yellow-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">Waiting for M-Pesa Payment</h1>
        <p>Please enter your PIN on your phone.</p>

        <p className="text-2xl font-bold text-yellow-600">
          {Math.floor(countdown / 60)}:
          {(countdown % 60).toString().padStart(2, '0')}
        </p>
      </div>
    );
  }

  // ❌ FAILED
  return (
    <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-6">
      <div className="flex justify-center">
        <div className="bg-red-100 rounded-full p-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold">Payment Failed</h1>
      <p>No money was deducted. Please try again.</p>

      <div className="flex justify-center gap-4">
        <Link to={`/checkout?order_id=${orderId}`} className="btn-primary">
          Try Again
        </Link>
        <Link to="/" className="btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
