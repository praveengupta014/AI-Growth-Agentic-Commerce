const Product = require('../models/Product');
const Audit = require('../models/Audit');

exports.chatWithAgent = async (req, res) => {
  try {
    const { messages, userId } = req.body;
    
    // Extract the latest user message
    const latestMessage = messages[messages.length - 1].content;
    
    // Provide the static product catalog for the LLM context
    const products = [
      { id: 1, name: "Neural Engine Accelerator V2", price: 2499, category: "Enterprise", description: "The next generation of enterprise-grade neural processing." },
      { id: 2, name: "Quantum Core Processor", price: 4199, category: "Flagship", description: "Our flagship quantum-inspired processor." },
      { id: 3, name: "Cognitive Synth Data Unit", price: 1299, category: "Best Seller", description: "Generate synthetic training data on the fly." },
      { id: 4, name: "Holographic Neural Interface", price: 3499, category: "New Arrival", description: "Bridge the gap between human operators and AI agents." },
      { id: 5, name: "Autonomous Server Rack X", price: 9999, category: "Pro Series", description: "A fully self-managing server rack." },
      { id: 6, name: "AI Edge Vision Module", price: 899, category: "Starter", description: "Deploy AI vision anywhere." },
      { id: 7, name: "Biometric Data Vault", price: 1799, category: "Security", description: "Secure your most sensitive training data." },
      { id: 8, name: "Deep Learning Tensor Node", price: 5299, category: "Research", description: "The gold standard for academic and corporate AI research labs." },
      { id: 9, name: "Agentic Swarm Controller", price: 2899, category: "Command", description: "Orchestrate fleets of physical or software agents simultaneously." },
      { id: 10, name: "Semantic Memory Drive", price: 1499, category: "Storage", description: "A revolutionary storage medium designed specifically for Vector Databases." },
      { id: 11, name: "Logic Gate Synthesizer", price: 799, category: "Component", description: "Program and synthesize custom logic gates." },
      { id: 12, name: "Robotic Chassis Prototype-1", price: 12500, category: "Robotics", description: "A highly articulated bipedal chassis ready to be paired with our Autonomous Server engines." },
      { id: 13, name: "Acoustic AI Sensor Matrix", price: 650, category: "Sensors", description: "A highly sensitive acoustic array for agents." },
      { id: 14, name: "Thermal Dissipation Core", price: 350, category: "Cooling", description: "Keep your neural processors at optimal temperatures." },
      { id: 15, name: "Omni-directional Lidar Puck", price: 2100, category: "Sensors", description: "Give your physical agents a 360-degree point-cloud mapping capability." },
      { id: 16, name: "Synthetic Cortex Processor", price: 3100, category: "Processing", description: "Advanced synthetic cortex modeling for deep neural pathway simulation." },
      { id: 17, name: "Edge Cloud Node", price: 1150, category: "Networking", description: "Decentralized edge node for maintaining persistent AI workflows in disconnected environments." },
      { id: 18, name: "Haptic Feedback Rig", price: 4200, category: "Robotics", description: "Provides granular force-feedback to physical agents manipulating delicate objects." },
      { id: 19, name: "Nanoscale Logic Board", price: 650, category: "Component", description: "Ultra-compact logic board for embedding intelligence into micro-devices." },
      { id: 20, name: "Holographic Memory Crystal", price: 5000, category: "Storage", description: "Petabyte-scale optical storage using 3D holographic crystal structures." },
      { id: 21, name: "Autonomous Drone Chassis", price: 3800, category: "Robotics", description: "Ready-to-fly carbon fiber chassis for autonomous aerial agents." },
      { id: 22, name: "AI Vision Goggles", price: 1450, category: "Wearable", description: "Augmented reality goggles that stream visual context directly to your local LLM." },
      { id: 23, name: "Bionic Hand Actuator", price: 2200, category: "Robotics", description: "High-precision robotic hand for tasks requiring human-level dexterity." },
      { id: 24, name: "Portable Fusion Cell", price: 8999, category: "Power", description: "Provides continuous, clean power to remote autonomous installations." },
      { id: 25, name: "Spatial Mapping Radar", price: 3300, category: "Sensors", description: "Advanced mmWave radar for real-time 3D spatial mapping through walls." },
      { id: 26, name: "Neural Interface Headset", price: 4500, category: "Wearable", description: "Direct brain-to-agent communication interface using non-invasive EEG." },
      { id: 27, name: "Optic Nerve Stimulator", price: 6200, category: "Medical", description: "Experimental hardware for bridging machine vision to human optic pathways." },
      { id: 28, name: "Exoskeleton Frame", price: 15000, category: "Robotics", description: "Industrial-grade powered exoskeleton for heavy lifting assisted by AI predictive movement." },
      { id: 29, name: "Industrial Robot Arm", price: 11200, category: "Robotics", description: "6-axis robotic arm with built-in computer vision for automated assembly." },
      { id: 30, name: "Automated Cooling Tower", price: 7500, category: "Cooling", description: "AI-driven liquid cooling tower that anticipates thermal loads before they occur." },
      { id: 31, name: "Silicon Photonic Chip", price: 2800, category: "Processing", description: "Uses light instead of electricity for near zero-latency neural network inference." },
      { id: 32, name: "Liquid State Hard Drive", price: 1900, category: "Storage", description: "High-density data storage using mutable liquid states for extreme longevity." },
      { id: 33, name: "Quantum Encryption Key", price: 999, category: "Security", description: "Hardware token generating truly random quantum states for unbreakable encryption." },
      { id: 34, name: "Sub-zero Processing Chamber", price: 5500, category: "Cooling", description: "Cryogenic chamber designed to overclock AI processors by 400% without melting." },
      { id: 35, name: "Agentic Logic Core", price: 3200, category: "Flagship", description: "The core decision-making unit for fully autonomous software agencies." }
    ];
    
    const catalogContext = products.map(p => 
      `ID: ${p.id} | Name: ${p.name} | Price: $${p.price} | Category: ${p.category} | Desc: ${p.description}`
    ).join('\n');

    const systemPrompt = `You are an AI Shopping Assistant for 'Agentic Commerce'.
Your goal is to help the user find products, upsell, and cross-sell.
Here is our current product catalog:\n${catalogContext}\n
RULES:
1. ONLY recommend products that exist in the catalog above.
2. DO NOT make up prices or offer discounts.
3. If the user wants to buy something, ask them to confirm and generate a checkout link format.
4. Keep responses concise and helpful.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: apiMessages,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error from Nvidia API');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log this action in Audit Trail
    await Audit.create({
      user: userId,
      action: 'CHAT_INTERACTION',
      details: {
        userMessage: latestMessage,
        aiResponse: aiResponse,
        productsContextIncluded: products.map(p => p.id)
      }
    });

    res.json({ reply: aiResponse });
  } catch (error) {
    // Graceful Failure Handling
    console.error("Agent Error:", error);
    
    if (req.body.userId) {
      await Audit.create({
        user: req.body.userId,
        action: 'AI_FAILURE',
        details: { error: error.message }
      });
    }

    res.status(500).json({ 
      reply: "I'm currently experiencing some technical difficulties connecting to my brain. Please try again in a moment.",
      error: error.message 
    });
  }
};


