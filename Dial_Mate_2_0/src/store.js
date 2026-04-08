/* __imports_rewritten__ */
import React from 'https://esm.sh/react@19.2.0';
import { html } from './jsx.js';
import { createInitialState } from './data.js';

const StoreContext = React.createContext(null);

const STORAGE_KEY = 'dial-mate-state';
const LEGACY_STORAGE_KEY = 'zariya-confirm-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);

    // Back-compat: merge in any new keys added after a user already has localStorage state.
    const base = createInitialState();
    return {
      ...base,
      ...parsed,
      session: { ...base.session, ...(parsed.session || {}), user: { ...base.session.user, ...(parsed.session?.user || {}) }, shop: { ...base.session.shop, ...(parsed.session?.shop || {}) } },
      billing: { ...base.billing, ...(parsed.billing || {}) },
      analytics: { ...base.analytics, ...(parsed.analytics || {}) },
      onboarding: { ...base.onboarding, ...(parsed.onboarding || {}) },
      branding: { ...base.branding, ...(parsed.branding || {}) },
      voice: { ...base.voice, ...(parsed.voice || {}) },
      scripts: { ...base.scripts, ...(parsed.scripts || {}) },
      backendUrl: parsed.backendUrl || base.backendUrl
    };
  } catch (error) {
    return createInitialState();
  }
}

function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
  }
}

function addCallForOrder(order, outcome) {
  const nextId = 'call-' + String(Date.now());
  return {
    id: nextId,
    orderId: order.id,
    agent: 'Urdu Voice v3',
    sentiment: outcome === 'Cancelled' ? 'Negative' : outcome === 'No Answer' ? 'Unknown' : 'Positive',
    intent: outcome,
    duration: outcome === 'No Answer' ? '00:18' : '01:12',
    outcome,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: nextTheme };
    }
    case 'SET_BACKEND_URL': {
      return { ...state, backendUrl: action.url };
    }
    case 'SET_SHOP_DOMAIN': {
      return {
        ...state,
        session: {
          ...state.session,
          shop: {
            ...state.session.shop,
            domain: action.domain
          }
        }
      };
    }
    case 'SYNC_DATA': {
      return {
        ...state,
        orders: action.orders || state.orders,
        calls: action.calls || state.calls,
        complianceLogs: action.complianceLogs || state.complianceLogs,
        onboarding: {
          ...state.onboarding,
          connectedShopify: true,
          syncedProducts: action.orders?.length || state.onboarding.syncedProducts
        }
      };
    }
    case 'SET_ROUTE_NOTE': {
      return {
        ...state,
        session: {
          ...state.session,
          routeNote: action.note
        }
      };
    }
    case 'UPDATE_ACCOUNT': {
      return {
        ...state,
        session: {
          ...state.session,
          user: {
            ...state.session.user,
            ...action.user
          }
        }
      };
    }
    case 'UPDATE_LOGO': {
      return {
        ...state,
        branding: {
          ...state.branding,
          logoDataUrl: action.logoDataUrl || null
        }
      };
    }
    case 'UPDATE_VOICE': {
      return {
        ...state,
        voice: {
          ...state.voice,
          voiceId: action.voiceId
        }
      };
    }
    case 'UPDATE_SCRIPT': {
      return {
        ...state,
        scripts: {
          ...state.scripts,
          [action.key]: action.value
        }
      };
    }
    case 'CALL_ORDER': {
      const { orderId, outcome } = action;
      const target = state.orders.find((order) => order.id === orderId);
      if (!target) return state;
      const updatedOrders = state.orders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: outcome === 'Confirmed' ? 'Confirmed' : outcome === 'Cancelled' ? 'Cancelled' : outcome === 'No Answer' ? 'No Answer' : 'Reschedule Requested',
          tag: outcome === 'Confirmed' ? 'Confirmed' : outcome === 'Cancelled' ? 'Cancelled' : outcome === 'No Answer' ? 'No Answer' : 'Reschedule',
          lastCallOutcome: outcome,
          recording: 'Call #' + order.id + '-' + String(Date.now()).slice(-2) + ' · ' + (outcome === 'No Answer' ? '00:18' : '01:12'),
          transcript: outcome === 'Confirmed'
            ? 'Agent: Assalam-o-alaikum, aap ka order confirm karne ke liye call ki gayi hai. Customer: Ji order theek hai, confirm kar dain. Agent: Shukriya, order confirm ho gaya hai.'
            : outcome === 'Cancelled'
            ? 'Customer ne bataya ke order duplicate tha aur cancel karwana tha. AI ne cancellation tag Shopify par update kar diya.'
            : outcome === 'No Answer'
            ? 'AI ne 18 seconds tak ring detect ki, jawab na milne par automatic retry queue bana di.'
            : 'Customer ne callback window request ki. AI ne preferred time note karke reschedule tag set kar diya.',
          timeline: [
            ...order.timeline,
            outcome === 'Confirmed'
              ? 'AI confirmation completed ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : outcome === 'Cancelled'
              ? 'Order marked cancelled after voice verification ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : outcome === 'No Answer'
              ? 'Retry scheduled after unanswered attempt ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Customer requested callback, reschedule saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          ]
        };
      });
      const newCall = addCallForOrder(target, outcome);
      return {
        ...state,
        analytics: {
          ...state.analytics,
          callsToday: state.analytics.callsToday + 1,
          confirmations: outcome === 'Confirmed' ? state.analytics.confirmations + 1 : state.analytics.confirmations
        },
        orders: updatedOrders,
        calls: [newCall, ...state.calls]
      };
    }
    case 'INSTALL_WIDGET': {
      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          widgetInstalled: true
        }
      };
    }
    case 'UPDATE_PLAN': {
      return {
        ...state,
        billing: {
          ...state.billing,
          currentPlan: action.plan
        },
        session: {
          ...state.session,
          shop: {
            ...state.session.shop,
            plan: action.plan
          }
        }
      };
    }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, null, () => loadState());

  React.useEffect(() => {
    persistState(state);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state]);

  // Sync data from backend if connected
  React.useEffect(() => {
    if (state.backendUrl && state.session.shop.domain && state.onboarding.connectedShopify) {
      const shop = state.session.shop.domain;
      const base = state.backendUrl.replace(/\/$/, '');

      const fetchData = async () => {
        try {
          const [ordersRes, callsRes, logsRes] = await Promise.all([
            fetch(`${base}/api/shops/${shop}/orders`),
            fetch(`${base}/api/shops/${shop}/calls`),
            fetch(`${base}/api/shops/${shop}/compliance`)
          ]);

          if (ordersRes.ok && callsRes.ok && logsRes.ok) {
            const [ordersData, callsData, logsData] = await Promise.all([
              ordersRes.json(),
              callsRes.json(),
              logsRes.json()
            ]);

            // Map backend orders to frontend format if needed
            // The backend already returns a format similar to what we need
            dispatch({
              type: 'SYNC_DATA',
              orders: ordersData.orders.map(o => ({
                ...o,
                timeline: o.timeline || ['Order synced from Shopify'],
                transcript: o.transcript || 'No transcript available yet.',
                recording: o.recording || 'Pending call...'
              })),
              calls: callsData.calls,
              complianceLogs: logsData.logs.map(l => ({
                ...l,
                time: new Date(l.createdAt).toLocaleTimeString()
              }))
            });
          }
        } catch (err) {
          console.error('Failed to sync data:', err);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [state.backendUrl, state.session.shop.domain, state.onboarding.connectedShopify]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return html`<${StoreContext.Provider} value=${value}>${props.children}</${StoreContext.Provider}>`;
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
