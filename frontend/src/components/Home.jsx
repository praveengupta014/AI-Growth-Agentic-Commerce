import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight, Zap, Loader2, X, Share2 } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Neural Engine Accelerator V2",
    price: "$2,499",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    tag: "Enterprise",
    description: "The next generation of enterprise-grade neural processing. Designed specifically for training large language models with unmatched efficiency and lower thermal output."
  },
  {
    id: 2,
    name: "Quantum Core Processor",
    price: "$4,199",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tag: "Flagship",
    description: "Our flagship quantum-inspired processor. Capable of evaluating complex probability matrices instantly, making it the perfect brain for autonomous decision engines."
  },
  {
    id: 3,
    name: "Cognitive Synth Data Unit",
    price: "$1,299",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tag: "Best Seller",
    description: "Generate synthetic training data on the fly. This hardware module creates perfectly labeled edge-case datasets to fine-tune your vision models locally."
  },
  {
    id: 4,
    name: "Holographic Neural Interface",
    price: "$3,499",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "New Arrival",
    description: "Bridge the gap between human operators and AI agents. This interface projects multi-dimensional data structures for intuitive workflow oversight."
  },
  {
    id: 5,
    name: "Autonomous Server Rack X",
    price: "$9,999",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tag: "Pro Series",
    description: "A fully self-managing server rack. Equipped with onboard diagnostic agents that dynamically route power and handle load balancing without human intervention."
  },
  {
    id: 6,
    name: "AI Edge Vision Module",
    price: "$899",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    tag: "Starter",
    description: "Deploy AI vision anywhere. This compact, rugged edge module processes 4K video feeds in real-time for security and quality assurance pipelines."
  },
  {
    id: 7,
    name: "Biometric Data Vault",
    price: "$1,799",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    tag: "Security",
    description: "Secure your most sensitive training data. Features quantum-resistant encryption and hardware-level isolation for absolute peace of mind."
  },
  {
    id: 8,
    name: "Deep Learning Tensor Node",
    price: "$5,299",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1597839219216-a773cb2473e4?auto=format&fit=crop&q=80&w=800",
    tag: "Research",
    description: "The gold standard for academic and corporate AI research labs. Unparalleled tensor operations per second for rapid model iteration."
  },
  {
    id: 9,
    name: "Agentic Swarm Controller",
    price: "$2,899",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800",
    tag: "Command",
    description: "Orchestrate fleets of physical or software agents simultaneously. Features a hyper-threaded command router designed to eliminate bottlenecking."
  },
  {
    id: 10,
    name: "Semantic Memory Drive",
    price: "$1,499",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    tag: "Storage",
    description: "A revolutionary storage medium designed specifically for Vector Databases. Retrieve context instantly for retrieval-augmented generation (RAG)."
  },
  {
    id: 11,
    name: "Logic Gate Synthesizer",
    price: "$799",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tag: "Component",
    description: "A fundamental component for DIY AI hardware enthusiasts. Program and synthesize custom logic gates in a flexible, modular architecture."
  },
  {
    id: 12,
    name: "Robotic Chassis Prototype-1",
    price: "$12,500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "The physical embodiment for your agent. A highly articulated bipedal chassis ready to be paired with our Autonomous Server engines."
  },
  {
    id: 13,
    name: "Acoustic AI Sensor Matrix",
    price: "$650",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "Sensors",
    description: "A highly sensitive acoustic array for agents needing to process complex audio environments. Isolates voice commands even in heavy industrial noise."
  },
  {
    id: 14,
    name: "Thermal Dissipation Core",
    price: "$350",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tag: "Cooling",
    description: "Keep your neural processors at optimal temperatures. Uses experimental phase-change liquids to dissipate extreme heat silently."
  },
  {
    id: 15,
    name: "Omni-directional Lidar Puck",
    price: "$2,100",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    tag: "Sensors",
    description: "Give your physical agents a 360-degree point-cloud mapping capability. Essential for autonomous navigation and environment scanning."
  },
  {
    id: 16,
    name: "Synthetic Cortex Processor",
    price: "$3,100",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tag: "Processing",
    description: "Advanced synthetic cortex modeling for deep neural pathway simulation."
  },
  {
    id: 17,
    name: "Edge Cloud Node",
    price: "$1,150",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tag: "Networking",
    description: "Decentralized edge node for maintaining persistent AI workflows in disconnected environments."
  },
  {
    id: 18,
    name: "Haptic Feedback Rig",
    price: "$4,200",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "Provides granular force-feedback to physical agents manipulating delicate objects."
  },
  {
    id: 19,
    name: "Nanoscale Logic Board",
    price: "$650",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1597839219216-a773cb2473e4?auto=format&fit=crop&q=80&w=800",
    tag: "Component",
    description: "Ultra-compact logic board for embedding intelligence into micro-devices."
  },
  {
    id: 20,
    name: "Holographic Memory Crystal",
    price: "$5,000",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tag: "Storage",
    description: "Petabyte-scale optical storage using 3D holographic crystal structures."
  },
  {
    id: 21,
    name: "Autonomous Drone Chassis",
    price: "$3,800",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "Ready-to-fly carbon fiber chassis for autonomous aerial agents."
  },
  {
    id: 22,
    name: "AI Vision Goggles",
    price: "$1,450",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    tag: "Wearable",
    description: "Augmented reality goggles that stream visual context directly to your local LLM."
  },
  {
    id: 23,
    name: "Bionic Hand Actuator",
    price: "$2,200",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "High-precision robotic hand for tasks requiring human-level dexterity."
  },
  {
    id: 24,
    name: "Portable Fusion Cell",
    price: "$8,999",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    tag: "Power",
    description: "Provides continuous, clean power to remote autonomous installations."
  },
  {
    id: 25,
    name: "Spatial Mapping Radar",
    price: "$3,300",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tag: "Sensors",
    description: "Advanced mmWave radar for real-time 3D spatial mapping through walls."
  },
  {
    id: 26,
    name: "Neural Interface Headset",
    price: "$4,500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "Wearable",
    description: "Direct brain-to-agent communication interface using non-invasive EEG."
  },
  {
    id: 27,
    name: "Optic Nerve Stimulator",
    price: "$6,200",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tag: "Medical",
    description: "Experimental hardware for bridging machine vision to human optic pathways."
  },
  {
    id: 28,
    name: "Exoskeleton Frame",
    price: "$15,000",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "Industrial-grade powered exoskeleton for heavy lifting assisted by AI predictive movement."
  },
  {
    id: 29,
    name: "Industrial Robot Arm",
    price: "$11,200",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800",
    tag: "Robotics",
    description: "6-axis robotic arm with built-in computer vision for automated assembly."
  },
  {
    id: 30,
    name: "Automated Cooling Tower",
    price: "$7,500",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1597839219216-a773cb2473e4?auto=format&fit=crop&q=80&w=800",
    tag: "Cooling",
    description: "AI-driven liquid cooling tower that anticipates thermal loads before they occur."
  },
  {
    id: 31,
    name: "Silicon Photonic Chip",
    price: "$2,800",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    tag: "Processing",
    description: "Uses light instead of electricity for near zero-latency neural network inference."
  },
  {
    id: 32,
    name: "Liquid State Hard Drive",
    price: "$1,900",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    tag: "Storage",
    description: "High-density data storage using mutable liquid states for extreme longevity."
  },
  {
    id: 33,
    name: "Quantum Encryption Key",
    price: "$999",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    tag: "Security",
    description: "Hardware token generating truly random quantum states for unbreakable encryption."
  },
  {
    id: 34,
    name: "Sub-zero Processing Chamber",
    price: "$5,500",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    tag: "Cooling",
    description: "Cryogenic chamber designed to overclock AI processors by 400% without melting."
  },
  {
    id: 35,
    name: "Agentic Logic Core",
    price: "$3,200",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    tag: "Flagship",
    description: "The core decision-making unit for fully autonomous software agencies."
  }
];

