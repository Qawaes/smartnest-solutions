import { 
  Shield, Lock, Eye, UserCheck, Database, FileText, 
  AlertCircle, CheckCircle, Cookie, Mail, Bell, Trash2,
  Download, Share2, Settings, Globe
} from "lucide-react";

export default function Privacy() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Shield className="w-4 h-4 text-white animate-pulse" />
            <span className="text-white font-semibold text-sm">Your Privacy Matters</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            We're committed to protecting your personal information and your right to privacy
          </p>
          <p className="text-white/70 mt-4">Last Updated: February 2026</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Lock, label: "Secure Data", desc: "Bank-level encryption" },
              { icon: UserCheck, label: "You Control", desc: "Your data, your choice" },
              { icon: Shield, label: "Protected", desc: "GDPR compliant" },
              { icon: Eye, label: "Transparent", desc: "No hidden practices" }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[
              { name: "Overview", id: "overview" },
              { name: "Data Collection", id: "collection" },
              { name: "How We Use Data", id: "usage" },
              { name: "Data Sharing", id: "sharing" },
              { name: "Security", id: "security" },
              { name: "Your Rights", id: "rights" },
              { name: "Cookies", id: "cookies" },
              { name: "Contact", id: "contact" }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all whitespace-nowrap"
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
            
            {/* Overview */}
            <div id="overview" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">1. Overview</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At SmartNest Solutions, we take your privacy seriously. This Privacy Policy explains how we 
                  collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p>
                  By using our platform, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-lg">
                  <p className="text-blue-900 font-semibold flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      We will never sell your personal information to third parties. Your trust is our priority.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <div id="collection" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">2. Information We Collect</h2>
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Personal Information
                  </h3>
                  <p className="mb-3">We collect personal information that you voluntarily provide to us when you:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Register for an account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Make a purchase or place an order</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Contact our customer service team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Subscribe to our newsletter or promotional emails</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Participate in surveys, contests, or promotions</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">This may include:</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      <span className="text-sm">• Full name</span>
                      <span className="text-sm">• Email address</span>
                      <span className="text-sm">• Phone number</span>
                      <span className="text-sm">• Delivery address</span>
                      <span className="text-sm">• Payment information</span>
                      <span className="text-sm">• Order history</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Automatically Collected Information
                  </h3>
                  <p className="mb-3">When you access our website, we automatically collect certain information:</p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>IP address and browser type</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Device information and operating system</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Pages visited and time spent on pages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Referring website addresses</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Clickstream data and browsing patterns</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Payment Information
                  </h3>
                  <p>
                    We collect payment information necessary to process your orders. However, we do not store 
                    complete credit card or M-Pesa PIN information. Payment processing is handled by secure 
                    third-party payment processors.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div id="usage" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">3. How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We use the information we collect for the following purposes:</p>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                  {[
                    { title: "Order Processing", desc: "Fulfill and manage your purchases" },
                    { title: "Customer Service", desc: "Respond to inquiries and support requests" },
                    { title: "Account Management", desc: "Maintain and update your account" },
                    { title: "Communication", desc: "Send order updates and newsletters" },
                    { title: "Personalization", desc: "Customize your shopping experience" },
                    { title: "Analytics", desc: "Improve our website and services" },
                    { title: "Marketing", desc: "Send promotional offers (with consent)" },
                    { title: "Security", desc: "Prevent fraud and protect our platform" }
                  ].map((item) => (
                    <div key={item.title} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-r-lg">
                  <p className="text-green-900 font-semibold flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      We only use your information for legitimate business purposes and will never use it 
                      in ways that would violate your trust.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Information Sharing */}
            <div id="sharing" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">4. How We Share Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900">
                  We DO NOT sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
                <p>We may share your information in the following limited circumstances:</p>

                <div className="space-y-4 mt-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">Service Providers</h4>
                    <p className="text-sm">
                      We share data with trusted third-party service providers who help us operate our business 
                      (e.g., payment processors, delivery services, email platforms). These providers are 
                      contractually obligated to protect your information.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">Legal Compliance</h4>
                    <p className="text-sm">
                      We may disclose information when required by law, legal process, or government request, 
                      or to protect our rights, property, or safety.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">Business Transfers</h4>
                    <p className="text-sm">
                      In the event of a merger, acquisition, or sale of assets, your information may be 
                      transferred to the new owner, subject to this privacy policy.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-gray-900 mb-2">With Your Consent</h4>
                    <p className="text-sm">
                      We may share your information for any other purpose with your explicit consent.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div id="security" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">5. Data Security</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="bg-gray-50 p-6 rounded-xl space-y-3 my-6">
                  <h4 className="font-bold text-gray-900 mb-4">Our Security Measures Include:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">SSL/TLS encryption for data transmission</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Secure payment processing systems</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Regular security audits and updates</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Access controls and authentication</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Employee training on data protection</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Encrypted database storage</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-5 rounded-r-lg">
                  <p className="text-yellow-900 font-semibold flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>
                      While we strive to protect your personal information, no method of transmission over 
                      the internet is 100% secure. Please use strong passwords and keep your login credentials confidential.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div id="rights" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">6. Your Privacy Rights</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>You have the following rights regarding your personal information:</p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  {[
                    {
                      icon: Eye,
                      title: "Right to Access",
                      desc: "Request a copy of the personal data we hold about you"
                    },
                    {
                      icon: Settings,
                      title: "Right to Rectification",
                      desc: "Request correction of inaccurate or incomplete data"
                    },
                    {
                      icon: Trash2,
                      title: "Right to Deletion",
                      desc: "Request deletion of your personal information"
                    },
                    {
                      icon: Download,
                      title: "Right to Data Portability",
                      desc: "Receive your data in a structured, machine-readable format"
                    },
                    {
                      icon: Bell,
                      title: "Right to Opt-Out",
                      desc: "Unsubscribe from marketing communications anytime"
                    },
                    {
                      icon: AlertCircle,
                      title: "Right to Object",
                      desc: "Object to processing of your personal data"
                    }
                  ].map((right) => {
                    const IconComponent = right.icon;
                    return (
                      <div key={right.title} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:border-purple-300 transition-colors">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                          </div>
                          <h4 className="font-bold text-gray-900">{right.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 ml-13">{right.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-3">How to Exercise Your Rights</h4>
                  <p className="text-purple-800 mb-4">
                    To exercise any of these rights, please contact us at{" "}
                    <a href="mailto:smartnestsolutionskenya@gmail.com" className="underline font-semibold">
                      smartnestsolutionskenya@gmail.com
                    </a>
                    {" "}or through our contact form. We will respond to your request within 30 days.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div id="cookies" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">7. Cookies and Tracking</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We use cookies and similar tracking technologies to improve your browsing experience, 
                  analyze site traffic, and personalize content.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Types of Cookies We Use:</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
                    <p className="text-sm">Required for the website to function properly (e.g., shopping cart, login)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                    <p className="text-sm">Help us understand how visitors use our website</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                    <p className="text-sm">Track your visits to show you relevant advertisements</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-1">Preference Cookies</h4>
                    <p className="text-sm">Remember your settings and preferences</p>
                  </div>
                </div>

                <p className="mt-4">
                  You can control cookies through your browser settings. However, disabling certain cookies 
                  may affect the functionality of our website.
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">8. Children's Privacy</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our services are not directed to individuals under the age of 18. We do not knowingly 
                  collect personal information from children. If you are a parent or guardian and believe 
                  your child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </div>

            {/* International Data Transfers */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">9. International Transfers</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Your information may be transferred to and maintained on servers located outside of Kenya. 
                  We ensure that appropriate safeguards are in place to protect your data in accordance with 
                  this privacy policy and applicable laws.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">10. Data Retention</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes 
                  outlined in this privacy policy, unless a longer retention period is required by law.
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Account information: Retained while your account is active</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Transaction records: Retained for 7 years for accounting purposes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Marketing data: Retained until you unsubscribe</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Updates to Policy */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">11. Policy Updates</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Posting the updated policy on our website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Sending an email notification (for significant changes)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Updating the "Last Updated" date at the top of this policy</span>
                  </li>
                </ul>
                <p>
                  Your continued use of our services after changes are posted constitutes acceptance of 
                  the updated Privacy Policy.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div id="contact" className="scroll-mt-24">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 md:p-10 rounded-2xl text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Contact Us</h2>
                    <p className="text-white/80">Questions about our privacy practices?</p>
                  </div>
                </div>
                
                <p className="mb-6 text-white/90 text-lg">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                  data practices, please contact our Data Protection Officer:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20">
                    <p className="text-white/70 text-sm mb-1">Email</p>
                    <a href="mailto:smartnestsolutionskenya@gmail.com" className="text-white font-bold text-lg hover:underline">
                      smartnestsolutionskenya@gmail.com
                    </a>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20">
                    <p className="text-white/70 text-sm mb-1">Phone</p>
                    <a href="tel:+254712345678" className="text-white font-bold text-lg hover:underline">
                      +254 728840848
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/Contact"
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-center hover:scale-105 transition-all shadow-xl"
                  >
                    Contact Form
                  </a>
                  <a
                    href="/Terms"
                    className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-center border-2 border-white/20 hover:bg-white/20 transition-all"
                  >
                    View Terms & Conditions
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}