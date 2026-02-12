import { 
  Heart, Award, Users, TrendingUp, Target, Shield, Sparkles, 
  Gift, Palette, Home as HomeIcon, CheckCircle2, Star, Zap 
} from "lucide-react";

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-white font-semibold text-sm">About SmartNest Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Transforming Spaces,
            <br />
            Creating Memories
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to bring joy, style, and functionality to every home and business through premium products and personalized solutions
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                Our Story
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-6">
                Built on Passion & Excellence
              </h2>
              <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
                <p>
                  SmartNest Solutions began with a simple vision: to make quality home essentials, 
                  thoughtful gifts, and custom branding solutions accessible to everyone in Kenya.
                </p>
                <p>
                  What started as a small operation has grown into a trusted name, serving thousands 
                  of satisfied customers across the country. We believe that every product should tell 
                  a story and make life better.
                </p>
                <p>
                  Today, we're proud to offer a curated selection of premium products that combine 
                  functionality with style, all while maintaining our commitment to exceptional quality 
                  and customer service.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl">
                    <div className="text-4xl font-black text-purple-600 mb-2">1000+</div>
                    <div className="text-gray-700 font-semibold">Happy Customers</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-2xl">
                    <div className="text-4xl font-black text-blue-600 mb-2">500+</div>
                    <div className="text-gray-700 font-semibold">Products</div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-2xl">
                    <div className="text-4xl font-black text-orange-600 mb-2">5+</div>
                    <div className="text-gray-700 font-semibold">Years Experience</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl">
                    <div className="text-4xl font-black text-green-600 mb-2">99%</div>
                    <div className="text-gray-700 font-semibold">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Guided by purpose, driven by passion
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                To provide premium quality products and exceptional customer service that transforms 
                houses into homes and helps businesses stand out through custom branding solutions. 
                We strive to make every customer interaction meaningful and every product purchase valuable.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                To become Kenya's most trusted destination for home essentials, gifts, and custom branding, 
                known for our commitment to quality, innovation, and customer satisfaction. We envision a 
                future where every Kenyan home and business reflects style, personality, and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
              What We Stand For
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Quality First",
                description: "We never compromise on quality. Every product is carefully selected and tested to meet our high standards.",
                color: "from-yellow-400 to-orange-600"
              },
              {
                icon: Heart,
                title: "Customer Care",
                description: "Your satisfaction is our priority. We go above and beyond to ensure you have the best experience.",
                color: "from-pink-400 to-red-600"
              },
              {
                icon: Shield,
                title: "Trust & Integrity",
                description: "We build lasting relationships through honesty, transparency, and reliable service every single time.",
                color: "from-blue-400 to-indigo-600"
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We constantly evolve and improve, staying ahead with the latest trends and customer needs.",
                color: "from-green-400 to-emerald-600"
              },
              {
                icon: Users,
                title: "Community Focus",
                description: "We're committed to supporting local businesses and contributing positively to our community.",
                color: "from-purple-400 to-pink-600"
              },
              {
                icon: Zap,
                title: "Speed & Efficiency",
                description: "Fast delivery, quick responses, and efficient service - because your time matters to us.",
                color: "from-orange-400 to-red-600"
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4">
              What We Offer
            </h2>
            <p className="text-purple-200 text-base sm:text-lg max-w-2xl mx-auto">
              Three main categories to serve all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gift,
                title: "Premium Gifts",
                features: [
                  "Corporate gifts",
                  "Personal occasions",
                  "Seasonal collections",
                  "Gift wrapping available"
                ],
                color: "from-pink-500 to-rose-600"
              },
              {
                icon: HomeIcon,
                title: "Home Essentials",
                features: [
                  "Kitchen & dining",
                  "Décor items",
                  "Storage solutions",
                  "Lifestyle products"
                ],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Palette,
                title: "Custom Branding",
                features: [
                  "Company merchandise",
                  "Promotional items",
                  "Personalized gifts",
                  "Bulk orders"
                ],
                color: "from-purple-500 to-indigo-600"
              }
            ].map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.title}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-purple-200">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why Choose SmartNest?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We go the extra mile to make your experience exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: CheckCircle2, text: "Carefully curated product selection" },
              { icon: CheckCircle2, text: "Competitive pricing with regular discounts" },
              { icon: CheckCircle2, text: "Fast and reliable delivery across Kenya" },
              { icon: CheckCircle2, text: "Secure payment options (M-Pesa, Bank Transfer)" },
              { icon: CheckCircle2, text: "Responsive customer support team" },
              { icon: CheckCircle2, text: "Easy returns and exchanges policy" },
              { icon: CheckCircle2, text: "Custom branding and bulk order services" },
              { icon: CheckCircle2, text: "Regular flash sales and promotions" }
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <item.icon className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Experience Excellence?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of satisfied customers and discover the SmartNest difference today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/category/gifts"
              className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Start Shopping
            </a>
            <a
              href="/contact"
              className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/20 hover:scale-105 transition-all shadow-2xl"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