const Home = ({ addToCart, buyNow }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShare = async (product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${product.name} - ${window.location.href}`);
      alert('Product link copied to clipboard!');
    }
  };

  const displayedProducts = showAll ? products : products.slice(0, 10); // Show 10 initially to display a nice two-row grid

  return (
    <div className="w-full pb-20 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/5 mb-16 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent z-0"></div>
        
        <motion.div 
          className="relative z-10 px-8 py-20 lg:py-32 lg:px-16 flex flex-col lg:flex-row items-center gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 border border-indigo-500/20">
              <Zap size={14} /> New Arrivals Available
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Hardware for the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Agentic Era
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Equip your AI agents with state-of-the-art computational hardware. Discover the ultimate performance for enterprise-scale autonomous systems.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-2"
              >
                Explore Catalog
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full relative hidden lg:block">
            <motion.div 
              className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
                alt="Quantum Core" 
                className="object-cover w-full h-full opacity-80 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <p className="text-xs text-indigo-400 font-bold tracking-wider uppercase mb-1">Featured Tech</p>
                  <p className="text-white font-medium">Quantum Core Processor</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Products Grid */}
      <div id="catalog-section" className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Featured Hardware</h2>
          <p className="text-gray-400 text-sm">Top picks for high-performance computing.</p>
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20"
        >
          {showAll ? 'Show less' : 'View all'} <ArrowRight size={14} className={showAll ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 relative z-10">
        {displayedProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 5) * 0.05 }}
            className="group rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-1 flex flex-col"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative h-40 sm:h-48 overflow-hidden bg-neutral-800">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 text-[10px] sm:text-xs font-medium text-white">
                {product.tag}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-indigo-500 border border-white/10 hover:border-indigo-400 transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 flex items-center justify-center"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <div className="flex items-center gap-1 mb-1 sm:mb-2 text-yellow-500">
                <Star size={12} className="fill-yellow-500" />
                <span className="text-[10px] sm:text-xs font-medium text-white">{product.rating}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-2 flex-grow line-clamp-2">{product.name}</h3>
              <p className="text-indigo-400 font-semibold text-sm sm:text-base">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 h-64 md:h-auto bg-neutral-800 relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
              </div>
              
              <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium mb-4 border border-indigo-500/20 w-fit">
                  {selectedProduct.tag}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedProduct.name}</h2>
                
                <div className="flex items-center gap-2 mb-6 text-yellow-500">
                  <Star size={16} className="fill-yellow-500" />
                  <span className="text-sm font-medium text-white">{selectedProduct.rating} / 5.0 Rating</span>
                </div>
                
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="text-2xl font-bold text-white">{selectedProduct.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleShare(selectedProduct)}
                      className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors border border-white/10"
                      title="Share"
                    >
                      <Share2 size={18} />
                    </button>
                    
                    <button 
                      onClick={() => addToCart(selectedProduct)}
                      className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors border border-white/10 flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      <span className="hidden sm:inline">Add to Cart</span>
                    </button>
                    
                    <button 
                      onClick={() => { buyNow(selectedProduct); setSelectedProduct(null); }}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-2"
                    >
                      Buy Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
