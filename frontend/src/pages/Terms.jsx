import { 
  Shield, FileText, CreditCard, Truck, RefreshCw, 
  AlertCircle, CheckCircle, Lock, ShoppingCart, Scale
} from "lucide-react";

export default function Terms() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <FileText className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">Legal Information</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-white/70 mt-4">Last Updated: February 2026</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[
              { name: "Introduction", id: "introduction" },
              { name: "Account Terms", id: "account" },
              { name: "Products", id: "products" },
              { name: "Payments", id: "payments" },
              { name: "Shipping", id: "shipping" },
              { name: "Returns", id: "returns" },
              { name: "Privacy", id: "privacy" }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12">
            
            {/* Introduction */}
            <div id="introduction" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">1. Introduction</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Welcome to SmartNest Solutions ("we", "our", or "us"). These Terms and Conditions govern your use 
                  of our website and services. By accessing or using our platform, you agree to be bound by these terms.
                </p>
                <p>
                  If you do not agree with any part of these terms, you must not use our services. We reserve the right 
                  to modify these terms at any time, and your continued use of the platform constitutes acceptance of 
                  any changes.
                </p>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                  <p className="text-purple-900 font-semibold flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Please read these terms carefully. They contain important information about your rights and obligations.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Account Terms */}
            <div id="account" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">2. Account Terms</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>When you create an account with us, you agree to:</p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Provide accurate, current, and complete information during registration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Maintain and promptly update your account information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Keep your password secure and confidential</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Notify us immediately of any unauthorized use of your account</span>
                  </li>
                </ul>
                <p className="font-semibold text-gray-900 mt-6">
                  You must be at least 18 years old to create an account and make purchases on our platform.
                </p>
              </div>
            </div>

            {/* Products and Services */}
            <div id="products" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">3. Products and Services</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Product Information</h3>
                <p>
                  We strive to display accurate product information, including descriptions, images, and pricing. 
                  However, we do not guarantee that all information is error-free, complete, or current.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Product Availability</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>All products are subject to availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>We reserve the right to limit quantities and discontinue products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Flash sales and promotions are subject to stock availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>We may refuse or cancel orders at our discretion</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Custom Branding</h3>
                <p>
                  For custom branding orders, you must provide all necessary designs and information. 
                  Production time varies based on order complexity. Custom orders are non-refundable once 
                  production has begun.
                </p>
              </div>
            </div>

            {/* Payments */}
            <div id="payments" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">4. Payments and Pricing</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Methods</h3>
                <p>We accept the following payment methods:</p>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <p className="font-semibold text-green-900">M-Pesa</p>
                    <p className="text-sm text-green-700">Instant mobile payment</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="font-semibold text-blue-900">Bank Transfer</p>
                    <p className="text-sm text-blue-700">Direct bank deposit</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Pricing</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>All prices are listed in Kenyan Shillings (KES)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Prices are subject to change without notice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>The price charged is the price displayed at the time of order</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Flash sale and discount prices are valid for limited periods only</span>
                  </li>
                </ul>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg mt-6">
                  <p className="text-yellow-900 font-semibold">
                    Payment must be received before orders are processed and shipped.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping and Delivery */}
            <div id="shipping" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">5. Shipping and Delivery</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Delivery Areas</h3>
                <p>We deliver to all major cities and towns within Kenya. Remote areas may incur additional charges.</p>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Delivery Times</h3>
                <div className="bg-gray-50 p-6 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="font-semibold">Nairobi & Suburbs</span>
                    <span className="text-purple-600 font-bold">1-2 Business Days</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="font-semibold">Major Cities</span>
                    <span className="text-purple-600 font-bold">2-4 Business Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Remote Areas</span>
                    <span className="text-purple-600 font-bold">4-7 Business Days</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Shipping Costs</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>FREE delivery on orders above KES 5,000</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Standard delivery fee: KES 300-500 (based on location)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Bulk orders may qualify for discounted shipping rates</span>
                  </li>
                </ul>

                <p className="text-sm text-gray-600 italic mt-4">
                  * Delivery times are estimates and may vary due to circumstances beyond our control.
                </p>
              </div>
            </div>

            {/* Returns and Refunds */}
            <div id="returns" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">6. Returns and Refunds</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Return Policy</h3>
                <p>
                  We accept returns within <strong>7 days</strong> of delivery for items that are:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Defective or damaged upon arrival</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Significantly different from the description</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Unused and in original packaging with tags</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Non-Returnable Items</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Custom-branded or personalized products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Items on flash sale or clearance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Products damaged due to misuse</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Refund Process</h3>
                <p>
                  Once we receive and inspect your return, we will process your refund within 5-7 business days. 
                  Refunds will be issued to the original payment method.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mt-6">
                  <p className="text-blue-900 font-semibold">
                    To initiate a return, please contact our customer service team with your order number and reason for return.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Data */}
            <div id="privacy" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">7. Privacy and Data Protection</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We are committed to protecting your privacy and personal information. By using our services, 
                  you consent to the collection and use of your data as described in our Privacy Policy.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Information We Collect</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Personal information (name, email, phone number, address)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Payment and transaction information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Browsing behavior and preferences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Communication with customer service</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">How We Use Your Data</h3>
                <p>Your information is used to:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Process and fulfill your orders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Communicate about orders, promotions, and updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Improve our products and services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Comply with legal obligations</span>
                  </li>
                </ul>

                <p className="font-semibold text-gray-900 mt-6">
                  We do not sell or share your personal information with third parties except as necessary 
                  to provide our services or as required by law.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="mb-6 text-white/90">
                If you have any questions or concerns about these Terms and Conditions, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold text-center hover:scale-105 transition-all"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@smartnest.co.ke"
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-center border-2 border-white/20 hover:bg-white/20 transition-all"
                >
                  Email Support
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}