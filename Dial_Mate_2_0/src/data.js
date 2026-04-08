export function createInitialState() {
  return {
    session: {
      user: {
        name: 'Areeba Khalid',
        email: 'areeba@mehrmart.pk',
        role: 'Owner'
      },
      shop: {
        name: 'Mehr Mart',
        domain: 'mehrmart.myshopify.com',
        plan: 'Growth',
        language: 'Urdu First'
      }
    },
    branding: {
      // Stored as a data URL (base64) for the demo app. In production, upload to object storage.
      logoDataUrl: null
    },
    voice: {
      // Provider-agnostic voice id/label.
      voiceId: 'urdu_female_v3'
    },
    scripts: {
      confirmationUrdu:
        'Assalam-o-alaikum! Main ${SHOP_NAME} se bol raha/rahi hoon. Aap ne ${ORDER_ID} order place kiya hai. Kya aap order confirm karte hain?\n\nAgar aap chahein to main delivery ka andaza time, price, variants, aur return/exchange policy bhi bata sakta/sakti hoon.',
      cancellationUrdu:
        'Theek hai. Aap ki request ke mutabiq main aap ka order cancel kar raha/rahi hoon.\n\nKya aap cancellation ki wajah bata dein? (Optional)\nShukriya! Agar future mein help chahiye ho to hum se rabta karein.'
    },
    theme: 'light',
    billing: {
      currentPlan: 'Growth',
      monthlySpend: 428,
      voiceMinutes: 3190,
      teamSeats: 4,
      freeTrialDaysLeft: 8,
      addons: ['Multilingual', 'White-label']
    },
    analytics: {
      callsToday: 184,
      connectionRate: 81,
      confirmations: 132,
      recoveredRevenue: 485000,
      fraudPrevented: 17,
      avgHandleTime: '01:48'
    },
    products: [
      { id: 'prod-101', title: 'Lahori Linen Kurta - Emerald', sku: 'MM-LK-E-42', price: 3490, stock: 18, variants: ['Small', 'Medium', 'Large', 'XL'], eta: '2-4 din', returnPolicy: '7 din size exchange', zones: ['Lahore', 'Karachi', 'Islamabad'] },
      { id: 'prod-102', title: 'Premium Prayer Mat - Ivory Weave', sku: 'MM-PM-IW', price: 2190, stock: 34, variants: ['Standard', 'Gift Box'], eta: '3-5 din', returnPolicy: 'Damage par return accepted', zones: ['Pakistan Nationwide'] },
      { id: 'prod-103', title: 'Rose Quartz Hijab Pins Set', sku: 'MM-HP-RQ', price: 890, stock: 57, variants: ['Set of 6'], eta: '2-3 din', returnPolicy: 'Opened pack non-returnable', zones: ['Pakistan Nationwide'] },
      { id: 'prod-104', title: 'Velvet Abaya - Midnight Navy', sku: 'MM-AB-MN', price: 5990, stock: 11, variants: ['52', '54', '56', '58'], eta: '4-6 din', returnPolicy: '7 din exchange', zones: ['Major Cities'] }
    ],
    faqs: [
      { id: 'faq-1', question: 'Delivery kitne din mein hogi?', answer: 'Major cities mein aam tor par 2 se 4 din aur remote areas mein 4 se 6 din lagte hain.' },
      { id: 'faq-2', question: 'Return aur exchange policy kya hai?', answer: 'Unused items 7 din ke andar size exchange ke liye eligible hain. Damaged item par return process available hai.' },
      { id: 'faq-3', question: 'COD available hai?', answer: 'Ji, selected cities mein cash on delivery available hai. High-risk orders par prepayment request ho sakti hai.' },
      { id: 'faq-4', question: 'Order mein size ya color change ho sakta hai?', answer: 'Ji, dispatch se pehle live stock ke mutabiq order edit kiya ja sakta hai.' }
    ],
    orders: [
      {
        id: 'MM-48192',
        customer: 'Hina Rauf',
        city: 'Lahore',
        phone: '+92 300 4127811',
        payment: 'COD',
        total: 3490,
        status: 'Pending Confirmation',
        tag: 'Retry',
        risk: 22,
        transcript: 'Agent: Assalam-o-alaikum Hina sahiba, aap ne Mehr Mart se Lahori Linen Kurta order kiya hai. Customer: Ji bilkul, medium size confirm kar dain. Agent: Shukriya, aap ka order confirm kar diya gaya hai.',
        recording: 'Call #MM-48192-1 · 01:31',
        timeline: ['Order placed 10:12 AM', 'Shopify synced 10:13 AM', 'First call connected 10:18 AM', 'Customer confirmed size Medium 10:20 AM'],
        items: [{ productId: 'prod-101', title: 'Lahori Linen Kurta - Emerald', variant: 'Medium', qty: 1 }],
        notes: 'Customer asked if delivery before Friday is possible.',
        lastCallOutcome: 'Confirmed'
      },
      {
        id: 'MM-48193',
        customer: 'Umer Farooq',
        city: 'Faisalabad',
        phone: '+92 321 7736208',
        payment: 'Prepaid',
        total: 5990,
        status: 'Confirmed',
        tag: 'Confirmed',
        risk: 8,
        transcript: 'Agent: Aap ka prepaid order verify kar raha hun. Customer: Ji theek hai, address sahi hai. Agent: Bohat shukriya.',
        recording: 'Call #MM-48193-1 · 00:54',
        timeline: ['Order placed 09:40 AM', 'Payment captured 09:40 AM', 'Confirmation call completed 09:52 AM'],
        items: [{ productId: 'prod-104', title: 'Velvet Abaya - Midnight Navy', variant: '54', qty: 1 }],
        notes: 'Requested evening delivery attempt.',
        lastCallOutcome: 'Confirmed'
      },
      {
        id: 'MM-48194',
        customer: 'Sadia Javed',
        city: 'Karachi',
        phone: '+92 333 2184406',
        payment: 'COD',
        total: 4380,
        status: 'No Answer',
        tag: 'No Answer',
        risk: 61,
        transcript: 'No live transcript available. AI detected ringing timeout and scheduled retry after 45 minutes.',
        recording: 'Call #MM-48194-1 · 00:22',
        timeline: ['Order placed 11:03 AM', 'Fraud score elevated 11:04 AM', 'First attempt no answer 11:10 AM', 'Retry queued for 11:55 AM'],
        items: [{ productId: 'prod-102', title: 'Premium Prayer Mat - Ivory Weave', variant: 'Gift Box', qty: 2 }],
        notes: 'Duplicate phone number found on one cancelled order last month.',
        lastCallOutcome: 'No Answer'
      },
      {
        id: 'MM-48195',
        customer: 'Bilal Ahmed',
        city: 'Multan',
        phone: '+92 300 9942755',
        payment: 'COD',
        total: 890,
        status: 'Reschedule Requested',
        tag: 'Reschedule',
        risk: 18,
        transcript: 'Customer: Main abhi office mein hun, shaam 7 baje call kar lein. Agent: Zaroor, aap ka callback reschedule kar diya gaya hai.',
        recording: 'Call #MM-48195-1 · 00:41',
        timeline: ['Order placed 08:58 AM', 'Call connected 09:05 AM', 'Reschedule requested for 07:00 PM'],
        items: [{ productId: 'prod-103', title: 'Rose Quartz Hijab Pins Set', variant: 'Set of 6', qty: 1 }],
        notes: 'Roman Urdu response handled correctly.',
        lastCallOutcome: 'Reschedule'
      },
      {
        id: 'MM-48196',
        customer: 'Nabeela Tariq',
        city: 'Rawalpindi',
        phone: '+92 345 8172301',
        payment: 'COD',
        total: 3490,
        status: 'Cancelled',
        tag: 'Cancelled',
        risk: 79,
        transcript: 'Customer: Maine ye order galti se do martaba place kar diya tha, isay cancel kar dein. Agent: Ji, duplicate order cancel kar diya gaya hai.',
        recording: 'Call #MM-48196-1 · 01:06',
        timeline: ['Order placed 10:49 AM', 'Duplicate risk detected 10:50 AM', 'Customer requested cancellation 11:01 AM'],
        items: [{ productId: 'prod-101', title: 'Lahori Linen Kurta - Emerald', variant: 'Large', qty: 1 }],
        notes: 'Duplicate with MM-48190.',
        lastCallOutcome: 'Cancelled'
      }
    ],
    calls: [
      { id: 'call-1', orderId: 'MM-48192', agent: 'Urdu Voice v3', sentiment: 'Positive', intent: 'Confirmation', duration: '01:31', outcome: 'Confirmed', time: '10:18 AM' },
      { id: 'call-2', orderId: 'MM-48193', agent: 'Urdu Voice v3', sentiment: 'Neutral', intent: 'Verification', duration: '00:54', outcome: 'Confirmed', time: '09:52 AM' },
      { id: 'call-3', orderId: 'MM-48194', agent: 'Urdu Voice v3', sentiment: 'Unknown', intent: 'No Pickup', duration: '00:22', outcome: 'No Answer', time: '11:10 AM' },
      { id: 'call-4', orderId: 'MM-48195', agent: 'Urdu Voice v3', sentiment: 'Positive', intent: 'Reschedule', duration: '00:41', outcome: 'Reschedule', time: '09:05 AM' },
      { id: 'call-5', orderId: 'MM-48196', agent: 'Urdu Voice v3', sentiment: 'Negative', intent: 'Cancel Duplicate', duration: '01:06', outcome: 'Cancelled', time: '11:01 AM' }
    ],
    team: [
      { id: 'team-1', name: 'Areeba Khalid', role: 'Owner', status: 'Active' },
      { id: 'team-2', name: 'Hamza Naeem', role: 'Operations', status: 'Active' },
      { id: 'team-3', name: 'Sana Iftikhar', role: 'Support Lead', status: 'Pending Invite' },
      { id: 'team-4', name: 'Rizwan Ali', role: 'Analyst', status: 'Active' }
    ],
    onboarding: {
      connectedShopify: false,
      syncedProducts: 0,
      syncedPolicies: false,
      voiceConfigured: false,
      widgetInstalled: false,
      webhooksActive: false
    },
    complianceLogs: [
      { id: 'log-1', event: 'System initialized', detail: 'Dial Mate 2.0 ready for Shopify connection', time: new Date().toLocaleTimeString() }
    ],
    backendUrl: ''
  };
}
